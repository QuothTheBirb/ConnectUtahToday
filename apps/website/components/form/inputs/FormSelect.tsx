"use client";

import Select, { GroupBase, Props } from "react-select";

import { FormField } from "@/components/form/FormField";

export type SelectOption = { value: string; label: string };

type FormSelectProps = {
	label: string;
	id: string;
} & Omit<Props<SelectOption, boolean, GroupBase<SelectOption>>, "inputId">;

export const FormSelect = ({ label, id, ...selectProps }: FormSelectProps) => {
	return (
		<FormField label={label} id={id}>
			<Select inputId={id} {...selectProps} />
		</FormField>
	);
};
