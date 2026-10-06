import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdir } from "node:fs/promises";
const routes = [
  "/",
  "/company",
  "/portfolio",
  "/acquisitions",
  "/approach",
  "/contact",
  "/privacy",
  "/terms",
];
test("all public pages, images, titles, and internal navigation work", async ({
  page,
}) => {
  const runtimeErrors: string[] = [];
  page.on("pageerror", (e) => runtimeErrors.push(e.message));
  for (const route of routes) {
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page).toHaveTitle(/Odirico/);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(overflow, `Overflow on ${route}`).toBe(false);
    await expect(page.locator("body")).not.toContainText("Odirico Solutions");
    await expect(page.locator("body")).not.toContainText(
      /\b(Ember|Sol|Surge)\b/,
    );
    const broken = await page
      .locator("img")
      .evaluateAll((imgs) =>
        (imgs as HTMLImageElement[])
          .filter((i) => i.complete && !i.naturalWidth)
          .map((i) => i.getAttribute("src")),
      );
    expect(broken).toEqual([]);
  }
  expect(runtimeErrors).toEqual([]);
  const hidden = await page.goto("/companies/odirico-solutions");
  expect(hidden?.status()).toBe(404);
  expect((await page.goto("/portfolio/odirico-solutions"))?.status()).toBe(404);
});
test("legacy addresses redirect to the revised corporate pages", async ({
  request,
}) => {
  for (const [from, to] of [
    ["/about", "/company"],
    ["/companies", "/portfolio"],
    ["/partnerships", "/contact"],
  ]) {
    const response = await request.get(from, { maxRedirects: 0 });
    expect(response.status()).toBe(308);
    expect(response.headers().location).toBe(to);
  }
});
test("homepage, acquisition, and contact screenshots and accessibility", async ({
  page,
}, info) => {
  await mkdir("docs/screenshots", { recursive: true });
  for (const [slug, route] of [
    ["homepage", "/"],
    ["acquisitions", "/acquisitions"],
    ["contact", "/contact"],
  ]) {
    await page.goto(route);
    await page.evaluate(() => document.fonts.ready);
    await page.locator("footer").scrollIntoViewIfNeeded();
    await page.locator("img").evaluateAll(async (imgs) => {
      await Promise.all(
        (imgs as HTMLImageElement[]).map(async (img) => {
          img.loading = "eager";
          await img.decode();
        }),
      );
    });
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({
      path: `docs/screenshots/${slug}-${info.project.name}.png`,
      fullPage: true,
      animations: "disabled",
      scale: "css",
    });
    if (route === "/") await page.screenshot({ path: `docs/screenshots/homepage-${info.project.name}-viewport.png`, animations: "disabled", scale: "css" });
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(
      result.violations.map((v) => ({
        id: v.id,
        help: v.help,
        nodes: v.nodes.map((n) => n.target),
      })),
    ).toEqual([]);
  }
});
test("keyboard skip link and mobile dialog focus", async ({ page }, info) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
  if (info.project.name === "mobile") {
    await page.getByRole("button", { name: "Open navigation" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).not.toBeVisible();
    await expect(
      page.getByRole("button", { name: "Open navigation" }),
    ).toBeFocused();
    await page.getByRole("button", { name: "Open navigation" }).click();
    await page
      .getByRole("navigation", { name: "Mobile navigation" })
      .getByRole("link", { name: /Company/ })
      .click();
    await expect(page).toHaveURL(/\/company$/);
    await expect(page.getByRole("dialog")).not.toBeVisible();
  }
});
test("all inquiry forms validate and show an explicit no-email preview response", async ({
  page,
}) => {
  for (const [route, kind] of [
    ["/contact", "contact"],
    ["/acquisitions", "acquisition"],
  ]) {
    await page.goto(route);
    const form = page.getByRole("form", { name: `${kind} inquiry` });
    await form
      .getByRole("button", { name: /Send inquiry|Test inquiry/ })
      .click();
    await expect(page.getByText("Please enter your full name.")).toBeVisible();
    await form.getByLabel("Full name").fill("Local QA Sender");
    await form.getByLabel("Email address").fill("qa@example.invalid");
    await form
      .getByLabel(kind === "acquisition" ? "Message" : "How can we help?")
      .fill("This is an automated local test; do not send email.");
    // Optional business details can be left blank; the minimal introduction works.
    await form.getByRole("checkbox").check();
    await form
      .getByRole("button", { name: /Send inquiry|Test inquiry/ })
      .click();
    await expect(form.getByRole("status")).toContainText(
      "no inquiry was sent or saved",
    );
  }
});
test("submission failure is shown without losing entered details", async ({
  page,
}) => {
  await page.route("**/api/inquiries", (route) =>
    route.fulfill({
      status: 503,
      contentType: "application/json",
      body: JSON.stringify({
        message: "Inquiry delivery is unavailable. Nothing has been sent.",
      }),
    }),
  );
  await page.goto("/contact");
  await page.getByLabel("Full name").fill("Retry Test");
  await page.getByLabel("Email address").fill("retry@example.invalid");
  await page.getByLabel("How can we help?").fill("A test inquiry.");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: /Send inquiry|Test inquiry/ }).click();
  await expect(page.getByRole("form").getByRole("alert")).toContainText(
    "Nothing has been sent",
  );
  await expect(page.getByLabel("Full name")).toHaveValue("Retry Test");
});
test("metadata, sitemap and security headers", async ({ request }) => {
  const r = await request.get("/contact");
  expect(r.headers()["x-content-type-options"]).toBe("nosniff");
  expect(r.headers()["content-security-policy"]).toContain(
    "frame-ancestors 'none'",
  );
  const sitemap = await request.get("/sitemap.xml");
  expect(await sitemap.text()).toContain("/acquisitions");
  expect(await sitemap.text()).toContain("/approach");
  expect(await sitemap.text()).toContain("/portfolio");
  expect(await sitemap.text()).not.toContain("/about");
  expect(await sitemap.text()).not.toContain("/partnerships");
  expect(await sitemap.text()).not.toContain("odirico-solutions");
  expect(await sitemap.text()).not.toContain("/privacy");
  expect(await (await request.get("/robots.txt")).text()).toContain(
    "Disallow: /",
  );
});
test("successful delivery UI can reset the form without a real email", async ({
  page,
}) => {
  await page.route("**/api/inquiries", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        status: "success",
        message: "Simulated delivery for local browser testing.",
      }),
    }),
  );
  await page.goto("/contact");
  await page.getByLabel("Full name").fill("Success Test");
  await page.getByLabel("Email address").fill("success@example.invalid");
  await page.getByLabel("How can we help?").fill("Simulated success test.");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: /Send inquiry|Test inquiry/ }).click();
  await expect(
    page.getByRole("heading", { name: "Thank you for reaching out." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Send another inquiry" }).click();
  await expect(page.getByLabel("Full name")).toHaveValue("");
});
test("all internal links and fragment targets resolve", async ({
  page,
  request,
}) => {
  const links = new Set<string>();
  for (const route of routes) {
    await page.goto(route);
    for (const href of await page
      .locator("a[href]")
      .evaluateAll((nodes) =>
        nodes.map((node) => (node as HTMLAnchorElement).href),
      ))
      if (href.startsWith("http://127.0.0.1:3100")) links.add(href);
  }
  for (const href of links) {
    const url = new URL(href);
    const result = await request.get(url.pathname);
    expect(result.status(), href).toBe(200);
    if (url.hash)
      expect(await result.text(), href).toContain(
        `id="${decodeURIComponent(url.hash.slice(1))}"`,
      );
  }
});
test("content and navigation remain available without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:3100/");
  await expect(page.locator("h1")).toContainText("ŌDIRICO");
  await page
    .locator(".noscript-nav")
    .getByRole("link", { name: "Company", exact: true })
    .click();
  await expect(page.locator("h1")).toContainText("long-term");
  await context.close();
});
test("tablet and narrow mobile layouts fit the viewport", async ({ page }) => {
  for (const width of [320, 768, 1024]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/acquisitions");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth + 1,
      ),
    ).toBe(true);
  }
});
