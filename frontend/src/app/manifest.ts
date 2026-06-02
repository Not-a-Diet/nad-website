import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Not a Diet",
    short_name: "Not a Diet",
    description:
      "Nutrition counseling that builds a calm, sustainable relationship with food — no rules, no restrictions.",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f3ee",
    theme_color: "#e8471e",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
