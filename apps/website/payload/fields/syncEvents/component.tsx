"use client";

import { toast } from "@payloadcms/ui";
import { CalendarSync, RefreshCw } from "lucide-react";
import { UIFieldClientComponent } from "payload";
import {
	SyntheticEvent,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";

import styles from "./SyncEvents.module.scss";

const MANUAL_SYNC_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes
const POLL_INTERVAL_MS = 5_000; // 5 seconds

export const SyncEvents: UIFieldClientComponent = () => {
	const [isProcessing, setIsProcessing] = useState(false);
	const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const stopPolling = useCallback(() => {
		if (pollRef.current) {
			clearInterval(pollRef.current);
			pollRef.current = null;
		}
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
			timeoutRef.current = null;
		}
	}, []);

	const startPolling = useCallback(
		(startedAt: number) => {
			stopPolling();

			pollRef.current = setInterval(async () => {
				try {
					const res = await fetch("/api/sync-events");
					if (!res.ok) return;
					const data = await res.json();
					if (data.status === "idle") {
						setIsProcessing(false);
						stopPolling();
					}
				} catch {
					// Ignore transient poll errors
				}
			}, POLL_INTERVAL_MS);

			// Unlock the button after 5 minutes regardless of job state
			const remaining = MANUAL_SYNC_TIMEOUT_MS - (Date.now() - startedAt);
			if (remaining > 0) {
				timeoutRef.current = setTimeout(() => {
					setIsProcessing(false);
					stopPolling();
				}, remaining);
			} else {
				setIsProcessing(false);
			}
		},
		[stopPolling],
	);

	// On mount, check if a manual sync is already running
	useEffect(() => {
		const checkStatus = async () => {
			try {
				const res = await fetch("/api/sync-events");
				if (!res.ok) return;
				const data = await res.json();
				if (data.status === "processing" && data.startedAt) {
					const startedAt = new Date(data.startedAt).getTime();
					if (Date.now() - startedAt < MANUAL_SYNC_TIMEOUT_MS) {
						setIsProcessing(true);
						startPolling(startedAt);
					}
				}
			} catch {
				// Ignore errors on mount check
			}
		};

		checkStatus();
		return () => stopPolling();
	}, [startPolling, stopPolling]);

	const handleClick = async (event: SyntheticEvent<HTMLButtonElement>) => {
		event.preventDefault();

		try {
			const res = await fetch("/api/sync-events", { method: "POST" });

			if (res.status === 409) {
				const data = await res.json();
				toast.error(
					data.error ?? "A manual sync is already in progress.",
				);
				return;
			}

			if (!res.ok) {
				throw new Error("Failed to start sync");
			}

			const data = await res.json();
			toast.success(data.message ?? "Sync successfully started.");

			const startedAt = Date.now();
			window.dispatchEvent(
				new CustomEvent("manualSyncStarted", { detail: startedAt }),
			);
			setIsProcessing(true);
			startPolling(startedAt);
		} catch (error) {
			if ((error as Error).name === "AbortError") return;
			console.error("Error starting sync:", error);
			toast.error("Failed to start sync.");
		}
	};

	return (
		<div className={`${styles.syncEvents} field-type`}>
			<button
				onClick={handleClick}
				disabled={isProcessing}
				className={`btn btn--icon btn--size-medium btn--style-primary btn--no-margin btn--icon-style-without-border btn--icon-position-left${isProcessing ? " btn--disabled" : ""}`}
			>
				<span className={"btn__content"}>
					<span className={"btn__label"}>
						{isProcessing ? "Syncing Events…" : "Manual Sync"}
					</span>
					<span className={"btn__icon"}>
						{isProcessing ? (
							<RefreshCw className={styles.syncAnimation} />
						) : (
							<CalendarSync />
						)}
					</span>
				</span>
			</button>
		</div>
	);
};
