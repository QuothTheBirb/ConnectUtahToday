"use client";

import {useCallback, useMemo, useState} from "react";

import {FiltersForm} from "@/components/FilterForm";
import {OrganizationFilter} from "@/components/FilterForm/Filters/OrgSelect";
import ActivitiesSelect from "@/components/FilterForm/Filters/ActivitiesSelect";
import OpportunityList from "@/components/VolunteeringOpportunities/OpportunityList/OpportunityList";
import styles from './VolunteeringOpportunities.module.scss';
import {Organization} from "@/payload-types";

export const VolunteeringOpportunities = ({ organizations }: { organizations: Organization[] }) => {
  const [selectedOrgs, setSelectedOrgs] = useState<string[]>([]);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [appliedFilters, setAppliedFilters] = useState({
    orgs: [] as string[],
    activities: [] as string[],
  });

  const filteredOrganizations = useMemo(() => {
    const { orgs, activities } = appliedFilters;
    return organizations.filter((org) => {
      const matchesOrg = orgs.length === 0 || orgs.includes(org.name);
      if (!matchesOrg) return false;

      if (activities.length === 0) return true;

      const orgActivities =
        org.opportunities
          ?.map((opp) => (typeof opp === "object" ? opp.name : ""))
          .filter(Boolean) || [];

      return activities.some((act) => orgActivities.includes(act));
    });
  }, [organizations, appliedFilters]);

  const activitiesOptions = useMemo(() => {
    const activities = organizations
      .flatMap((org) => org.opportunities || [])
      .map((opp) => (typeof opp === "object" ? opp.name.trim() : ""))
      .filter(Boolean);

    return Array.from(new Set(activities)).sort();
  }, [organizations]);

  const orgOptions = useMemo(
    () => Array.from(new Set(organizations.map((org) => org.name))).sort(),
    [organizations]
  );

  const applyFilters = useCallback(() => {
    setAppliedFilters({
      orgs: selectedOrgs,
      activities: selectedActivities,
    });
  }, [selectedOrgs, selectedActivities]);

  const clearFilters = useCallback(() => {
    setSelectedOrgs([]);
    setSelectedActivities([]);
    setAppliedFilters({
      orgs: [],
      activities: [],
    });
  }, []);

  const isClearable =
    selectedOrgs.length > 0 ||
    selectedActivities.length > 0 ||
    appliedFilters.orgs.length > 0 ||
    appliedFilters.activities.length > 0;

  return (
    <>
      <FiltersForm applyFilters={applyFilters} clearFilters={clearFilters} showClearButton={isClearable}>
        <OrganizationFilter orgOptions={orgOptions} selectedOrgs={selectedOrgs} setSelectedOrgs={setSelectedOrgs} selectMany={true} />
        <ActivitiesSelect activities={activitiesOptions} selectedActivities={selectedActivities} setSelectedActivities={setSelectedActivities} />
      </FiltersForm>
      <section className={styles.opportunityList}>
        <OpportunityList organizations={filteredOrganizations} />
      </section>
    </>
  )
}
