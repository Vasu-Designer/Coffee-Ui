export const site = {
  name: 'Kaapii',
  legalName: 'Kaapii Roasting Co.',
  tagline: 'Single-estate Indian coffee, roasted by hand in Bengaluru.',
  description:
    'Kaapii is a small-batch specialty coffee roaster in Bengaluru. We buy directly from estates in Chikmagalur, Coorg, Araku and the Nilgiris and roast to order three days a week.',
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, ''),
  email: 'hello@kaapii.coffee',
  phone: '+91 80 4567 2019',
  address: {
    street: '14, 12th Main, HAL 2nd Stage, Indiranagar',
    city: 'Bengaluru',
    region: 'Karnataka',
    postcode: '560038',
    country: 'IN',
  },
  hours: 'Tue–Sun · 8 am – 7 pm',
  social: {
    instagram: 'https://instagram.com/kaapii.coffee',
    youtube: 'https://youtube.com/@kaapii',
    spotify: 'https://open.spotify.com/user/kaapii',
  },
  nav: [
    { href: '/shop', label: 'Shop' },
    { href: '/collections', label: 'Collections' },
    { href: '/about', label: 'Our Story' },
    { href: '/blog', label: 'Journal' },
    { href: '/contact', label: 'Visit' },
  ],
} as const;

export const absoluteUrl = (path = '/') => `${site.url}${path.startsWith('/') ? path : `/${path}`}`;
