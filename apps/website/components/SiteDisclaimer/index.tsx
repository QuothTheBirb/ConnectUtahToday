"use client";

import { useEffect, useState } from "react";

import styles from "./SiteDisclaimer.module.scss";

interface DisclaimerProps {
	enabled: boolean;
	title: string;
	message: string;
	buttonText: string;
}

export const SiteDisclaimer = ({
	enabled,
	title,
	message,
	buttonText,
}: DisclaimerProps) => {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		if (enabled) {
			const hasSeenDisclaimer = localStorage.getItem("hasSeenDisclaimer");
			if (!hasSeenDisclaimer) {
				setIsVisible(true);
			}
		}
	}, [enabled]);

	const handleAccept = () => {
		localStorage.setItem("hasSeenDisclaimer", "true");
		setIsVisible(false);
	};

	if (!isVisible) return null;

	return (
		<div className={styles.overlay}>
			<div className={styles.modal}>
				<h2 className={styles.title}>{title}</h2>
				<p className={styles.message}>{message}</p>
				<button className={styles.button} onClick={handleAccept}>
					{buttonText}
				</button>
			</div>
		</div>
	);
};
