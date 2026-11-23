import Image from 'next/image';
import Link from 'next/link';
import { img } from '@/data';
import { JourneyAnchor } from '@/components/journey/JourneyAnchor';
import { SplitWords } from '@/components/motion/SplitWords';
import s from './home.module.css';

const estates = [
  { name: 'Thogarihunkal', region: 'Chikmagalur', alt: '1,450 m', note: 'Washed SL795' },
  { name: 'Kodanad', region: 'Nilgiris', alt: '1,750 m', note: 'Washed Chandragiri' },
  { name: 'Araku co-operative', region: 'Eastern Ghats', alt: '1,000 m', note: 'Natural' },
  { name: 'Grange', region: 'Shevaroy Hills', alt: '1,400 m', note: 'Peaberry' },
  { name: 'Riverbend', region: 'Coorg', alt: '1,100 m', note: 'Swiss Water decaf' },
  { name: 'Malabar warehouses', region: 'Mangalore coast', alt: 'Sea level', note: 'Monsooned' },
];

export function Origins() {
  return (
    <section className="section" aria-labelledby="origins-title">
      <div className={`container ${s.origins}`}>
        <div className={s.originsMedia}>
          <div className={`media ${s.originsMain}`} data-reveal="clip">
            <Image src={img.estate} alt="A planter’s bungalow in the shade of a Coorg coffee estate" fill sizes="(max-width: 900px) 92vw, 50vw" data-parallax="0.1" />
          </div>
          <div className={`media ${s.originsInset}`} data-reveal="clip" data-delay="0.2">
            <Image src={img.greenCherries} alt="Green coffee cherries ripening on the branch in Mekanagadde" fill sizes="240px" />
          </div>
          <JourneyAnchor id="origins" rotate={-12} />
          <p className={s.originsCaption} data-reveal data-delay="0.3">
            Fig. 1 — Shade-grown arabica under silver oak, Kodagu.
          </p>
        </div>

        <div className={s.originsCopy}>
          <p className="eyebrow" data-reveal>Where it grows</p>
          <SplitWords id="origins-title" className="h2" lines={['Six estates,', [{ text: 'two mountain', em: true }], [{ text: 'ranges', em: true }, 'apart.']]} />
          <p className="lede" data-reveal>
            India grows some of the world’s only shade-grown coffee, under pepper vines, jackfruit and silver oak.
            Slow ripening in that dappled light is why our cups taste sweet before they taste bright.
          </p>

          <ol className={s.estates} data-stagger>
            {estates.map((e, i) => (
              <li key={e.name} className={s.estate}>
                <span className={s.estateNum}>{String(i + 1).padStart(2, '0')}</span>
                <span className={s.estateName}>
                  {e.name}
                  <small>{e.region}</small>
                </span>
                <span className={s.estateNote}>{e.note}</span>
                <span className={`${s.estateAlt} tabular`}>{e.alt}</span>
              </li>
            ))}
          </ol>
          <Link href="/about" className="link-underline" data-reveal>Read our sourcing report</Link>
        </div>
      </div>
    </section>
  );
}
