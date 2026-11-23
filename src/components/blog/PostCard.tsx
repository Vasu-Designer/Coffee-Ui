import Image from 'next/image';
import Link from 'next/link';
import type { Post } from '@/data';
import { formatDate } from '@/lib/format';
import styles from './PostCard.module.css';

export function PostCard({ post, size = 'md', priority }: { post: Post; size?: 'lg' | 'md' | 'sm'; priority?: boolean }) {
  return (
    <article className={styles.card} data-size={size}>
      <Link href={`/blog/${post.slug}`} className={styles.link}>
        <div className={styles.media}>
          <Image
            src={post.cover}
            alt=""
            fill
            priority={priority}
            sizes={size === 'lg' ? '(max-width: 900px) 92vw, 58vw' : '(max-width: 900px) 92vw, 30vw'}
          />
          <span className={`chip ${styles.cat}`}>{post.category}</span>
        </div>
        <div className={styles.body}>
          <p className={styles.meta}>
            <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
            <span aria-hidden="true">·</span>
            <span>{post.readMinutes} min read</span>
          </p>
          <h3 className={styles.title}>{post.title}</h3>
          {size !== 'sm' && <p className={styles.excerpt}>{post.excerpt}</p>}
        </div>
      </Link>
    </article>
  );
}
