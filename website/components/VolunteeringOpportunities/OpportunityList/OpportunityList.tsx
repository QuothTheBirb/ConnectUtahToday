"use client";

import styles from './OpportunityList.module.scss';
import type {Opportunity} from "@/app/volunteer/page";

// --- Org Image Logic ---
const assetFiles = [
  "1000014843.png",
  "1000014844.png",
  "1000014845.png",
  "1000014846.png",
  "1000014847.png",
  "1000014848.png",
  "Armed Queers Salt Lake City.jpg",
  "bakers_for_palestine.jpg",
  "bakers_for_palestine.png",
  "brown_berets.png",
  "BTMC.jpg",
  "Cache Valley Mutual Aid.jpg",
  "Camping in Color SLC.jpg",
  "Comunidades Unidas.jpg",
  "CUT.png",
  "description.png",
  "dsa.jpg",
  "dsa.png",
  "Fish For Garbage.jpg",
  "Green Wave Utah.jpg",
  "ibikeutah.jpg",
  "indivisible.png",
  "Ken_Sanders_Rare_Books.jpg",
  "MyUEA.jpg",
  "placeholder.jpg",
  "Project Rainbow.jpg",
  "Salt Lake Area Queer Climbers.jpg",
  "Salt Lake Harm Reduction Project.jpg",
  "Sierra Club Utah.jpg",
  "SLC Queer Latin Dance.jpg",
  "SLCounty Community Exchange.jpg",
  "slc_mutual_aid.png",
  "uhwunited.jpg",
  "Under the Umbrella Bookstore.jpg",
  "United_Mountain_Workers.jpg",
  "Urban Indian Center of Salt Lake.jpg",
  "Utah Rivers Council.jpg",
  "Utah State Progressive Caucus.jpg",
  "Wasatch Community Gardens.jpg",
  "Wasatch Food Co-op.jpg",
  "Wasatch Trails Collective.jpg",
  "WildUtah.png",
];

function normalize(name: string): string {
  return name
    .toLowerCase()
    .replace(/[\s\-]+/g, "_")
    .replace(/[^a-z0-9_]/g, "")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function getOrgImg(orgName: string): string {
  const nOrg = normalize(orgName);
  const assetMap: Record<string, string> = {};
  assetFiles.forEach((f) => {
    let stem = f.replace(/\.[^/.]+$/, "");
    assetMap[normalize(stem)] = f;
  });
  if (assetMap[nOrg]) {
    return `assets/${assetMap[nOrg]}`;
  }
  for (let [nAsset, fname] of Object.entries(assetMap)) {
    if (nOrg.includes(nAsset) || nAsset.includes(nOrg)) {
      return `assets/${fname}`;
    }
  }
  return "assets/placeholder.png";
}

interface OpportunityListProps {
  opportunities: Opportunity[];
}

export const OpportunityList = ({
  opportunities,
}: OpportunityListProps) => {
  if (!opportunities.length) {
    return (
      <div className={styles.noOppsMsg}>
        No matching opportunities found.
      </div>
    );
  }

  // Group by orgName, list activities under each org
  const orgMap: { [orgName: string]: { activities: string[]; link?: string } } = {};
  opportunities.forEach((opp) => {
    if (!orgMap[opp.orgName])
      orgMap[opp.orgName] = { activities: [], link: opp.orgLink };
    orgMap[opp.orgName].activities.push(opp.activity);
  });

  return (
    <>
      {Object.entries(orgMap).map(([orgName, orgData]) => {
        const hasLink =
          orgData.link && orgData.link.trim() !== "";
        return (
          <div
            className={styles.opportunityItem}
            key={orgName}
          >
            <img
              src={getOrgImg(orgName)}
              alt={orgName}
              className={styles.opportunityImg}
            />
            <div>
              <div className={styles.opportunityOrg}>{orgName}</div>
              <ul className={styles.opportunityActivities}>
                {orgData.activities.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
              {hasLink && (
                <a
                  href={orgData.link}
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
