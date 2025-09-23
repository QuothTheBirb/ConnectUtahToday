"use client";
import React, { useEffect, useState } from "react";
import styles from './VolunteerPage.module.css';
import OrgDropdowns from "../../components/OrgDropdowns/OrgDropdowns";
import ActivityCheckboxes from "../../components/ActivityCheckboxes/ActivityCheckboxes";
import OpportunityList from "../../components/OpportunityList/OpportunityList";
//import DisclaimerPopover from "./DisclaimerPopover";
// --- Types ---
export interface Organization {
  id: string;
  name: string;
  link: string;
}
export interface Opportunity {
  orgId: string;
  orgName: string;
  orgLink: string;
  activity: string;
}

const VolunteerPage: React.FC = () => {
  // --- State ---
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [activities, setActivities] = useState<string[]>([]);
  const [selectedOrgs, setSelectedOrgs] = useState<string[]>(["Any"]);
  const [selectedActivities, setSelectedActivities] = useState<string[]>(["Any"]);
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  // --- Fetch Data ---
  useEffect(() => {
    async function fetchOrganizations() {
      const res = await fetch("https://connectutahtoday-1.onrender.com/api/organizations");
      const data = await res.json();
      setOrganizations((data.organizations || []).map((org: any) => ({
        id: org.id, name: org.name, link: org.link
      })));
    }
    fetchOrganizations();
  }, []);

  useEffect(() => {
    async function fetchAllOpportunities() {
      let allOpps: Opportunity[] = [];
      for (const org of organizations) {
        const res = await fetch(
          `https://connectutahtoday-1.onrender.com/api/opportunities?organization_id=${org.id}`
        );
        const data = await res.json();
        (data.opportunities || []).forEach((opp: string) => {
          allOpps.push({
            orgId: org.id,
            orgName: org.name,
            orgLink: org.link,
            activity: opp,
          });
        });
      }
      setOpportunities(allOpps);
      setActivities(Array.from(new Set(allOpps.map(o => o.activity))).sort());
    }
    if (organizations.length) fetchAllOpportunities();
  }, [organizations]);

  // --- Filtering ---
  const filteredOpps = opportunities.filter(opp => {
    const orgOk = selectedOrgs.includes("Any") || selectedOrgs.includes(opp.orgName);
    const actOk = selectedActivities.includes("Any") || selectedActivities.includes(opp.activity);
    return orgOk && actOk;
  });

  // --- Render ---
  return (
    <div>
      <nav>
        <a href="index.html">Home</a> | <a href="calendar.html">Calendar</a> | <a href="events.html">Events</a> | <a href="volunteer.html">Volunteering</a> | <a href="support.html">Support a Cause</a> | <a href="latest-updates.html">Latest Updates</a> | <a href="activism.html">Activism</a>
      </nav>
      <main>
        <h1>Volunteer for Local Events and Organizations</h1>
        <p style={{ fontSize: "0.97em" }}>
          Be matched with volunteer opportunities with local organizations by selecting the boxes of interest to you below.
          <a onClick={e => { e.preventDefault(); setShowDisclaimer(true); }} style={{ fontSize: "0.92em", textDecoration: "underline", cursor: "pointer" }}>Disclaimer</a>
        </p>
        <section className={styles.filterSection}>
          <form>
            <fieldset>
              <legend><strong>Organization:</strong></legend>
              <OrgDropdowns
                organizations={organizations}
                selectedOrgs={selectedOrgs}
                setSelectedOrgs={setSelectedOrgs}
              />
            </fieldset>
            <fieldset>
              <legend><strong>Activities:</strong></legend>
              <ActivityCheckboxes
                activities={activities}
                selectedActivities={selectedActivities}
                setSelectedActivities={setSelectedActivities}
              />
            </fieldset>
          </form>
        </section>
        <section className={styles.opportunityList}>
          <OpportunityList
            opportunities={filteredOpps}
            organizations={organizations}
          />
        </section>
      </main>
      {/* <DisclaimerPopover show={showDisclaimer} onClose={() => setShowDisclaimer(false)} /> */}
    </div>
  );
};

export default VolunteerPage;