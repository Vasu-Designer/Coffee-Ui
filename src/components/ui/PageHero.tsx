import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { SplitWords } from '@/components/motion/SplitWords';
import styles from './PageHero.module.css';

type Line = string | { text: string; em?: boolean };

export interface Crumb {
  href?: string;
  label: string;
}

/** Editorial header for inner pages: breadcrumb, split headline, lede and an optional image. */
export function PageHero({
  eyebrow,
  title,
  lede,
  image,
  imageAlt = '',
  crumbs,
  children,
  align = 'split',
}: {
  eyebrow?: string;
  title: (Line | Line[])[];
  lede?: ReactNode;
  image?: string;
  imageAlt?: string;
  crumbs?: Crumb[];
  children?: ReactNode;
  align?: 'split' | 'center';
}) {
  return (
    <section className={styles.hero} data-align={align}>
      <div className={`container ${styles.grid}`} data-has-image={image ? '' : undefined}>
        <div className={styles.copy}>
          {crumbs && (
            <nav aria-label="Breadcrumb" className={styles.crumbs} data-reveal>
              <ol>
                <li><Link href="/">Home</Link></li>
                {crumbs.map((c) => (
                  <li key={c.label}>
                    {c.href ? <Link href={c.href}>{c.label}</Link> : <span aria-current="page">{c.label}</span>}
                  </li>
                ))}
              </ol>
            </nav>
          )}
          {eyebrow && <p className="eyebrow" data-reveal>{eyebrow}</p>}
          <SplitWords as="h1" className={`h1 ${styles.title}`} lines={title} />
          {lede && <div className={`lede ${styles.lede}`} data-reveal data-delay="0.15">{lede}</div>}
          {children && <div className={styles.extra} data-reveal data-delay="0.25">{children}</div>}
        </div>
        {image && (
          <div className={`media ${styles.media}`} data-reveal="clip">
            <Image src={image} alt={imageAlt} fill priority sizes="(max-width: 900px) 92vw, 42vw" />
          </div>
        )}
      </div>
    </section>
  );
}
