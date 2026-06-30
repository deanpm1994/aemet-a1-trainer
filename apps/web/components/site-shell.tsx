import Link from "next/link";
import type { ReactNode } from "react";

import { AuthStatus } from "@/components/auth-status";
import { routeCards } from "@/lib/mock-data";

type SiteShellProps = {
  children: ReactNode;
};

export function SiteShell({ children }: SiteShellProps) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-ink/10 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <Link href="/" className="text-2xl font-semibold tracking-tight text-ink">
                AEMET A1 Trainer
              </Link>
              <p className="mt-1 max-w-3xl text-sm text-ink/70">
                PWA-first study system scaffold for the AEMET Grupo A1 opposition.
                Official data is not loaded yet.
              </p>
            </div>
            <div className="flex flex-col items-start gap-3 md:items-end">
              <div className="rounded-full border border-warning/30 bg-warning/10 px-3 py-1 text-xs font-medium text-warning">
                Foundation phase
              </div>
              <AuthStatus />
            </div>
          </div>
          <nav className="flex flex-wrap gap-2">
            {routeCards.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className="rounded-full border border-ink/10 bg-white px-3 py-2 text-sm text-ink/80 hover:border-accent hover:text-accent"
              >
                {route.title}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
