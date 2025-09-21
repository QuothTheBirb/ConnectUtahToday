import {useRouter} from 'next/navigation';

import styles from '../../EventCalendar.module.scss';
import {CSSProperties, FocusEvent, useCallback, useEffect, useRef, useState} from "react";
import {parseMonthYear} from "../../../../../utils/parseMonthYear";

export const MonthNavigation = ({
  date: {
    year,
    month
  },
}: {
  date: {
    year: number;
    month: number;
  };
}) => {
  const router = useRouter();

  const formatDisplayDate = useCallback((y: number, m: number) => {
    const d = new Date(Date.UTC(y, m, 1));

    return d.toLocaleString('default', { month: 'long', year: 'numeric', timeZone: 'UTC' });
  }, []);

  const [inputValue, setInputValue] = useState(formatDisplayDate(year, month));
  const [originalValue, setOriginalValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInputValue(formatDisplayDate(year, month));
  }, [year, month, formatDisplayDate]);

  const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
    setOriginalValue(event.target.value);
    event.target.select();
  };

  const handleBlur = () => {
    if (inputValue.trim() === originalValue) return;

    const parsed = parseMonthYear(inputValue);

    if (parsed.month !== -1 && parsed.year !== -1) {
      if (parsed.year >= 1900 && parsed.year <= 2100) {
        handleNavigate(parsed.year, parsed.month);
      } else {
        setError('Year must be between 1900 and 2100');
        setInputValue(originalValue);
        setTimeout(() => setError(null), 3000);
      }
    } else {
      setError('Invalid format. Try "January 2025" or "1/2025"');
      setInputValue(originalValue);
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleNavigate = (newYear: number, newMonth: number) => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    // If the target date is the current month and year, clear the search params
    if (newYear === currentYear && newMonth === currentMonth) {
      router.push('/calendar');
    } else {
      router.push(`/calendar?year=${newYear}&month=${newMonth + 1}`);
    }
  };

  const handleCycleMonth = (direction: number) => {
    const d = new Date(year, month + direction, 1);

    handleNavigate(d.getFullYear(), d.getMonth());
  };

  const errorMsgStyle: CSSProperties = {
    position: 'absolute',
    background: '#f44336',
    color: 'white',
    padding: '0.5em 1em',
    borderRadius: '4px',
    fontSize: '0.85em',
    marginTop: '0.5em',
    zIndex: 1000,
    left: '50%',
    transform: 'translateX(-50%)',
    whiteSpace: 'nowrap',
  };

  return (
    <>
      <form
        className={styles.monthNav}
        onSubmit={(event) => {
          event.preventDefault();
          inputRef.current?.blur();
        }}
        style={{ // Temporarily unsetting global styles for forms
          background: 'none',
          boxShadow: 'none',
          borderRadius: 0,
          padding: 0,
        }}
      >
        <div style={{ marginBottom: '1rem' }}>
          <button className={styles.navButton} type={"button"} onClick={() => handleCycleMonth(-1)}>&#8592;</button>
          <input
            ref={inputRef}
            type={"text"}
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            onBlur={handleBlur}
            onFocus={handleFocus}
            className={styles.currentMonthInput}
            style={{
              backgroundColor: error ? '#ffebee' : undefined,
              borderColor: error ? '#f44336' : undefined,
            }}
            placeholder={"Month YYYY"}
          />
          <button className={styles.navButton} type={"button"} onClick={() => handleCycleMonth(1)}>&#8594;</button>
        </div>
        <div className={styles.controlsInfo}>
          <span>Type month and year (e.g., "January 2025" or "1/2025") and press Enter</span>
        </div>
        {error && <div style={errorMsgStyle}>{error}</div>}
      </form>
    </>
  );
};
