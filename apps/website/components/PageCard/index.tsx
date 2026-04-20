import { ComponentPropsWithoutRef } from "react";

import styles from "./PageCard.module.scss";

export const PageCard = ({
	children,
	className,
	...props
}: ComponentPropsWithoutRef<"main">) => {
	return (
		<main
			className={`${styles.pageCard}${className ? ` ${className}` : ""}`}
			{...props}
		>
			{children}
		</main>
	);
};
