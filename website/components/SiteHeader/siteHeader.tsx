import styles from './SiteHeader.module.scss';
import Link from "next/link";

export const SiteHeader = () => {
  return (
    <header>
      <nav className={styles.siteNav}>
        <Link href={"/website/public"} className={styles.siteNavLink}>Home</Link> |
        <Link href={"/calendar"} className={styles.siteNavLink}>Calendar</Link> |
        <Link href={"/events"} className={styles.siteNavLink}>Events</Link> |
        <Link href={"/volunteer"} className={styles.siteNavLink}>Volunteering</Link> |
        <Link href={"/support"} className={styles.siteNavLink}>Support a Cause</Link> |
        <Link href={"/latest-updates"} className={styles.siteNavLink}>Latest Updates</Link> |
        <Link href={"/local-issues"} className={styles.siteNavLink}>Local Issues</Link>
      </nav>
    </header>
  )
}
