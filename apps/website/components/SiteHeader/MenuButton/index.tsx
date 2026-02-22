import styles from '../SiteHeader.module.scss';

export const MenuButton = (
  { navOpen, toggleNav }:
  {
    navOpen: boolean;
    toggleNav: () => void
  }
) => {
  return (
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
  )
};
