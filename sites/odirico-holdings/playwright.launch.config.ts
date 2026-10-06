import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/launch",
  workers: 1,
  use: { baseURL: "http://127.0.0.1:3102", reducedMotion: "reduce" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 1000 } } },
    { name: "mobile", use: { ...devices["iPhone 13"], defaultBrowserType: "chromium" } },
  ],
  webServer: {
    command: "npm run start -- --port 3102",
    url: "http://127.0.0.1:3102",
    reuseExistingServer: false,
    env: { INQUIRY_DELIVERY: "disabled", SITE_INDEXING_ENABLED: "true", NEXT_PUBLIC_SITE_URL: "https://odirico.com", VERCEL_ENV: "production" },
  },
});
