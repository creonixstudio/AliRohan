import type { Metadata } from 'next';
import { CartView } from '@/components/cart/CartView';

export const metadata: Metadata = {
  title: 'Bag',
  description: 'Review the pieces in your bag, adjust quantities, and proceed to checkout.',
  robots: { index: false, follow: false },
};

export default function CartPage() {
  return <CartView />;
}
