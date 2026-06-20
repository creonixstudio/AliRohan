'use client';

import { forwardRef } from 'react';
import Link from 'next/link';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'outline' | 'ghost' | 'signature';
type Size = 'sm' | 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 font-medium uppercase tracking-[0.08em] text-caption rounded-[var(--radius)] transition-colors duration-micro ease-house disabled:opacity-40 disabled:pointer-events-none select-none';

const variants: Record<Variant, string> = {
  primary: 'bg-ink text-paper hover:bg-ink/85',
  signature: 'bg-signature text-paper hover:bg-signature/85',
  outline: 'border border-ink/30 text-ink hover:border-ink hover:bg-ink/5',
  ghost: 'text-ink hover:bg-ink/5',
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-4',
  md: 'h-11 px-6',
  lg: 'h-14 px-8 text-body normal-case tracking-normal',
};

type ButtonProps = {
  variant?: Variant;
  size?: Size;
  href?: string;
  className?: string;
  children?: React.ReactNode;
} & Omit<HTMLMotionProps<'button'>, 'ref' | 'children'>;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', href, className, children, ...props }, ref) => {
    const classes = cn(base, variants[variant], sizes[size], className);
    const motionProps = {
      whileTap: { scale: 0.97 },
      transition: { type: 'spring' as const, stiffness: 400, damping: 22 },
    };

    if (href) {
      return (
        <motion.div {...motionProps} className="inline-block">
          <Link href={href} className={classes}>
            {children}
          </Link>
        </motion.div>
      );
    }
    return (
      <motion.button ref={ref} className={classes} {...motionProps} {...props}>
        {children}
      </motion.button>
    );
  }
);
Button.displayName = 'Button';
