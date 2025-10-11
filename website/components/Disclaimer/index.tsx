"use client";

import {CSSProperties, ReactNode, useEffect, useRef, useState} from "react";

import styles from './Disclaimer.module.scss';

export const Disclaimer = ({
  children,
  label,
  className,
  style
}: {
  children: ReactNode;
  label?: string;
  className?: string;
  style?: CSSProperties
}) => {
  const disclaimerRef = useRef<HTMLDivElement | null>(null);

  const [showDisclaimer, setShowDisclaimer] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (disclaimerRef.current && !disclaimerRef.current.contains(event.target as Node)) {
        setShowDisclaimer(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <button
        className={styles.toggleDisclaimer}
        onClick={() => setShowDisclaimer((open) => !open)}
      >
        {label || 'Disclaimer'}
      </button>
      <div
        ref={disclaimerRef}
        className={`${styles.disclaimer}${className ? ` ${className}` : ''}`}
        style={style}
      >
        {showDisclaimer && (
          <div className={styles.disclaimerPopover} style={{display: 'block'}}>
            <div className={styles.disclaimerContent}>
              {children}
            </div>
            <button className={styles.closeDisclaimer} onClick={() => setShowDisclaimer(false)}>Close</button>
          </div>
        )}
      </div>
    </>
  )
}
