import assert from "node:assert/strict";
const origin = new URL(process.argv[2] || "https://odirico.com").origin;
const preview = process.argv.includes("--preview");
const routes = ["/", "/company", "/approach", "/portfolio", "/acquisitions", "/contact", "/privacy", "/terms"];
const results = [];
let homepage = "";
for (const path of routes) {
  const response = await fetch(origin + path);
  assert.equal(response.status, 200, path);
  const html = await response.text();
  assert(html.includes("ŌDIRICO"), `Brand absent: ${path}`);
  assert(!/\b(Ember|Surge)\b/.test(html), `Legacy positioning: ${path}`);
  assert(!/localhost|127\.0\.0\.1/.test(html), `Development URL: ${path}`);
  assert(html.includes('rel="canonical" href="https://odirico.com'), `Canonical absent: ${path}`);
  assert(html.includes('property="og:image"'), `Social metadata absent: ${path}`);
  assert(response.headers.get("content-security-policy")?.includes("frame-ancestors 'none'"));
  if (path === "/contact" || path === "/acquisitions") {
    assert(html.includes("Inquiries are not open yet"));
    assert(!/<form\b|<input\b|<textarea\b/.test(html), `Inactive form exposed: ${path}`);
  }
  if (path === "/") homepage = html;
  results.push({ path, status: response.status });
}
for (const path of ["/admin", "/login", "/forge", "/calendar", "/api/tickets", "/ember", "/sol", "/surge", "/not-a-real-page", "/portfolio/odirico-solutions"]) {
  const response = await fetch(origin + path);
  assert.equal(response.status, 404, path);
  results.push({ path, status: response.status });
}
for (const [path, destination] of [["/about", "/company"], ["/companies", "/portfolio"], ["/partnerships", "/contact"]]) {
  const response = await fetch(origin + path, { redirect: "manual" });
  assert.equal(response.status, 308, path);
  assert.equal(new URL(response.headers.get("location"), origin).pathname, destination);
  results.push({ path, status: response.status, destination });
}
const robots = await (await fetch(origin + "/robots.txt")).text();
assert(robots.includes(preview ? "Disallow: /" : "Allow: /"));
const sitemap = await (await fetch(origin + "/sitemap.xml")).text();
assert(sitemap.includes("https://odirico.com/acquisitions"));
assert(!/localhost|127\.0\.0\.1/.test(sitemap));
const assets = new Set(["/icons/odirico-macron.svg", "/icons/odirico-macron-32.png", "/icons/odirico-macron-apple.png", "/images/odirico-ownership-social.png", "/sw.js"]);
for (const match of homepage.matchAll(/(?:src|href)="(\/_next\/static\/[^" ]+)"/g)) assets.add(match[1]);
for (const path of assets) assert.equal((await fetch(origin + path)).status, 200, path);
const inquiry = await fetch(origin + "/api/inquiries", {
  method: "POST", headers: { "Content-Type": "application/json", Origin: origin }, body: "{}",
});
assert.equal(inquiry.status, 503);
assert((await inquiry.text()).includes("Nothing has been sent"));
console.log(JSON.stringify({ checkedAt: new Date().toISOString(), origin, preview, results, assetsChecked: assets.size, inquiryStatus: inquiry.status, passed: true }, null, 2));
