import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageCard } from "@/components/PageCard";
import { PageHeading } from "@/components/PageHeading";
import SiteLogo from "@/public/assets/connect-utah-today-logo.png";

import styles from "./Home.module.scss";

export const metadata: Metadata = {
	title: "Home | Connect Utah Today",
};

const Home = () => {
	return (
		<PageCard className={styles.home}>
			<div className={styles.content}>
				{/* Logo at top center */}
				<div className={styles.logoContainer}>
					<Image
						src={SiteLogo}
						alt={"Connect Utah Today Logo"}
						className={styles.logoImage}
					/>
				</div>
				<PageHeading heading={"h1"} className={styles.heading}>
					Welcome to Connect Utah Today
				</PageHeading>
				<p className={styles.about}>
					Connect Utah Today is dedicated to fostering community
					through local engagement and collective action. Explore
					local{" "}
					<Link href="/events" className={styles.eventsLink}>
						<span>upcoming events</span>
					</Link>{" "}
					to find opportunities for connection and advocacy.
				</p>

				{/* Group Objectives Section */}
				<div className={styles.objectives}>
					<PageHeading
						heading={"h2"}
						className={styles.objectivesTitle}
					>
						Group Objectives
					</PageHeading>
					<ul className={styles.objectivesList}>
						<li className={styles.objectivesItem}>
							<span className={styles.objectivesBullet}>•</span>
							Create a safe space for like-minded individuals to
							discuss politics, activism, and other shared
							interests.
						</li>
						<li className={styles.objectivesItem}>
							<span className={styles.objectivesBullet}>•</span>
							Organize in-person and virtual events for social
							connection and advocacy efforts.
						</li>
						<li className={styles.objectivesItem}>
							<span className={styles.objectivesBullet}>•</span>
							Raise awareness of and collaborate with existing
							nonprofits and community organizations.
						</li>
						<li className={styles.objectivesItem}>
							<span className={styles.objectivesBullet}>•</span>
							Educate members on key political issues and ways to
							engage effectively.
						</li>
						<li className={styles.objectivesItem}>
							<span className={styles.objectivesBullet}>•</span>
							Foster leadership and involvement opportunities for
							those who want to be more active.
						</li>
					</ul>
				</div>
			</div>
		</PageCard>
	);
};

export default Home;
