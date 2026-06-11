"use client";

import { Button, TextInput } from "@payloadcms/ui";
import { Instagram } from "lucide-react";
import { useState } from "react";

import styles from "../EventUploads.module.scss";

export const InstagramUpload = () => {
	const link = useState<string | null>(null);

	return (
		<div className={styles.instagramUpload}>
			<TextInput path={"instagram-upload"} />
			<Button
				type="button"
				buttonStyle={"primary"}
				// onClick={() => fileInputRef.current?.click()}
				disabled={true}
				margin={false}
				size="large"
				icon={<Instagram />}
				iconPosition={"left"}
				iconStyle={"without-border"}
				className={`${styles.instagramUploadButton}`}
			>
				Upload Instagram Event
			</Button>
			{/*<button*/}
			{/*	className={`${styles.instagramUploadButton} btn btn--style-primary btn--no-margin btn--size-large btn--icon-style-without-border`}*/}
			{/*>*/}
			{/*	<Instagram size={18} />*/}
			{/*	<span>Upload Instagram Event</span>*/}
			{/*</button>*/}
		</div>
	);
};
