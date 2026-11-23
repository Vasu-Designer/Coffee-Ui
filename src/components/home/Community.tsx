import Image from 'next/image';
import { img } from '@/data';
import { NewsletterForm } from '@/components/forms/NewsletterForm';
import { JourneyAnchor } from '@/components/journey/JourneyAnchor';
import s from './home.module.css';

export function Community() {
  return (
    <section className={s.community} aria-labelledby="community-title">
      <div className={`container ${s.communityInner}`}>
        <JourneyAnchor id="community" rotate={-10} />
        <div className={`${s.floatImg} ${s.floatA}`} data-parallax="0.35" aria-hidden="true">
          <Image src={img.beansClose} alt="" fill sizes="220px" />
        </div>
        <div className={`${s.floatImg} ${s.floatB}`} data-parallax="0.55" aria-hidden="true">
          <Image src={img.espressoGlass} alt="" fill sizes="180px" />
        </div>
        <div className={s.communityCopy}>
          <p className="eyebrow eyebrow--plain" data-reveal>The Saturday Cupping Club</p>
          <h2 id="community-title" className="h1" data-reveal>
            Pull up a stool. <em>Taste with us.</em>
          </h2>
          <p className="lede" data-reveal style={{ marginInline: 'auto' }}>
            Join 12,000 coffee people who get our roast notes, early access to micro-lots and an invitation to the
            free Saturday cupping at our Indiranagar roastery.
          </p>
          <div data-reveal style={{ display: 'flex', justifyContent: 'center' }}>
            <NewsletterForm id="community-newsletter" tone="page" />
          </div>
        </div>
      </div>
    </section>
  );
}
