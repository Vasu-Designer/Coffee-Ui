import Link from 'next/link';
import styles from './Logo.module.css';

/** The Kaapii bean seal: a hand-drawn bean inside a thin roaster's ring. */
export function LogoMark({ size = 36, className }: { size?: number; className?: string }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="20" cy="20" r="18.6" stroke="currentColor" strokeWidth="1.1" />
      <circle cx="20" cy="20" r="15.4" stroke="currentColor" strokeWidth="0.5" strokeDasharray="0.6 2.2" opacity="0.7" />
      <g transform="rotate(-32 20 20.5)">
        <ellipse cx="20" cy="20.5" rx="7.6" ry="10.8" fill="currentColor" />
        <path
          d="M20.4 10.2c-3.6 3.4 3.8 8.6.1 12.2-2.4 2.3-1.6 5.5-.3 8.3"
          stroke="var(--logo-cut, var(--bg))"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

/** Wordmark: Newsreader italic with the two “i” tittles drawn as tiny beans. */
export function Wordmark({ className }: { className?: string }) {
  return (
    // role="img" names the whole wordmark "Kaapii"; the dotless "ıı" glyphs are
    // drawn by CSS so they never leak into accessible or visible-text names.
    <span className={`${styles.word} ${className ?? ''}`} role="img" aria-label="Kaapii">
      <span aria-hidden="true">Kaap</span>
      <span className={styles.ii} aria-hidden="true">
        <span data-glyph="ı" />
        <span data-glyph="ı" />
        <svg className={styles.tittles} viewBox="0 0 24 8" aria-hidden="true">
          <ellipse cx="6" cy="4" rx="2.3" ry="3.2" transform="rotate(-30 6 4)" fill="var(--accent)" />
          <ellipse cx="17" cy="4" rx="2.3" ry="3.2" transform="rotate(-30 17 4)" fill="var(--accent)" />
        </svg>
      </span>
    </span>
  );
}

export function Logo({ className, onClick }: { className?: string; onClick?: () => void }) {
  return (
    <Link href="/" className={`${styles.logo} ${className ?? ''}`} aria-label="Kaapii — home" onClick={onClick}>
      <LogoMark className={styles.mark} />
      <Wordmark />
    </Link>
  );
}
