'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Enter a valid email address.');
      return;
    }
    setError('');
    setDone(true);
  }

  return (
    <div className="mt-2 max-w-sm">
      <AnimatePresence mode="wait">
        {done ? (
          <motion.p
            key="done"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-body"
          >
            You’re on the list. Look out for first access to new releases.
          </motion.p>
        ) : (
          <motion.form key="form" onSubmit={submit} exit={{ opacity: 0 }} noValidate>
            <label htmlFor="newsletter" className="eyebrow mb-2 block">
              Join the studio list
            </label>
            <div className="flex items-center border-b border-ink/30 focus-within:border-ink">
              <input
                id="newsletter"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="w-full bg-transparent py-2 text-body outline-none placeholder:text-muted/60"
                aria-invalid={!!error}
                aria-describedby={error ? 'newsletter-error' : undefined}
              />
              <button type="submit" className="shrink-0 px-2 font-mono text-caption uppercase tracking-[0.12em] hover:text-signature">
                Join →
              </button>
            </div>
            {error && (
              <p id="newsletter-error" className="mt-1 text-caption text-signature">
                {error}
              </p>
            )}
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
