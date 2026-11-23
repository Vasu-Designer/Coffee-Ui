import type { Metadata } from 'next';
import { PostCard } from '@/components/blog/PostCard';
import { NewsletterForm } from '@/components/forms/NewsletterForm';
import { PageHero } from '@/components/ui/PageHero';
import { getPosts } from '@/lib/data';
import styles from './blog.module.css';

export const metadata: Metadata = {
  title: 'Journal — Origin Stories & Brew Guides',
  description: 'Harvest diaries from Indian coffee estates, honest brew guides and notes from the Kaapii roastery in Bengaluru.',
  alternates: { canonical: '/blog' },
};

export const revalidate = 300;

export default async function BlogPage() {
  const posts = await getPosts();
  const [lead, ...rest] = posts;
  const categories = Array.from(new Set(posts.map((p) => p.category)));

  return (
    <>
      <PageHero
        crumbs={[{ label: 'Journal' }]}
        eyebrow="The Kaapii Journal"
        title={[['Stories from', { text: 'the hills', em: true }], ['and the', { text: 'roaster', em: true }]]}
        lede="Harvest diaries, brew guides that actually work, and the occasional strongly held opinion about chicory."
      >
        <ul className={styles.cats}>
          {categories.map((c) => (
            <li key={c} className="chip">{c}</li>
          ))}
        </ul>
      </PageHero>

      <section className="container" style={{ paddingBottom: 'clamp(80px, 10vw, 140px)' }} aria-label="Articles">
        {lead && (
          <div className={styles.lead} data-reveal>
            <PostCard post={lead} size="lg" priority />
          </div>
        )}
        <ul className={styles.grid} data-stagger>
          {rest.map((p, i) => (
            <li key={p.slug} data-offset={i % 3 === 1 || undefined}>
              <PostCard post={p} />
            </li>
          ))}
          <li className={styles.signup}>
            <p className="eyebrow eyebrow--plain">Twice a month</p>
            <p className="h3">
              New stories, <em>in your inbox.</em>
            </p>
            <NewsletterForm id="blog-newsletter" tone="page" />
          </li>
        </ul>
      </section>
    </>
  );
}
