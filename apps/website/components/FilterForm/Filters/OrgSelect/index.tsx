import {Dispatch, SetStateAction} from "react";
import Select from 'react-select';
import styles from './OrgSelect.module.scss';
import {FormInput} from "@/components/FormInput";

type OrgOption = { label: string; value: string };

type OrganizationFilterProps = {
  orgOptions: (string | OrgOption)[];
} & ({
  selectedOrg: string | null;
  setSelectedOrg: Dispatch<SetStateAction<string | null>>;
  selectMany?: false;
} | {
  selectedOrgs: string[];
  setSelectedOrgs: Dispatch<SetStateAction<string[]>>;
  selectMany: true;
});
export const OrganizationFilter = (props: OrganizationFilterProps) => {
  const {
    orgOptions,
    selectMany
  } = props;

  const selectOptions = orgOptions.map((org) => {
    if (typeof org === 'string') {
      return {
        value: org,
        label: org
      };
    }
    return org;
  });

  // If selectMany is true, return a multi-select dropdown
  if (selectMany) {
    const {
      selectedOrgs,
      setSelectedOrgs
    } = props;

    return (
      <FormInput label={"Organizations"} htmlFor={'organizations'}>
        <Select
          inputId={'organizations'}
          name={'organizations'}
          className={styles.orgSelect}
          options={selectOptions}
          isMulti={true}
          value={selectedOrgs.map((org) => {
            const option = selectOptions.find(o => o.value === org);
            return option || {value: org, label: org};
          })}
          onChange={(value) => setSelectedOrgs(value.map((org) => org.value))}
          placeholder={"Any"}
          isClearable={true}
          isSearchable={true}
          aria-label={"Search and select organizations…"}
          instanceId={"organizations"}
        />
      </FormInput>
    )
  }

  // Otherwise, return a single-select dropdown
  const {
    selectedOrg,
    setSelectedOrg
  } = props;

  return (
    <FormInput label={`Organisation`} htmlFor={'organization'}>
      <Select
        inputId={'organization'}
        name={'organization'}
        className={styles.orgSelect}
        options={selectOptions}
        isMulti={false}
        value={selectedOrg ? (selectOptions.find(o => o.value === selectedOrg) || {
          value: selectedOrg,
          label: selectedOrg,
        }) : null}
        onChange={(value) => setSelectedOrg(value ? value.value : null)}
        placeholder={"Any"}
        isClearable={true}
        isSearchable={true}
        aria-label={"Search and select an organization…"}
        instanceId={"organization"}
      />
    </FormInput>
  )
}
