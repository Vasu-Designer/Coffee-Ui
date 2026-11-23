import Link from 'next/link';
import type { Post } from '@/data';
import { PostCard } from '@/components/blog/PostCard';
import { JourneyAnchor } from '@/components/journey/JourneyAnchor';
import { Icon } from '@/components/ui/Icon';
import s from './home.module.css';

export function JournalTeaser({ posts }: { posts: Post[] }) {
  const [lead, ...rest] = posts;
  if (!lead) return null;
  return (
    <section className="section" aria-labelledby="journal-title">
      <div className="container">
        <div className={s.headRow}>
          <div>
            <p className="eyebrow" data-reveal>The Journal</p>
            <h2 id="journal-title" className="h2" data-reveal>
              Notes from <em>origin</em> &amp; roastery
            </h2>
          </div>
          <Link href="/blog" className="btn btn--ghost btn--sm" data-reveal>
            All stories
            <span className="btn-arrow"><Icon name="arrow" size={14} /></span>
          </Link>
          <JourneyAnchor id="journal" rotate={12} />
        </div>
        <div className={s.journalGrid}>
          <div data-reveal>
            <PostCard post={lead} size="lg" />
          </div>
          <div className={s.journalSide} data-stagger>
            {rest.slice(0, 2).map((p) => (
              <PostCard key={p.slug} post={p} size="sm" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
