"use client";

import {createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState} from "react";

import styles from './Disclaimer.module.scss';
import {usePathname} from "next/navigation";
import {Popup} from "@/components/Popup";

type DisclaimerContext = {
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
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setShowDisclaimer(false);
  }, [pathname]);

  const value = {showDisclaimer, setShowDisclaimer};

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
      className={`${styles.toggleDisclaimer}${className ? ` ${className}` : ''}`}
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
  const {showDisclaimer, setShowDisclaimer} = useDisclaimerContext();

  const onClose = () => setShowDisclaimer(false);

  const footer = (
    <button className={styles.closeDisclaimer} onClick={onClose}>Close</button>
  );

  return (
    <Popup
      isOpen={showDisclaimer}
      onClose={onClose}
      title="Disclaimer"
      className={className}
      footer={footer}
    >
      <div className={styles.disclaimerContent}>
        {children}
      </div>
    </Popup>
  );
};
