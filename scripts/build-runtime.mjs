import { build } from "esbuild";
import { mkdir, writeFile, readFile } from "node:fs/promises";
await mkdir("src/generated", { recursive: true });
const bundle = await build({
  entryPoints: ["src/scene/runtime.js"],
  bundle: true,
  minify: true,
  format: "iife",
  globalName: "AstraScene",
  write: false,
  legalComments: "inline",
});
await writeFile(
  "src/generated/scene-runtime.txt",
  "/* Three.js license\n" +
    (await readFile("node_modules/three/LICENSE", "utf8")) +
    "\n*/\n" +
    bundle.outputFiles[0].text,
);
const fonts = [
  ["Manrope", "manrope/files/manrope-latin-400-normal.woff2", "400"],
  ["Manrope", "manrope/files/manrope-latin-700-normal.woff2", "700"],
  [
    "DM Serif Display",
    "dm-serif-display/files/dm-serif-display-latin-400-normal.woff2",
    "400",
  ],
];
let css =
  "/* Font licenses\n" +
  (await readFile("node_modules/@fontsource/manrope/LICENSE", "utf8")) +
  "\n" +
  (await readFile(
    "node_modules/@fontsource/dm-serif-display/LICENSE",
    "utf8",
  )) +
  "\n*/\n";
for (const [name, file, weight] of fonts) {
  const data = await readFile(`node_modules/@fontsource/${file}`);
  css += `@font-face{font-family:'${name}';font-weight:${weight};font-display:swap;src:url(data:font/woff2;base64,${data.toString("base64")}) format('woff2');}`;
}
await writeFile("src/generated/fonts.txt", css);
