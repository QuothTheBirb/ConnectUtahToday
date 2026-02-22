import styles from './PageCard.module.scss';
import {ReactNode} from "react";

export const PageCard = ({children}: {children?: ReactNode}) => {
  return (
    <main className={styles.pageCard}>
      {children}
    </main>
  )
}
