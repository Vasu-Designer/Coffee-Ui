import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PostCard } from '@/components/blog/PostCard';
import { ReadingProgress } from '@/components/blog/ReadingProgress';
import { JsonLd } from '@/components/ui/JsonLd';
import { getPost, getPosts, staticSlugs } from '@/lib/data';
import { formatDate } from '@/lib/format';
import { headingsOf, Markdown } from '@/lib/markdown';
import { absoluteUrl } from '@/lib/site';
import styles from './post.module.css';

type Params = Promise<{ slug: string }>;

export const revalidate = 300;
export const generateStaticParams = staticSlugs.posts;

const cover = (id: string, w = 1200, h = 630) => `https://images.unsplash.com/${id}?w=${w}&h=${h}&fit=crop&auto=format&q=75`;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: 'Not found' };
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    authors: [{ name: post.author }],
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.excerpt,
      url: `/blog/${post.slug}`,
      publishedTime: post.publishedAt,
      authors: [post.author],
      section: post.category,
      images: [{ url: cover(post.cover), width: 1200, height: 630, alt: post.title }],
    },
    twitter: { card: 'summary_large_image', title: post.title, description: post.excerpt, images: [cover(post.cover)] },
  };
}

export default async function PostPage({ params }: { params: Params }) {
  const { slug } = await params;
  const [post, all] = await Promise.all([getPost(slug), getPosts()]);
  if (!post) notFound();
  const more = all.filter((p) => p.slug !== slug).slice(0, 3);
  const toc = headingsOf(post.body);

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: [cover(post.cover, 1600, 900)],
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: { '@type': 'Person', name: post.author },
    publisher: { '@id': absoluteUrl('/#org') },
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
    articleSection: post.category,
    timeRequired: `PT${post.readMinutes}M`,
  };

  return (
    <>
      <JsonLd data={articleLd} />
      <ReadingProgress />
      <article>
        <header className={`container ${styles.head}`}>
          <nav aria-label="Breadcrumb" className={styles.crumbs} data-reveal>
            <Link href="/blog">Journal</Link>
            <span aria-hidden="true">/</span>
            <span>{post.category}</span>
          </nav>
          <h1 className={`h1 ${styles.title}`} data-reveal>{post.title}</h1>
          <p className={styles.excerpt} data-reveal data-delay="0.1">{post.excerpt}</p>
          <p className={styles.meta} data-reveal data-delay="0.2">
            <span className={styles.avatar} aria-hidden="true">{post.author.split(' ').map((n) => n[0]).join('')}</span>
            <span>
              By <strong>{post.author}</strong>
              <br />
              <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time> · {post.readMinutes} min read
            </span>
          </p>
        </header>

        <div className={`container ${styles.coverWrap}`}>
          <div className={`media ${styles.cover}`} data-reveal="clip">
            <Image src={post.cover} alt="" fill priority sizes="(max-width: 1400px) 94vw, 1360px" quality={80} />
          </div>
        </div>

        <div className={`container ${styles.layout}`}>
          {toc.length > 0 && (
            <aside className={styles.toc} aria-label="In this story">
              <p className="eyebrow eyebrow--plain">In this story</p>
              <ol>
                {toc.map((h) => (
                  <li key={h.id}><a href={`#${h.id}`}>{h.text}</a></li>
                ))}
              </ol>
            </aside>
          )}
          <div className={styles.prose}>
            <Markdown source={post.body} />
            <footer className={styles.sign}>
              <span>— {post.author}</span>
              <Link href="/blog" className="link-underline">Back to the journal</Link>
            </footer>
          </div>
        </div>
      </article>

      {more.length > 0 && (
        <section className={`section ${styles.more}`} aria-labelledby="more-title">
          <div className="container">
            <h2 id="more-title" className="h2" data-reveal>Keep <em>reading</em></h2>
            <ul className={styles.moreGrid} data-stagger>
              {more.map((p) => <li key={p.slug}><PostCard post={p} /></li>)}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
