import {Metadata} from "next";
import {fetchOrganizations} from "@/lib/api/fetchOrganizations";
import {VolunteeringOpportunities} from "@/components/VolunteeringOpportunities";
import {fetchOpportunities} from "@/lib/api/fetchOpportunities";
import {PageHeading} from "@/components/PageHeading";

export const metadata: Metadata = {
  title: "Volunteering",
  description: "Volunteer for Local Events and Organizations"
}

export type Organization = {
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

const VolunteerPage = async () => {
  const organizations = await fetchOrganizations();
  const opportunities = await fetchOpportunities(organizations);

  return (
      <main>
        <PageHeading heading={'h1'}>Volunteer for Local Events and Organizations</PageHeading>
        <p>
          Be matched with volunteer opportunities with local organizations by selecting the boxes of interest to you below.
        </p>
        <VolunteeringOpportunities organizations={organizations} opportunities={opportunities} />
      </main>
  );
};

export default VolunteerPage;
