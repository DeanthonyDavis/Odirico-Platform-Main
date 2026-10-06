import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdir } from "node:fs/promises";

test("disabled launch accepts no inquiries and exposes no private routes", async ({ page, request }, info) => {
  await mkdir("docs/screenshots", { recursive: true });
  for (const path of ["/contact", "/acquisitions"]) {
    await page.goto(path);
    await expect(page.getByRole("status")).toContainText("Inquiries are not open yet");
    await expect(page.locator("form, input, textarea")).toHaveCount(0);
    expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
    await page.screenshot({ path: `docs/screenshots/launch-${path.slice(1)}-${info.project.name}.png`, fullPage: true, animations: "disabled" });
  }
  const result = await request.post("/api/inquiries", { data: { message: "Synthetic test. No delivery authorized." } });
  expect(result.status()).toBe(503);
  expect(await result.text()).toContain("Nothing has been sent");
  for (const path of ["/admin", "/dashboard", "/login", "/forge", "/calendar", "/api/tickets", "/api/settings", "/ember", "/sol", "/surge"]) {
    expect((await request.get(path)).status(), path).toBe(404);
  }
});

test("production metadata and retired worker are correct", async ({ page, request }) => {
  await page.goto("/");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /^https:\/\/odirico\.com\/?$/);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "index, follow");
  await expect(page.locator("h1")).toContainText("ŌDIRICO");
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toContain("Allow: /");
  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).toContain("https://odirico.com/acquisitions");
  expect(sitemap).not.toContain("localhost");
  const worker = await request.get("/sw.js");
  expect(worker.status()).toBe(200);
  expect(worker.headers()["cache-control"]).toContain("no-store");
  expect(await worker.text()).toContain("self.registration.unregister()");
  expect(await worker.text()).toContain('caches.delete("odirico-platform-shell-v1")');
  for (const path of ["/privacy", "/terms"]) {
    await page.goto(path);
    await expect(page.locator("main")).not.toContainText(/review draft|placeholder|must be confirmed/);
  }
});
