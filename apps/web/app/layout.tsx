import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import { SiteShell } from "@/components/site-shell";
import { DEFAULT_LOCALE, t } from "@/lib/i18n";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "AEMET A1 Trainer",
    template: "%s | AEMET A1 Trainer",
  },
  description:
    t(DEFAULT_LOCALE, "app.description"),
  manifest: "/manifest.webmanifest",
  applicationName: "AEMET A1 Trainer",
  appleWebApp: {
    capable: true,
    title: "AEMET A1",
    statusBarStyle: "default",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/apple-icon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#1f5f70",
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang={DEFAULT_LOCALE}>
      <body>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
