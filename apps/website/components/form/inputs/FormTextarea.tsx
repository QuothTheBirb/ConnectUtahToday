import React, {
	DetailedHTMLProps,
	ReactNode,
	TextareaHTMLAttributes,
} from "react";
import { FormField } from "@/components/form/FormField";

import styles from "../Form.module.scss";

type FormTextareaProps = {
	label: ReactNode;
	id: string;
	invalid?: boolean;
} & DetailedHTMLProps<
	TextareaHTMLAttributes<HTMLTextAreaElement>,
	HTMLTextAreaElement
>;

const FormTextarea = ({
	label,
	id,
	invalid,
	...textareaProps
}: FormTextareaProps) => {
	return (
		<FormField label={label} id={id} className={styles.inputWrapper}>
			<textarea id={id} className={styles.input} {...textareaProps} />
		</FormField>
	);
};

export default FormTextarea;
