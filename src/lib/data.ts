import {
  categories,
  collections,
  faqs,
  posts,
  products,
  type Category,
  type Collection,
  type Faq,
  type Post,
  type Product,
} from '@/data';

/**
 * Data access for the UI. Everything is read from the local mock data in
 * `src/data` — there is no backend or API to configure. The functions stay
 * async so they can later be swapped for real fetch calls without touching pages.
 */

export type ProductDTO = Product & { categoryName?: string };
export type CategoryDTO = Category & { productCount?: number };

const withCategoryName = (p: Product): ProductDTO => ({
  ...p,
  categoryName: categories.find((c) => c.slug === p.categorySlug)?.name,
});

export interface ProductQuery {
  category?: string;
  roast?: string;
  sort?: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
  featured?: boolean;
  q?: string;
  limit?: number;
}

export async function getProducts(q: ProductQuery = {}): Promise<ProductDTO[]> {
  let list = products.map(withCategoryName);
  if (q.category) list = list.filter((p) => p.categorySlug === q.category);
  if (q.roast) list = list.filter((p) => p.roast === q.roast);
  if (q.featured) list = list.filter((p) => p.featured);
  if (q.q) {
    const needle = q.q.toLowerCase();
    list = list.filter((p) =>
      [p.name, p.subtitle, p.region ?? '', ...p.notes].some((s) => s.toLowerCase().includes(needle)),
    );
  }
  const price = (p: Product) => p.variants[0]?.price ?? 0;
  switch (q.sort) {
    case 'price-asc': list.sort((a, b) => price(a) - price(b)); break;
    case 'price-desc': list.sort((a, b) => price(b) - price(a)); break;
    case 'rating': list.sort((a, b) => b.rating - a.rating); break;
    case 'newest': list.sort((a, b) => Number(b.isNew) - Number(a.isNew)); break;
    default: list.sort((a, b) => Number(b.featured) - Number(a.featured) || b.reviewCount - a.reviewCount);
  }
  return q.limit ? list.slice(0, q.limit) : list;
}

export async function getProduct(slug: string): Promise<{ product: ProductDTO; related: ProductDTO[] } | null> {
  const product = products.find((p) => p.slug === slug);
  if (!product) return null;
  const related = products
    .filter((p) => p.slug !== slug)
    .sort((a, b) => Number(b.categorySlug === product.categorySlug) - Number(a.categorySlug === product.categorySlug))
    .slice(0, 4)
    .map(withCategoryName);
  return { product: withCategoryName(product), related };
}

export async function getCategories(): Promise<CategoryDTO[]> {
  return categories.map((c) => ({
    ...c,
    productCount: products.filter((p) => p.categorySlug === c.slug).length,
  }));
}

export async function getCollections(): Promise<Collection[]> {
  return collections;
}

export async function getCollection(slug: string): Promise<{ collection: Collection; products: ProductDTO[] } | null> {
  const collection = collections.find((c) => c.slug === slug);
  if (!collection) return null;
  const items = collection.productSlugs
    .map((s) => products.find((p) => p.slug === s))
    .filter((p): p is Product => Boolean(p))
    .map(withCategoryName);
  return { collection, products: items };
}

export async function getPosts(): Promise<Post[]> {
  return [...posts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export async function getPost(slug: string): Promise<Post | null> {
  return posts.find((p) => p.slug === slug) ?? null;
}

export async function getFaqs(): Promise<Faq[]> {
  return faqs;
}

/** Slugs for static generation. */
export const staticSlugs = {
  products: () => products.map((p) => ({ slug: p.slug })),
  collections: () => collections.map((c) => ({ slug: c.slug })),
  posts: () => posts.map((p) => ({ slug: p.slug })),
};
