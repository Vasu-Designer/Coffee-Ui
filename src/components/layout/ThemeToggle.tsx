'use client';

import { useEffect, useState } from 'react';
import styles from './ThemeToggle.module.css';

type Theme = 'light' | 'dark';

/** Runs before paint (inlined in <head>) so the saved theme never flashes. */
export const themeInitScript = `(function(){try{var d=document.documentElement;d.classList.add('js');var t=localStorage.getItem('kaapii.theme');if(!t){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}d.dataset.theme=t}catch(e){}})();`;

/**
 * Latte ↔ Espresso theme switch. The track is a milky latte by day; switching
 * to dark "pours" espresso across it while a coffee bean rolls to the other end.
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    setTheme((document.documentElement.dataset.theme as Theme) ?? 'light');
  }, []);

  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem('kaapii.theme', next);
    } catch {
      /* storage unavailable */
    }
    setTheme(next);
  };

  const dark = theme === 'dark';
  const label = dark ? 'Switch to latte (light) theme' : 'Switch to espresso (dark) theme';

  return (
    <button
      type="button"
      role="switch"
      aria-checked={dark}
      className={styles.toggle}
      onClick={toggle}
      aria-label={label}
      title={dark ? 'Espresso mode · tap for latte' : 'Latte mode · tap for espresso'}
      data-state={theme ?? 'light'}
    >
      <span className={styles.track} aria-hidden="true">
        {/* Latte: milky body with a few foam bubbles */}
        <span className={styles.latte}>
          <i /><i /><i /><i />
        </span>
        {/* Espresso pours in over the latte */}
        <span className={styles.espresso}>
          <i /><i /><i />
        </span>

        {/* What the other side does: a moon by day, a steaming cup by night */}
        <svg className={`${styles.hint} ${styles.hintNight}`} viewBox="0 0 16 16" width="13" height="13">
          <path d="M11.8 10.6A5 5 0 0 1 5.4 4.2a5 5 0 1 0 6.4 6.4Z" fill="currentColor" />
        </svg>
        <svg className={`${styles.hint} ${styles.hintDay}`} viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
          <path d="M3.5 7.5h7v2.6a3 3 0 0 1-3 3h-1a3 3 0 0 1-3-3V7.5Z" />
          <path d="M10.5 8.4h.8a1.4 1.4 0 0 1 0 2.8h-.9" />
          <path d="M6 2.6c-.6.7.6 1.3 0 2.1M8.2 2.2c-.6.7.6 1.3 0 2.1" />
        </svg>

        {/* The rolling bean */}
        <span className={styles.thumb}>
          <svg viewBox="0 0 40 40" width="18" height="18">
            <g transform="rotate(-32 20 20.5)">
              <ellipse cx="20" cy="20.5" rx="8.4" ry="11.6" className={styles.beanBody} />
              <path d="M20.4 9.6c-3.8 3.6 4 9 .1 12.8-2.5 2.4-1.7 5.8-.3 8.7" className={styles.beanCrease} fill="none" strokeWidth="1.8" strokeLinecap="round" />
            </g>
          </svg>
        </span>
      </span>
    </button>
  );
}
