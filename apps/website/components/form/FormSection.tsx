import { ReactNode } from "react";

import styles from "./Form.module.scss";

export const FormSection = ({
	label,
	children,
}: {
	label: string;
	children?: ReactNode;
}) => {
	return (
		<div className={styles.section}>
			<h2 className={styles.sectionLabel}>{label}</h2>
			{children}
		</div>
	);
};
