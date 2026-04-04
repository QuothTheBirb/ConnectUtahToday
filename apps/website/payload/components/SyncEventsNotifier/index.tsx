"use client";

import type { ReactNode } from "react";

import { toast } from "@payloadcms/ui";
import { useEffect, useRef } from "react";

const STORAGE_KEY = "manualSyncStartedAt";
const MANUAL_SYNC_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes
const POLL_INTERVAL_MS = 5_000; // 5 seconds

/**
 * Headless global component — mounted once in the admin layout via
 * admin.components.providers.  Watches localStorage for a pending manual
 * sync and fires a persistent toast when the sync completes, regardless of
 * which admin page the user is currently viewing.
 */
export const SyncEventsNotifier = ({ children }: { children?: ReactNode }) => {
	const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const stop = () => {
		if (pollRef.current) {
			clearInterval(pollRef.current);
			pollRef.current = null;
		}
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
			timeoutRef.current = null;
		}
		localStorage.removeItem(STORAGE_KEY);
	};

	const startWatching = (startedAt: number) => {
		if (pollRef.current) return; // already watching

		pollRef.current = setInterval(async () => {
			try {
				const res = await fetch("/api/sync-events");
				if (!res.ok) return;
				const data = await res.json();
				if (data.status === "idle") {
					stop();
					toast.success("Events synced successfully.", {
						duration: Infinity,
					});
				}
			} catch {
				// ignore transient errors
			}
		}, POLL_INTERVAL_MS);

		// Auto-abandon after 5 minutes (mirrors the button unlock logic)
		const remaining = MANUAL_SYNC_TIMEOUT_MS - (Date.now() - startedAt);
		if (remaining > 0) {
			timeoutRef.current = setTimeout(stop, remaining);
		} else {
			stop();
		}
	};

	useEffect(() => {
		// Pick up any sync that was started (possibly on a different page)
		const raw = localStorage.getItem(STORAGE_KEY);
		if (raw) {
			const startedAt = Number(raw);
			if (
				!Number.isNaN(startedAt) &&
				Date.now() - startedAt < MANUAL_SYNC_TIMEOUT_MS
			) {
				startWatching(startedAt);
			} else {
				localStorage.removeItem(STORAGE_KEY);
			}
		}

		// Listen for the custom event fired by SyncEvents button component
		const handler = (e: Event) => {
			const startedAt = (e as CustomEvent<number>).detail;
			localStorage.setItem(STORAGE_KEY, String(startedAt));
			startWatching(startedAt);
		};
		window.addEventListener("manualSyncStarted", handler);

		return () => {
			window.removeEventListener("manualSyncStarted", handler);
			if (pollRef.current) clearInterval(pollRef.current);
			if (timeoutRef.current) clearTimeout(timeoutRef.current);
		};
	}, []);

	return <>{children}</>;
};
