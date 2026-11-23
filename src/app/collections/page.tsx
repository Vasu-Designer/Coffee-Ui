import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { products as catalogue } from '@/data';
import { Icon } from '@/components/ui/Icon';
import { PageHero } from '@/components/ui/PageHero';
import { getCollections, getProducts } from '@/lib/data';
import { formatPrice } from '@/lib/format';
import styles from './collections.module.css';

export const metadata: Metadata = {
  title: 'Collections',
  description: 'Curated coffee edits from Kaapii: monsoon coffees, bright and floral light roasts, the South Indian filter kaapi ritual and thoughtful gifts.',
  alternates: { canonical: '/collections' },
};

export const revalidate = 300;

export default async function CollectionsPage() {
  const [collections, products] = await Promise.all([getCollections(), getProducts()]);
  const bySlug = new Map((products.length ? products : catalogue).map((p) => [p.slug, p]));

  return (
    <>
      <PageHero
        crumbs={[{ label: 'Collections' }]}
        eyebrow="Edited by the roastery"
        title={[['Coffee for', { text: 'every', em: true }], [{ text: 'kind of morning', em: true }]]}
        lede="Small, considered edits built around a mood, a season or a way of brewing. Each one pairs coffees with the tools we reach for ourselves."
      />

      <section className="container" style={{ paddingBottom: 'clamp(80px, 10vw, 150px)' }}>
        <ol className={styles.list}>
          {collections.map((c, i) => {
            const items = c.productSlugs.map((s) => bySlug.get(s)).filter((p): p is NonNullable<typeof p> => Boolean(p));
            const from = Math.min(...items.map((p) => p.variants[0]?.price ?? Infinity));
            return (
              <li key={c.slug} className={styles.row} data-flip={i % 2 === 1 || undefined}>
                <Link href={`/collections/${c.slug}`} className={`media ${styles.media}`} data-reveal="clip" aria-label={`${c.name} collection`}>
                  <Image src={c.image} alt="" fill sizes="(max-width: 900px) 92vw, 55vw" priority={i === 0} data-parallax="0.08" />
                  <span className={styles.num} aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                </Link>
                <div className={styles.copy}>
                  <p className="eyebrow" data-reveal>{c.kicker}</p>
                  <h2 className="h2" data-reveal>
                    <Link href={`/collections/${c.slug}`}>{c.name}</Link>
                  </h2>
                  <p className="lede" data-reveal>{c.description}</p>
                  <ul className={styles.thumbs} data-stagger>
                    {items.map((p) => (
                      <li key={p.slug}>
                        <Link href={`/shop/${p.slug}`} className={styles.thumb} title={p.name}>
                          <Image src={p.images[0]} alt={p.name} fill sizes="80px" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <div className={styles.foot} data-reveal>
                    <Link href={`/collections/${c.slug}`} className="btn btn--sm">
                      Explore the edit
                      <span className="btn-arrow"><Icon name="arrow" size={14} /></span>
                    </Link>
                    {Number.isFinite(from) && (
                      <span className="small muted">
                        {items.length} pieces · from {formatPrice(from)}
                      </span>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </section>
    </>
  );
}
