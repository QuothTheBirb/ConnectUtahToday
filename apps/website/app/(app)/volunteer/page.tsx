import {Metadata} from "next";
import {fetchOrganizations} from "@/lib/api/fetchOrganizations";
import {VolunteeringOpportunities} from "@/components/VolunteeringOpportunities";
import {PageHeading} from "@/components/PageHeading";
import {DisclaimerButton, DisclaimerPopup} from "@/components/Disclaimer";

export const metadata: Metadata = {
  title: "Volunteering",
  description: "Volunteer for Local Events and Organizations"
}

const VolunteerPage = async () => {
  const organizations = await fetchOrganizations();

  return (
    <DisclaimerProvider>
      <main>
        <PageHeading heading={'h1'}>Volunteer for Local Events and Organizations</PageHeading>
        <p>
          Be matched with volunteer opportunities with local organizations by selecting the boxes of interest to you
          below. <DisclaimerButton>Disclaimer.</DisclaimerButton>
        </p>
        <VolunteeringOpportunities organizations={organizations} />
        <DisclaimerPopup>
          <p>
            <strong>Disclaimer:</strong> Connect Utah Today provides links to external organizations offering volunteer opportunities for informational purposes only. We do not endorse, guarantee, or assume responsibility for the organizations listed or the opportunities they provide. All volunteering arrangements are made directly between you and the respective organization. Connect Utah Today does not verify the legitimacy, safety, or quality of any volunteer opportunity or organization, and is not responsible for any outcomes, experiences, or issues arising from your participation. Please conduct your own due diligence before engaging with any organization. By clicking on a volunteer opportunity link, you will be redirected to a third-party website and subject to their terms, conditions, and privacy policies. Connect Utah Today is not responsible for the content or practices of any linked site.
          </p>
        </DisclaimerPopup>
      </main>
    </DisclaimerProvider>
  );
};

export default VolunteerPage;
