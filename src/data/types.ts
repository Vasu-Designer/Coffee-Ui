export type Roast = 'light' | 'medium' | 'medium-dark' | 'dark';
export type ProductKind = 'coffee' | 'gear' | 'gift';

export interface Variant {
  id?: string;
  label: string;
  grams?: number | null;
  price: number; // INR, whole rupees
}

export interface Category {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  position: number;
}

export interface Collection {
  slug: string;
  name: string;
  kicker: string;
  description: string;
  image: string;
  productSlugs: string[];
}

export interface Product {
  id?: string;
  slug: string;
  name: string;
  subtitle: string;
  kind: ProductKind;
  categorySlug: string;
  origin?: string | null;
  region?: string | null;
  altitude?: string | null;
  process?: string | null;
  varietal?: string | null;
  roast?: Roast | null;
  notes: string[];
  description: string;
  story: string;
  brewTips: string[];
  images: string[];
  variants: Variant[];
  featured: boolean;
  isNew: boolean;
  rating: number;
  reviewCount: number;
}

export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  readMinutes: number;
  publishedAt: string; // ISO date
  cover: string;
  body: string; // lightweight markdown: paragraphs, ## headings, > quotes
}

export interface Faq {
  group: string;
  question: string;
  answer: string;
  position: number;
}
