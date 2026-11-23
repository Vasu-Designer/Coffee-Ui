import type { Metadata } from 'next';
import { CategoryStrip } from '@/components/home/CategoryStrip';
import { Community } from '@/components/home/Community';
import { Hero } from '@/components/home/Hero';
import { JournalTeaser } from '@/components/home/JournalTeaser';
import { KaapiSteps } from '@/components/home/KaapiSteps';
import { Manifesto } from '@/components/home/Manifesto';
import { Origins } from '@/components/home/Origins';
import { ProductRail } from '@/components/home/ProductRail';
import { Ritual } from '@/components/home/Ritual';
import { Testimonials } from '@/components/home/Testimonials';
import { BeanJourney } from '@/components/journey/BeanJourney';
import { Edge } from '@/components/ui/Edge';
import { getCategories, getPosts, getProducts } from '@/lib/data';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

export const revalidate = 300;

export default async function HomePage() {
  const [categories, featured, posts] = await Promise.all([
    getCategories(),
    getProducts({ featured: true, limit: 7 }),
    getPosts(),
  ]);

  return (
    <>
      <Hero />
      <CategoryStrip categories={categories} />
      <Manifesto />
      <Edge />
      <ProductRail products={featured} />
      <Edge position="bottom" variant={2} />
      <Origins />
      <Ritual />
      <Testimonials />
      <KaapiSteps />
      <JournalTeaser posts={posts.slice(0, 3)} />
      <Community />
      {/* Last, so every section (and its pinned triggers) exists before the journey measures them. */}
      <BeanJourney />
    </>
  );
}
