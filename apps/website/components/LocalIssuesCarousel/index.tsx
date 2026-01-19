"use client";

import {useState} from "react";

import styles from './LocalIssuesCarousel.module.scss';
import {slides} from "./slides";

export const LocalIssuesCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalSlides = slides.length;

  const showSlide = (index: number) => {
    // Ensure index is within bounds
    if (index >= totalSlides) setCurrentIndex(0);
    else if (index < 0) setCurrentIndex(totalSlides - 1);
    else setCurrentIndex(index);
  }

  const moveCarousel = (direction: number) => {
    showSlide(currentIndex + direction);
  }

  const currentSlide = (index: number) => {
    showSlide(index - 1);
  }

  return (
    <div className={styles.carouselContainer}>
      <div
        className={styles.carouselImages}
        style={{
          transform: `translateX(-${currentIndex * 100}%)`
      }}>
        {slides.map((slide, index) => {
          return (
            <img key={index} src={slide.image} alt={slide.title} className={styles.carouselImage}/>
          )
        })}
      </div>
      <button className={`${styles.carouselNav} ${styles.carouselPrev}`} onClick={() => moveCarousel(-1)}>❮</button>
      <button className={`${styles.carouselNav} ${styles.carouselNext}`} onClick={() => moveCarousel(1)}>❯</button>
      <div className={styles.carouselDots}>
        {slides.map((_, index) => {
          return (
            <button key={index}
                    className={currentIndex === index ? `${styles.carouselDot} ${styles.active}` : styles.carouselDot}
                    onClick={() => currentSlide(index + 1)}/>
          )
        })}
      </div>
    </div>
  )
}
