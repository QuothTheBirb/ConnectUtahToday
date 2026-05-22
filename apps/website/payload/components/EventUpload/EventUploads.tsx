import { UIFieldServerComponent } from "payload";

import { EventUploadActions } from "./EventUploadActions";
import styles from "./EventUploads.module.scss";

export const EventUploads: UIFieldServerComponent = () => {
	return (
		<div className={`${styles.eventUploads}`}>
			<h3 className={styles.title}>Upload Events</h3>
			<EventUploadActions />
		</div>
	);
};
