import {Dispatch, SetStateAction} from "react";

import styles from '../../EventsFilterForm.module.scss';

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
    <label className={styles.filter}>
      <span className={styles.filterLabel}>Organization:</span>
      <select
        className={styles.filterOrgSelect}
        value={selectedOrg}
        onChange={(event) => setSelectedOrg(event.target.value)}
      >
        <option value={""}>Any</option>
        {orgOptions.map((org, index) => (
          <option key={index} value={org}>{org}</option>
        ))}
      </select>
    </label>
  )
}
