import { ReactNode } from "react";

import styles from "./Form.module.scss";

export const FormField = ({
	label,
	id,
	className,
	children,
}: {
	label: ReactNode;
	id: string;
	className?: string;
	children?: ReactNode;
}) => {
	return (
		<div className={`${styles.field}${className ? ` ${className}` : ""}`}>
			<label htmlFor={id} className={styles.label}>
				{label}
			</label>
			{children}
		</div>
	);
};
