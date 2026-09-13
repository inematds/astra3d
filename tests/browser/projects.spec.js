import { test, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { defaultConfig } from "../../src/config.js";
const saved = (page) =>
  expect(page.locator(".save-state")).toHaveText("Salvo neste navegador");

test("demonstrações abrem sem editor; leitor e criação a partir do exemplo funcionam", async ({
  page,
}) => {
  for (const template of ["portfolio", "agency", "journal"]) {
    await page.goto("/demos/" + template + "/");
    await expect(page.locator(".hero h1")).toBeVisible();
    await expect(page.locator(".editor-sidebar")).toHaveCount(0);
    await page.locator("[data-read]").first().click();
    await expect(page.locator("#article-view")).toBeVisible();
    await page.getByRole("button", { name: "Voltar" }).click();
  }
  await page.getByRole("link", { name: "Usar este exemplo" }).click();
  await expect(page).toHaveURL(/#projeto\//);
  await expect(page.getByLabel("Nome da marca", { exact: true })).toHaveValue(
    "Caderno aberto",
  );
});
test("criar, renomear, duplicar e editar sem alterar o original", async ({
  page,
}) => {
  await page.goto("/#novo/portfolio");
  await page.getByLabel("Seu nome", { exact: true }).fill("Marca original");
  await saved(page);
  await page.getByRole("link", { name: "Meus projetos", exact: true }).click();
  await page.getByRole("button", { name: /Renomear Meu portfólio/ }).click();
  await page
    .getByLabel("Nome do projeto", { exact: true })
    .fill("Site original");
  await page.getByRole("button", { name: "Salvar nome" }).click();
  await page
    .getByRole("button", { name: "Duplicar Site original", exact: true })
    .click();
  const copy = page.getByRole("article", {
    name: "Site original (cópia)",
    exact: true,
  });
  await expect(copy).toBeVisible();
  await copy.getByRole("link", { name: "Editar" }).click();
  await page.getByLabel("Seu nome", { exact: true }).fill("Marca da cópia");
  await saved(page);
  await page.getByRole("link", { name: "Meus projetos", exact: true }).click();
  await page
    .getByRole("article", { name: "Site original", exact: true })
    .getByRole("link", { name: "Editar" })
    .click();
  await expect(page.getByLabel("Seu nome", { exact: true })).toHaveValue(
    "Marca original",
  );
});
test("arquivar, buscar, filtrar e restaurar na biblioteca móvel", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/#novo/agency");
  await page.getByLabel("Nome da marca", { exact: true }).fill("Estúdio A");
  await saved(page);
  await page.getByRole("link", { name: "Meus projetos", exact: true }).click();
  await page.getByLabel("Buscar projetos").fill("inexistente");
  await expect(
    page.getByRole("heading", { name: "Nenhum projeto encontrado." }),
  ).toBeVisible();
  await page.getByLabel("Buscar projetos").fill("");
  await page.getByLabel("Filtrar por modelo").selectOption("portfolio");
  await expect(page.locator(".project-row")).toHaveCount(0);
  await page.getByLabel("Filtrar por modelo").selectOption("agency");
  await page.getByRole("button", { name: /Arquivar Minha agência/ }).click();
  await expect(page.locator(".project-row")).toHaveCount(0);
  await page.getByRole("button", { name: "Arquivados", exact: true }).click();
  await expect(page.locator(".project-row")).toHaveCount(1);
  await page.getByRole("button", { name: /Restaurar Minha agência/ }).click();
  await page.getByRole("button", { name: "Ativos", exact: true }).click();
  await expect(page.locator(".project-row")).toHaveCount(1);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
test("salvar versão, reabrir editor e restaurar preserva a revisão anterior", async ({
  page,
}) => {
  await page.goto("/#novo/portfolio");
  await page.getByLabel("Seu nome", { exact: true }).fill("Antes da mudança");
  await saved(page);
  await page.locator(".saved-versions summary").click();
  await page.getByLabel("Nome da versão (opcional)").fill("Antes das cores");
  await page
    .getByRole("button", { name: "Salvar versão", exact: true })
    .click();
  await expect(page.locator(".saved-versions")).toContainText(
    "Antes das cores",
  );
  await page.getByLabel("Seu nome", { exact: true }).fill("Depois da mudança");
  await saved(page);
  await page.reload();
  await page.locator(".saved-versions summary").click();
  await page
    .getByRole("button", {
      name: "Restaurar versão Antes das cores",
      exact: true,
    })
    .click();
  await page
    .getByRole("button", { name: "Restaurar versão", exact: true })
    .click();
  await expect(page.getByLabel("Seu nome", { exact: true })).toHaveValue(
    "Antes da mudança",
  );
  await expect(page.locator(".saved-versions")).toContainText(
    "Antes da restauração",
  );
  await saved(page);
});
test("biblioteca exporta tudo e reimporta cópias sem sobrescrever", async ({
  page,
}) => {
  await page.goto("/#novo/journal");
  await expect(page.getByLabel("Nome da marca", { exact: true })).toBeVisible();
  await page.getByRole("link", { name: "Meus projetos", exact: true }).click();
  const promise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Baixar backup" }).click();
  const file = await promise;
  const raw = await readFile(await file.path());
  expect(JSON.parse(raw).projects).toHaveLength(1);
  await page.locator("input[type=file]").setInputFiles({
    name: "backup.json",
    mimeType: "application/json",
    buffer: raw,
  });
  await expect(page.locator(".project-row")).toHaveCount(2);
  await page.reload();
  await expect(page.locator(".project-row")).toHaveCount(2);
});
test("migra rascunho V1 uma única vez na primeira visita", async ({ page }) => {
  const c = { ...defaultConfig(), name: "Rascunho antigo" };
  await page.addInitScript(
    (config) =>
      localStorage.setItem("astra3d:project:portfolio", JSON.stringify(config)),
    c,
  );
  await page.goto("/#projetos");
  await expect(page.locator(".project-row")).toHaveCount(1);
  await expect(page.locator(".project-row")).toContainText("Rascunho antigo");
  await page.reload();
  await expect(page.locator(".project-row")).toHaveCount(1);
  await page.getByRole("link", { name: "Editar" }).click();
  await expect(page.getByLabel("Seu nome", { exact: true })).toHaveValue(
    "Rascunho antigo",
  );
});
test("conflito entre abas não sobrescreve e permite salvar cópia", async ({
  page,
  context,
}) => {
  await page.goto("/#novo/portfolio");
  await expect(page.getByLabel("Seu nome", { exact: true })).toBeVisible();
  const url = page.url();
  const other = await context.newPage();
  await other.goto(url);
  await expect(other.getByLabel("Seu nome", { exact: true })).toBeVisible();
  await page.getByLabel("Seu nome", { exact: true }).fill("Primeira aba");
  await saved(page);
  await other.getByLabel("Seu nome", { exact: true }).fill("Segunda aba");
  await expect(other.getByRole("alert")).toContainText("outra aba");
  await other
    .getByRole("button", { name: "Salvar minhas alterações como cópia" })
    .click();
  await expect(other).not.toHaveURL(url);
  await expect(other.getByLabel("Seu nome", { exact: true })).toHaveValue(
    "Segunda aba",
  );
  await page.reload();
  await expect(page.getByLabel("Seu nome", { exact: true })).toHaveValue(
    "Primeira aba",
  );
});
