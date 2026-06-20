'use client';

import { motion } from 'framer-motion';

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 10,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div className="inline-flex items-center rounded-[var(--radius)] border border-ink/25">
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Decrease quantity"
        className="flex h-9 w-9 items-center justify-center text-h4 leading-none disabled:opacity-30"
      >
        −
      </button>
      <motion.span
        key={value}
        initial={{ scale: 0.8, opacity: 0.5 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 500, damping: 24 }}
        className="w-8 text-center font-mono text-caption tabular-nums"
        aria-live="polite"
      >
        {value}
      </motion.span>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Increase quantity"
        className="flex h-9 w-9 items-center justify-center text-h4 leading-none disabled:opacity-30"
      >
        +
      </button>
    </div>
  );
}
