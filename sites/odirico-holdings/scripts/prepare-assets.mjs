import sharp from "sharp";
import {
  mkdir,
  copyFile,
  readFile,
  writeFile,
  rename,
  access,
} from "node:fs/promises";
import { execFileSync } from "node:child_process";
await mkdir("public/images", { recursive: true });
await mkdir("docs/sources", { recursive: true });
// Keep original source images outside the served public directory.
for (const name of ["architecture-source.png", "social-card-source.png"]) {
  try {
    await access(`public/images/${name}`);
    await rename(`public/images/${name}`, `docs/sources/${name}`);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
}
await sharp("docs/sources/architecture-source.png")
  .resize({ width: 1536, withoutEnlargement: true })
  .webp({ quality: 84 })
  .toFile("public/images/architecture.webp");
console.log("Architectural image optimized as WebP.");
if (process.env.BRAND_REFERENCE && process.env.PYTHON_PATH) {
  await mkdir("docs/sources", { recursive: true });
  await copyFile(
    process.env.BRAND_REFERENCE,
    "docs/sources/brand-reference.jpg",
  );
  execFileSync(
    process.env.PYTHON_PATH,
    [
      "scripts/extract-branding.py",
      "public/branding",
      "docs/sources/brand-reference.jpg",
    ],
    { stdio: "inherit" },
  );
}
await mkdir("public/icons", { recursive: true });
const symbol = await readFile("public/branding/symbol-black.svg");
await writeFile("public/icons/favicon.svg", symbol);
await sharp(symbol).resize(32, 32).png().toFile("public/icons/favicon-32.png");
await sharp(symbol)
  .resize(120, 120)
  .extend({ top: 30, bottom: 30, left: 30, right: 30, background: "#ffffff" })
  .flatten({ background: "#ffffff" })
  .png()
  .toFile("public/icons/apple-touch-icon.png");
await sharp(symbol)
  .resize(320, 320)
  .extend({ top: 96, bottom: 96, left: 96, right: 96, background: "#ffffff" })
  .flatten({ background: "#ffffff" })
  .png()
  .toFile("public/branding/social-profile.png");
await sharp("public/branding/odirico-black.svg")
  .resize(1000)
  .flatten({ background: "#ffffff" })
  .png()
  .toFile("docs/sources/wordmark-review.png");
await sharp(symbol)
  .resize(360, 360)
  .flatten({ background: "#ffffff" })
  .png()
  .toFile("docs/sources/symbol-review.png");
console.log("Brand paths and icons prepared.");
