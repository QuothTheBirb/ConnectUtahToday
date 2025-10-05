import {Opportunity, Organization} from "@/app/volunteer/page";

export const fetchOpportunities = async (organizations: Organization[]): Promise<Opportunity[]> => {
  const API_BASE = process.env.NODE_ENV === 'development' ? 'http://localhost:3000/api' : 'https://connectutahtoday-1.onrender.com/api';
  const apiUrl = `${API_BASE}/opportunities`;

  const opportunityPromises = organizations.map(async (org) => {
    try {
      const res = await fetch(`${apiUrl}?organization_id=${org.id}`, {
        next: {
          revalidate: 300,
        },
      });

      if (!res.ok) {
        console.error(`Failed to fetch opportunities for ${org.name}: ${res.status} ${res.statusText}`);
        return [];
      }

      const data = await res.json();
      return (data.items || []).map((activity: string): Opportunity => ({
        orgId: org.id,
        orgName: org.name,
        orgLink: org.link,
        activity,
      }));
    } catch (error) {
      console.error(`Error fetching opportunities for ${org.name}:`, error);
      return [];
    }
  });

  const results = await Promise.all(opportunityPromises);

  return results.flat();
};
