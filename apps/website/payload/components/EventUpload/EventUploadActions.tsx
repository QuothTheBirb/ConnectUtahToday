"use client";

import { useConfig } from "@payloadcms/ui";
import { CalendarPlus, Instagram } from "lucide-react";
import Link from "next/link";

import styles from "./EventUploads.module.scss";

export const EventUploadActions = () => {
	const { config } = useConfig();
	const adminRoute = config.routes.admin || "/admin";
	const posterUploadHref = `${adminRoute}/poster-upload`;
	const instagramUploadHref = `${adminRoute}/instagram-upload`;

	return (
		<div className={styles.uploadActions}>
			<Link
				href={posterUploadHref}
				className={`${styles.uploadAction} btn btn--style-primary btn--no-margin btn--size-medium btn--icon-style-without-border`}
			>
				<CalendarPlus size={16} />
				<span>Poster Upload</span>
			</Link>
			<button
				// href={instagramUploadHref}
				className={`${styles.uploadAction} btn btn--style-primary btn--no-margin btn--size-medium btn--icon-style-without-border btn--disabled`}
			>
				<Instagram size={16} />
				<span>Instagram Link</span>
			</button>
		</div>
	);
};
