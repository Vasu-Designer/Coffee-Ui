import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import { img } from '@/data';
import { ProductCard } from '@/components/product/ProductCard';
import { ShopControls } from '@/components/product/ShopControls';
import { Icon } from '@/components/ui/Icon';
import { JsonLd } from '@/components/ui/JsonLd';
import { PageHero } from '@/components/ui/PageHero';
import { getCategories, getProducts, type ProductQuery } from '@/lib/data';
import { absoluteUrl } from '@/lib/site';
import styles from './shop.module.css';

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const SORTS = ['featured', 'price-asc', 'price-desc', 'rating', 'newest'] as const;
const ROASTS = ['light', 'medium', 'medium-dark', 'dark'];

function parse(sp: Record<string, string | string[] | undefined>): ProductQuery {
  const one = (k: string) => (Array.isArray(sp[k]) ? sp[k]?.[0] : sp[k]) as string | undefined;
  const sort = one('sort');
  const roast = one('roast');
  return {
    category: one('category')?.slice(0, 60) || undefined,
    roast: roast && ROASTS.includes(roast) ? roast : undefined,
    sort: SORTS.includes(sort as (typeof SORTS)[number]) ? (sort as ProductQuery['sort']) : undefined,
    q: one('q')?.slice(0, 80) || undefined,
  };
}

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const { category } = parse(await searchParams);
  const cats = await getCategories();
  const cat = cats.find((c) => c.slug === category);
  const title = cat ? `${cat.name} Coffee` : 'Shop Specialty Coffee';
  return {
    title,
    description: cat
      ? `${cat.description} Roasted to order in Bengaluru and shipped within 24 hours.`
      : 'Shop single-estate Indian coffee, filter kaapi blends, espresso and brew gear. Roasted to order and shipped within 24 hours.',
    alternates: { canonical: cat ? `/shop?category=${cat.slug}` : '/shop' },
  };
}

export default async function ShopPage({ searchParams }: { searchParams: SearchParams }) {
  const query = parse(await searchParams);
  const [products, categories] = await Promise.all([getProducts(query), getCategories()]);
  const active = categories.find((c) => c.slug === query.category);
  const showPromo = !query.q && products.length > 4;

  const listLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: active ? `${active.name} — Kaapii` : 'Kaapii coffee',
    itemListElement: products.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: absoluteUrl(`/shop/${p.slug}`),
      name: p.name,
    })),
  };

  return (
    <>
      <JsonLd data={listLd} />
      <PageHero
        crumbs={[{ label: 'Shop', href: active ? '/shop' : undefined }, ...(active ? [{ label: active.name }] : [])]}
        eyebrow={active ? active.tagline : 'Roasted Monday · Wednesday · Friday'}
        title={active ? [[active.name.split(' ')[0], { text: active.name.split(' ').slice(1).join(' ') || 'coffee', em: true }]] : [['The', { text: 'roastery', em: true }], 'shelf']}
        lede={active ? active.description : 'Every coffee we sell is grown in India and roasted by us in small batches. Choose whole bean or ground to order for your brewer.'}
      />

      <section className="container" style={{ paddingBottom: 'clamp(80px, 10vw, 140px)' }} aria-label="Products">
        <Suspense>
          <ShopControls categories={categories} total={products.length} />
        </Suspense>

        {products.length === 0 ? (
          <div className={styles.empty}>
            <p className="h3">Nothing matches <em>just yet.</em></p>
            <p className="muted">Try a different note or clear your filters.</p>
            <Link href="/shop" className="btn btn--sm">Clear filters</Link>
          </div>
        ) : (
          <ul className={styles.grid} data-stagger>
            {products.map((p, i) => (
              <li key={p.slug} className={styles.item} data-wide={i === 0 && !query.q ? '' : undefined}>
                <ProductCard product={p} priority={i < 3} sizes={i === 0 ? '(max-width: 640px) 92vw, 50vw' : undefined} />
              </li>
            )).flatMap((el, i) =>
              showPromo && i === 4
                ? [
                    <li key="promo" className={styles.promo}>
                      <Link href="/shop/estate-discovery-box" className={styles.promoLink}>
                        <Image src={img.cupsCircle} alt="" fill sizes="(max-width: 640px) 92vw, 33vw" />
                        <span className={styles.promoCopy}>
                          <span className="eyebrow eyebrow--plain">Can’t decide?</span>
                          <span className="h3">Taste four estates <em>side by side.</em></span>
                          <span className={styles.promoCta}>
                            Discovery box <Icon name="arrowUpRight" size={16} />
                          </span>
                        </span>
                      </Link>
                    </li>,
                    el,
                  ]
                : [el],
            )}
          </ul>
        )}
      </section>
    </>
  );
}
