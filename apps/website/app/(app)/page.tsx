import {Metadata} from "next";
import {PageHeading} from "@/components/PageHeading";
import {PageCard} from "@/components/PageCard";
import Image from "next/image";

import styles from './Home.module.scss';
import SiteLogo from '../../public/assets/connect-utah-today-logo.png'

export const metadata: Metadata = {
  title: "Home | Connect Utah Today",
}

const Home = () => {
  return (
    <PageCard>
      {/* Logo at top center */}
      <div className={styles.logoContainer}>
        <Image
          src={SiteLogo}
          alt={"Connect Utah Today Logo"}
          className={styles.logoImage}
        />
      </div>

      <PageHeading heading={'h1'}>Welcome to community building homepage!</PageHeading>
      <p>Here is some information about community building on the Connect Utah Today site.</p>

      {/* Group Objectives Section */}
      <div className={styles.objectives}>
        <PageHeading heading={'h2'}>Group Objectives</PageHeading>
        <ul className={styles.objectivesList}>
          <li className={styles.objectivesItem}>
            <span className={styles.objectivesBullet}>•</span>
            Create a safe space for like-minded individuals to discuss politics, activism, and other shared interests.
          </li>
          <li className={styles.objectivesItem}>
            <span className={styles.objectivesBullet}>•</span>
            Organize in-person and virtual events for social connection and advocacy efforts.
          </li>
          <li className={styles.objectivesItem}>
            <span className={styles.objectivesBullet}>•</span>
            Raise awareness of and collaborate with existing nonprofits and community organizations.
          </li>
          <li className={styles.objectivesItem}>
            <span className={styles.objectivesBullet}>•</span>
            Educate members on key political issues and ways to engage effectively.
          </li>
          <li className={styles.objectivesItem}>
            <span className={styles.objectivesBullet}>•</span>
            Foster leadership and involvement opportunities for those who want to be more active.
          </li>
        </ul>
      </div>
    </PageCard>
  )
}

export default Home;
