import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AddToCart } from '@/components/product/AddToCart';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductGallery } from '@/components/product/ProductGallery';
import styles from '@/components/product/ProductDetail.module.css';
import { Icon } from '@/components/ui/Icon';
import { JsonLd } from '@/components/ui/JsonLd';
import { getProduct, staticSlugs } from '@/lib/data';
import { roastLabel, roastScale } from '@/lib/format';
import { absoluteUrl } from '@/lib/site';

type Params = Promise<{ slug: string }>;

export const revalidate = 300;
export const dynamicParams = true;
export const generateStaticParams = staticSlugs.products;

const ogImage = (id: string) => `https://images.unsplash.com/${id}?w=1200&h=630&fit=crop&auto=format&q=75`;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const data = await getProduct(slug);
  if (!data) return { title: 'Not found' };
  const { product } = data;
  const title = `${product.name} — ${product.subtitle}`;
  const description = `${product.description} Tasting notes: ${product.notes.join(', ')}.`;
  return {
    title,
    description,
    alternates: { canonical: `/shop/${product.slug}` },
    openGraph: { type: 'website', title, description, url: `/shop/${product.slug}`, images: [{ url: ogImage(product.images[0]), width: 1200, height: 630, alt: product.name }] },
    twitter: { card: 'summary_large_image', title, description, images: [ogImage(product.images[0])] },
  };
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  const data = await getProduct(slug);
  if (!data) notFound();
  const { product, related } = data;

  const specs = [
    { k: 'Estate', v: product.origin },
    { k: 'Region', v: product.region },
    { k: 'Altitude', v: product.altitude },
    { k: 'Process', v: product.process },
    { k: 'Varietal', v: product.varietal },
  ].filter((s) => s.v);

  const prices = product.variants.map((v) => v.price);
  const productLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images.map((i) => `https://images.unsplash.com/${i}?w=1600&auto=format`),
    sku: product.slug,
    brand: { '@type': 'Brand', name: 'Kaapii' },
    category: product.categoryName,
    ...(product.region ? { countryOfOrigin: 'IN' } : {}),
    aggregateRating: { '@type': 'AggregateRating', ratingValue: product.rating, reviewCount: product.reviewCount },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'INR',
      lowPrice: Math.min(...prices),
      highPrice: Math.max(...prices),
      offerCount: prices.length,
      availability: 'https://schema.org/InStock',
      url: absoluteUrl(`/shop/${product.slug}`),
      seller: { '@id': absoluteUrl('/#org') },
    },
  };
  const crumbsLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: absoluteUrl('/') },
      { '@type': 'ListItem', position: 2, name: 'Shop', item: absoluteUrl('/shop') },
      { '@type': 'ListItem', position: 3, name: product.categoryName ?? 'Coffee', item: absoluteUrl(`/shop?category=${product.categorySlug}`) },
      { '@type': 'ListItem', position: 4, name: product.name, item: absoluteUrl(`/shop/${product.slug}`) },
    ],
  };

  return (
    <>
      <JsonLd data={[productLd, crumbsLd]} />

      <section className={`container ${styles.top}`}>
        <ProductGallery images={product.images} name={product.name} />

        <div className={styles.info}>
          <nav aria-label="Breadcrumb" className={styles.crumbs}>
            <Link href="/shop">Shop</Link>
            <span aria-hidden="true">/</span>
            <Link href={`/shop?category=${product.categorySlug}`}>{product.categoryName}</Link>
          </nav>

          <div className={styles.titleBlock}>
            {product.isNew && <span className="chip chip--accent">New harvest</span>}
            <h1 className={`h1 ${styles.title}`}>{product.name}</h1>
            <p className={styles.subtitle}>{product.subtitle}</p>
            <p className={styles.rating}>
              <span className={styles.stars} aria-hidden="true">
                {Array.from({ length: 5 }, (_, i) => (
                  <Icon key={i} name="star" size={14} style={{ opacity: i < Math.round(product.rating) ? 1 : 0.25 }} />
                ))}
              </span>
              <span>{product.rating.toFixed(1)}</span>
              <span className="muted">· {product.reviewCount} reviews</span>
            </p>
          </div>

          <p className={styles.description}>{product.description}</p>

          <ul className={styles.notes} aria-label="Tasting notes">
            {product.notes.map((n) => <li key={n}>{n}</li>)}
          </ul>

          <AddToCart product={product} />

          <ul className={styles.assure}>
            <li><Icon name="flame" size={18} /> Roasted to order, stamped with the roast date</li>
            <li><Icon name="truck" size={18} /> Free shipping over ₹999 · dispatched in 24 h</li>
            <li><Icon name="leaf" size={18} /> Compostable valve bag, recyclable outer box</li>
          </ul>
        </div>
      </section>

      <section className={`band ${styles.origin}`} aria-labelledby="origin-title">
        <div className={`container ${styles.originGrid}`}>
          <div>
            <p className="eyebrow" data-reveal>{product.kind === 'coffee' ? 'From the estate' : 'How it’s made'}</p>
            <h2 id="origin-title" className="h2" data-reveal>
              The <em>story</em> in the bag
            </h2>
          </div>
          <div className={styles.story}>
            <p className={styles.storyText} data-reveal>{product.story}</p>
            {(specs.length > 0 || product.roast) && (
              <dl className={styles.specs} data-stagger>
                {specs.map((s) => (
                  <div key={s.k}>
                    <dt>{s.k}</dt>
                    <dd>{s.v}</dd>
                  </div>
                ))}
                {product.roast && (
                  <div>
                    <dt>Roast</dt>
                    <dd className={styles.roastDd}>
                      {roastLabel[product.roast]}
                      <span className={styles.roastMeter} aria-hidden="true">
                        {[1, 2, 3, 4].map((n) => (
                          <i key={n} data-on={n <= roastScale[product.roast!] || undefined} />
                        ))}
                      </span>
                    </dd>
                  </div>
                )}
              </dl>
            )}
          </div>
        </div>
      </section>

      <section className="section section--tight" aria-labelledby="brew-title">
        <div className={`container ${styles.brew}`}>
          <h2 id="brew-title" className="h3" data-reveal>
            {product.kind === 'coffee' ? <>How we <em>brew it</em></> : <>Good to <em>know</em></>}
          </h2>
          <ol className={styles.tips} data-stagger>
            {product.brewTips.map((t, i) => (
              <li key={t}>
                <span>{String(i + 1).padStart(2, '0')}</span>
                {t}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section" style={{ paddingTop: 0 }} aria-labelledby="related-title">
          <div className="container">
            <div className={styles.relatedHead}>
              <h2 id="related-title" className="h2" data-reveal>
                You might <em>also like</em>
              </h2>
              <Link href="/shop" className="link-underline">Shop all</Link>
            </div>
            <ul className={styles.related} data-stagger>
              {related.map((p) => (
                <li key={p.slug}><ProductCard product={p} /></li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
