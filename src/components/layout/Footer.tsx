import Link from 'next/link';
import { LogoMark } from '@/components/brand/Logo';
import { NewsletterForm } from '@/components/forms/NewsletterForm';
import { JourneyAnchor } from '@/components/journey/JourneyAnchor';
import { Edge } from '@/components/ui/Edge';
import { site } from '@/lib/site';
import styles from './Footer.module.css';

const columns = [
  {
    title: 'Shop',
    links: [
      { href: '/shop', label: 'All coffee' },
      { href: '/shop?category=single-estate', label: 'Single estate' },
      { href: '/shop?category=filter-kaapi', label: 'Filter kaapi' },
      { href: '/shop?category=brew-gear', label: 'Brew gear' },
      { href: '/collections', label: 'Collections' },
    ],
  },
  {
    title: 'Kaapii',
    links: [
      { href: '/about', label: 'Our story' },
      { href: '/blog', label: 'Journal' },
      { href: '/contact', label: 'Visit the roastery' },
      { href: '/contact?topic=Wholesale', label: 'Wholesale' },
    ],
  },
  {
    title: 'Help',
    links: [
      { href: '/faq', label: 'FAQ' },
      { href: '/faq#orders-shipping', label: 'Shipping' },
      { href: '/cart', label: 'Your bag' },
      { href: '/contact', label: 'Contact' },
    ],
  },
];

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <Edge />
      <div className={`band ${styles.band}`}>
        <div className={`container ${styles.top}`}>
          <div className={styles.intro}>
            <LogoMark size={44} className={styles.mark} />
            <p className={styles.pitch}>
              Letters from the <em>roastery</em>
            </p>
            <NewsletterForm id="footer-newsletter" />
          </div>

          <nav className={styles.cols} aria-label="Footer">
            {columns.map((col) => (
              <div key={col.title}>
                <h2 className={styles.colTitle}>{col.title}</h2>
                <ul>
                  {col.links.map((l) => (
                    <li key={l.href + l.label}>
                      <Link href={l.href} className={styles.link}>{l.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div>
              <h2 className={styles.colTitle}>Roastery</h2>
              <address className={styles.address}>
                {site.address.street}
                <br />
                {site.address.city} {site.address.postcode}
                <br />
                <span className={styles.hours}>{site.hours}</span>
              </address>
              <a href={`mailto:${site.email}`} className={styles.link}>{site.email}</a>
            </div>
          </nav>
        </div>

        <div className={`container ${styles.giant}`} aria-hidden="true">
          <span data-parallax="0.08">Kaap<i>ii</i></span>
          {/* Final resting place of the homepage's travelling bean (ignored elsewhere). */}
          <JourneyAnchor id="footer" />
        </div>

        <div className={`container ${styles.legal}`}>
          <p>© {year} {site.legalName}. Grown in India, roasted in Bengaluru.</p>
          <ul className={styles.social}>
            <li><a href={site.social.instagram} target="_blank" rel="noopener noreferrer">Instagram</a></li>
            <li><a href={site.social.youtube} target="_blank" rel="noopener noreferrer">YouTube</a></li>
            <li><a href={site.social.spotify} target="_blank" rel="noopener noreferrer">Roastery playlist</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
