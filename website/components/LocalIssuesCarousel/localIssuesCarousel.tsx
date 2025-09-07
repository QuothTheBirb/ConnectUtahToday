"use client";

import {useState} from "react";

import styles from './LocalIssuesCarousel.module.scss';

const LocalIssues = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalSlides = slides.length;

  function showSlide(index: number) {
    // Ensure index is within bounds
    if (index >= totalSlides) setCurrentIndex(0);
    else if (index < 0) setCurrentIndex(totalSlides - 1);
    else setCurrentIndex(index);
  }

  function moveCarousel(direction: number) {
    showSlide(currentIndex + direction);
  }

  function currentSlide(index: number) {
    showSlide(index - 1);
  }

  return (
    <>
      {/* Image Carousel */}
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
    </>
  )
}

type slide = {
  image: string;
  title: string;
}
const slides: slide[] = [
  {
    image: 'assets/1000014843.png',
    title: 'Activism Image 1',
  },
  {
    image: 'assets/1000014844.png',
    title: 'Activism Image 2',
  },
  {
    image: 'assets/1000014845.png',
    title: 'Activism Image 3',
  },
  {
    image: 'assets/1000014846.png',
    title: 'Activism Image 4',
  },
  {
    image: 'assets/1000014847.png',
    title: 'Activism Image 5',
  },
  {
    image: 'assets/1000014848.png',
    title: 'Activism Image 6',
  },
]

export default LocalIssues;
