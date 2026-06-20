import type { Metadata } from "next";
import type { ReactNode } from "react";

import { SiteShell } from "@/components/site-shell";

import "./globals.css";

export const metadata: Metadata = {
  title: "AEMET A1 Trainer",
  description: "Foundation scaffold for an AEMET Grupo A1 exam preparation app.",
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
