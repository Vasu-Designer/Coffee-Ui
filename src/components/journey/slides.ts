/** The three hero "coffee experiences": copy, links and cut-out cup photography. */
export interface HeroSlide {
  key: 'espresso' | 'iced' | 'coldbrew';
  label: string;
  kicker: string;
  title: (string | { text: string; em: true })[][];
  description: string;
  meta: string[];
  cta: { href: string; label: string };
  secondary: { href: string; label: string };
  /** `fit` = cup height as a fraction of the hero stage, so the three read at believable relative sizes. */
  cup: {
    src: string;
    alt: string;
    width: number;
    height: number;
    fit: number;
    /** Smaller variant for phones (see scripts/resize-cutouts.mjs) and the rendered width hint for srcset. */
    sm: { src: string; width: number };
    sizes: string;
  };
  hot: boolean;
}

export const heroSlides: HeroSlide[] = [
  {
    key: 'espresso',
    label: 'Hot Espresso',
    kicker: 'No. 01 · Pulled at 93°C',
    title: [['A short pour'], ['of something', { text: 'serious.', em: true }]],
    description:
      'Our Night Shift blend, pulled slow: dark cherry, molasses and a crema thick enough to hold a spoon of sugar for a heartbeat.',
    meta: ['18 g in', '38 g out', '28 seconds'],
    cta: { href: '/shop?category=espresso', label: 'Shop espresso' },
    secondary: { href: '/shop/night-shift-espresso', label: 'Night Shift blend' },
    cup: { src: '/cutouts/cup-espresso.webp', alt: 'A white cup of hot espresso on a saucer', width: 1183, height: 640, fit: 0.56, sm: { src: '/cutouts/cup-espresso-sm.webp', width: 720 }, sizes: 'min(90vw, 48vh)' },
    hot: true,
  },
  {
    key: 'iced',
    label: 'Iced Coffee',
    kicker: 'No. 02 · Over ice, slowly',
    title: [['Cold milk,'], ['warm', { text: 'caramel', em: true }], [{ text: 'clouds.', em: true }]],
    description:
      'Araku Valley natural poured over ice and cold milk: blueberry, cacao and a long, creamy finish for the hottest afternoons.',
    meta: ['Double shot', '1 : 3 milk', '300 ml glass'],
    cta: { href: '/shop/araku-valley-natural', label: 'Shop Araku natural' },
    secondary: { href: '/blog/pour-over-ratios-we-actually-use', label: 'Our iced recipe' },
    cup: { src: '/cutouts/cup-iced.webp', alt: 'A tall glass of iced coffee with milk swirling through the ice', width: 484, height: 887, fit: 0.9, sm: { src: '/cutouts/cup-iced-sm.webp', width: 300 }, sizes: 'min(43vw, 23vh)' },
    hot: false,
  },
  {
    key: 'coldbrew',
    label: 'Signature Cold Brew',
    kicker: 'No. 03 · Steeped 18 hours',
    title: [['Eighteen hours'], ['in the', { text: 'dark.', em: true }]],
    description:
      'Monsooned Malabar steeped cold overnight: smooth, chocolate-heavy and almost free of bitterness. Our summer obsession, poured over clear ice.',
    meta: ['18 h steep', '1 : 8 ratio', 'Served on ice'],
    cta: { href: '/shop/monsooned-malabar-aa', label: 'Shop Monsooned Malabar' },
    secondary: { href: '/blog/what-the-monsoon-does-to-a-coffee-bean', label: 'Why monsooned?' },
    cup: { src: '/cutouts/cup-coldbrew.webp', alt: 'A glass of cold brew coffee over large ice cubes', width: 442, height: 582, fit: 0.74, sm: { src: '/cutouts/cup-coldbrew-sm.webp', width: 360 }, sizes: 'min(49vw, 26vh)' },
    hot: false,
  },
];
