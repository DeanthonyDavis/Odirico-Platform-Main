import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Odirico Platform",
    short_name: "Odirico",
    description:
      "A connected platform for Ember, Sol, and Surge so planning, money, and momentum can live in one system.",
    start_url: "/overview",
    display: "standalone",
    background_color: "#f6f1e8",
    theme_color: "#ff5a43",
    icons: [
      {
        src: "/branding/odirico-platform.jpg",
        sizes: "512x512",
        type: "image/jpeg",
      },
    ],
    shortcuts: [
      {
        name: "Overview",
        short_name: "Overview",
        url: "/overview",
      },
      {
        name: "Ember",
        short_name: "Ember",
        url: "/ember",
      },
      {
        name: "Sol",
        short_name: "Sol",
        url: "/sol",
      },
      {
        name: "Surge",
        short_name: "Surge",
        url: "/surge",
      },
    ],
  };
}
