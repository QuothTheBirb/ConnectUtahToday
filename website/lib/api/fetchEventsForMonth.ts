export const fetchEventsForMonth = async ({ year, month }: { year: number; month: number;
}) => {
  const start = new Date(Date.UTC(year, month, 1)).toISOString();
  const end = new Date(Date.UTC(year, month + 1, 1)).toISOString();

  const API_BASE = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://connectutahtoday-1.onrender.com';

  const apiUrl = `${API_BASE}/api/all-events?timeMin=${encodeURIComponent(start)}&timeMax=${encodeURIComponent(end)}`;

  const res = await fetch(apiUrl, {
    next: {
      revalidate: 300
    }
  });

  if (!res.ok) throw new Error(`Failed to fetch events: ${res.status} ${res.statusText}`);

  const data = await res.json();

  return data.items || [];
}
