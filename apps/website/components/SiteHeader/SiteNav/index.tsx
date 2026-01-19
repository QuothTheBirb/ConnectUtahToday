"use client";

import {useEffect, useState} from "react";
import Link from 'next/link';
import {usePathname} from "next/navigation";

import styles from './SiteNav.module.scss';

export const SiteNav = () => {
  const [navOpen, setNavOpen] = useState(false);
  const [navSmoothTransition, setNavSmoothTransition] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    setNavSmoothTransition(false);
    setNavOpen(false);
  }, [pathname]);

  // TODO: Prevent scrolling when nav is open

  const toggleNav = () => {
    setNavSmoothTransition(true);
    setNavOpen((open) => !open);
  };

  return (
    <div className={styles.siteNavWrapper}>
      <nav className={`${styles.siteNav}${navOpen ? ` ${styles.navOpened}` : ''}${navSmoothTransition ? ` ${styles.smoothTransition}` : ''}`}>
        <div className={styles.linksContainer}>
          <div className={styles.linkWrapper}>
            <Link href={"/"} className={styles.siteNavLink}>Home</Link>
          </div>
          <div className={styles.linkWrapper}>
            <Link href={"/events"} className={styles.siteNavLink}>Events</Link>
          </div>
          <div className={styles.linkWrapper}>
            <Link href={"/volunteer"} className={styles.siteNavLink}>Volunteering</Link>
          </div>
          <div className={styles.linkWrapper}>
            <Link href={"/support"} className={styles.siteNavLink}>Support a Cause</Link>
          </div>
          <div className={styles.linkWrapper}>
            <Link href={"/latest-updates"} className={styles.siteNavLink}>Latest Updates</Link>
          </div>
          <div className={styles.linkWrapper}>
            <Link href={"/local-issues"} className={styles.siteNavLink}>Local Issues</Link>
          </div>
        </div>
      </nav>
      <button
        className={styles.toggleSiteNav}
        aria-label={"Toggle Site Navigation"}
        aria-expanded={navOpen ? "true" : "false"}
        aria-controls={'site-navigation'}
        onClick={toggleNav}
      >
        <span />
        <span />
        <span />
      </button>
    </div>
  )
}
