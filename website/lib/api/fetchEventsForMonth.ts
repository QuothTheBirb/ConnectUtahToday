export const fetchEventsForMonth = async ({ year, month }: { year: number; month: number;
}) => {
  const start = new Date(year, month, 1).toISOString();
  const end = new Date(year, month + 1, 1).toISOString();

  const API_BASE = process.env.NODE_ENV === 'development' ? 'http://localhost:3000/api' : 'https://connectutahtoday-1.onrender.com/api';

  const apiUrl = `${API_BASE}/all-events?timeMin=${encodeURIComponent(start)}&timeMax=${encodeURIComponent(end)}`;

  const res = await fetch(apiUrl, {
    next: {
      revalidate: 300
    }
  });

  if (!res.ok) throw new Error(`Failed to fetch events: ${res.status} ${res.statusText}`);

  const data = await res.json();

  return data.items || [];
}
