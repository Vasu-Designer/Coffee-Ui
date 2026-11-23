'use client';

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useTransition, type FormEvent } from 'react';
import { Icon } from '@/components/ui/Icon';
import styles from './ShopControls.module.css';

export function ShopControls({
  categories,
  total,
}: {
  categories: { slug: string; name: string; productCount?: number }[];
  total: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [q, setQ] = useState(params.get('q') ?? '');

  useEffect(() => setQ(params.get('q') ?? ''), [params]);

  const active = params.get('category') ?? '';
  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    startTransition(() => router.replace(`${pathname}${next.size ? `?${next}` : ''}`, { scroll: false }));
  };
  const hrefFor = (slug: string) => {
    const next = new URLSearchParams(params.toString());
    if (slug) next.set('category', slug);
    else next.delete('category');
    return `${pathname}${next.size ? `?${next}` : ''}`;
  };

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    update('q', q.trim());
  };

  return (
    <div className={styles.controls} data-pending={pending || undefined}>
      <nav className={styles.tabs} aria-label="Filter by category">
        <Link href={hrefFor('')} scroll={false} className={styles.tab} aria-current={!active ? 'page' : undefined}>
          All
        </Link>
        {categories.map((c) => (
          <Link key={c.slug} href={hrefFor(c.slug)} scroll={false} className={styles.tab} aria-current={active === c.slug ? 'page' : undefined}>
            {c.name}
            {typeof c.productCount === 'number' && <sup>{c.productCount}</sup>}
          </Link>
        ))}
      </nav>

      <div className={styles.row}>
        <form role="search" className={styles.search} onSubmit={onSearch}>
          <Icon name="search" size={18} />
          <label htmlFor="shop-q" className="sr-only">Search coffee</label>
          <input
            id="shop-q"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name, region or note: “cocoa”"
          />
        </form>

        <div className={styles.selects}>
          <label className={styles.select}>
            <span>Roast</span>
            <select value={params.get('roast') ?? ''} onChange={(e) => update('roast', e.target.value)}>
              <option value="">Any</option>
              <option value="light">Light</option>
              <option value="medium">Medium</option>
              <option value="medium-dark">Medium-dark</option>
              <option value="dark">Dark</option>
            </select>
          </label>
          <label className={styles.select}>
            <span>Sort</span>
            <select value={params.get('sort') ?? 'featured'} onChange={(e) => update('sort', e.target.value === 'featured' ? '' : e.target.value)}>
              <option value="featured">Our picks</option>
              <option value="newest">New harvest</option>
              <option value="rating">Top rated</option>
              <option value="price-asc">Price, low to high</option>
              <option value="price-desc">Price, high to low</option>
            </select>
          </label>
        </div>
      </div>

      <p className={styles.count} aria-live="polite">
        {total} {total === 1 ? 'coffee' : 'items'}
        {params.get('q') && <> matching “{params.get('q')}”</>}
      </p>
    </div>
  );
}
