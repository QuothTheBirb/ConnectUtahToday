import {useEffect, useState} from "react";
import {CalendarEvent} from "../../../../api/types";

export const useOrgSelect = (events: CalendarEvent[]) => {
  const [orgOptions, setOrgOptions] = useState<string[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<string | null>(null);

  useEffect(() => {
    if (events) {
      const orgs = new Set<string>();

      events.forEach(event => {
        if (event.org && event.org !== '') {
          orgs.add(event.org.trim());
        }
      });

      setOrgOptions(Array.from(orgs).sort((a, b) => a.localeCompare(b)));
    }
  }, [events]);

  return { selectedOrg, setSelectedOrg, orgOptions };
}
