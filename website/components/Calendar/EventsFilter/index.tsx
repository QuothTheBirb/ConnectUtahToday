import {Dispatch, FormEvent, SetStateAction} from "react";
import styles from './EventsFilterForm.module.scss';
import {OrganizationFilter} from "@/components/Calendar/EventsFilter/FilterInputs/OrgFilter";
import {DateRangeFilter} from "@/components/Calendar/EventsFilter/FilterInputs/DateRangeFilter";

export const EventsFilter = ({
  orgOptions,
  selectedOrg,
  setSelectedOrg,
  dateRange,
  setDateRange,
  applyFilters,
  clearFilters,
}: {
  orgOptions: string[];
  selectedOrg: string;
  setSelectedOrg: Dispatch<SetStateAction<string>>;
  dateRange: {
    start: string;
    end: string;
  };
  setDateRange: Dispatch<SetStateAction<{
    start: string
    end: string
  }>>;
  applyFilters: () => void;
  clearFilters: () => void;
}) => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    applyFilters();
  }

  return (
    <form className={styles.filterForm} onSubmit={handleSubmit}>
      <div className={styles.filterInputs}>
        <OrganizationFilter
          orgOptions={orgOptions}
          selectedOrg={selectedOrg}
          setSelectedOrg={setSelectedOrg}
        />
        <DateRangeFilter
          dateRange={dateRange}
          setDateRange={setDateRange}
        />
      </div>
      <div className={styles.controlButtons}>
        <button type={'submit'} className={styles.applyFiltersButton}>Apply Filters</button>
        <button id={"clear-calendar-filter"} type={'button'} className={styles.clearFiltersButton} onClick={clearFilters}>Clear Filters</button>
      </div>
    </form>
  )
}
