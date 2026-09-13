import { useEffect, useRef, useState } from "react";
import {
  Plus,
  Search,
  ArrowUpRight,
  Copy,
  Archive,
  ArchiveRestore,
  Pencil,
  Download,
  Upload,
  X,
  Check,
  FolderOpen,
  Box,
} from "lucide-react";
import { projects } from "./projects.js";
import { templates, themes, validateConfig, fileSlug } from "./config.js";
import { download } from "./storage.js";
const date = (value) =>
  new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
export default function Projects() {
  const [rows, setRows] = useState([]),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(""),
    [notice, setNotice] = useState("");
  const [query, setQuery] = useState(""),
    [view, setView] = useState("active"),
    [model, setModel] = useState("all"),
    [sort, setSort] = useState("recent");
  const [busy, setBusy] = useState(false),
    [renaming, setRenaming] = useState(null),
    [title, setTitle] = useState("");
  const fileRef = useRef(null);
  async function refresh() {
    const migration = await projects.ready();
    setRows(await projects.list());
    if (migration.warnings.length) setNotice(migration.warnings.join(" "));
  }
  useEffect(() => {
    const load = () =>
      refresh()
        .catch((e) => setError(e.message))
        .finally(() => setLoading(false));
    load();
    window.addEventListener("focus", load);
    return () => window.removeEventListener("focus", load);
  }, []);
  async function perform(action, message) {
    setBusy(true);
    setError("");
    try {
      await action();
      await refresh();
      if (message) setNotice(message);
    } catch (e) {
      setError(e.message);
      await refresh().catch(() => {});
    } finally {
      setBusy(false);
    }
  }
  async function importFile(event) {
    const file = event.target.files[0];
    event.target.value = "";
    if (!file) return;
    await perform(async () => {
      if (file.size > 64 * 1024 * 1024)
        throw new Error(
          "O arquivo precisa ter até 64 MB. Importe projetos menores separadamente.",
        );
      let raw;
      try {
        raw = JSON.parse(await file.text());
      } catch {
        throw new Error(
          "JSON inválido. Escolha um projeto ou backup exportado pelo Astra3D.",
        );
      }
      if (raw.format === "astra3d-library") {
        const added = await projects.importBackup(raw);
        setNotice(
          `${added.length} projeto(s) importado(s) como novas cópias. Seus projetos existentes foram preservados.`,
        );
      } else {
        const c = validateConfig(raw);
        await projects.create(c, c.name);
        setNotice("Projeto importado como uma nova cópia.");
      }
    });
  }
  async function exportLibrary() {
    await perform(async () => {
      const data = await projects.backup();
      if (data.projects.length > 100)
        throw new Error(
          "O backup aceita até 100 projetos por arquivo. Exporte os projetos individualmente.",
        );
      const text = JSON.stringify(data, null, 2);
      if (new Blob([text]).size > 64 * 1024 * 1024)
        throw new Error(
          "A biblioteca ultrapassa 64 MB. Exporte os projetos individualmente.",
        );
      download(text, "astra3d-biblioteca.json", "application/json");
    }, "Backup baixado. Ele inclui projetos arquivados e versões salvas.");
  }
  const normalized = (s) =>
    s
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  const visible = rows
    .filter(
      (p) =>
        p.archived === (view === "archived") &&
        (model === "all" || p.config.template === model) &&
        normalized(p.title + " " + p.config.name).includes(normalized(query)),
    )
    .sort((a, b) =>
      sort === "name"
        ? a.title.localeCompare(b.title, "pt-BR")
        : b.updatedAt.localeCompare(a.updatedAt),
    );
  return (
    <main id="main" tabIndex={-1} className="projects-main">
      <div className="projects-heading">
        <div>
          <h1>Seu espaço de criação.</h1>
          <p>
            Sites em andamento, ideias para depois.
            <br />
            Tudo organizado neste navegador.
          </p>
        </div>
        <a className="primary-button" href="#modelos">
          <Plus size={17} /> Novo projeto
        </a>
      </div>
      <div className="library-summary">
        <FolderOpen size={18} />
        <span>
          {rows.filter((p) => !p.archived).length} projeto(s) ativo(s)
        </span>
        <span className="local-storage-note">
          Armazenamento local · faça seu backup
        </span>
        <div className="backup-actions">
          <button
            onClick={exportLibrary}
            disabled={busy || loading || !rows.length}
          >
            <Download size={15} /> Baixar backup
          </button>
          <button
            onClick={() => fileRef.current.click()}
            disabled={busy || loading}
          >
            <Upload size={15} /> Importar
          </button>
        </div>
      </div>
      {error && (
        <div className="library-alert" role="alert">
          {error}
          <button
            className="text-link"
            onClick={() => perform(() => Promise.resolve())}
          >
            Tentar novamente
          </button>
        </div>
      )}
      {notice && (
        <div className="library-notice" role="status">
          {notice}
          <button onClick={() => setNotice("")} aria-label="Fechar aviso">
            <X size={16} />
          </button>
        </div>
      )}
      <div className="projects-toolbar">
        <div className="filter-group">
          <button
            aria-pressed={view === "active"}
            onClick={() => setView("active")}
          >
            Ativos
          </button>
          <button
            aria-pressed={view === "archived"}
            onClick={() => setView("archived")}
          >
            Arquivados
          </button>
        </div>
        <label className="project-search">
          <Search size={16} />
          <input
            aria-label="Buscar projetos"
            type="search"
            placeholder="Buscar um projeto..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <select
          aria-label="Filtrar por modelo"
          value={model}
          onChange={(e) => setModel(e.target.value)}
        >
          <option value="all">Todos os modelos</option>
          {templates.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
        <select
          aria-label="Ordenar projetos"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="recent">Mais recentes</option>
          <option value="name">Nome A–Z</option>
        </select>
      </div>
      {loading ? (
        <p role="status" className="library-empty">
          Abrindo seus projetos...
        </p>
      ) : (
        <>
          <p className="results-count" role="status">
            {visible.length} projeto(s) nesta visualização
          </p>
          <div className="project-list">
            {visible.map((p) => {
              const t = templates.find((t) => t.id === p.config.template),
                theme = themes[p.config.theme];
              return (
                <article
                  className="project-row"
                  key={p.id}
                  aria-label={p.title}
                >
                  <div
                    className="project-swatch"
                    style={{ background: theme.soft, color: theme.ink }}
                  >
                    <Box size={25} />
                    <span>{t.name}</span>
                  </div>
                  <div className="project-info">
                    {renaming === p.id ? (
                      <form
                        className="rename-form"
                        onSubmit={(e) => {
                          e.preventDefault();
                          perform(async () => {
                            await projects.rename(p.id, title, p.revision);
                            setRenaming(null);
                          }, "Projeto renomeado.");
                        }}
                      >
                        <input
                          aria-label="Nome do projeto"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          maxLength={80}
                          required
                          autoFocus
                        />
                        <button aria-label="Salvar nome" disabled={busy}>
                          <Check size={18} />
                        </button>
                        <button
                          type="button"
                          aria-label="Cancelar renomeação"
                          onClick={() => setRenaming(null)}
                        >
                          <X size={18} />
                        </button>
                      </form>
                    ) : (
                      <h2>{p.title}</h2>
                    )}
                    <p>
                      {t.kind} <span>·</span> {p.config.name}
                    </p>
                    <small>
                      Atualizado em {date(p.updatedAt)} · {p.snapshots.length}{" "}
                      versão(ões) salva(s)
                    </small>
                  </div>
                  <div className="project-row-actions">
                    {!p.archived && (
                      <a className="secondary-button" href={`#projeto/${p.id}`}>
                        Editar <ArrowUpRight size={15} />
                      </a>
                    )}
                    <button
                      className="icon-button"
                      disabled={busy}
                      title="Renomear"
                      aria-label={`Renomear ${p.title}`}
                      onClick={() => {
                        setRenaming(p.id);
                        setTitle(p.title);
                      }}
                    >
                      <Pencil size={17} />
                    </button>
                    <button
                      className="icon-button"
                      disabled={busy}
                      title="Duplicar"
                      aria-label={`Duplicar ${p.title}`}
                      onClick={() =>
                        perform(
                          () => projects.duplicate(p.id),
                          "Cópia criada como um projeto independente.",
                        )
                      }
                    >
                      <Copy size={17} />
                    </button>
                    <button
                      className="icon-button"
                      title="Exportar projeto JSON"
                      aria-label={`Exportar ${p.title}`}
                      onClick={() =>
                        download(
                          JSON.stringify(p.config, null, 2),
                          fileSlug(p.title) + ".astra3d.json",
                          "application/json",
                        )
                      }
                    >
                      <Download size={17} />
                    </button>
                    <button
                      className="icon-button"
                      disabled={busy}
                      title={p.archived ? "Restaurar" : "Arquivar"}
                      aria-label={`${p.archived ? "Restaurar" : "Arquivar"} ${p.title}`}
                      onClick={() =>
                        perform(
                          () => projects.archive(p.id, !p.archived, p.revision),
                          p.archived
                            ? "Projeto restaurado."
                            : "Projeto arquivado. Encontre-o na aba Arquivados.",
                        )
                      }
                    >
                      {p.archived ? (
                        <ArchiveRestore size={17} />
                      ) : (
                        <Archive size={17} />
                      )}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
          {!visible.length && (
            <section className="library-empty">
              <FolderOpen size={36} />
              <h2>
                {query || model !== "all"
                  ? "Nenhum projeto encontrado."
                  : view === "archived"
                    ? "Nenhum projeto arquivado."
                    : "Sua próxima ideia começa aqui."}
              </h2>
              <p>
                {query || model !== "all"
                  ? "Tente outro nome ou remova os filtros."
                  : view === "archived"
                    ? "Projetos arquivados continuam guardados e podem ser restaurados."
                    : "Escolha um modelo ou importe um projeto que você já começou."}
              </p>
              {view === "active" && !query && model === "all" && (
                <a className="primary-button" href="#modelos">
                  Escolher um modelo <ArrowUpRight size={16} />
                </a>
              )}
            </section>
          )}
        </>
      )}
      <div className="library-help">
        <strong>Seu trabalho continua sendo seu.</strong>
        <p>
          O backup inclui toda a biblioteca e as versões salvas. Importar cria
          novas cópias sem substituir projetos. Limpar os dados do navegador
          remove a biblioteca local.
        </p>
        <a href="./guia/#biblioteca">
          Como guardar e recuperar meus projetos <ArrowUpRight size={14} />
        </a>
      </div>
      <input
        ref={fileRef}
        type="file"
        accept=".json,application/json"
        hidden
        onChange={importFile}
      />
    </main>
  );
}
