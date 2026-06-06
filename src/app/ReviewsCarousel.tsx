"use client";

import { useCallback, useRef, useState } from "react";
import type { MouseEvent, PointerEvent, TouchEvent } from "react";
import styles from "./page.module.css";

const reviews = [
  {
    name: "merlie m",
    text: "Επιτέλους ένα φροντιστήριο στο οποίο μπορούμε να βασιστούμε να προσέχουν τα παιδιά μας όπως πρέπει. Η κόρη μας είχε τεράστιο θέμα με τα αγγλικά και ο κύριος Ρεζβάν την βοήθησε μέσα στον χρόνο να εξελιχθεί πολύ! Χαίρομαι που καταφέραμε να βρούμε ένα τέτοιο διαμάντι. Μπράβο σας!",
  },
  {
    name: "Eva P.",
    text: "Δεν μπορώ να εκφράσω πόσο ευχαριστημένοι έχουμε μείνει. Το περιβάλλον είναι πολύ φιλόξενο και ο καθηγητής είναι δίπλα στα παιδιά και σε εμάς σα γονείς. Έχουν δημιουργήσει και μια εφαρμογή που μας βοηθάει να μαθαίνουμε την πρόοδο των παιδιών αλλά και τα μαθήματα που έχουν για το σπίτι. Ευχαριστούμε πολύ για την δουλειά σας!",
  },
  {
    name: "Sergio G.",
    text: "Εξαιρετικό, το συνιστώ με κλειστά μάτια, καθηγητής με όρεξη και με καλή μεταδοτικότητα στα παιδιά!",
  },
  {
    name: "Nicoleta V.",
    text: "Φοβερός καθηγητής και πάντα δίπλα μας σε όλα! Μοντέρνος χώρος και μαθήματα που τα παιδιά τα λατρεύουν!",
  },
  {
    name: "Dimitris V.",
    text: "Φοβερός καθηγητής και πάντα δίπλα μας σε όλα! Μοντέρνος χώρος και μαθήματα που τα παιδιά τα λατρεύουν!",
  },
];

export default function ReviewsCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [animationKey, setAnimationKey] = useState(0);
  const swipeStartRef = useRef<{ x: number; y: number } | null>(null);
  const handledPointerSwipeRef = useRef(false);

  const updateReviewIndex = useCallback(
    (getNextIndex: (current: number) => number) => {
      setActiveIndex((current) => {
        const nextIndex = getNextIndex(current);

        return (nextIndex + reviews.length) % reviews.length;
      });
      setAnimationKey((current) => current + 1);
    },
    [],
  );

  const setReviewIndex = useCallback(
    (index: number) => {
      updateReviewIndex(() => index);
    },
    [updateReviewIndex],
  );

  const moveReview = useCallback(
    (offset: number) => {
      updateReviewIndex((current) => current + offset);
    },
    [updateReviewIndex],
  );

  const handlePreviousButton = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    moveReview(-1);
  };

  const handleNextButton = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    moveReview(1);
  };

  const startSwipe = (x: number, y: number) => {
    swipeStartRef.current = { x, y };
  };

  const finishSwipe = (x: number, y: number) => {
    const swipeStart = swipeStartRef.current;
    swipeStartRef.current = null;

    if (!swipeStart) {
      return false;
    }

    const deltaX = x - swipeStart.x;
    const deltaY = y - swipeStart.y;

    if (Math.abs(deltaX) < 36 || Math.abs(deltaX) <= Math.abs(deltaY) * 1.2) {
      return false;
    }

    moveReview(deltaX > 0 ? -1 : 1);
    return true;
  };

  const handleSwipeStart = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }

    handledPointerSwipeRef.current = false;
    startSwipe(event.clientX, event.clientY);
  };

  const handleSwipeEnd = (event: PointerEvent<HTMLElement>) => {
    handledPointerSwipeRef.current = finishSwipe(event.clientX, event.clientY);
  };

  const handleTouchStart = (event: TouchEvent<HTMLElement>) => {
    const touch = event.changedTouches[0];

    if (touch) {
      startSwipe(touch.clientX, touch.clientY);
    }
  };

  const handleTouchEnd = (event: TouchEvent<HTMLElement>) => {
    if (handledPointerSwipeRef.current) {
      handledPointerSwipeRef.current = false;
      return;
    }

    const touch = event.changedTouches[0];

    if (touch) {
      finishSwipe(touch.clientX, touch.clientY);
    }
  };

  const activeReview = reviews[activeIndex];

  return (
    <section className={styles.reviewsSection} aria-label="Google reviews">
      <div className={styles.reviewsHeader}>
        <div>
          <p className={styles.eyebrow}>Google Reviews</p>
          <h2>Τι είπαν για εμάς</h2>
        </div>
      </div>

      <div className={styles.reviewCarousel}>
        <button
          className={styles.reviewArrow}
          type="button"
          onClick={handlePreviousButton}
          aria-label="Προηγούμενο review"
        >
          ‹
        </button>

        <article
          className={styles.reviewCard}
          key={`${activeReview.name}-${animationKey}`}
          onPointerCancel={() => {
            swipeStartRef.current = null;
          }}
          onPointerDown={handleSwipeStart}
          onPointerUp={handleSwipeEnd}
          onTouchCancel={() => {
            swipeStartRef.current = null;
          }}
          onTouchEnd={handleTouchEnd}
          onTouchStart={handleTouchStart}
        >
          <header className={styles.reviewCardHeader}>
            <strong>{activeReview.name}</strong>
            <span>Google Review</span>
          </header>
          <div className={styles.reviewStars} aria-label="5 αστέρια">
            ★★★★★
          </div>
          <p>{activeReview.text}</p>
        </article>

        <button
          className={styles.reviewArrow}
          type="button"
          onClick={handleNextButton}
          aria-label="Επόμενο review"
        >
          ›
        </button>
      </div>

      <div className={styles.reviewDots} aria-label="Επιλογή review">
        {reviews.map((review, index) => (
          <button
            aria-label={`Review ${index + 1}: ${review.name}`}
            className={index === activeIndex ? styles.activeDot : ""}
            key={review.name}
            onClick={() => {
              setReviewIndex(index);
            }}
            type="button"
          />
        ))}
      </div>
    </section>
  );
}
