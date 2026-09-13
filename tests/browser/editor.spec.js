import { test, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { defaultConfig } from "../../src/config.js";

test("editar, desfazer, refazer e recuperar o rascunho", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/#editor/portfolio");
  await page.getByLabel("Seu nome", { exact: true }).fill("Marina Costa");
  const frame = page.frameLocator("iframe");
  await expect(frame.locator(".brand")).toHaveText("Marina Costa");
  await page.getByRole("button", { name: "Desfazer", exact: true }).click();
  await expect(page.getByLabel("Seu nome", { exact: true })).toHaveValue(
    "Seu nome",
  );
  await page.getByRole("button", { name: "Refazer", exact: true }).click();
  await page.reload();
  await expect(page.getByLabel("Seu nome", { exact: true })).toHaveValue(
    "Marina Costa",
  );
  await page.getByRole("tab", { name: "Aparência" }).click();
  await page.getByRole("button", { name: "Oceano" }).click();
  await expect(frame.locator("body")).toHaveCSS(
    "background-color",
    "rgb(234, 240, 245)",
  );
  await page.getByRole("button", { name: "Prévia celular" }).click();
  await expect(page.locator("iframe")).toHaveCSS("max-width", "390px");
  expect(errors).toEqual([]);
});
test("JSON é portátil, importa outro modelo e rejeita conteúdo inválido", async ({
  page,
}) => {
  await page.goto("/#editor/portfolio");
  await page
    .locator("input[type=file]")
    .first()
    .setInputFiles({
      name: "bad.json",
      mimeType: "application/json",
      buffer: Buffer.from("{bad"),
    });
  await expect(
    page.getByRole("status").filter({ hasText: "Não foi possível ler o JSON" }),
  ).toBeVisible();
  const c = { ...defaultConfig("agency"), name: "Estúdio importado" };
  await page
    .locator("input[type=file]")
    .first()
    .setInputFiles({
      name: "good.json",
      mimeType: "application/json",
      buffer: Buffer.from(JSON.stringify(c)),
    });
  await expect(page).toHaveURL(/editor\/agency/);
  await expect(page.getByLabel("Nome da marca", { exact: true })).toHaveValue(
    "Estúdio importado",
  );
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Salvar JSON" }).click();
  const dl = await downloadPromise;
  const json = JSON.parse(await readFile(await dl.path(), "utf8"));
  expect(json.name).toBe("Estúdio importado");
});
test("HTML exportado abre offline e texto malicioso não executa", async ({
  page,
  context,
}, testInfo) => {
  await page.goto("/#editor/portfolio");
  await page.getByLabel("Seu nome", { exact: true }).fill("Meu portfólio");
  await page
    .getByLabel("Chamada principal")
    .fill("</script><script>window.pwned=true</script>");
  const p = page.waitForEvent("download");
  await page.getByRole("button", { name: "Exportar site" }).click();
  const dl = await p;
  const html = await readFile(await dl.path(), "utf8");
  expect(html).toContain("data:font/woff2;base64");
  const exported = testInfo.outputPath("meu-portfolio.html");
  await dl.saveAs(exported);
  const offline = await context.newPage();
  await context.setOffline(true);
  await offline.goto("file://" + exported);
  await expect(offline.locator(".hero h1")).toHaveText(
    "</script><script>window.pwned=true</script>",
  );
  expect(await offline.evaluate(() => window.pwned)).toBeUndefined();
  await offline
    .getByRole("button", { name: "Conhecer projeto" })
    .first()
    .click();
  await expect(offline.locator("#article-view")).toBeVisible();
  await offline.getByRole("button", { name: "Voltar" }).click();
  await expect(offline.locator("#site-main")).toBeVisible();
  await offline.close();
});
test("Caderno: busca e categoria combinam, leitura abre e volta", async ({
  page,
}) => {
  await page.goto("/#editor/journal");
  const frame = page.frameLocator("iframe");
  await frame.getByLabel("Buscar textos").fill("ferramentas");
  await expect(frame.locator(".item:visible")).toHaveCount(1);
  await frame
    .getByLabel("Categoria", { exact: true })
    .selectOption("Criatividade");
  await expect(frame.locator(".item:visible")).toHaveCount(0);
  await expect(frame.locator("#search-status")).toContainText("Nenhum texto");
  await frame.getByLabel("Categoria", { exact: true }).selectOption("");
  await frame.getByRole("button", { name: "Ler texto" }).first().click();
  await expect(frame.locator("#article-view h1")).toHaveText(
    "Ferramentas e intenção",
  );
  await frame.getByRole("button", { name: "Voltar" }).click();
  await expect(frame.locator("#work")).toBeVisible();
});
test("seções e imagem participam da exportação; reset pode ser desfeito", async ({
  page,
}) => {
  await page.goto("/#editor/portfolio");
  await page
    .locator("input[type=file]")
    .nth(1)
    .setInputFiles("guia/assets/hero.png");
  await expect(
    page.getByRole("button", { name: "Remover imagem" }),
  ).toBeVisible();
  await page.getByRole("tab", { name: "Seções" }).click();
  await page.getByLabel("Sobre", { exact: true }).uncheck();
  await expect(page.frameLocator("iframe").locator("#about")).toHaveCount(0);
  await page.getByRole("button", { name: "Restaurar este modelo" }).click();
  await page
    .getByRole("button", { name: "Restaurar modelo", exact: true })
    .click();
  await expect(page.getByLabel("Sobre", { exact: true })).toBeChecked();
  await page.getByRole("button", { name: "Desfazer", exact: true }).click();
  await expect(page.getByLabel("Sobre", { exact: true })).not.toBeChecked();
});
test("celular navega sem overflow e alterna controles/prévia", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Seu próximo site.", exact: false }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.getByRole("link", { name: "Personalizar Órbita" }).click();
  await page.getByLabel("Seu nome", { exact: true }).fill("No celular");
  await page.getByRole("button", { name: "Ver prévia", exact: true }).click();
  await expect(page.locator("iframe")).toBeVisible();
  await expect(page.frameLocator("iframe").locator(".brand")).toHaveText(
    "No celular",
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.goto("/guia/");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.getByRole("button", { name: "Alternar tema" }).click();
  await page.reload();
  await expect(page.locator("body")).toHaveClass("light");
});
test("sem WebGL, conteúdo e leitura continuam disponíveis", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const orig = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, ...args) {
      return type.startsWith("webgl") ? null : orig.call(this, type, ...args);
    };
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#editor/agency");
  const frame = page.frameLocator("iframe");
  await expect(frame.locator("#scene")).toHaveAttribute(
    "data-fallback",
    "true",
  );
  await expect(frame.locator(".hero h1")).toBeVisible();
  await frame.getByRole("button", { name: "Conhecer projeto" }).first().click();
  await expect(frame.locator("#article-view")).toBeVisible();
});

test("teclado navega abas e foco do link de salto permanece visível", async ({
  page,
}) => {
  await page.goto("/#editor/portfolio");
  const content = page.getByRole("tab", { name: "Conteúdo" });
  await content.focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tab", { name: "Aparência" })).toBeFocused();
  await page.keyboard.press("End");
  await expect(page.getByRole("tab", { name: "Seções" })).toBeFocused();
  const frame = page.frameLocator("iframe");
  await frame.getByRole("link", { name: "Pular para o conteúdo" }).focus();
  await expect(
    frame.getByRole("link", { name: "Pular para o conteúdo" }),
  ).toHaveCSS("clip", "auto");
});
