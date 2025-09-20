import {Dispatch, SetStateAction} from "react";

import {FormInput} from "@/components/FormInput";
import styles from './SelectOrg.module.scss';

export const OrganizationFilter = ({
  orgOptions,
  selectedOrg,
  setSelectedOrg
}: {
  orgOptions: string[];
  selectedOrg: string;
  setSelectedOrg: Dispatch<SetStateAction<string>>;
}) => {
  return (
    <FormInput label={"Organization"}>
      <select
        className={styles.orgSelect}
        value={selectedOrg}
        onChange={(event) => setSelectedOrg(event.target.value)}
      >
        <option value={""}>Any</option>
        {orgOptions.map((org, index) => (
          <option key={index} value={org}>{org}</option>
        ))}
      </select>
    </FormInput>
  )
}
