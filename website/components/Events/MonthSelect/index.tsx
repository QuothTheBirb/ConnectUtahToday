"use client";

import {useRouter, useSearchParams} from 'next/navigation';

import {CSSProperties, FocusEvent, useCallback, useEffect, useRef, useState} from "react";
import {parseMonthYear} from "../../../../utils/parseMonthYear";
import styles from '../Events.module.scss';

export const EventsMonthSelect = ({
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
  const searchParams = useSearchParams();

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

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
    const params = new URLSearchParams();

    // Preserve other search params
    for (const [key, value] of searchParams.entries()) {
      if (key !== 'year' && key !== 'month') {
        params.set(key, value);
      }
    }

    // If the target date is NOT the current month and year, add year and month
    if (newYear !== currentYear || newMonth !== currentMonth) {
      params.set('year', String(newYear));
      params.set('month', String(newMonth + 1));
    }

    const queryString = params.toString();

    router.push(`/events${queryString ? `?${queryString}` : ''}`, { scroll: false });
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
        className={styles.month}
        onSubmit={(event) => {
          event.preventDefault();
          inputRef.current?.blur();
        }}
      >
        <div className={styles.monthControls}>
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
          <span>Type month and year (e.g., "January {currentYear}" or "1/{currentYear}") and press Enter</span>
        </div>
        {error && <div style={errorMsgStyle}>{error}</div>}
      </form>
    </>
  );
};
