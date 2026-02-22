import {PageHeading} from "@/components/PageHeading";
import styles from './ImageEmbed.module.scss';

export const ImageEmbed = ({ title, img, alt }: { title: string; img: string; alt: string }) => {
  return (
    <section className={styles.section}>
      <PageHeading heading={'h2'}>{title}</PageHeading>
      <div className={styles.imageContainer}>
        <img src={img} alt={alt} className={styles.image} />
      </div>
    </section>  )
}
