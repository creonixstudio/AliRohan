'use client';

import { useEffect, useState } from 'react';

/**
 * Returns false on the server and on the client's first render, then true.
 * Use to gate UI that depends on client-only state (e.g. the localStorage-
 * persisted cart) so SSR and first client render agree — avoiding hydration
 * mismatches and a flash of the empty state before the cart rehydrates.
 */
export function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
