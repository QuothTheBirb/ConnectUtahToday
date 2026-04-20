import { Dispatch, SetStateAction } from "react";
import { FormSelect } from "@/components/form/inputs/FormSelect";

type OrgOption = { label: string; value: string };

type OrganizationFilterProps = {
	orgOptions: (string | OrgOption)[];
	className?: string;
} & (
	| {
			selectedOrg: string | null;
			setSelectedOrg: Dispatch<SetStateAction<string | null>>;
			selectMany?: false;
	  }
	| {
			selectedOrgs: string[];
			setSelectedOrgs: Dispatch<SetStateAction<string[]>>;
			selectMany: true;
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
				value={selectedOrgs.map((org) => {
					const option = selectOptions.find((o) => o.value === org);

					return option || { value: org, label: org };
				})}
				onChange={(value) =>
					setSelectedOrgs(
						Array.isArray(value)
							? value.map((org) => org.value)
							: [value],
					)
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
			value={
				selectedOrg
					? selectOptions.find((o) => o.value === selectedOrg) || {
							value: selectedOrg,
							label: selectedOrg,
						}
					: null
			}
			// @ts-ignore
			onChange={(value) => setSelectedOrg(value ? value.value : null)}
			placeholder={"Any"}
			isClearable={true}
			isSearchable={true}
			aria-label={"Search and select an organization…"}
			instanceId={"organization"}
			className={className}
		/>
	);
};
