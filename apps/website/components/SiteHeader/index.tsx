"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/SiteHeader/Logo";
import { MenuButton } from "@/components/SiteHeader/MenuButton";
import { Nav } from "@/components/SiteHeader/Nav";
import { User } from "@/payload-types";

import styles from "./SiteHeader.module.scss";

export const SiteHeader = ({ user }: { user: User | null }) => {
	const [navOpen, setNavOpen] = useState(false);
	const [navSmoothTransition, setNavSmoothTransition] = useState(true);
	const pathname = usePathname();

	useEffect(() => {
		setNavSmoothTransition(false);
		setNavOpen(false);
	}, [pathname]);

	useEffect(() => {
		if (navOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}

		return () => {
			document.body.style.overflow = "";
		};
	}, [navOpen]);

	const toggleNav = () => {
		setNavSmoothTransition(true);
		setNavOpen((open) => !open);
	};

	return (
		<header className={styles.siteHeader}>
			<Logo />
			<Nav
				navOpen={navOpen}
				smoothTransition={navSmoothTransition}
				user={user}
			/>
			<MenuButton navOpen={navOpen} toggleNav={toggleNav} />
		</header>
	);
};
