import {ReactNode} from "react";

import styles from './FormInput.module.scss';

export const FormInput = ({ children, label, htmlFor }: { children: ReactNode; label: string; htmlFor: string; }) => {
  return (
    <div className={styles.filter}>
      <label className={styles.filterLabel} htmlFor={htmlFor}>{label}</label>
      {children}
    </div>
  )}
