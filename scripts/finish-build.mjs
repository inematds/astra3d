import { cp, writeFile } from "node:fs/promises";
await cp("guia", "dist/guia", { recursive: true });
await cp("capa", "dist/capa", { recursive: true });
await cp("docs", "dist/docs", { recursive: true });
await writeFile("dist/.nojekyll", "");

// Standalone demos: ordinary HTML routes, no editor, download or account needed.
const { readFile, mkdir } = await import("node:fs/promises");
const { buildSite } = await import("../src/site-render.js");
const { demoConfig } = await import("../src/demos.js");
const resources = {
  runtime: await readFile("src/generated/scene-runtime.txt", "utf8"),
  fonts: await readFile("src/generated/fonts.txt", "utf8"),
  css: await readFile("src/site.css", "utf8"),
};
for (const template of ["portfolio", "agency", "journal"]) {
  await mkdir(`dist/demos/${template}`, { recursive: true });
  let html = buildSite(demoConfig(template), resources);
  html = html.replace(
    '<header class="site-nav">',
    `<div class="demo-toolbar"><a href="../../">← Modelos Astra3D</a><span>Demonstração fictícia</span><a href="../../#usar/${template}">Usar este exemplo ↗</a></div><header class="site-nav">`,
  );
  await writeFile(`dist/demos/${template}/index.html`, html);
}
