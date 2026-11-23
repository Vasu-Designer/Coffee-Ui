'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { shippingFor } from '@/lib/format';
import { mockPlaceOrder } from '@/lib/mock';

export interface CartLine {
  productSlug: string;
  name: string;
  subtitle: string;
  image: string | null;
  variantLabel: string;
  grind: string;
  price: number;
  quantity: number;
}

export interface CheckoutDetails {
  name: string;
  email: string;
  phone?: string;
  address: string;
  city: string;
  postcode: string;
}

interface CartContextValue {
  lines: CartLine[];
  count: number;
  subtotal: number;
  shipping: number;
  total: number;
  ready: boolean;
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  add: (line: Omit<CartLine, 'quantity'>, quantity?: number) => void;
  setQuantity: (line: CartLine, quantity: number) => void;
  clear: () => void;
  checkout: (details: CheckoutDetails) => Promise<{ number: string; total: number }>;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = 'kaapii.cart.v1';
const MAX_QTY = 24;

export const lineKey = (l: Pick<CartLine, 'productSlug' | 'variantLabel' | 'grind'>) =>
  `${l.productSlug}|${l.variantLabel}|${l.grind}`;

/** Client-side cart: kept in React state and saved to localStorage. No server involved. */
export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Restore the bag saved on this device.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setLines((JSON.parse(raw) as { lines?: CartLine[] }).lines ?? []);
    } catch {
      /* storage unavailable or corrupt */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ lines }));
    } catch {
      /* ignore */
    }
  }, [lines, ready]);

  const add = useCallback<CartContextValue['add']>((line, quantity = 1) => {
    setLines((prev) => {
      const key = lineKey(line);
      const existing = prev.find((l) => lineKey(l) === key);
      if (existing) {
        return prev.map((l) => (lineKey(l) === key ? { ...l, quantity: Math.min(MAX_QTY, l.quantity + quantity) } : l));
      }
      return [...prev, { ...line, quantity: Math.min(MAX_QTY, quantity) }];
    });
    setDrawerOpen(true);
  }, []);

  const setQuantity = useCallback<CartContextValue['setQuantity']>((line, quantity) => {
    const q = Math.max(0, Math.min(MAX_QTY, quantity));
    setLines((prev) =>
      q === 0
        ? prev.filter((l) => lineKey(l) !== lineKey(line))
        : prev.map((l) => (lineKey(l) === lineKey(line) ? { ...l, quantity: q } : l)),
    );
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartContextValue>(() => {
    const subtotal = lines.reduce((s, l) => s + l.price * l.quantity, 0);
    const shipping = shippingFor(subtotal);
    const total = subtotal + shipping;
    return {
      lines,
      count: lines.reduce((n, l) => n + l.quantity, 0),
      subtotal,
      shipping,
      total,
      ready,
      drawerOpen,
      openDrawer: () => setDrawerOpen(true),
      closeDrawer: () => setDrawerOpen(false),
      add,
      setQuantity,
      clear,
      // Demo checkout: returns a mock order number and empties the bag.
      checkout: async () => {
        const order = await mockPlaceOrder(total);
        setLines([]);
        return order;
      },
    };
  }, [lines, ready, drawerOpen, add, setQuantity, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
