"use client";

import {
  createContext,
  Dispatch,
  ReactNode,
  RefObject,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState
} from "react";

import styles from './Disclaimer.module.scss';

type DisclaimerContext = {
  disclaimerRef: RefObject<HTMLDivElement | null>;
  showDisclaimer: boolean;
  setShowDisclaimer: Dispatch<SetStateAction<boolean>>;
}

const DisclaimerContext = createContext<DisclaimerContext | null>(null);

const useDisclaimerContext = () => {
  const context = useContext(DisclaimerContext);

  if (!context) {
    throw new Error('useDisclaimerContext must be used within a DisclaimerProvider');
  }

  return context;
};

export const DisclaimerProvider = ({children}: { children: ReactNode }) => {
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

  const value = {disclaimerRef, showDisclaimer, setShowDisclaimer};

  return (
    <DisclaimerContext.Provider value={value}>
      {children}
    </DisclaimerContext.Provider>
  );
};

export const DisclaimerButton = (
  {
    children,
    className,
  }: {
    children?: ReactNode;
    className?: string;
  }
) => {
  const {setShowDisclaimer} = useDisclaimerContext();

  return (
    <button
      className={className ?? styles.toggleDisclaimer}
      onClick={() => setShowDisclaimer((open) => !open)}
    >
      {children || 'Disclaimer'}
    </button>
  );
};

export const DisclaimerPopup = (
  {
    children,
    className,
  }: {
    children: ReactNode;
    className?: string;
  }
) => {
  const {disclaimerRef, showDisclaimer, setShowDisclaimer} = useDisclaimerContext();

  return (
    <div
      ref={disclaimerRef}
      className={`${styles.disclaimerPopover}${className ? ` ${className}` : ''}`}
      style={{display: showDisclaimer ? 'block' : 'none'}}
    >
      <div className={styles.disclaimerContent}>
        {children}
      </div>
      <button className={styles.closeDisclaimer} onClick={() => setShowDisclaimer(false)}>Close</button>
    </div>
  );
};
