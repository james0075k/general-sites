"use client";

import Link from "next/link";
import FadeIn from "./FadeIn";

interface Props {
  title: string;
  subtitle?: string;
  viewAllHref?: string;
  viewAllLabel?: string;
  accent?: string;
}

export default function SectionTitle({
  title,
  subtitle,
  viewAllHref,
  viewAllLabel = "View all",
  accent,
}: Props) {
  return (
    <FadeIn>
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          {accent && (
            <span className="mb-1 block text-xs font-bold uppercase tracking-widest text-secondary">
              {accent}
            </span>
          )}
          <h2 className="text-2xl font-bold tracking-tight text-text-primary md:text-3xl">{title}</h2>
          {subtitle && <p className="mt-1 max-w-2xl text-sm leading-6 text-text-muted">{subtitle}</p>}
        </div>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="shrink-0 rounded-full border border-secondary/20 px-4 py-2 text-sm font-semibold text-secondary transition hover:border-secondary/45 hover:bg-secondary/5"
          >
            {viewAllLabel}
          </Link>
        )}
      </div>
    </FadeIn>
  );
}
