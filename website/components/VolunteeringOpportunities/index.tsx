"use client";

import {useCallback, useEffect, useMemo, useState} from "react";

import {FiltersForm} from "@/components/FilterForm";
import {OrganizationFilter} from "@/components/FilterForm/Filters/OrgSelect";
import ActivitiesSelect from "@/components/FilterForm/Filters/ActivitiesSelect";
import OpportunityList from "@/components/VolunteeringOpportunities/OpportunityList/OpportunityList";
import styles from './VolunteeringOpportunities.module.scss';
import {Opportunity, Organization} from "@/app/(app)/volunteer/page";

export const VolunteeringOpportunities = (
  {
    organizations,
    opportunities,
  }: {
    organizations: Organization[];
    opportunities: Opportunity[];
  }
) => {
  const [selectedOrgs, setSelectedOrgs] = useState<string[]>([]);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [ appliedFilters, setAppliedFilters ] = useState<{
    orgs: string[];
    activities: string[];
  }>({
    orgs: [],
    activities: [],
  });

  const filteredOpportunities = useMemo(() => {
    return opportunities.filter((opp) => {
      const matchesOrg = appliedFilters.orgs.length < 1 || !!(opp.orgName && appliedFilters.orgs.includes(opp.orgName));
      const matchesAct = appliedFilters.activities.length < 1 || (appliedFilters.activities.includes(opp.activity));

      return matchesOrg && matchesAct;
    });
  }, [opportunities, appliedFilters]);

  useEffect(() => {
    // setSelectedActivities(Array.from(new Set(opportunities.map(o => o.activity))).sort());
    setSelectedActivities([]);
  }, [opportunities]);

  const activitiesOptions = useMemo(() => {
    if (!opportunities) return [];

    const activities = new Set<string>();

    opportunities.forEach(opp => {
      if (opp.activity && opp.activity !== '') {
        activities.add(opp.activity.trim());
      }
    });

    return Array.from(activities).sort((a, b) => a.localeCompare(b));
  }, [opportunities]);

  const orgOptions = useMemo(() => {
    const orgs = organizations.map(org => org.name);

    return Array.from(orgs).sort((a, b) => a.localeCompare(b));
  }, [organizations, selectedActivities]);

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

  const isClearable = useMemo(() => {
    return selectedOrgs.length > 0 ||
      selectedActivities.length > 0 ||
      appliedFilters.orgs.length > 0 ||
      appliedFilters.activities.length > 0;
  }, [selectedOrgs, selectedActivities]);

  return (
    <>
      <FiltersForm applyFilters={applyFilters} clearFilters={clearFilters} showClearButton={isClearable}>
        <OrganizationFilter orgOptions={orgOptions} selectedOrgs={selectedOrgs} setSelectedOrgs={setSelectedOrgs} selectMany={true} />
        <ActivitiesSelect activities={activitiesOptions} selectedActivities={selectedActivities} setSelectedActivities={setSelectedActivities} />
      </FiltersForm>
      <section className={styles.opportunityList}>
        <OpportunityList opportunities={filteredOpportunities} />
      </section>
    </>
  )
}
