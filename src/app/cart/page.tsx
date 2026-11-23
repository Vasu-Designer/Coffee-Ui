import type { Metadata } from 'next';
import { CartView } from '@/components/cart/CartView';
import { PageHero } from '@/components/ui/PageHero';

export const metadata: Metadata = {
  title: 'Your Bag',
  description: 'Review your Kaapii order: freshly roasted coffee, dispatched within 24 hours.',
  robots: { index: false, follow: true },
  alternates: { canonical: '/cart' },
};

export default function CartPage() {
  return (
    <>
      <PageHero crumbs={[{ label: 'Bag' }]} title={[['Your', { text: 'bag', em: true }]]} />
      <section className="container" style={{ paddingBottom: 'clamp(80px, 10vw, 140px)' }}>
        <CartView />
      </section>
    </>
  );
}
