import {FormEvent, ReactNode} from "react";

import styles from './FilterForm.module.scss';

export const FiltersForm = ({ children, legend, applyFilters, clearFilters, showClearButton = true }: {
  children: ReactNode;
  legend?: string;
  applyFilters: () => void;
  clearFilters: () => void;
  showClearButton?: boolean;
}) => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    applyFilters();
  }

  return (
    <form className={styles.filterForm} onSubmit={handleSubmit}>
      <fieldset className={styles.filters}>
        <legend>{legend ? legend : "Filter"}</legend>
        {children}
      </fieldset>
      <div className={styles.controlButtons}>
        <button type={'submit'} className={styles.applyFiltersButton}>Apply Filters</button>
        {showClearButton && <button id={"clear-calendar-filter"} type={'button'} className={styles.clearFiltersButton} onClick={clearFilters}>Clear Filters</button>}
      </div>
    </form>
  )
}
