export const odiricoTokens = {
  colors: {
    bg: "#f4efe7",
    bgStrong: "#e9ddd0",
    surface: "rgba(255, 249, 242, 0.82)",
    surfaceStrong: "#fffaf4",
    surfaceDark: "#1b1816",
    surfaceDarkSoft: "#28231f",
    ink: "#161311",
    inkSoft: "#302a25",
    muted: "#6d6258",
    mutedStrong: "#8c7f74",
    line: "rgba(22, 19, 17, 0.12)",
    lineStrong: "rgba(22, 19, 17, 0.22)",
    white: "#ffffff",
    accent: "#de613b",
    accentStrong: "#b64727",
    accentSoft: "rgba(222, 97, 59, 0.12)",
    gold: "#ae7a2d",
    teal: "#196f75",
    blue: "#315ea9"
  },
  shadows: {
    soft: "0 18px 50px rgba(22, 19, 17, 0.08)",
    deep: "0 28px 80px rgba(22, 19, 17, 0.14)"
  },
  radius: {
    sm: 14,
    md: 22,
    lg: 34,
    xl: 52
  },
  typography: {
    display: '"Space Grotesk", "Aptos Display", "Segoe UI", sans-serif',
    body: '"Instrument Sans", "Aptos", "Segoe UI", sans-serif'
  },
  layout: {
    maxWidth: 1220,
    headerHeight: 88
  },
  platform: {
    ios: {
      accent: "#315ea9",
      chrome: "sheet-heavy"
    },
    android: {
      accent: "#196f75",
      chrome: "material-supporting"
    },
    desktop: {
      accent: "#de613b",
      chrome: "dense-toolbar"
    }
  }
} as const;

export type OdiricoTokens = typeof odiricoTokens;
