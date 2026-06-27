import { Dispatch, SetStateAction } from "react";
import { FormSelect, SelectOption } from "@/components/form/inputs/FormSelect";

type OrganizationFilterProps = {
	orgOptions: SelectOption[];
	className?: string;
} & (
	| {
			selectMany?: false;
			selectedOrg: SelectOption | null;
			setSelectedOrg: Dispatch<SetStateAction<SelectOption | null>>;
	  }
	| {
			selectMany: true;
			selectedOrgs: SelectOption[];
			setSelectedOrgs: Dispatch<SetStateAction<SelectOption[]>>;
	  }
);

export const OrganizationFilter = (props: OrganizationFilterProps) => {
	const { orgOptions, selectMany, className } = props;

	const selectOptions = orgOptions.map((org) => {
		if (typeof org === "string") {
			return {
				value: org,
				label: org,
			};
		}
		return org;
	});

	// If selectMany is true, return a multi-select dropdown
	if (selectMany) {
		const { selectedOrgs, setSelectedOrgs } = props;

		return (
			<FormSelect
				label={"Organizations"}
				id={"organizations"}
				options={selectOptions}
				isMulti={true}
				value={selectedOrgs}
				onChange={(value) =>
					setSelectedOrgs(Array.isArray(value) ? value : [value])
				}
				placeholder={"Any"}
				isClearable={true}
				isSearchable={true}
				aria-label={"Search and select organizations…"}
				instanceId={"organizations"}
				className={className}
			/>
		);
	}

	// Otherwise, return a single-select dropdown
	const { selectedOrg, setSelectedOrg } = props;

	return (
		<FormSelect
			label={"Organization"}
			id={"organization"}
			name={"organization"}
			options={selectOptions}
			isMulti={false}
			value={selectedOrg}
			onChange={(value) =>
				setSelectedOrg(Array.isArray(value) ? value[0] : value)
			}
			placeholder={"Any"}
			isClearable={true}
			isSearchable={true}
			aria-label={"Search and select an organization…"}
			instanceId={"organization"}
			className={className}
		/>
	);
};
