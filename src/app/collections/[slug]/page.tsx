import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ProductCard } from '@/components/product/ProductCard';
import { JsonLd } from '@/components/ui/JsonLd';
import { PageHero } from '@/components/ui/PageHero';
import { getCollection, getCollections, staticSlugs } from '@/lib/data';
import { absoluteUrl } from '@/lib/site';
import styles from '@/app/shop/shop.module.css';

type Params = Promise<{ slug: string }>;

export const revalidate = 300;
export const generateStaticParams = staticSlugs.collections;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const data = await getCollection(slug);
  if (!data) return { title: 'Not found' };
  const { collection } = data;
  return {
    title: `${collection.name} — Coffee Collection`,
    description: collection.description,
    alternates: { canonical: `/collections/${collection.slug}` },
    openGraph: {
      title: collection.name,
      description: collection.description,
      images: [{ url: `https://images.unsplash.com/${collection.image}?w=1200&h=630&fit=crop&auto=format`, width: 1200, height: 630 }],
    },
  };
}

export default async function CollectionPage({ params }: { params: Params }) {
  const { slug } = await params;
  const [data, all] = await Promise.all([getCollection(slug), getCollections()]);
  if (!data) notFound();
  const { collection, products } = data;
  const others = all.filter((c) => c.slug !== slug);
  const [first, ...restWords] = collection.name.split(' ');

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: collection.name,
          description: collection.description,
          url: absoluteUrl(`/collections/${collection.slug}`),
          mainEntity: {
            '@type': 'ItemList',
            itemListElement: products.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: absoluteUrl(`/shop/${p.slug}`), name: p.name })),
          },
        }}
      />
      <PageHero
        crumbs={[{ label: 'Collections', href: '/collections' }, { label: collection.name }]}
        eyebrow={collection.kicker}
        title={[first, [{ text: restWords.join(' '), em: true }]]}
        lede={collection.description}
        image={collection.image}
      />

      <section className="container" style={{ paddingBottom: 'clamp(64px, 8vw, 120px)' }} aria-label={`${collection.name} products`}>
        <ul className={styles.grid} data-stagger>
          {products.map((p, i) => (
            <li key={p.slug}>
              <ProductCard product={p} index={i} />
            </li>
          ))}
        </ul>
      </section>

      <section className="section section--tight" style={{ borderTop: '1px solid var(--line)' }} aria-label="More collections">
        <div className="container" style={{ display: 'flex', flexWrap: 'wrap', gap: '16px 40px', alignItems: 'baseline' }}>
          <p className="eyebrow">More edits</p>
          {others.map((c) => (
            <Link key={c.slug} href={`/collections/${c.slug}`} className="h3 link-underline" style={{ fontFamily: 'var(--font-serif)' }}>
              {c.name}
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
