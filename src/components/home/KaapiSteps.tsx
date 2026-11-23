import Image from 'next/image';
import Link from 'next/link';
import { img } from '@/data';
import { JourneyAnchor } from '@/components/journey/JourneyAnchor';
import { Edge } from '@/components/ui/Edge';
import { Icon } from '@/components/ui/Icon';
import s from './home.module.css';

const steps = [
  { t: 'Pack', d: 'Three heaped spoons of fine Mylapore blend into the upper chamber. Press gently with the disc.' },
  { t: 'Drip', d: 'Pour just-boiled water over the disc, close the lid and leave it alone for fifteen unhurried minutes.' },
  { t: 'Pour', d: 'One part decoction to three parts boiled milk. Sweeten, then pour tumbler to dabarah from a height.' },
];

export function KaapiSteps() {
  return (
    <>
      <Edge variant={2} />
      <section className={`band ${s.kaapi}`} aria-labelledby="kaapi-title">
        <div className={`container ${s.kaapiGrid}`}>
          <div className={s.kaapiCopy}>
            <p className="eyebrow" data-reveal>The Kaapi Ritual</p>
            <h2 id="kaapi-title" className="h2" data-reveal>
              Our grandmothers never <em>measured.</em> We wrote it down anyway.
            </h2>
            <ol className={s.steps} data-stagger>
              {steps.map((st, i) => (
                <li key={st.t} className={s.step}>
                  <span className={s.stepNum}>{i + 1}</span>
                  <div>
                    <h3 className={s.stepTitle}>{st.t}</h3>
                    <p>{st.d}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className={s.kaapiCtas} data-reveal>
              <Link href="/collections/the-kaapi-ritual" className="btn btn--cream">
                Shop the ritual
                <span className="btn-arrow"><Icon name="arrow" size={14} /></span>
              </Link>
              <Link href="/blog/how-to-brew-south-indian-filter-coffee" className="link-underline">Full brew guide</Link>
            </div>
          </div>
          <div className={s.kaapiMedia}>
            <div className={`media media--arch ${s.kaapiMain}`} data-reveal="clip">
              <Image src={img.pourIntoCup} alt="Coffee poured from height into a cup, frothing at the top" fill sizes="(max-width: 900px) 90vw, 40vw" />
            </div>
            <div className={`media media--round ${s.kaapiRound}`} data-parallax="0.3">
              <Image src={img.groundsBowl} alt="Freshly ground coffee in a bowl" fill sizes="200px" />
            </div>
            <JourneyAnchor id="kaapi" rotate={-6} />
          </div>
        </div>
      </section>
      <Edge position="bottom" variant={2} />
    </>
  );
}
