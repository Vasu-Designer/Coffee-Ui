import { JourneyAnchor } from '@/components/journey/JourneyAnchor';
import s from './home.module.css';

const quotes = [
  {
    q: 'The Baba Budan tastes like the coffee my grandfather used to bring back from the estate, only cleaner. I have not bought supermarket coffee since.',
    name: 'Ananya Krishnan',
    place: 'Chennai',
    product: 'Baba Budan Giri',
  },
  {
    q: 'Their Mylapore blend makes a decoction thick enough to stand a spoon in. My mother approved, which is the highest honour available.',
    name: 'Rohit Venkatesh',
    place: 'Hyderabad',
    product: 'Mylapore Filter Blend',
  },
  {
    q: 'Roast date stamped by hand, tasting cards that actually help, and a bag that arrived two days after roasting. This is how coffee should be sold.',
    name: 'Sara D’Souza',
    place: 'Goa',
    product: 'Estate Discovery Box',
  },
];

export function Testimonials() {
  return (
    <section className="section" aria-labelledby="love-title">
      <JourneyAnchor id="testimonials" rotate={10} />
      <div className="container">
        <div className={`center ${s.loveHead}`}>
          <p className="eyebrow eyebrow--plain" data-reveal>4.9 ★ from 1,900+ reviews</p>
          <h2 id="love-title" className="h2" data-reveal>
            Letters from <em>the cup</em>
          </h2>
        </div>
        <ul className={s.quotes} data-stagger>
          {quotes.map((t) => (
            <li key={t.name} className={s.quote}>
              <svg className={s.quoteMark} viewBox="0 0 40 32" aria-hidden="true">
                <path d="M0 32V19C0 8.5 5.7 2.2 15.6 0l1.6 4.4C11.3 6 8.6 9.6 8.4 15H16v17H0Zm23 0V19c0-10.5 5.7-16.8 15.6-19l1.4 4.4C34.3 6 31.6 9.6 31.4 15H39v17H23Z" fill="currentColor" />
              </svg>
              <blockquote className={s.quoteText}>{t.q}</blockquote>
              <footer className={s.quoteBy}>
                <span className={s.avatar} aria-hidden="true">
                  {t.name.split(' ').map((n) => n[0]).join('')}
                </span>
                <span>
                  <strong>{t.name}</strong>
                  <small>
                    {t.place} · on {t.product}
                  </small>
                </span>
              </footer>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
