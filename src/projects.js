import { defaultConfig, validateConfig, templates } from "./config.js";

export const MAX_SNAPSHOTS = 5;
export const BACKUP_LIMIT = 100;
const uid = () => "p-" + crypto.randomUUID();
const now = () => new Date().toISOString();
const titleOf = (value, fallback = "Meu projeto") =>
  typeof value === "string" && value.trim()
    ? value.trim().slice(0, 80)
    : fallback;
const req = (request) =>
  new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
export class ProjectError extends Error {
  constructor(message, code = "storage") {
    super(message);
    this.code = code;
  }
}
const storageError = () =>
  new ProjectError(
    "Não foi possível acessar o armazenamento. Verifique as permissões e o espaço do navegador. Seus dados não foram substituídos.",
  );
export function backupRecords(raw) {
  if (
    !raw ||
    raw.format !== "astra3d-library" ||
    raw.version !== 2 ||
    !Array.isArray(raw.projects) ||
    raw.projects.length > BACKUP_LIMIT
  )
    throw new ProjectError(
      "Backup inválido. Use um arquivo da biblioteca Astra3D com até 100 projetos.",
      "invalid",
    );
  return raw.projects.map((p) => {
    if (!p || typeof p !== "object")
      throw new ProjectError("Um projeto do backup está inválido.", "invalid");
    const config = validateConfig(p.config);
    if (!Array.isArray(p.snapshots) || p.snapshots.length > MAX_SNAPSHOTS)
      throw new ProjectError("Histórico inválido no backup.", "invalid");
    return {
      title: titleOf(p.title, config.name),
      config,
      archived: p.archived === true,
      snapshots: p.snapshots.map((s) => {
        if (!s || typeof s !== "object")
          throw new ProjectError("Versão salva inválida.", "invalid");
        const snapshot = validateConfig(s.config);
        if (snapshot.template !== config.template)
          throw new ProjectError(
            "A versão salva não pertence ao mesmo modelo.",
            "invalid",
          );
        return {
          id: uid(),
          label: titleOf(s.label, "Versão importada"),
          createdAt: Number.isFinite(Date.parse(s.createdAt))
            ? new Date(s.createdAt).toISOString()
            : now(),
          config: snapshot,
        };
      }),
    };
  });
}

export class ProjectStore {
  constructor({ factory, legacyStorage, name = "astra3d-library" } = {}) {
    this.factory = factory;
    this.legacyStorage = legacyStorage;
    this.name = name;
  }
  open() {
    if (this.connection) return this.connection;
    this.connection = new Promise((resolve, reject) => {
      let request;
      try {
        const factory = this.factory ?? globalThis.indexedDB;
        if (!factory) throw storageError();
        request = factory.open(this.name, 1);
      } catch {
        reject(storageError());
        return;
      }
      request.onupgradeneeded = () => {
        request.result.createObjectStore("projects", { keyPath: "id" });
        request.result.createObjectStore("meta");
      };
      request.onblocked = () =>
        reject(
          new ProjectError("Feche outras abas do Astra3D e tente novamente."),
        );
      request.onerror = () => reject(storageError());
      request.onsuccess = () => {
        const db = request.result;
        db.onversionchange = () => {
          db.close();
          this.connection = null;
          this.initialized = null;
        };
        resolve(db);
      };
    }).catch((error) => {
      this.connection = null;
      throw error;
    });
    return this.connection;
  }
  async transact(stores, mode, work) {
    const db = await this.open();
    let transaction;
    try {
      transaction = db.transaction(stores, mode);
    } catch {
      throw storageError();
    }
    const completion = new Promise((resolve, reject) => {
      transaction.oncomplete = resolve;
      transaction.onabort = () => reject(storageError());
      transaction.onerror = () => reject(storageError());
    });
    // Only IndexedDB requests are awaited inside a transaction, keeping it active.
    try {
      const result = await work(transaction);
      await completion;
      return result;
    } catch (error) {
      try {
        transaction.abort();
      } catch {}
      await completion.catch(() => {});
      throw error instanceof ProjectError ? error : storageError();
    }
  }
  ready() {
    if (this.initialized) return this.initialized;
    this.initialized = this.migrate().catch((error) => {
      this.initialized = null;
      throw error;
    });
    return this.initialized;
  }
  async migrate() {
    const legacy = [];
    const warnings = [];
    for (const t of templates) {
      try {
        const storage = this.legacyStorage ?? globalThis.localStorage;
        const raw = storage?.getItem(`astra3d:project:${t.id}`);
        if (raw) {
          const config = validateConfig(JSON.parse(raw));
          if (config.template !== t.id) throw new Error("incompatible");
          legacy.push({
            id: `legacy-${t.id}`,
            title: `${config.name} · V1`,
            createdAt: now(),
            updatedAt: now(),
            revision: 1,
            archived: false,
            config,
            snapshots: [],
          });
        }
      } catch {
        warnings.push(
          `O rascunho antigo de ${t.name} não pôde ser lido e foi preservado no navegador.`,
        );
      }
    }
    return this.transact(["projects", "meta"], "readwrite", async (tx) => {
      const meta = tx.objectStore("meta");
      const previous = await req(meta.get("migration-v1"));
      if (previous) return previous;
      const projects = tx.objectStore("projects");
      for (const project of legacy)
        if (!(await req(projects.get(project.id))))
          await req(projects.add(project));
      const result = { migrated: legacy.length, warnings };
      await req(meta.put(result, "migration-v1"));
      return result;
    });
  }
  async list() {
    await this.ready();
    return this.transact(["projects"], "readonly", (tx) =>
      req(tx.objectStore("projects").getAll()),
    );
  }
  async get(id) {
    await this.ready();
    const p = await this.transact(["projects"], "readonly", (tx) =>
      req(tx.objectStore("projects").get(id)),
    );
    if (!p)
      throw new ProjectError(
        "Projeto não encontrado neste navegador. Abra Meus projetos ou importe um backup.",
        "missing",
      );
    return p;
  }
  async create(config, title, snapshots = [], archived = false) {
    await this.ready();
    const clean = validateConfig(config);
    const stamp = now();
    const project = {
      id: uid(),
      title: titleOf(title, clean.name),
      createdAt: stamp,
      updatedAt: stamp,
      revision: 1,
      archived,
      config: clean,
      snapshots: structuredClone(snapshots),
    };
    await this.transact(["projects"], "readwrite", (tx) =>
      req(tx.objectStore("projects").add(project)),
    );
    return project;
  }
  async fromTemplate(template, fresh = false) {
    const all = await this.list();
    const existing = all
      .filter((p) => p.config.template === template && !p.archived)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0];
    return !fresh && existing
      ? existing
      : this.create(
          defaultConfig(template),
          {
            portfolio: "Meu portfólio",
            agency: "Minha agência",
            journal: "Minha publicação",
          }[template] || "Meu site",
        );
  }
  async mutate(id, revision, fn) {
    await this.ready();
    return this.transact(["projects"], "readwrite", async (tx) => {
      const store = tx.objectStore("projects");
      const p = await req(store.get(id));
      if (!p) throw new ProjectError("Projeto não encontrado.", "missing");
      if (p.revision !== revision)
        throw new ProjectError(
          "Este projeto mudou em outra aba. Salve uma cópia das suas alterações ou reabra a versão atual em Meus projetos.",
          "conflict",
        );
      const next = fn(p);
      next.updatedAt = now();
      next.revision = p.revision + 1;
      await req(store.put(next));
      return next;
    });
  }
  update(id, config, revision) {
    const clean = validateConfig(config);
    return this.mutate(id, revision, (p) => {
      if (clean.template !== p.config.template)
        throw new ProjectError(
          "Importe outro modelo como um novo projeto.",
          "invalid",
        );
      return { ...p, config: clean };
    });
  }
  rename(id, title, revision) {
    return this.mutate(id, revision, (p) => ({
      ...p,
      title: titleOf(title, p.title),
    }));
  }
  archive(id, archived, revision) {
    return this.mutate(id, revision, (p) => ({ ...p, archived: !!archived }));
  }
  async duplicate(id) {
    const p = await this.get(id);
    return this.create(p.config, titleOf(p.title).slice(0, 70) + " (cópia)");
  }
  checkpoint(id, label, revision) {
    return this.mutate(id, revision, (p) => ({
      ...p,
      snapshots: [
        {
          id: uid(),
          label: titleOf(label, "Versão salva"),
          createdAt: now(),
          config: structuredClone(p.config),
        },
        ...p.snapshots,
      ].slice(0, MAX_SNAPSHOTS),
    }));
  }
  restore(id, snapshotId, revision) {
    return this.mutate(id, revision, (p) => {
      const s = p.snapshots.find((s) => s.id === snapshotId);
      if (!s) throw new ProjectError("Versão não encontrada.", "missing");
      return {
        ...p,
        config: structuredClone(s.config),
        snapshots: [
          {
            id: uid(),
            label: "Antes da restauração",
            createdAt: now(),
            config: structuredClone(p.config),
          },
          ...p.snapshots,
        ].slice(0, MAX_SNAPSHOTS),
      };
    });
  }
  async backup() {
    return {
      format: "astra3d-library",
      version: 2,
      exportedAt: now(),
      projects: await this.list(),
    };
  }
  async importBackup(raw) {
    // Validate the WHOLE payload before starting any write. Imported projects always get fresh IDs.
    const records = backupRecords(raw);
    await this.ready();
    return this.transact(["projects"], "readwrite", async (tx) => {
      const store = tx.objectStore("projects");
      const result = [];
      for (const r of records) {
        const p = {
          ...r,
          id: uid(),
          createdAt: now(),
          updatedAt: now(),
          revision: 1,
        };
        await req(store.add(p));
        result.push(p);
      }
      return result;
    });
  }
  async close() {
    const db = await this.open();
    db.close();
    this.connection = null;
    this.initialized = null;
  }
}
export const projects = new ProjectStore();
