import { Dispatch, SetStateAction } from "react";
import { FormSelect, SelectOption } from "@/components/form/inputs/FormSelect";

export const CityFilter = ({
	cityOptions,
	selectedCities,
	setSelectedCities,
	className,
}: {
	cityOptions: SelectOption[];
	selectedCities: SelectOption[];
	setSelectedCities: Dispatch<SetStateAction<SelectOption[]>>;
	className?: string;
}) => {
	return (
		<FormSelect
			label={"Cities"}
			id={"cities"}
			options={cityOptions}
			isMulti={true}
			value={selectedCities}
			onChange={(value) =>
				setSelectedCities(Array.isArray(value) ? value : [value])
			}
			placeholder={"All Cities"}
			isClearable={true}
			isSearchable={true}
			aria-label={"Search for events by city…"}
			instanceId={"cities"}
			className={className}
		/>
	);
};
