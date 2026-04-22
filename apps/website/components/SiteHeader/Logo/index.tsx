import Image from "next/image";
import Link from "next/link";
import SiteLogo from "@/public/assets/connect-utah-today-logo.png";

import styles from "../SiteHeader.module.scss";

export const Logo = () => {
	return (
		<Link href={"/"} className={styles.logoWrapper}>
			<Image
				src={SiteLogo}
				alt={"Connect Utah Today Logo"}
				className={styles.logo}
			/>
		</Link>
	);
};
