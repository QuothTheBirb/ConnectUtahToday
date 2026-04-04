import React, {
	DetailedHTMLProps,
	HTMLInputTypeAttribute,
	InputHTMLAttributes,
	ReactNode,
} from "react";

import { FormField } from "@/components/form/FormField";
import styles from "../Form.module.scss";

type FormInputProps = {
	type: HTMLInputTypeAttribute;
	label: ReactNode;
	id: string;
	invalid?: boolean;
} & DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

const FormInput = ({
	type,
	label,
	id,
	invalid,
	...inputProps
}: FormInputProps) => {
	if (type === "checkbox" || type === "radio") {
		return (
			<FormField
				label={label}
				id={id}
				className={
					type === "radio"
						? styles.radioWrapper
						: styles.checkboxWrapper
				}
			>
				<input
					type={type}
					id={id}
					className={styles.input}
					{...inputProps}
				/>
				<span
					className={
						type === "radio"
							? styles.customRadio
							: styles.customCheckbox
					}
				/>
			</FormField>
		);
	}

	return (
		<FormField label={label} id={id} className={styles.inputWrapper}>
			<input
				type={type}
				id={id}
				className={styles.input}
				{...inputProps}
			/>
		</FormField>
	);
};

export default FormInput;
