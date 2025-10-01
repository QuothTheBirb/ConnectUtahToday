export const fetchOrganizations = async () => {
  const API_BASE = process.env.NODE_ENV === 'development' ? 'http://localhost:3000/api' : 'https://connectutahtoday-1.onrender.com/api';

  const apiUrl = `${API_BASE}/organizations`;

  const res = await fetch(apiUrl, {
    next: {
      revalidate: 300
    }
  });

  if (!res.ok) throw new Error(`Failed to fetch organizations: ${res.status} ${res.statusText}`);

  const data = await res.json();

  return data.items || [];
}
