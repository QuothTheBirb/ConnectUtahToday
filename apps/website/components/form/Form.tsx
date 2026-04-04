import { ReactNode, SyntheticEvent } from "react";

import styles from "./Form.module.scss";

type FormProps = {
	onSubmit: (event: SyntheticEvent) => void;
	children: ReactNode;
};
// } & DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>; // Something is off with this, implement additional html form props later
export const Form = ({ onSubmit, children }: FormProps) => {
	return (
		<form className={styles.form} onSubmit={onSubmit}>
			{children}
		</form>
	);
};
