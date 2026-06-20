import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { AboutNarrative } from '@/components/about/AboutNarrative';

export const metadata: Metadata = {
  title: 'About',
  description:
    'VESTRA is a considered-apparel studio. How we work: material first, quiet construction, made to be lived in.',
};

export default function AboutPage() {
  return (
    <main id="main" className="pt-[120px]">
      <div className="shell">
        <Breadcrumbs trail={[{ label: 'Home', href: '/' }, { label: 'About' }]} />
      </div>
      <AboutNarrative />
    </main>
  );
}
