import {Dispatch, SetStateAction} from "react";

import {FormInput} from "@/components/FormInput";
import styles from './DateRange.module.scss';

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
    <FormInput label={"Date Range"}>
      <div className={styles.dateRange}>
        <input
          type={"date"}
          value={start}
          onChange={(event) =>
            setDateRange((prevState) => ({
              ...prevState,
              start: event.target.value
            }))}
          className={styles.dateInput}
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
          className={styles.dateInput}
        />
      </div>
    </FormInput>
  )
}
