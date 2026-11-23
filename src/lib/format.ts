const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

export const formatPrice = (rupees: number) => inr.format(rupees);

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

export const roastLabel: Record<string, string> = {
  light: 'Light',
  medium: 'Medium',
  'medium-dark': 'Medium-dark',
  dark: 'Dark',
};

export const roastScale: Record<string, number> = { light: 1, medium: 2, 'medium-dark': 3, dark: 4 };

export const FREE_SHIPPING_THRESHOLD = 999;
export const FLAT_SHIPPING = 79;
export const shippingFor = (subtotal: number) =>
  subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING;
