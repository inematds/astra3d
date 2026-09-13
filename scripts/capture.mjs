import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
const root = "/tmp/astra3d-review";
await mkdir(root, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  args: ["--enable-unsafe-swiftshader"],
});
for (const [name, width, height, route] of [
  ["gallery-desktop", 1440, 1080, "/"],
  ["editor-desktop", 1440, 1000, "/#editor/portfolio"],
  ["gallery-mobile", 390, 844, "/"],
  ["editor-mobile", 390, 844, "/#editor/portfolio"],
  ["guide-mobile", 390, 844, "/guia/"],
]) {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.goto("http://127.0.0.1:4180" + route);
  await page.waitForTimeout(1200);
  await page.screenshot({
    path: `${root}/${name}.png`,
    fullPage: !name.startsWith("editor"),
  });
  console.log(
    name,
    await page.evaluate(() => ({
      width: innerWidth,
      scroll: document.documentElement.scrollWidth,
    })),
  );
  await page.close();
}
await browser.close();
