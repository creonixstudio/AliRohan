'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { site } from '@/lib/site.config';
import { CATEGORIES } from '@/lib/products';
import { useCart } from '@/lib/cart-store';
import { cn } from '@/lib/utils';
import { Magnetic } from '@/components/motion/Magnetic';

export function Header() {
  const [condensed, setCondensed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { scrollY } = useScroll();

  const openCart = useCart((s) => s.open);
  const count = useCart((s) => s.items.reduce((n, i) => n + i.quantity, 0));

  useEffect(() => setMounted(true), []);
  useEffect(() => setMenuOpen(false), [pathname]);
  useMotionValueEvent(scrollY, 'change', (y) => setCondensed(y > 40));

  return (
    <>
      <motion.header
        className={cn(
          'fixed inset-x-0 top-0 z-[90] transition-[padding,background-color,backdrop-filter] duration-comp ease-house',
          condensed
            ? 'bg-paper/85 py-3 backdrop-blur-md border-b border-line'
            : 'bg-transparent py-5'
        )}
      >
        <nav className="shell flex items-center justify-between" aria-label="Primary">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex w-24 items-center gap-2 text-caption uppercase tracking-[0.12em]"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            <span className="relative flex h-3 w-4 flex-col justify-between">
              <span className={cn('h-px w-full bg-ink transition-transform duration-comp ease-house', menuOpen && 'translate-y-[5px] rotate-45')} />
              <span className={cn('h-px w-full bg-ink transition-opacity duration-micro', menuOpen && 'opacity-0')} />
              <span className={cn('h-px w-full bg-ink transition-transform duration-comp ease-house', menuOpen && '-translate-y-[5px] -rotate-45')} />
            </span>
            <span className="hidden sm:inline">{menuOpen ? 'Close' : 'Menu'}</span>
          </button>

          <Link
            href="/"
            className="font-display text-h4 font-semibold tracking-[0.06em] leading-none"
            aria-label={`${site.name} — home`}
          >
            {site.name}
          </Link>

          <div className="flex w-24 items-center justify-end gap-4">
            <Link href="/search" aria-label="Search" className="text-caption uppercase tracking-[0.12em] hover:text-signature">
              Search
            </Link>
            <button
              onClick={openCart}
              className="relative font-mono text-caption uppercase tracking-[0.12em] hover:text-signature"
              aria-label={`Open bag, ${mounted ? count : 0} items`}
            >
              Bag
              <AnimatePresence>
                {mounted && count > 0 && (
                  <motion.span
                    key={count}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -right-3 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-signature px-1 text-[0.6rem] text-paper tabular-nums"
                  >
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </nav>
      </motion.header>

      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}

function MenuOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (open) {
      const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
      document.addEventListener('keydown', onKey);
      document.body.style.overflow = 'hidden';
      return () => {
        document.removeEventListener('keydown', onKey);
        document.body.style.overflow = '';
      };
    }
  }, [open, onClose]);

  const links = [...site.nav];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[85] bg-paper"
        >
          <div className="shell flex h-full flex-col justify-center pt-7">
            <p className="eyebrow mb-5">Menu</p>
            <ul className="flex flex-col gap-1">
              {links.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Magnetic strength={0.2}>
                    <Link href={l.href} className="block font-display text-h1 leading-[1.05] hover:text-signature">
                      {l.label}
                    </Link>
                  </Magnetic>
                </motion.li>
              ))}
            </ul>
            <div className="mt-7 grid grid-cols-2 gap-y-2 border-t border-line pt-5 sm:grid-cols-4">
              {CATEGORIES.map((c, i) => (
                <motion.div
                  key={c}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 + i * 0.02 }}
                >
                  <Link href={`/shop/${c}`} className="font-mono text-caption capitalize text-muted hover:text-ink link-underline">
                    {c}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
