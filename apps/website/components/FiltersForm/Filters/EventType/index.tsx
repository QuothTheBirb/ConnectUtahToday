import { Dispatch, SetStateAction } from "react";
import { FormSelect, SelectOption } from "@/components/form/inputs/FormSelect";

type EventTypeFilterProps = {
	className?: string;
	eventTypeOptions: SelectOption[];
	selectedEventTypes: SelectOption[];
	setSelectedEventTypes: Dispatch<SetStateAction<SelectOption[]>>;
};
export const EventTypeFilter = (props: EventTypeFilterProps) => {
	const {
		eventTypeOptions,
		selectedEventTypes,
		setSelectedEventTypes,
		className,
	} = props;

	if (!eventTypeOptions) {
		console.log(
			"There are no available eventTypeOptions",
			eventTypeOptions,
		);

		return null;
	}

	return (
		<FormSelect
			label={"Event Types"}
			id={"eventTypes"}
			options={eventTypeOptions}
			isMulti={true}
			value={selectedEventTypes}
			onChange={(value) =>
				setSelectedEventTypes(Array.isArray(value) ? value : [value])
			}
			placeholder={"Any"}
			isClearable={true}
			isSearchable={true}
			aria-label={"Search and select event types…"}
			instanceId={"eventTypes"}
			className={className}
		/>
	);
};
