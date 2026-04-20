import { MultiValue, SingleValue } from "react-select";

import { FormSelect, SelectOption } from "@/components/form/inputs/FormSelect";
import styles from "./ActivitiesSelect.module.scss";

type ActivitiesSelectProps = {
	activities: string[];
	selectedActivities: string[];
	setSelectedActivities: (acts: string[]) => void;
};

export const ActivitiesSelect = ({
	activities,
	selectedActivities,
	setSelectedActivities,
}: ActivitiesSelectProps) => {
	if (!activities.length) {
		return <span className={styles.loading}>Loading activities...</span>;
	}

	const options = activities.map((activity) => ({
		value: activity,
		label: activity,
	}));
	const selectedOptions = selectedActivities.map((activity) => ({
		value: activity,
		label: activity,
	}));

	const onChange = (
		newValue: SingleValue<SelectOption> | MultiValue<SelectOption>,
	) => {
		setSelectedActivities(
			Array.isArray(newValue)
				? newValue?.map((option) => option.value)
				: [newValue],
		);
	};

	return (
		<FormSelect
			label={"Activities"}
			id={"activities"}
			isMulti={true}
			options={options}
			value={selectedOptions}
			onChange={onChange}
		/>
	);
};

export default ActivitiesSelect;
