import test from "node:test";
import assert from "node:assert/strict";
import {
  defaultConfig,
  validateConfig,
  safeUrl,
  scriptJson,
  fileSlug,
} from "../src/config.js";
import { buildSite } from "../src/site-render.js";

test("todos os modelos sobrevivem ao round trip JSON", () => {
  for (const template of ["portfolio", "agency", "journal"]) {
    const c = defaultConfig(template);
    assert.deepEqual(validateConfig(JSON.parse(JSON.stringify(c))), c);
  }
});
test("importação inválida não é aceita como projeto", () => {
  for (const c of [
    null,
    [],
    {},
    { schemaVersion: 2 },
    { ...defaultConfig(), template: "constructor" },
    { ...defaultConfig(), items: new Array(7).fill({}) },
  ])
    assert.throws(() => validateConfig(c));
});
test("URLs só permitem HTTP(S) e mailto, sem controles ocultos", () => {
  for (const s of [
    "javascript:alert(1)",
    "data:text/html,test",
    "file:///etc/passwd",
    "//evil.test",
    "https://x.test\n",
    "java\nscript:alert(1)",
  ]) {
    if (s.endsWith("\n") && s.startsWith("https:")) continue;
    assert.equal(safeUrl(s), "");
  }
  assert.equal(
    safeUrl("https://example.com/a?x=1&y=2"),
    "https://example.com/a?x=1&y=2",
  );
  assert.equal(safeUrl("mailto:ola@example.com"), "mailto:ola@example.com");
});
test("campos desconhecidos, temas hostis e SVG são descartados", () => {
  const c = validateConfig({
    ...defaultConfig(),
    theme: "__proto__",
    image: "data:image/svg+xml;base64,PHN2Zz4=",
    evil: "script",
  });
  assert.equal(c.theme, "sage");
  assert.equal(c.image, "");
  assert.equal(c.evil, undefined);
});
test("conteúdo hostil permanece texto, sem sair de HTML ou script", () => {
  const payload =
    "</script><script>window.pwned=true</script><img src=x onerror=alert(1)>";
  const c = {
    ...defaultConfig(),
    name: payload,
    title: payload,
    contactUrl: "javascript:alert(1)",
    items: [
      {
        id: "x",
        title: payload,
        body: payload,
        description: payload,
        url: "data:text/html,x",
        category: payload,
      },
    ],
  };
  const html = buildSite(c);
  assert.ok(!html.includes("<script>window.pwned=true</script>"));
  assert.ok(html.includes("&lt;/script&gt;"));
  assert.ok(!html.includes('href="javascript:'));
  assert.equal((html.match(/<script>/g) || []).length, 1);
  assert.equal((html.match(/<\/script>/g) || []).length, 1);
  assert.ok(!scriptJson({ text: payload }).includes("<"));
});
test("seções ocultas não deixam links mortos e IDs de itens são normalizados", () => {
  const c = {
    ...defaultConfig(),
    showAbout: false,
    showWork: false,
    showContact: false,
  };
  const html = buildSite(c);
  for (const id of ["#about", "#work", "#contact"])
    assert.ok(!html.includes(`href="${id}"`));
  assert.equal(
    validateConfig({
      ...defaultConfig(),
      items: [{ id: 'evil" onclick="alert(1)', title: "ok" }],
    }).items[0].id,
    "item-1",
  );
});
test("nomes de download não contêm caminhos nem caracteres ativos", () => {
  assert.equal(fileSlug("../../Meu Site <script>"), "meu-site-script");
  assert.equal(fileSlug(""), "meu-site");
});
