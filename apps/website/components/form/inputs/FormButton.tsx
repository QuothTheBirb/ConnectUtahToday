import React, { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

import styles from "../Form.module.scss";

type FormButtonProps = DetailedHTMLProps<
	ButtonHTMLAttributes<HTMLButtonElement>,
	HTMLButtonElement
>;

const FormButton = ({ children, className, ...props }: FormButtonProps) => {
	return (
		<button
			className={`${styles.button}${className ? ` ${className}` : ""}`}
			{...props}
		>
			{children}
		</button>
	);
};

export default FormButton;
