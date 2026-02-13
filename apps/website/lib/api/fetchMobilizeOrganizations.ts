import {Organization} from "@/payload-types";

const API_BASE = process.env.NODE_ENV === 'development' ? 'http://localhost:3000/api' : 'https://connectutahtoday-1.onrender.com/api';

export const fetchMobilizeOrganizations = async (): Promise<Organization[] | []> => {
  const apiUrl = `${API_BASE}/mobilize-organizations`;

  const res = await fetch(apiUrl, {
    next: {
      revalidate: 300
    }
  });
  if (!res.ok) {
    return [];
  }

  const data = await res.json();

  return data.items || [];
}
