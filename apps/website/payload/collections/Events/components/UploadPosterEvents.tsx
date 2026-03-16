"use client";

import React, { useRef, useState } from "react";
import { Button } from "@payloadcms/ui";
import { CalendarPlus } from "lucide-react";
import { useRouter } from "next/navigation";

import { uploadPosterEventsAction } from "../actions";

export const UploadPosterEvents = () => {
	const [loading, setLoading] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const router = useRouter();

	const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (!files || files.length === 0) return;

		setLoading(true);
		try {
			const formData = new FormData();
			for (const file of Array.from(files)) {
				formData.append("file", file);
			}

			const result = await uploadPosterEventsAction(formData);

			if (result.success) {
				alert(
					`Successfully created ${result.count} event(s) from posters!`,
				);
				router.refresh();
			} else {
				alert(
					`Failed to scan posters: ${result.error || "Unknown error"}`,
				);
			}
		} catch (error) {
			console.error("Error during poster upload and scan:", error);
			alert("An unexpected error occurred.");
		} finally {
			setLoading(false);
			if (fileInputRef.current) fileInputRef.current.value = "";
		}
	};

	return (
		<div style={{ marginBottom: "10px" }}>
			<div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
				<Button
					type="button"
					buttonStyle="pill"
					size={"small"}
					onClick={() => fileInputRef.current?.click()}
					disabled={loading}
				>
					<span
						style={{
							display: "flex",
							alignItems: "center",
							gap: "8px",
						}}
					>
						<CalendarPlus size={16} />
						{loading ? "Processing..." : "Upload Poster Events"}
					</span>
				</Button>
				<input
					type="file"
					multiple
					accept="image/*"
					ref={fileInputRef}
					style={{ display: "none" }}
					onChange={onFileChange}
				/>
				<p style={{ fontSize: "12px", color: "#666", margin: 0 }}>
					Upload one or more event posters to automatically create
					events using info in the posters.
				</p>
			</div>
		</div>
	);
};
