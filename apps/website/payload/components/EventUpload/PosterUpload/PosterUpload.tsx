"use client";

import { Button, useConfig } from "@payloadcms/ui";
import {
	AlertCircle,
	CheckCircle2,
	ImageUp,
	Loader2,
	RotateCcw,
	Upload,
	X,
} from "lucide-react";
import Link from "next/link";
import {
	ChangeEvent,
	Dispatch,
	SetStateAction,
	useEffect,
	useRef,
	useState,
} from "react";

import {
	dismissPosterUploadJob,
	getUserEventUploads,
	retryPosterUploadJob,
	uploadPosterEventsAction,
	UserEventUpload,
} from "../actions";
import styles from "../EventUploads.module.scss";

interface SelectedFile {
	file: File;
	previewUrl: string;
}

const UploadJobContent = ({
	job,
	busy,
	retryJob,
	dismissJob,
}: {
	job: UserEventUpload;
	busy: boolean;
	retryJob: () => Promise<void>;
	dismissJob: () => Promise<void>;
}) => {
	const status = job.status === "pending" ? "processing" : job.status;

	return (
		<>
			{job.imageUrl ? (
				<div className={styles.tileImageWrapper}>
					<img
						src={job.imageUrl}
						alt="poster"
						className={`${styles.tileImage}${status === "processing" && ` ${styles.pending}`}`}
					/>
				</div>
			) : (
				<div className={styles.tilePlaceholder}>
					<Upload size={48} />
				</div>
			)}
			<div
				className={`${styles.tileFooter} ${styles.centered} ${status === "success" ? ` ${styles.success}` : status === "failed" ? ` ${styles.failed}` : ""}`}
			>
				{status === "processing" ? (
					<>
						<Loader2
							size={16}
							className={`${styles.statusIcon} ${styles.spin}`}
						/>
						<span>
							{job.status === "processing"
								? "Scanning..."
								: "Queued"}
						</span>
					</>
				) : status === "success" ? (
					<>
						<CheckCircle2 size={16} className={styles.statusIcon} />
						<span className={styles.statusText}>Uploaded</span>
					</>
				) : (
					<>
						<AlertCircle size={16} className={styles.statusIcon} />
						<span className={styles.statusText}>Failed</span>
					</>
				)}
			</div>
			{status === "failed" && (
				<div className={styles.tileActions}>
					<button
						type="button"
						className={styles.iconCircleButton}
						onClick={(event) => {
							event.preventDefault();

							void retryJob();
						}}
						disabled={busy}
						title="Retry"
					>
						<RotateCcw size={16} />
					</button>
					<button
						type="button"
						className={styles.iconCircleButton}
						onClick={(event) => {
							event.preventDefault();

							void dismissJob();
						}}
						disabled={busy}
						title="Dismiss"
					>
						<X size={16} />
					</button>
				</div>
			)}
		</>
	);
};

const UploadJobTile = ({
	job,
	adminRoute,
	fetchJobs,
	setJobs,
	setError,
}: {
	job: UserEventUpload;
	adminRoute: string;
	fetchJobs: () => Promise<void>;
	setJobs: Dispatch<SetStateAction<UserEventUpload[]>>;
	setError: Dispatch<SetStateAction<string | null>>;
}) => {
	const jobId = job.id;
	const eventId = job.eventIds?.[0];
	const status = job.status === "pending" ? "processing" : job.status;
	const eventLink =
		status === "success" && eventId
			? `${adminRoute}/collections/events/${eventId}`
			: status === "failed"
				? `${adminRoute}/collections/payload-jobs/${job.id}`
				: null;
	const [jobBusy, setJobBusy] = useState<boolean>(false);

	const retryJob = async () => {
		setJobBusy(true);
		setError(null);

		try {
			const result = await retryPosterUploadJob(jobId);

			if (!result.success) {
				setError(result.error || "Failed to retry poster.");
				return;
			}

			// Drop the old failed job; the re-queued one arrives on refresh
			setJobs((prev) => prev.filter((job) => job.id !== jobId));

			void fetchJobs();
		} finally {
			setJobBusy(false);
		}
	};

	const dismissJob = async () => {
		setJobBusy(true);
		setError(null);

		try {
			const result = await dismissPosterUploadJob(jobId);

			if (!result.success) {
				setError(result.error || "Failed to dismiss poster.");
				return;
			}

			setJobs((prev) => prev.filter((job) => job.id !== jobId));
		} finally {
			setJobBusy(false);
		}
	};

	if (!eventLink) {
		return (
			<div key={job.id} className={styles.tile}>
				<UploadJobContent
					job={job}
					busy={jobBusy}
					retryJob={retryJob}
					dismissJob={dismissJob}
				/>
			</div>
		);
	}

	return (
		<Link
			key={job.id}
			href={eventLink}
			className={`${styles.tile} ${styles.clickable} ${status === "success" ? styles.success : status === "failed" ? styles.failed : ""}`}
			title={job.status === "success" ? "View event" : "View failed job"}
		>
			<UploadJobContent
				job={job}
				busy={jobBusy}
				retryJob={retryJob}
				dismissJob={dismissJob}
			/>
		</Link>
	);
};

export const PosterUpload = () => {
	const { config } = useConfig();
	const adminRoute = config.routes.admin || "/admin";

	const fileInputRef = useRef<HTMLInputElement>(null);
	const [uploading, setUploading] = useState(false);
	const [globalError, setGlobalError] = useState<string | null>(null);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);
	const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
	const [eventImageIndex, setEventImageIndex] = useState<number | null>(null);
	const [jobs, setJobs] = useState<UserEventUpload[]>([]);

	const fetchJobs = async () => {
		const userJobs = await getUserEventUploads();

		if (userJobs) setJobs(userJobs);
	};

	useEffect(() => {
		void fetchJobs();

		const interval = setInterval(fetchJobs, 5000); // Poll every 5s

		return () => clearInterval(interval);
	}, []);

	const onFilePick = (event: ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files;
		if (!files) return;

		const newFiles = Array.from(files).map((file) => ({
			file,
			previewUrl: URL.createObjectURL(file),
		}));

		setSelectedFiles((prev) => [...prev, ...newFiles]);

		// Reset input so the same file can be picked again if removed
		if (fileInputRef.current) fileInputRef.current.value = "";
	};

	const removeFile = (index: number) => {
		setSelectedFiles((prev) => {
			const updated = [...prev];

			URL.revokeObjectURL(updated[index].previewUrl);
			updated.splice(index, 1);

			// Keep eventImageIndex in bounds
			setEventImageIndex((prev) =>
				prev !== null && prev >= updated.length
					? updated.length > 0
						? updated.length - 1
						: null
					: prev,
			);
			return updated;
		});
	};

	const onUpload = async () => {
		if (selectedFiles.length === 0) return;

		setGlobalError(null);
		setSuccessMessage(null);
		setUploading(true);

		try {
			const formData = new FormData();

			for (const item of selectedFiles) {
				formData.append("file", item.file);
			}

			if (eventImageIndex !== null) {
				formData.append("eventImageIndex", String(eventImageIndex));
			}

			const result = await uploadPosterEventsAction(formData);

			if (!result.success) {
				setGlobalError(result.error || "Failed to upload posters.");
				return;
			}

			setSuccessMessage(
				`Event uploaded successfully. Scanning and event creation are processing in the background.`,
			);
			setEventImageIndex(null);

			// Cleanup object URLs
			selectedFiles.forEach((item) =>
				URL.revokeObjectURL(item.previewUrl),
			);
			setSelectedFiles([]);

			// Refresh jobs immediately
			void fetchJobs();
		} catch (err) {
			console.error(err);
			setGlobalError(
				err instanceof Error
					? err.message
					: "Unexpected error during upload.",
			);
		} finally {
			setUploading(false);
		}
	};

	const processingJobs = jobs.filter(
		(job) => job.status === "pending" || job.status === "processing",
	);
	const failedJobs = jobs.filter((job) => job.status === "failed");
	const successJobs = jobs.filter((job) => job.status === "success");

	return (
		<div
			className={`${styles.posterUpload}${uploading ? ` ${styles.uploading}` : ""}`}
		>
			{/* Row 1: Add Event section */}
			<div className={styles.addEventSection}>
				<div className={styles.uploadFiles}>
					{/* Add New Square */}
					<div
						className={styles.addTile}
						onClick={() =>
							!uploading && fileInputRef.current?.click()
						}
					>
						<ImageUp size={72} />
						<span className={styles.addLabel}>Upload Event</span>
						<input
							type="file"
							multiple
							accept="image/*"
							ref={fileInputRef}
							className={styles.hiddenInput}
							onChange={onFilePick}
						/>
					</div>

					{/* Selected Draft Files */}
					<div className={styles.selectedFiles}>
						{selectedFiles.map((item, index) => (
							<div
								key={`selected-${index}`}
								className={styles.selectedFile}
							>
								<div className={styles.imageWrapper}>
									<img
										src={item.previewUrl}
										alt="preview"
										className={styles.image}
									/>
								</div>
								<div className={styles.options}>
									<input
										type="checkbox"
										className={styles.checkbox}
										checked={eventImageIndex === index}
										onChange={() =>
											setEventImageIndex(
												eventImageIndex === index
													? null
													: index,
											)
										}
										disabled={uploading}
										id={`set-image-${index}`}
									/>
									<label
										className={styles.checkboxLabel}
										htmlFor={`set-image-${index}`}
									>
										Set as event image
									</label>
								</div>
								<div className={styles.actions}>
									<button
										type="button"
										className={styles.remove}
										onClick={() => removeFile(index)}
										disabled={uploading}
										title="Remove"
									>
										<X size={16} />
									</button>
								</div>
							</div>
						))}
					</div>
				</div>

				{selectedFiles.length > 0 && (
					<div className={styles.addEventUploadBar}>
						<Button
							type="button"
							buttonStyle="primary"
							onClick={onUpload}
							disabled={uploading}
							size="large"
							margin={false}
							icon={<Upload size={18} />}
							iconPosition={"left"}
						>
							{uploading
								? "Uploading..."
								: `Upload Event (${selectedFiles.length} image${selectedFiles.length !== 1 ? "s" : ""})`}
						</Button>
					</div>
				)}
			</div>

			{/* Row 2: Processing jobs */}
			{processingJobs.length > 0 && (
				<div className={styles.sectionRow}>
					<span className={styles.sectionLabel}>
						Processing Event Uploads
					</span>
					<div className={styles.grid}>
						{processingJobs.map((job) => (
							<UploadJobTile
								key={job.id}
								job={job}
								setJobs={setJobs}
								fetchJobs={fetchJobs}
								adminRoute={adminRoute}
								setError={setGlobalError}
							/>
						))}
					</div>
				</div>
			)}

			{/* Row 3: Failed jobs */}
			{failedJobs.length > 0 && (
				<div className={styles.sectionRow}>
					<span className={styles.sectionLabel}>
						Failed Event Uploads
					</span>
					<div className={styles.grid}>
						{failedJobs.map((job) => (
							<UploadJobTile
								key={job.id}
								job={job}
								setJobs={setJobs}
								fetchJobs={fetchJobs}
								adminRoute={adminRoute}
								setError={setGlobalError}
							/>
						))}
					</div>
				</div>
			)}

			{/* Row 4: Successful jobs */}
			{successJobs.length > 0 && (
				<div className={styles.sectionRow}>
					<span className={styles.sectionLabel}>
						Successful Event Uploads
					</span>
					<div className={styles.grid}>
						{successJobs.map((job) => (
							<UploadJobTile
								key={job.id}
								job={job}
								setJobs={setJobs}
								fetchJobs={fetchJobs}
								adminRoute={adminRoute}
								setError={setGlobalError}
							/>
						))}
					</div>
				</div>
			)}

			{globalError && (
				<div
					role="alert"
					className={`${styles.alert} ${styles.alertError}`}
				>
					{globalError}
				</div>
			)}

			{successMessage && (
				<div
					role="status"
					className={`${styles.alert} ${styles.alertSuccess}`}
				>
					{successMessage}
				</div>
			)}
		</div>
	);
};
