import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { img } from '@/data';
import { Accordion } from '@/components/ui/Accordion';
import { Icon } from '@/components/ui/Icon';
import { JsonLd } from '@/components/ui/JsonLd';
import { PageHero } from '@/components/ui/PageHero';
import { getFaqs } from '@/lib/data';
import { slugify } from '@/lib/markdown';
import { site } from '@/lib/site';
import styles from './faq.module.css';

export const metadata: Metadata = {
  title: 'FAQ — Shipping, Roasting & Subscriptions',
  description: 'Answers about Kaapii shipping times, freshness and storage, grind options, subscriptions, wholesale and visiting our Bengaluru roastery.',
  alternates: { canonical: '/faq' },
};

export const revalidate = 300;

export default async function FaqPage() {
  const faqs = await getFaqs();
  const groups = faqs.reduce<Record<string, typeof faqs>>((acc, f) => {
    (acc[f.group] ??= []).push(f);
    return acc;
  }, {});

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map((f) => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: { '@type': 'Answer', text: f.answer },
          })),
        }}
      />
      <PageHero
        crumbs={[{ label: 'FAQ' }]}
        eyebrow="Good questions"
        title={[['Everything you', { text: 'wanted', em: true }], [{ text: 'to ask', em: true }, 'the roaster']]}
        lede="Shipping, freshness, grinding, subscriptions and visiting the roastery. If your question isn’t here, write to us. A human replies within a day."
      />

      <section className={`container ${styles.layout}`} style={{ paddingBottom: 'clamp(80px, 10vw, 140px)' }}>
        <aside className={styles.side}>
          <nav aria-label="FAQ topics" className={styles.topics}>
            {Object.keys(groups).map((g) => (
              <a key={g} href={`#${slugify(g)}`}>{g}</a>
            ))}
          </nav>
          <div className={styles.help}>
            <div className={`media ${styles.helpMedia}`}>
              <Image src={img.handSteam} alt="" fill sizes="320px" />
            </div>
            <p className="h3">Still <em>curious?</em></p>
            <p className="small muted">{site.hours}. Or drop in for a cup and ask in person.</p>
            <Link href="/contact" className="btn btn--sm">
              Contact us
              <span className="btn-arrow"><Icon name="arrow" size={14} /></span>
            </Link>
          </div>
        </aside>

        <div className={styles.groups}>
          {Object.entries(groups).map(([group, items]) => (
            <section key={group} id={slugify(group)} className={styles.group} aria-labelledby={`${slugify(group)}-h`}>
              <h2 id={`${slugify(group)}-h`} className={styles.groupTitle} data-reveal>{group}</h2>
              <div data-reveal>
                <Accordion items={items} defaultOpen={-1} />
              </div>
            </section>
          ))}
        </div>
      </section>
    </>
  );
}
