import {ReactNode} from "react";

import styles from './FormInput.module.scss';

export const FormInput = ({ children, label }: { children: ReactNode; label?: string; }) => {
  return (
    <label className={styles.filter}>
      {label && <span className={styles.filterLabel}>{label}:</span>}
      {children}
    </label>
  )}
