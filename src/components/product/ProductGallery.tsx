'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { gsap, prefersReducedMotion } from '@/lib/gsap';
import styles from './ProductDetail.module.css';

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [index, setIndex] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const el = stageRef.current?.querySelector('[data-active] img');
    if (el && !prefersReducedMotion()) {
      gsap.fromTo(el, { scale: 1.08, opacity: 0.4 }, { scale: 1, opacity: 1, duration: 1, ease: 'expo.out' });
    }
  }, [index]);

  return (
    <div className={styles.gallery}>
      <div ref={stageRef} className={styles.stage} data-reveal="clip">
        {images.map((src, i) => (
          <div key={src} className={styles.slide} data-active={i === index || undefined} aria-hidden={i !== index}>
            <Image
              src={src}
              alt={i === 0 ? `${name} — product photograph` : `${name} — detail ${i + 1}`}
              fill
              priority={i === 0}
              sizes="(max-width: 960px) 92vw, 52vw"
              quality={80}
            />
          </div>
        ))}
        <span className={styles.counter} aria-hidden="true">
          {String(index + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
        </span>
      </div>
      {images.length > 1 && (
        <div className={styles.thumbs} role="tablist" aria-label="Product images">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Show image ${i + 1}`}
              className={styles.thumb}
              onClick={() => setIndex(i)}
            >
              <Image src={src} alt="" fill sizes="96px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
