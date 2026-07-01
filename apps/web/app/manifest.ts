import type { MetadataRoute } from "next";

const themeColor = "#1f5f70";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AEMET A1 Trainer",
    short_name: "AEMET A1",
    description:
      "Study planner, topic checklist, question practice, and focus support for AEMET A1 preparation.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#f7f4ee",
    theme_color: themeColor,
    lang: "en",
    categories: ["education", "productivity"],
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
      {
        src: "/apple-icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
