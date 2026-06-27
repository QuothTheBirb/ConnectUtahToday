"use client";

import { ReactNode } from "react";

export const FieldDescription = ({
	path,
	children,
	marginPlacement,
	className,
}: {
	path: string;
	children?: ReactNode;
	marginPlacement?: "top" | "bottom";
	className?: string;
}) => {
	if (children) {
		return (
			<div
				className={`field-description field-description-${path?.replace(/\./g, "__")}${marginPlacement && ` field-description--margin-${marginPlacement}`}${className ? ` ${className}` : ""}`}
			>
				{children}
			</div>
		);
	}

	return null;
};
