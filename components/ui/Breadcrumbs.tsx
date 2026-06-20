import Link from 'next/link';

export function Breadcrumbs({ trail }: { trail: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="font-mono text-caption text-muted">
      <ol className="flex flex-wrap items-center gap-1.5">
        {trail.map((t, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {t.href ? (
              <Link href={t.href} className="hover:text-ink link-underline capitalize">
                {t.label}
              </Link>
            ) : (
              <span className="capitalize text-ink">{t.label}</span>
            )}
            {i < trail.length - 1 && <span aria-hidden>/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
