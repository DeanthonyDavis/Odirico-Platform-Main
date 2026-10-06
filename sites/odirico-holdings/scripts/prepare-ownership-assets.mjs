// Development-only asset generation using existing Next, React, Geist and Sharp.
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import React from "react";
import { ImageResponse } from "next/og.js";
import sharp from "sharp";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const font = await fs.readFile(
  path.join(
    root,
    "../node_modules/geist/dist/fonts/geist-sans/Geist-Medium.ttf",
  ),
);
const h = React.createElement;
async function render(width, height, profile = false) {
  const image = new ImageResponse(
    h(
      "div",
      {
        style: {
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          background: "#f5f5f2",
          color: "#111111",
          padding: profile ? "55px" : "64px",
          fontFamily: "Geist",
          justifyContent: "space-between",
        },
      },
      h(
        "div",
        {
          style: {
            display: "flex",
            fontSize: profile ? 20 : 16,
            letterSpacing: "2px",
          },
        },
        "A PRIVATE HOLDING COMPANY",
      ),
      h(
        "div",
        {
          style: {
            display: "flex",
            fontSize: profile ? 88 : 200,
            letterSpacing: profile ? "-6px" : "-14px",
            lineHeight: 1.2,
          },
        },
        "ŌDIRICO",
      ),
      h(
        "div",
        {
          style: {
            display: "flex",
            justifyContent: "space-between",
            borderTop: "1px solid #bbbbbb",
            paddingTop: 24,
            fontSize: profile ? 22 : 27,
          },
        },
        profile ? "odirico.com" : "Built to own. Built to endure.",
        !profile && h("span", { style: { fontSize: 18 } }, "odirico.com"),
      ),
    ),
    {
      width,
      height,
      fonts: [{ name: "Geist", data: font, weight: 500, style: "normal" }],
    },
  );
  return Buffer.from(await image.arrayBuffer());
}
await fs.writeFile(
  path.join(root, "public/images/odirico-ownership-social.png"),
  await render(1200, 630),
);
await fs.writeFile(
  path.join(root, "public/branding/odirico-display-profile.png"),
  await render(600, 600, true),
);
// Small-size typographic O with a macron; no separate corporate symbol.
const icon =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="#111111"/><path d="M20 12h24" stroke="#ffffff" stroke-width="4"/><ellipse cx="32" cy="37" rx="16" ry="17" fill="none" stroke="#ffffff" stroke-width="5"/></svg>';
await fs.writeFile(path.join(root, "public/icons/odirico-macron.svg"), icon);
await sharp(Buffer.from(icon))
  .resize(32, 32)
  .png()
  .toFile(path.join(root, "public/icons/odirico-macron-32.png"));
await sharp(Buffer.from(icon))
  .resize(180, 180)
  .png()
  .toFile(path.join(root, "public/icons/odirico-macron-apple.png"));
console.log(
  "Generated display-brand social and icon assets. Legacy artwork preserved.",
);
