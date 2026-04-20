"use client";

import Select, { GroupBase, Props } from "react-select";
import { FormField } from "@/components/form/FormField";

export type SelectOption = { value: string; label: string };

type FormSelectProps = {
	label: string;
	id: string;
	className?: string;
} & Omit<Props<SelectOption, boolean, GroupBase<SelectOption>>, "inputId">;

export const FormSelect = ({
	label,
	id,
	className,
	...selectProps
}: FormSelectProps) => {
	return (
		<FormField label={label} id={id} className={className}>
			<Select inputId={id} {...selectProps} />
		</FormField>
	);
};
