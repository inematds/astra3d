import test from "node:test";
import assert from "node:assert/strict";
import { IDBFactory } from "fake-indexeddb";
import { ProjectStore, ProjectError, MAX_SNAPSHOTS } from "../src/projects.js";
import { defaultConfig } from "../src/config.js";
const setup = (data = {}) => {
  const factory = new IDBFactory();
  const legacyStorage = { getItem: (key) => data[key] ?? null };
  return new ProjectStore({ factory, legacyStorage });
};

test("migração V1 é idempotente e preserva o armazenamento antigo", async () => {
  const old = defaultConfig();
  old.name = "Meu trabalho anterior";
  const data = { "astra3d:project:portfolio": JSON.stringify(old) };
  const store = setup(data);
  assert.equal((await store.ready()).migrated, 1);
  assert.deepEqual((await store.list())[0].config, old);
  await store.close();
  await store.ready();
  assert.equal((await store.list()).length, 1);
  assert.ok(data["astra3d:project:portfolio"]);
  await store.close();
});
test("rascunho V1 inválido é preservado e avisado; válidos são migrados", async () => {
  const data = {
    "astra3d:project:portfolio": "{broken",
    "astra3d:project:journal": JSON.stringify(defaultConfig("journal")),
  };
  const store = setup(data);
  assert.equal((await store.ready()).warnings.length, 1);
  assert.equal((await store.list()).length, 1);
  assert.equal(data["astra3d:project:portfolio"], "{broken");
  await store.close();
});
test("cópia tem identidade própria; edição e nome não alteram original", async () => {
  const store = setup();
  const a = await store.create(defaultConfig(), "Site A");
  const b = await store.duplicate(a.id);
  assert.notEqual(a.id, b.id);
  let edited = await store.update(
    b.id,
    { ...b.config, name: "Outra marca" },
    b.revision,
  );
  edited = await store.rename(b.id, "Site B", edited.revision);
  assert.equal((await store.get(a.id)).config.name, "Seu nome");
  assert.equal((await store.get(a.id)).title, "Site A");
  assert.equal(edited.title, "Site B");
  await store.close();
});
test("arquivar/restaurar é reversível e escrita obsoleta é rejeitada", async () => {
  const store = setup();
  const p = await store.create(defaultConfig(), "Original");
  let next = await store.archive(p.id, true, p.revision);
  await assert.rejects(
    store.update(p.id, { ...p.config, name: "stale" }, p.revision),
    (e) => e.code === "conflict",
  );
  assert.equal((await store.get(p.id)).config.name, "Seu nome");
  next = await store.archive(p.id, false, next.revision);
  assert.equal(next.archived, false);
  await store.close();
});
test("duas conexões não sobrescrevem a revisão de outra aba", async () => {
  const factory = new IDBFactory(),
    legacyStorage = { getItem: () => null };
  const a = new ProjectStore({ factory, legacyStorage }),
    b = new ProjectStore({ factory, legacyStorage });
  const p = await a.create(defaultConfig());
  const before = await b.get(p.id);
  await a.update(p.id, { ...p.config, name: "Primeira aba" }, p.revision);
  await assert.rejects(
    b.update(p.id, { ...before.config, name: "Segunda aba" }, before.revision),
    (e) => e.code === "conflict",
  );
  assert.equal((await b.get(p.id)).config.name, "Primeira aba");
  await a.close();
  await b.close();
});
test("versões sobrevivem à reabertura e restauração guarda estado anterior", async () => {
  const store = setup();
  let p = await store.create(defaultConfig());
  p = await store.checkpoint(p.id, "Original", p.revision);
  const snapshot = p.snapshots[0].id;
  p = await store.update(
    p.id,
    { ...p.config, name: "Novo conteúdo" },
    p.revision,
  );
  await store.close();
  p = await store.get(p.id);
  p = await store.restore(p.id, snapshot, p.revision);
  assert.equal(p.config.name, "Seu nome");
  assert.equal(p.snapshots[0].config.name, "Novo conteúdo");
  assert.equal(p.snapshots[0].label, "Antes da restauração");
  for (let i = 0; i < 6; i++)
    p = await store.checkpoint(p.id, "Versão " + i, p.revision);
  assert.equal(p.snapshots.length, MAX_SNAPSHOTS);
  assert.equal(p.snapshots[0].label, "Versão 5");
  await store.close();
});
test("backup inclui arquivo e versões e importa como cópias independentes", async () => {
  const store = setup();
  let p = await store.create(defaultConfig("agency"), "Site com versões");
  p = await store.checkpoint(p.id, "Primeira versão", p.revision);
  p = await store.archive(p.id, true, p.revision);
  const backup = JSON.parse(JSON.stringify(await store.backup()));
  const imported = await store.importBackup(backup);
  assert.equal((await store.list()).length, 2);
  assert.notEqual(imported[0].id, p.id);
  assert.equal(imported[0].archived, true);
  assert.deepEqual(imported[0].snapshots[0].config, p.config);
  assert.notEqual(imported[0].snapshots[0].id, p.snapshots[0].id);
  assert.equal((await store.get(p.id)).revision, p.revision);
  await store.close();
});
test("backup com qualquer item inválido não grava parcialmente", async () => {
  const store = setup();
  await store.create(defaultConfig());
  const raw = await store.backup();
  raw.projects.push({ ...raw.projects[0], config: { schemaVersion: 99 } });
  await assert.rejects(store.importBackup(raw));
  assert.equal((await store.list()).length, 1);
  await store.close();
});
test("falha durante gravação do lote desfaz todas as inclusões", async () => {
  const store = setup();
  await store.create(defaultConfig());
  const raw = await store.backup();
  raw.projects.push(structuredClone(raw.projects[0]));
  const original = store.transact.bind(store);
  store.transact = (stores, mode, work) =>
    original(stores, mode, async (tx) => {
      let additions = 0;
      const getStore = tx.objectStore.bind(tx);
      const real = getStore("projects");
      const add = real.add.bind(real);
      real.add = (value) => {
        if (++additions === 2)
          throw new DOMException("quota", "QuotaExceededError");
        return add(value);
      };
      return work(tx);
    });
  await assert.rejects(store.importBackup(raw));
  store.transact = original;
  assert.equal((await store.list()).length, 1);
  await store.close();
});
test("armazenamento indisponível retorna erro legível", async () => {
  const store = new ProjectStore({
    factory: {
      open() {
        throw new Error("denied");
      },
    },
    legacyStorage: { getItem: () => null },
  });
  await assert.rejects(
    store.ready(),
    (e) => e instanceof ProjectError && e.message.includes("armazenamento"),
  );
});
