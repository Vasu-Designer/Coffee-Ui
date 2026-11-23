import Image from 'next/image';
import Link from 'next/link';
import { img } from '@/data';
import { Icon } from '@/components/ui/Icon';

export default function NotFound() {
  return (
    <section
      className="container"
      style={{
        minHeight: '88vh',
        paddingTop: 'calc(var(--header-h) + 48px)',
        paddingBottom: 80,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
        gap: 'clamp(32px, 6vw, 96px)',
        alignItems: 'center',
      }}
    >
      <div className="stack-m">
        <p className="eyebrow">Error 404</p>
        <h1 className="h1">
          This cup is <em>empty.</em>
        </h1>
        <p className="lede">The page you’re after has been moved, finished, or perhaps never brewed. Let’s get you somewhere warmer.</p>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center' }}>
          <Link href="/shop" className="btn">
            Shop coffee <span className="btn-arrow"><Icon name="arrow" size={14} /></span>
          </Link>
          <Link href="/" className="link-underline">Back home</Link>
        </div>
      </div>
      <div className="media media--arch" style={{ aspectRatio: '4 / 5', maxWidth: 440, width: '100%', justifySelf: 'center' }}>
        <Image src={img.blackShadow} alt="An empty coffee cup casting a long shadow" fill sizes="440px" />
      </div>
    </section>
  );
}
