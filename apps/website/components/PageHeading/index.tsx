import {ReactNode} from "react";

import styles from './PageHeading.module.scss';

export const PageHeading = ({children, heading}: {
  children: ReactNode;
  heading?: 'h1' | 'h2' | 'h3' | 'h4'
}) => {
  switch (heading) {
    case 'h1':
      return <h1 className={styles.heading}>{children}</h1>
    case 'h2':
      return <h2 className={styles.heading}>{children}</h2>
    case 'h3':
      return <h3 className={styles.heading}>{children}</h3>
    case 'h4':
      return <h4 className={styles.heading}>{children}</h4>
    default:
      return <h1 className={styles.heading}>{children}</h1>
  }
}
