import type { Config } from 'tailwindcss';

/**
 * VESTRA design tokens. Golden-ratio (φ ≈ 1.618) type scale and a
 * Fibonacci-derived spacing rhythm are exposed as Tailwind tokens so the
 * whole UI derives from the same system. Colors mirror styles/tokens.css.
 */
const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: 'var(--ink)',
        paper: 'var(--paper)',
        clay: 'var(--clay)',
        signature: 'var(--signature)',
        accent2: 'var(--accent2)',
        line: 'var(--line)',
        muted: 'var(--muted)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Clash Display', 'system-ui', 'sans-serif'],
        sans: ['var(--font-body)', 'Satoshi', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Sentient', 'Georgia', 'serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        // Golden-ratio scale (base 1rem = 16px, φ = 1.618)
        caption: ['0.764rem', { lineHeight: '1.5', letterSpacing: '0.02em' }],
        body: ['1rem', { lineHeight: '1.55' }],
        lead: ['1.272rem', { lineHeight: '1.5' }],
        h4: ['1.618rem', { lineHeight: '1.2' }],
        h3: ['2.058rem', { lineHeight: '1.12' }],
        h2: ['2.618rem', { lineHeight: '1.08', letterSpacing: '-0.01em' }],
        h1: ['4.236rem', { lineHeight: '1.02', letterSpacing: '-0.02em' }],
        mega: ['6.854rem', { lineHeight: '0.98', letterSpacing: '-0.03em' }],
      },
      spacing: {
        // Fibonacci / φ-ish rhythm
        '1': '4px',
        '2': '8px',
        '3': '13px',
        '4': '21px',
        '5': '34px',
        '6': '55px',
        '7': '89px',
        '8': '144px',
        '9': '233px',
      },
      maxWidth: {
        shell: '1600px',
        prose: '68ch',
      },
      transitionTimingFunction: {
        house: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      transitionDuration: {
        micro: '180ms',
        comp: '420ms',
      },
      gridTemplateColumns: {
        // 61.8% / 38.2% golden split
        golden: '61.8fr 38.2fr',
        'golden-rev': '38.2fr 61.8fr',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s cubic-bezier(0.22,1,0.36,1) both',
      },
    },
  },
  plugins: [],
};

export default config;
