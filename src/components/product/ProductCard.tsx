import Image from 'next/image';
import Link from 'next/link';
import type { ProductDTO } from '@/lib/data';
import { formatPrice, roastLabel } from '@/lib/format';
import { Icon } from '@/components/ui/Icon';
import styles from './ProductCard.module.css';

export function ProductCard({
  product,
  priority = false,
  sizes = '(max-width: 640px) 80vw, (max-width: 1080px) 45vw, 25vw',
  index,
}: {
  product: ProductDTO;
  priority?: boolean;
  sizes?: string;
  index?: number;
}) {
  const from = Math.min(...product.variants.map((v) => v.price));
  const multiple = product.variants.length > 1;
  const [primary, secondary] = product.images;

  return (
    <article className={styles.card}>
      <Link href={`/shop/${product.slug}`} className={styles.link}>
        <div className={styles.media}>
          <Image src={primary} alt={`${product.name} — ${product.subtitle}`} fill sizes={sizes} priority={priority} className={styles.img} />
          {secondary && <Image src={secondary} alt="" fill sizes={sizes} className={`${styles.img} ${styles.alt}`} />}
          <div className={styles.badges}>
            {product.isNew && <span className="chip chip--accent">New harvest</span>}
            {product.roast && <span className={`chip ${styles.glass}`}>{roastLabel[product.roast]} roast</span>}
          </div>
          <span className={styles.go} aria-hidden="true">
            <Icon name="arrowUpRight" size={18} />
          </span>
          {typeof index === 'number' && <span className={styles.index} aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>}
        </div>
        <div className={styles.body}>
          <div className={styles.row}>
            <h3 className={styles.name}>{product.name}</h3>
            <p className={`${styles.price} tabular`}>
              {multiple && <span className="muted">from </span>}
              {formatPrice(from)}
            </p>
          </div>
          <p className={styles.sub}>{product.subtitle}</p>
          <p className={styles.notes}>{product.notes.join(' · ')}</p>
        </div>
      </Link>
    </article>
  );
}
