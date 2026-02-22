"use client";

import Link from 'next/link';

import styles from '../SiteHeader.module.scss';
import {usePathname} from "next/navigation";

export const Nav = (
  { navOpen, smoothTransition }:
  {
    navOpen: boolean;
    smoothTransition?: boolean;
  }
) => {

  const pathname = usePathname();

  return (
    <nav className={`${styles.nav}${navOpen ? ` ${styles.navOpened}` : ''}${smoothTransition ? ` ${styles.smoothTransition}` : ''}`}>
      <div className={styles.linksContainer}>
        <div className={styles.linkWrapper}>
          <Link
            href={"/"}
            className={styles.siteNavLink}
            aria-current={pathname === "/" ? "page" : undefined}
          >
            Home
          </Link>
        </div>
        <div className={styles.linkWrapper}>
          <Link
            href={"/events"}
            className={styles.siteNavLink}
            aria-current={pathname === "/events" ? "page" : undefined}
          >
            Events
          </Link>
        </div>
        <div className={styles.linkWrapper}>
          <Link
            href={"/volunteer"}
            className={styles.siteNavLink}
            aria-current={pathname === "/volunteer" ? "page" : undefined}
          >
            Volunteering
          </Link>
        </div>
        <div className={styles.linkWrapper}>
          <Link
            href={"/support"}
            className={styles.siteNavLink}
            aria-current={pathname === "/support" ? "page" : undefined}
          >
            Support a Cause
          </Link>
        </div>
        <div className={styles.linkWrapper}>
          <Link
            href={"/latest-updates"}
            className={styles.siteNavLink}
            aria-current={pathname === "/latest-updates" ? "page" : undefined}
          >
            Latest Updates
          </Link>
        </div>
        <div className={styles.linkWrapper}>
          <Link
            href={"/local-issues"}
            className={styles.siteNavLink}
            aria-current={pathname === "/local-issues" ? "page" : undefined}
          >
            Local Issues
          </Link>
        </div>
      </div>
    </nav>
  )
}
