import Image from 'next/image';
import Link from 'next/link';
import type { CategoryDTO } from '@/lib/data';
import { JourneyAnchor } from '@/components/journey/JourneyAnchor';
import { SplitWords } from '@/components/motion/SplitWords';
import { Icon } from '@/components/ui/Icon';
import s from './home.module.css';

export function CategoryStrip({ categories }: { categories: CategoryDTO[] }) {
  return (
    <section className="section section--tight" aria-labelledby="cats-title">
      <JourneyAnchor id="cats" rotate={14} />
      <div className="container">
        <div className={s.headRow}>
          <div>
            <p className="eyebrow" data-reveal>Find your cup</p>
            <SplitWords id="cats-title" className="h2" lines={[['Five ways', { text: 'in', em: true }]]} />
          </div>
          <p className="lede" data-reveal data-delay="0.1">
            From a slow Sunday pour-over to a tumbler of frothy decoction at seven a.m. Start with how you brew.
          </p>
        </div>

        <ul className={s.cats} data-stagger>
          {categories.map((c, i) => (
            <li key={c.slug}>
              <Link href={`/shop?category=${c.slug}`} className={s.cat}>
                <span className={s.catMedia}>
                  <Image src={c.image} alt="" fill sizes="(max-width: 640px) 60vw, 20vw" />
                </span>
                <span className={s.catMeta}>
                  <span className={s.catNum}>0{i + 1}</span>
                  <span className={s.catName}>{c.name}</span>
                  <span className={s.catTag}>{c.tagline}</span>
                </span>
                <span className={s.catArrow} aria-hidden="true"><Icon name="arrowUpRight" size={16} /></span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
