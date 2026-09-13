import { cp, writeFile } from "node:fs/promises";
await cp("guia", "dist/guia", { recursive: true });
await cp("capa", "dist/capa", { recursive: true });
await cp("docs", "dist/docs", { recursive: true });
await writeFile("dist/.nojekyll", "");
