# Kaapii — Coffee UI

A premium, fully responsive specialty-coffee storefront built with **Next.js 15 (App Router)**, **TypeScript**, **GSAP + ScrollTrigger** and **Lenis** smooth scrolling.

This is the **UI-only edition**: there is no backend, database or API to configure. All products, collections, journal posts and FAQs come from local mock data in [`src/data`](src/data), and the cart, checkout, contact and newsletter forms are simulated in the browser.

## Getting started

Requires Node.js 20 or newer.

```bash
npm install
npm run dev        # http://localhost:3000
```

Production build:

```bash
npm run build
npm run start      # http://localhost:3000
```

## What's inside

| Page | Route |
| --- | --- |
| Home (hero slider, scroll-driven coffee bean journey) | `/` |
| Shop with filters, sorting and search | `/shop` |
| Product details | `/shop/[slug]` |
| Collections | `/collections`, `/collections/[slug]` |
| Journal (blog) | `/blog`, `/blog/[slug]` |
| About, Contact, FAQ | `/about`, `/contact`, `/faq` |
| Cart and demo checkout | `/cart` |

- **Light & dark themes:** a latte/espresso switch, remembered per device.
- **Cart:** stored in `localStorage`; checkout returns a mock order number.
- **Forms:** contact and newsletter forms validate input and show a success state; nothing is sent.
- **SEO:** metadata, Open Graph image, JSON-LD, `sitemap.xml` and `robots.txt`.
- **Accessibility:** keyboard-friendly slider and menus, reduced-motion support.

## Mock data

| File | Contents |
| --- | --- |
| `src/data/catalog.ts` | Products, categories, collections |
| `src/data/editorial.ts` | Journal posts, FAQs, testimonials |
| `src/data/images.ts` | Photography (Unsplash CDN) |
| `src/data/types.ts` | Shared TypeScript types |

Pages read this data through [`src/lib/data.ts`](src/lib/data.ts). Its functions are async, so you can later replace them with real `fetch` calls without changing any page.
`src/lib/mock.ts` holds the simulated form submission and order placement.

## Project structure

```
public/cutouts/     transparent coffee cut-outs used in the hero and bean journey
src/app/            routes (App Router)
src/components/     UI: layout, home sections, product, cart, forms, motion
src/data/           mock data
src/lib/            data access, mocks, formatting, GSAP helpers
```
