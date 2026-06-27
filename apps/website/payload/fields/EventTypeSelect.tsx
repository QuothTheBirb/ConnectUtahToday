"use client";

import { SelectInput, useField } from "@payloadcms/ui";
import { OptionObject } from "payload";
import { useEffect, useState } from "react";
import { getEventTypes } from "@/lib/api/getEventTypes";
import { EventSetting } from "@/payload-types";
import { FieldDescription } from "@/payload/components/FieldDescription";

export const SelectEventTypeComponent = ({
	path,
	selectMany,
}: {
	path: string;
	selectMany?: boolean;
}) => {
	const { value, setValue } = useField<string[]>({ path });
	const [eventTypes, setEventTypes] = useState<EventSetting["eventTypes"]>(
		[],
	);
	const [options, setOptions] = useState<OptionObject[]>([]);

	const selectedEventTypes = Array.isArray(value)
		? value?.map((id) =>
				eventTypes?.find((eventType) => eventType.id === id),
			)
		: eventTypes?.find((eventType) => eventType.id === value);
	const eventTypeDescriptions = selectedEventTypes
		? Array.isArray(selectedEventTypes)
			? selectedEventTypes?.map(
					(eventType) =>
						`${eventType?.title}: ${eventType?.description}`,
				)
			: [`${selectedEventTypes.title}: ${selectedEventTypes.description}`]
		: null;

	useEffect(() => {
		const fetchOptions = async () => {
			const eventTypes = await getEventTypes();
			const eventTypeOptions = eventTypes.reduce<OptionObject[]>(
				(acc, eventType) => {
					if (eventType.id) {
						acc.push({
							label: eventType.title,
							value: eventType.id,
						});
					}

					return acc;
				},
				[],
			);

			setEventTypes(eventTypes);
			setOptions(eventTypeOptions);
		};

		void fetchOptions();
	}, []);

	return (
		<div className={"field-type select"}>
			<label className={"field-label"}>Event Type</label>
			<SelectInput
				name={path}
				path={path}
				options={options}
				value={value}
				hasMany={selectMany}
				onChange={(selected) => {
					if (selected) {
						const newValue = Array.isArray(selected)
							? selected.map((option) => option.value)
							: selected.value;

						setValue(newValue);
					} else {
						setValue(null);
					}
				}}
			/>
			<FieldDescription path={path}>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						gap: "0.25rem",
					}}
				>
					<div>The type of event being organized.</div>
					{eventTypeDescriptions ? (
						<ul
							style={{
								fontStyle: "italic",
							}}
						>
							{eventTypeDescriptions.map((description) => (
								<li>{description}</li>
							))}
						</ul>
					) : null}
				</div>
			</FieldDescription>
		</div>
	);
};
