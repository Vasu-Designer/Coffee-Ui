import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { img } from '@/data';
import { SplitWords } from '@/components/motion/SplitWords';
import { Edge } from '@/components/ui/Edge';
import { Icon } from '@/components/ui/Icon';
import styles from './about.module.css';

export const metadata: Metadata = {
  title: 'Our Story',
  description: 'How a borrowed roaster and one estate in Chikmagalur became Kaapii, a Bengaluru roastery buying directly from six Indian coffee estates.',
  alternates: { canonical: '/about' },
};

const timeline = [
  { year: '2019', title: 'A borrowed roaster', body: 'Meera and Kabir roast their first 2 kg of Baba Budan Giri on a friend’s sample roaster in a Jayanagar garage.' },
  { year: '2020', title: 'One estate, one handshake', body: 'The Gowda family agree to sell us their best lot directly. We pay before harvest, a practice we have never dropped.' },
  { year: '2022', title: 'Indiranagar roastery', body: 'A 6 kg Turkish drum roaster, a cupping table and a tasting room that opens onto 12th Main.' },
  { year: '2024', title: 'Six partner estates', body: 'From the Nilgiris to Araku, every relationship visited, every harvest tasted at origin.' },
  { year: '2026', title: 'Carbon-light shipping', body: 'Compostable valve bags and consolidated dispatch: three roast days, one courier run each.' },
];

const numbers = [
  { n: '2.3×', l: 'Average price paid above the commodity market' },
  { n: '06', l: 'Partner estates, every one visited each harvest' },
  { n: '41 t', l: 'Green coffee roasted by hand in 2025' },
  { n: '0', l: 'Middlemen between the estate and your cup' },
];

export default function AboutPage() {
  return (
    <>
      <section className={`band ${styles.hero}`}>
        <div className={`container ${styles.heroGrid}`}>
          <div className={styles.heroCopy}>
            <p className="eyebrow" data-reveal style={{ color: 'var(--brass-300)' }}>Our story</p>
            <SplitWords
              as="h1"
              className="h1"
              lines={['We began with', ['one estate', { text: 'and', em: true }], [{ text: 'a borrowed', em: true }, 'roaster.']]}
            />
            <p className="lede" data-reveal data-delay="0.2" style={{ color: 'var(--band-ink-2)' }}>
              Kaapii is a small roastery in Bengaluru, run by two people who grew up on filter coffee and fell, later,
              for the extraordinary single-estate lots being grown a few hours from home.
            </p>
          </div>
          <div className={styles.heroCollage}>
            <div className={`media ${styles.collageA}`} data-reveal="clip">
              <Image src={img.cherriesHands} alt="Hands holding freshly picked red coffee cherries" fill priority sizes="(max-width: 900px) 60vw, 28vw" />
            </div>
            <div className={`media ${styles.collageB}`} data-reveal="clip" data-delay="0.2">
              <Image src={img.roaster} alt="Freshly roasted beans tumbling into the cooling tray" fill sizes="(max-width: 900px) 50vw, 22vw" />
            </div>
          </div>
        </div>
      </section>
      <Edge position="bottom" />

      <section className="section" aria-labelledby="letter-title">
        <div className={`container ${styles.letter}`}>
          <h2 id="letter-title" className="sr-only">A letter from the founders</h2>
          <p className={styles.letterText} data-reveal>
            “India grows some of the most interesting coffee in the world, and almost all of it leaves the country as a
            commodity. We wanted to roast it with the care it deserves, and to pay the people who grow it what it’s
            actually worth.”
          </p>
          <p className={styles.letterBy} data-reveal>
            <span className={styles.sig}>Meera Rao &amp; Kabir Menon</span>
            <span className="muted small">Founders, Q-graders, recovering software engineers</span>
          </p>
        </div>
      </section>

      <section className={styles.wide} aria-hidden="true">
        <div className={styles.wideMedia} data-scale>
          <Image src={img.pourStation} alt="" fill sizes="100vw" />
        </div>
        <p className={`container ${styles.wideCaption}`}>The brew bar at our Indiranagar roastery, 7:40 a.m.</p>
      </section>

      <section className="section" aria-labelledby="timeline-title">
        <div className="container">
          <div className={styles.timelineHead}>
            <p className="eyebrow" data-reveal>Seven harvests in</p>
            <h2 id="timeline-title" className="h2" data-reveal>
              Slowly, <em>then all at once</em>
            </h2>
          </div>
          <ol className={styles.timeline} data-stagger>
            {timeline.map((t) => (
              <li key={t.year} className={styles.tItem}>
                <span className={styles.tYear}>{t.year}</span>
                <h3 className={styles.tTitle}>{t.title}</h3>
                <p>{t.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={`section ${styles.numbersSection}`} aria-labelledby="numbers-title">
        <div className={`container ${styles.numbersGrid}`}>
          <div>
            <p className="eyebrow" data-reveal>Sourcing, in numbers</p>
            <h2 id="numbers-title" className="h2" data-reveal>
              Transparent <em>by default</em>
            </h2>
            <p className="lede" data-reveal style={{ marginTop: 24 }}>
              We publish what we pay every estate, every year. Ask us at the roastery and we will show you the invoices.
            </p>
          </div>
          <dl className={styles.numbers} data-stagger>
            {numbers.map((x) => (
              <div key={x.l}>
                <dt>{x.n}</dt>
                <dd>{x.l}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="section" aria-labelledby="visit-title">
        <div className={`container ${styles.visit}`}>
          <div className={`media media--arch ${styles.visitMedia}`} data-reveal="clip">
            <Image src={img.cafeShelves} alt="Shelves of coffee and brewing equipment at the roastery" fill sizes="(max-width: 900px) 80vw, 36vw" />
          </div>
          <div className={styles.visitCopy}>
            <p className="eyebrow" data-reveal>Come say hello</p>
            <h2 id="visit-title" className="h2" data-reveal>
              Saturday cuppings, <em>on the house</em>
            </h2>
            <p className="lede" data-reveal>
              Every Saturday at 11 we set out the week’s roasts on the cupping table and taste them together. Twelve
              stools, no expertise required, free filter kaapi afterwards.
            </p>
            <div data-reveal style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
              <Link href="/contact?topic=Roastery%20visit" className="btn">
                Book a stool
                <span className="btn-arrow"><Icon name="arrow" size={14} /></span>
              </Link>
              <Link href="/shop" className="link-underline">Or shop the roasts</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
