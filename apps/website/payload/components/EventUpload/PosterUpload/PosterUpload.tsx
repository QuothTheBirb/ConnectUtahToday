"use client";

import { Button } from "@payloadcms/ui";
import { Upload } from "lucide-react";
import { ChangeEvent, useRef, useState } from "react";

import { uploadPosterEventsAction } from "../actions";

export const PosterUpload = () => {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [uploading, setUploading] = useState(false);
	const [globalError, setGlobalError] = useState<string | null>(null);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);

	const onFilePick = async (event: ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files;
		if (!files || files.length === 0) return;

		setGlobalError(null);
		setSuccessMessage(null);
		setUploading(true);

		try {
			const formData = new FormData();
			for (const file of Array.from(files)) {
				formData.append("file", file);
			}

			const result = await uploadPosterEventsAction(formData);

			if (!result.success) {
				setGlobalError(result.error || "Failed to upload posters.");
				return;
			}

			setSuccessMessage(
				`Successfully uploaded ${result.count} poster(s). Scanning and event creation are processing in the background. You can safely leave this page.`,
			);
		} catch (err) {
			console.error(err);
			setGlobalError(
				err instanceof Error
					? err.message
					: "Unexpected error during upload.",
			);
		} finally {
			setUploading(false);
			if (fileInputRef.current) fileInputRef.current.value = "";
		}
	};

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				gap: "1.5rem",
			}}
		>
			<div
				style={{
					display: "flex",
					alignItems: "center",
					gap: "0.5rem",
					flexWrap: "wrap",
					padding: "2rem",
					border: "1px solid var(--theme-elevation-150)",
					borderRadius: 8,
					background: "var(--theme-elevation-50)",
					justifyContent: "center",
					textAlign: "center",
				}}
			>
				<input
					type="file"
					multiple
					accept="image/*"
					ref={fileInputRef}
					style={{ display: "none" }}
					onChange={onFilePick}
				/>
				<div style={{ width: "100%" }}>
					<Button
						type="button"
						buttonStyle="primary"
						onClick={() => fileInputRef.current?.click()}
						disabled={uploading}
						size="large"
					>
						<span
							style={{
								display: "inline-flex",
								alignItems: "center",
							}}
						>
							<Upload size={20} />
							{uploading
								? "Uploading..."
								: "Select Posters to Upload"}
						</span>
					</Button>
				</div>
				<p
					style={{
						color: "var(--theme-elevation-500)",
					}}
				>
					Select one or more poster images. Each will be processed in
					the background.
				</p>
			</div>

			{globalError && (
				<div
					role="alert"
					style={{
						padding: "1rem",
						border: "1px solid var(--theme-error-500)",
						borderRadius: 4,
						color: "var(--theme-error-500)",
						background: "var(--theme-error-50, transparent)",
					}}
				>
					{globalError}
				</div>
			)}

			{successMessage && (
				<div
					role="status"
					style={{
						padding: "1rem",
						border: "1px solid var(--theme-success-500)",
						borderRadius: 4,
						color: "var(--theme-success-500)",
						background: "var(--theme-success-50, transparent)",
					}}
				>
					{successMessage}
				</div>
			)}
		</div>
	);
};
