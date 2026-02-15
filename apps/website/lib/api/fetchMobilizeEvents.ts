import {USState} from "@/lib/usStates";
import {CalendarEvents, EventsApiResponse} from "@connect-utah-today/api/types";

const API_BASE = process.env.NODE_ENV === 'development' ? 'http://localhost:3000/api' : 'https://connectutahtoday-1.onrender.com/api';

export interface FetchMobilizeOptions {
  timeMin: string;
  timeMax: string;
  filters?: {
    state?: USState;
    organizations?: {
      type: 'allowlist' | 'blocklist';
      list: string[];
    };
  }
}

export async function fetchMobilizeEvents(options: FetchMobilizeOptions): Promise<CalendarEvents> {
  const { timeMin, timeMax, filters } = options;

  if (!timeMin || !timeMax) return [];

  const baseUrl = `${API_BASE}/mobilize-events`;
  const queryParams = new URLSearchParams({});

  queryParams.append('timeMin', timeMin);
  queryParams.append('timeMax', timeMax);

  if (filters?.state) {
    queryParams.append('state', filters.state);
  }

  if (filters?.organizations) {
    queryParams.append('organizations', JSON.stringify(filters.organizations));
  }

  const response = await fetch(`${baseUrl}?${queryParams.toString()}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch Mobilize events: ${response.statusText}`);
  }

  const result: EventsApiResponse = await response.json();
  const { data } = result;

  return data;
}
