import type { Metadata } from 'next';
import { CheckoutFlow } from '@/components/checkout/CheckoutFlow';

export const metadata: Metadata = {
  title: 'Checkout',
  description: 'Complete your order — contact, shipping, and a simulated demo payment.',
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  // CheckoutFlow handles the empty-cart state client-side (cart lives in the browser).
  return <CheckoutFlow />;
}
