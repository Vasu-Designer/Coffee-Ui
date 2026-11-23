'use client';

import { useId, useState } from 'react';
import styles from './Accordion.module.css';

export function Accordion({ items, defaultOpen = 0 }: { items: { question: string; answer: string }[]; defaultOpen?: number }) {
  const [open, setOpen] = useState<number | null>(defaultOpen);
  const base = useId();

  return (
    <ul className={styles.list}>
      {items.map((item, i) => {
        const isOpen = open === i;
        const id = `${base}-${i}`;
        return (
          <li key={item.question} className={styles.item} data-open={isOpen || undefined}>
            <h3 className={styles.heading}>
              <button
                type="button"
                className={styles.trigger}
                aria-expanded={isOpen}
                aria-controls={`${id}-panel`}
                id={`${id}-btn`}
                onClick={() => setOpen(isOpen ? null : i)}
              >
                <span>{item.question}</span>
                <span className={styles.icon} aria-hidden="true" />
              </button>
            </h3>
            <div id={`${id}-panel`} role="region" aria-labelledby={`${id}-btn`} className={styles.panel}>
              <div className={styles.inner}>
                <p>{item.answer}</p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
