'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product } from './types';

type RemovedSnapshot = { item: CartItem; index: number } | null;

type CartState = {
  items: CartItem[];
  isOpen: boolean;
  lastRemoved: RemovedSnapshot;
  open: () => void;
  close: () => void;
  toggle: () => void;
  add: (product: Product, size: string, color: string, qty?: number) => void;
  remove: (key: string) => void;
  undoRemove: () => void;
  setQty: (key: string, qty: number) => void;
  clear: () => void;
  count: () => number;
  subtotal: () => number;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      lastRemoved: null,
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set((s) => ({ isOpen: !s.isOpen })),
      add: (product, size, color, qty = 1) => {
        const key = `${product.id}__${size}__${color}`;
        set((s) => {
          const existing = s.items.find((i) => i.key === key);
          if (existing) {
            return {
              items: s.items.map((i) =>
                i.key === key ? { ...i, quantity: i.quantity + qty } : i
              ),
              isOpen: true,
            };
          }
          const item: CartItem = {
            key,
            productId: product.id,
            slug: product.slug,
            name: product.name,
            price: product.price,
            image: product.images[0]?.url ?? '',
            size,
            color,
            quantity: qty,
          };
          return { items: [...s.items, item], isOpen: true };
        });
      },
      remove: (key) =>
        set((s) => {
          const index = s.items.findIndex((i) => i.key === key);
          if (index === -1) return s;
          return {
            items: s.items.filter((i) => i.key !== key),
            lastRemoved: { item: s.items[index], index },
          };
        }),
      undoRemove: () =>
        set((s) => {
          if (!s.lastRemoved) return s;
          const items = [...s.items];
          items.splice(s.lastRemoved.index, 0, s.lastRemoved.item);
          return { items, lastRemoved: null };
        }),
      setQty: (key, qty) =>
        set((s) => ({
          items: s.items
            .map((i) => (i.key === key ? { ...i, quantity: Math.max(0, qty) } : i))
            .filter((i) => i.quantity > 0),
        })),
      clear: () => set({ items: [], lastRemoved: null }),
      count: () => get().items.reduce((n, i) => n + i.quantity, 0),
      subtotal: () => get().items.reduce((n, i) => n + i.price * i.quantity, 0),
    }),
    { name: 'vestra-cart', partialize: (s) => ({ items: s.items }) }
  )
);
