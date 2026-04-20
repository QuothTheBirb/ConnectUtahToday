import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageCard } from "@/components/PageCard";
import { PageHeading } from "@/components/PageHeading";
import SiteLogo from "@/public/assets/connect-utah-today-logo.png";

import styles from "./NotFound.module.scss";

export const metadata: Metadata = {
	title: "404 - Page Not Found | Connect Utah Today",
};

export default function NotFound() {
	return (
		<PageCard>
			<div className={styles.notFoundContainer}>
				{/* Logo at top center */}
				<div className={styles.logoContainer}>
					<Image
						src={SiteLogo}
						alt={"Connect Utah Today Logo"}
						className={styles.logoImage}
					/>
				</div>

				<PageHeading heading={"h1"}>404 - Page Not Found</PageHeading>
				<p className={styles.text}>
					Sorry, the page you are looking for does not exist or has
					been moved.
				</p>
				<Link href="/" className={styles.link}>
					Return Home
				</Link>
			</div>
		</PageCard>
	);
}
