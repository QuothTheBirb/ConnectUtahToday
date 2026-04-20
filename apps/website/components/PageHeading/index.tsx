import { ComponentPropsWithoutRef, ReactNode } from "react";

import styles from "./PageHeading.module.scss";

interface PageHeadingProps extends ComponentPropsWithoutRef<
	"h1" | "h2" | "h3" | "h4"
> {
	children: ReactNode;
	heading?: "h1" | "h2" | "h3" | "h4";
}

export const PageHeading = ({
	children,
	heading = "h1",
	className,
	...props
}: PageHeadingProps) => {
	const Tag = heading;

	return (
		<Tag
			className={`${styles.heading}${className ? ` ${className}` : ""}`}
			{...props}
		>
			{children}
		</Tag>
	);
};
