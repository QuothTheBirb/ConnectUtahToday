import { Dispatch, SetStateAction } from "react";
import { FormSelect } from "@/components/form/inputs/FormSelect";

export const CityFilter = ({
	cityOptions,
	selectedCity,
	setSelectedCity,
	className,
}: {
	cityOptions: { label: string; value: string }[];
	selectedCity: string;
	setSelectedCity: Dispatch<SetStateAction<string>>;
	className?: string;
}) => {
	return (
		<FormSelect
			label={"City"}
			id={"locationSearch"}
			options={cityOptions}
			value={
				selectedCity
					? {
							label: selectedCity,
							value: selectedCity,
						}
					: null
			}
			onChange={(val: any) => setSelectedCity(val?.value || "")}
			placeholder={"All Cities"}
			isClearable={true}
			instanceId={"city-select"}
			className={className}
		/>
	);
};
