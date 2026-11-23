import type { Metadata } from 'next';
import Image from 'next/image';
import { Suspense } from 'react';
import { img } from '@/data';
import { ContactForm } from '@/components/forms/ContactForm';
import { Icon, type IconName } from '@/components/ui/Icon';
import { PageHero } from '@/components/ui/PageHero';
import { site } from '@/lib/site';
import styles from './contact.module.css';

export const metadata: Metadata = {
  title: 'Contact & Visit the Roastery',
  description: 'Visit the Kaapii roastery and tasting room in Indiranagar, Bengaluru, book a Saturday cupping, or get in touch about orders and wholesale.',
  alternates: { canonical: '/contact' },
};

const details: { icon: IconName; label: string; value: string; href?: string }[] = [
  { icon: 'pin', label: 'Roastery & tasting room', value: `${site.address.street}, ${site.address.city} ${site.address.postcode}`, href: 'https://maps.google.com/?q=Indiranagar+12th+Main+Bengaluru' },
  { icon: 'clock', label: 'Opening hours', value: `${site.hours} · Cupping Sat 11 am` },
  { icon: 'mail', label: 'Write to us', value: site.email, href: `mailto:${site.email}` },
  { icon: 'phone', label: 'Call the roastery', value: site.phone, href: `tel:${site.phone.replace(/\s/g, '')}` },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: 'Contact' }]}
        eyebrow="Visit · Write · Call"
        title={[['Come for', { text: 'a cup,', em: true }], ['stay for', { text: 'the cupping', em: true }]]}
        lede="Our roastery doubles as a tasting room. Drop in for a pour-over, pick up a fresh bag, or watch the morning roast through the glass."
      />

      <section className={`container ${styles.grid}`} style={{ paddingBottom: 'clamp(80px, 10vw, 140px)' }}>
        <div className={styles.formCol} data-reveal>
          <h2 className="h3" style={{ marginBottom: 28 }}>
            Send us <em>a note</em>
          </h2>
          <Suspense>
            <ContactForm />
          </Suspense>
        </div>

        <aside className={styles.infoCol}>
          <div className={`media ${styles.photo}`} data-reveal="clip">
            <Image src={img.cafeInterior} alt="Inside the Kaapii tasting room" fill sizes="(max-width: 960px) 92vw, 40vw" />
            <span className={styles.photoTag}>Indiranagar, since 2022</span>
          </div>
          <ul className={styles.details} data-stagger>
            {details.map((d) => (
              <li key={d.label}>
                <span className={styles.icon}><Icon name={d.icon} size={20} /></span>
                <span>
                  <small>{d.label}</small>
                  {d.href ? (
                    <a href={d.href} target={d.href.startsWith('http') ? '_blank' : undefined} rel={d.href.startsWith('http') ? 'noopener noreferrer' : undefined}>
                      {d.value}
                    </a>
                  ) : (
                    <span>{d.value}</span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </aside>
      </section>
    </>
  );
}
