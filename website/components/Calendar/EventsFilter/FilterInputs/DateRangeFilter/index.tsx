import {Dispatch, SetStateAction} from "react";

import styles from '../../EventsFilterForm.module.scss';

export const DateRangeFilter = (
  {
    dateRange,
    setDateRange
  }: {
  dateRange: {
    start: string;
    end: string;
  }
  setDateRange: Dispatch<SetStateAction<{
    start: string;
    end: string;
  }>>
}
) => {
  const { start, end } = dateRange;

  return (
    <label className={styles.filter}>
      <span className={styles.filterLabel}>Date Range:</span>
      <div className={styles.filterDateRange}>
        <input
          type={"date"}
          value={start}
          onChange={(event) =>
            setDateRange((prevState) => ({
              ...prevState,
              start: event.target.value
            }))}
          className={styles.filterDateInput}
        />
        –
        <input
          type={"date"}
          value={end}
          onChange={(event) =>
            setDateRange((prevState) => ({
              ...prevState,
              end: event.target.value
            }))}
          className={styles.filterDateInput}
        />
      </div>
    </label>
  )
}
