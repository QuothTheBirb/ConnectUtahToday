import {ReactNode, SyntheticEvent, useState} from "react";

import styles from './FilterForm.module.scss';
import {ListFilterPlus} from "lucide-react";

export const FiltersForm = ({ children, legend, applyFilters, clearFilters, showClearButton = true }: {
  children: ReactNode;
  legend?: string;
  applyFilters: () => void;
  clearFilters: () => void;
  showClearButton?: boolean;
}) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    applyFilters();
  }

  const toggleCollapsed = () => {
    setIsCollapsed(!isCollapsed);
  }

  return (
    <form className={`${styles.filterForm} ${isCollapsed ? styles.collapsed : ''}`} onSubmit={handleSubmit}>
      <fieldset className={`${styles.filters} ${isCollapsed ? styles.collapsed : ''}`}>
        <legend className={styles.legend}>
          <button
            type="button"
            onClick={toggleCollapsed}
            className={`${styles.legendButton} ${isCollapsed ? styles.collapsed : ''}`}
            aria-expanded={!isCollapsed}
          >
            <span>{legend ? legend : "Filter"}</span>
            <ListFilterPlus className={`${styles.toggleIcon} ${isCollapsed ? styles.collapsed : ''}`} />
          </button>
        </legend>
        {!isCollapsed && <div className={styles.filterContent}>
          {children}
        </div>}
      </fieldset>
      {!isCollapsed && (
        <div className={styles.controlButtons}>
          <button type={'submit'} className={styles.applyFiltersButton}>Apply Filters</button>
          {showClearButton && <button id={"clear-calendar-filter"} type={'button'} className={styles.clearFiltersButton} onClick={clearFilters}>Clear Filters</button>}
        </div>
      )}
    </form>
  )
}
