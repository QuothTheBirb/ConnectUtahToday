import {FormEvent, ReactNode} from "react";

import styles from './FilterForm.module.scss';

export const FiltersForm = ({ children, applyFilters, clearFilters }: {
  children: ReactNode;
  applyFilters: () => void;
  clearFilters: () => void;
}) => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    applyFilters();
  }

  return (
    <form className={styles.filterForm} onSubmit={handleSubmit}>
      <div className={styles.filters}>
        {children}
      </div>
      <div className={styles.controlButtons}>
        <button type={'submit'} className={styles.applyFiltersButton}>Apply Filters</button>
        <button id={"clear-calendar-filter"} type={'button'} className={styles.clearFiltersButton} onClick={clearFilters}>Clear Filters</button>
      </div>
    </form>
  )
}
