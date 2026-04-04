import { ReactNode } from "react";

import styles from "./Form.module.scss";

export const FormFieldset = ({
	legend,
	description,
	children,
}: {
	legend: string;
	description?: string;
	children?: ReactNode;
}) => {
	return (
		<fieldset className={styles.fieldset}>
			<legend className={styles.legend}>{legend}</legend>
			{description && <p className={styles.description}>{description}</p>}
			{children}
		</fieldset>
	);
};
