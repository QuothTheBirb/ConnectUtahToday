'use client';

import styles from './SiteHeader.module.scss';

import {Nav} from "@/components/SiteHeader/Nav";
import {MenuButton} from "@/components/SiteHeader/MenuButton";
import {useEffect, useState} from "react";
import {usePathname} from "next/navigation";

export const SiteHeader = () => {
  const [navOpen, setNavOpen] = useState(false);
  const [navSmoothTransition, setNavSmoothTransition] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    setNavSmoothTransition(false);
    setNavOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (navOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [navOpen]);

  const toggleNav = () => {
    setNavSmoothTransition(true);
    setNavOpen((open) => !open);
  };

  return (
    <header className={styles.siteHeader}>
      <Nav navOpen={navOpen} smoothTransition={navSmoothTransition} />
      <MenuButton navOpen={navOpen} toggleNav={toggleNav} />
    </header>
  )
}
