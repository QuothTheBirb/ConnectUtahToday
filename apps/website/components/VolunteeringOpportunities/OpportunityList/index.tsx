"use client";

import {Organization} from "@/payload-types";
import RichText from "@/components/RichText";

import styles from '../VolunteeringOpportunities.module.scss';

interface OpportunityListProps {
  organizations: Organization[];
}

export const OpportunityList = ({ organizations }: OpportunityListProps) => {
  if (!organizations.length) {
    return <div className={styles.noOppsMsg}>No matching organizations found.</div>;
  }

  return (
    <>
      {organizations.map((org) => {
        const activities =
          org.opportunities
            ?.map((opp) => (typeof opp === "object" ? opp.name : ""))
            .filter(Boolean) || [];

        const logo = typeof org.logo === "object" ? org.logo?.url : org.logo;

        return (
          <div className={styles.opportunityItem} key={org.id}>
            {logo ? (
              <img src={logo} alt={org.name} className={styles.opportunityImg} />
            ) : (
              <div className={styles.opportunityImg} />
            )}
            <div className={styles.opportunityContent}>
              <div className={styles.opportunityOrg}>{org.name}</div>
              {activities.length > 0 && (
                <ul className={styles.opportunityActivities}>
                  {activities.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              )}
              {org.description && (
                <RichText content={org.description} className={styles.opportunityDescription} />
              )}
              {org.url?.trim() && (
                <a
                  href={org.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.orgLink}
                >
                  Sign Up / Learn More
                </a>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
};

export default OpportunityList;
