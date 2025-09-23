"use client";

import { useState } from "react";
import styles from './OrgDropdowns.module.scss'; 
import type { Organization } from "../../app/volunteer/page";

interface OrgDropdownsProps {
  organizations: Organization[];
  selectedOrgs: string[];
  setSelectedOrgs: (orgs: string[]) => void;
}

export const OrgDropdowns = ({
  organizations,
  selectedOrgs,
  setSelectedOrgs,
}: OrgDropdownsProps) => {
  // Always at least one dropdown
  const dropdowns = selectedOrgs.length ? selectedOrgs : ["Any"];

  const handleChange = (idx: number, value: string) => {
    const updated = [...dropdowns];
    updated[idx] = value;
    const filtered = updated.filter((val) => val.trim() !== "");
    setSelectedOrgs(filtered.length ? filtered : ["Any"]);
  };

  const addDropdown = () => {
    setSelectedOrgs([...dropdowns.filter(v => v !== "Any"), ""]);
  };

  const removeDropdown = (idx: number) => {
    const updated = [...dropdowns];
    updated.splice(idx, 1);
    setSelectedOrgs(updated.length ? updated : ["Any"]);
  };

  return (
    <div>
      {dropdowns.map((org, idx) => (
        <div key={idx} className={styles.dropdownWrapper}>
          <input
            type="text"
            list="org-list"
            placeholder="Type or select an organization"
            value={org}
            onChange={(e) => handleChange(idx, e.target.value)}
            className={styles.dropdownInput}
            autoComplete="off"
            data-index={idx}
          />
          {dropdowns.length > 1 && (
            <button
              type="button"
              className={styles.removeButton}
              onClick={() => removeDropdown(idx)}
            >
              Remove
            </button>
          )}
        </div>
      ))}
      <datalist id="org-list">
        {organizations.map((org) => (
          <option key={org.id} value={org.name} />
        ))}
      </datalist>
      <button
        type="button"
        className={styles.addButton}
        onClick={addDropdown}
      >
        + Add another organization
      </button>
    </div>
  );
};

export default OrgDropdowns;