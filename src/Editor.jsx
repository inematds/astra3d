import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  lazy,
  Suspense,
} from "react";
import {
  ArrowUpRight,
  ArrowRight,
  ArrowLeft,
  Box,
  Check,
  Monitor,
  Smartphone,
  Undo2,
  Redo2,
  Download,
  Upload,
  SlidersHorizontal,
  Type,
  Layers,
  Plus,
  Trash2,
  ImagePlus,
  X,
  BookOpen,
  Code2,
  CircleHelp,
  MessageSquare,
  ExternalLink,
  RotateCcw,
} from "lucide-react";
import {
  templates,
  themes,
  defaultConfig,
  validateConfig,
  versions,
  safeUrl,
  fileSlug,
} from "./config.js";
import { readDraft, saveDraft, download, readImage } from "./storage.js";
import { renderSite } from "./site.js";

const GUIDE = "./guia/";
function Logo() {
  return (
    <a className="logo" href="#modelos" aria-label="Astra3D, modelos">
      <span className="logo-symbol">
        <Box size={21} />
      </span>
      Astra<span className="logo-light">3D</span>
    </a>
  );
}
function Field({ label, children, help }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
      {help && <small>{help}</small>}
    </label>
  );
}
function Editor({ template }) {
  const [history, setHistory] = useState(() => ({
    past: [],
    present: readDraft(template),
    future: [],
  }));
  const config = history.present;
  const [tab, setTab] = useState("content");
  const [device, setDevice] = useState("desktop");
  const [mobilePanel, setMobilePanel] = useState("edit");
  const [saved, setSaved] = useState(true);
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [previewConfig, setPreviewConfig] = useState(config);
  const importRef = useRef(null),
    imageRef = useRef(null),
    resetRef = useRef(null);
  const selected = templates.find((t) => t.id === template);
  useEffect(() => {
    setSaved(saveDraft(config));
    const timer = setTimeout(() => setPreviewConfig(config), 250);
    return () => clearTimeout(timer);
  }, [config]);
  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(""), 7000);
    return () => clearTimeout(t);
  }, [notice]);
  useEffect(() => {
    if (confirmReset) resetRef.current.showModal();
  }, [confirmReset]);
  const html = useMemo(() => renderSite(previewConfig), [previewConfig]);
  function change(patch) {
    setHistory((h) => ({
      past: [...h.past.slice(-39), h.present],
      present: { ...h.present, ...patch },
      future: [],
    }));
  }
  function undo() {
    setHistory((h) =>
      h.past.length
        ? {
            past: h.past.slice(0, -1),
            present: h.past.at(-1),
            future: [h.present, ...h.future],
          }
        : h,
    );
  }
  function redo() {
    setHistory((h) =>
      h.future.length
        ? {
            past: [...h.past, h.present],
            present: h.future[0],
            future: h.future.slice(1),
          }
        : h,
    );
  }
  function updateItem(i, patch) {
    change({
      items: config.items.map((item, j) =>
        j === i ? { ...item, ...patch } : item,
      ),
    });
  }
  async function importProject(event) {
    const file = event.target.files[0];
    event.target.value = "";
    if (!file) return;
    try {
      if (file.size > 4 * 1024 * 1024)
        throw new Error("O JSON precisa ter até 4 MB.");
      const next = validateConfig(JSON.parse(await file.text()));
      if (next.template !== template) {
        if (!saveDraft(next))
          throw new Error(
            "Não foi possível salvar o projeto importado. Exporte o rascunho atual e libere espaço no navegador.",
          );
        location.hash = "editor/" + next.template;
      } else change(next);
      setNotice("Projeto importado. Confira o conteúdo na prévia.");
    } catch (err) {
      setNotice(
        err instanceof SyntaxError
          ? "Não foi possível ler o JSON. Escolha um projeto exportado pelo Astra3D."
          : err.message,
      );
    }
  }
  async function uploadImage(event) {
    const file = event.target.files[0];
    event.target.value = "";
    if (!file) return;
    setBusy(true);
    try {
      const image = await readImage(file);
      if (image.length > 3000000)
        throw new Error(
          "A imagem ainda está grande. Escolha uma imagem menor.",
        );
      change({ image });
      setNotice("Imagem adicionada ao projeto.");
    } catch (err) {
      setNotice(
        err.message || "Não foi possível abrir a imagem. Tente outro arquivo.",
      );
    } finally {
      setBusy(false);
    }
  }
  function exportHtml() {
    download(
      renderSite(config),
      fileSlug(config.name) + ".html",
      "text/html;charset=utf-8",
    );
    setNotice("Site exportado. Abra o HTML no navegador para conferir.");
  }
  const textInput = (key, max, multiline = false) =>
    multiline ? (
      <textarea
        value={config[key]}
        maxLength={max}
        rows={key === "about" ? 5 : 3}
        onChange={(e) => change({ [key]: e.target.value })}
      />
    ) : (
      <input
        value={config[key]}
        maxLength={max}
        onChange={(e) => change({ [key]: e.target.value })}
      />
    );
  const linkInvalid = config.contactUrl && !safeUrl(config.contactUrl);
  return (
    <div className="editor-shell">
      <header className="editor-header">
        <Logo />
        <div className="editor-identity">
          <span className="header-divider" />
          <div>
            <strong>{selected.name}</strong>
            <span>{selected.kind}</span>
          </div>
        </div>
        <div className="save-state" role="status">
          <span className={saved ? "save-dot" : "save-dot warning"} />
          {saved ? "Salvo neste navegador" : "Sem espaço para salvar"}
        </div>
        <div className="editor-actions">
          <button
            className="icon-button"
            onClick={undo}
            disabled={!history.past.length}
            aria-label="Desfazer"
            title="Desfazer"
          >
            <Undo2 size={18} />
          </button>
          <button
            className="icon-button"
            onClick={redo}
            disabled={!history.future.length}
            aria-label="Refazer"
            title="Refazer"
          >
            <Redo2 size={18} />
          </button>
          <button className="primary-button" onClick={exportHtml}>
            <Download size={16} />
            <span>Exportar site</span>
          </button>
        </div>
      </header>
      <div className="mobile-switch">
        <button
          aria-pressed={mobilePanel === "edit"}
          onClick={() => setMobilePanel("edit")}
        >
          Personalizar
        </button>
        <button
          aria-pressed={mobilePanel === "preview"}
          onClick={() => setMobilePanel("preview")}
        >
          Ver prévia
        </button>
      </div>
      <main
        id="main"
        tabIndex={-1}
        className={`editor-main mobile-${mobilePanel}`}
      >
        <aside className="editor-sidebar" aria-label="Personalizar site">
          <div className="sidebar-title">
            <a href="#modelos">
              <ArrowLeft size={15} /> Modelos
            </a>
            <a
              href={GUIDE}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Abrir guia de uso"
            >
              <CircleHelp size={19} />
            </a>
          </div>
          <h1>Deixe com a sua cara.</h1>
          <p className="sidebar-description">
            Seu conteúdo transforma o modelo.
          </p>
          <div
            className="editor-tabs"
            role="tablist"
            aria-label="Opções de personalização"
            onKeyDown={(event) => {
              const ids = ["content", "style", "sections"];
              const i = ids.indexOf(tab);
              const next =
                event.key === "ArrowRight"
                  ? (i + 1) % 3
                  : event.key === "ArrowLeft"
                    ? (i + 2) % 3
                    : event.key === "Home"
                      ? 0
                      : event.key === "End"
                        ? 2
                        : null;
              if (next !== null) {
                event.preventDefault();
                setTab(ids[next]);
                document.getElementById("tab-" + ids[next])?.focus();
              }
            }}
          >
            {[
              { id: "content", label: "Conteúdo", icon: Type },
              { id: "style", label: "Aparência", icon: SlidersHorizontal },
              { id: "sections", label: "Seções", icon: Layers },
            ].map((t) => (
              <button
                role="tab"
                tabIndex={tab === t.id ? 0 : -1}
                id={"tab-" + t.id}
                aria-controls={"panel-" + t.id}
                aria-selected={tab === t.id}
                key={t.id}
                onClick={() => setTab(t.id)}
              >
                <t.icon size={17} />
                {t.label}
              </button>
            ))}
          </div>
          <div
            className="tab-content"
            role="tabpanel"
            id={"panel-" + tab}
            aria-labelledby={"tab-" + tab}
          >
            {tab === "content" && (
              <>
                <Field
                  label={
                    template === "portfolio" ? "Seu nome" : "Nome da marca"
                  }
                >
                  {textInput("name", 70)}
                </Field>
                <Field label="Chamada principal">
                  {textInput("title", 160, true)}
                </Field>
                <Field label="Apresentação">
                  {textInput("description", 500, true)}
                </Field>
                <Field label="Sobre">{textInput("about", 2000, true)}</Field>
                <div className="field">
                  <span>Imagem principal</span>
                  {config.image ? (
                    <div className="image-preview">
                      <img src={config.image} alt="Imagem selecionada" />
                      <button
                        className="icon-button"
                        onClick={() => change({ image: "" })}
                        aria-label="Remover imagem"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <button
                      className="upload-zone"
                      onClick={() => imageRef.current.click()}
                      disabled={busy}
                    >
                      <ImagePlus size={23} />
                      <strong>
                        {busy ? "Preparando imagem..." : "Adicionar sua imagem"}
                      </strong>
                      <span>PNG, JPG ou WebP · até 8 MB</span>
                    </button>
                  )}
                  <small>O arquivo fica no seu navegador.</small>
                </div>
                {config.image && (
                  <Field
                    label="Descrição da imagem"
                    help="Descreva a imagem para quem usa leitor de tela."
                  >
                    {textInput("imageAlt", 200)}
                  </Field>
                )}
                <Field label="Texto do botão de contato">
                  {textInput("contactLabel", 60)}
                </Field>
                <Field
                  label="Link de contato"
                  help="Use https:// ou mailto:voce@exemplo.com."
                >
                  <input
                    value={config.contactUrl}
                    onChange={(e) => change({ contactUrl: e.target.value })}
                    placeholder="https://..."
                    aria-invalid={!!linkInvalid}
                  />
                </Field>
                {linkInvalid && (
                  <p className="field-error">
                    Link inválido. Use um endereço completo; ele não será
                    incluído na exportação.
                  </p>
                )}
              </>
            )}
            {tab === "style" && (
              <>
                <div className="field">
                  <span>Paleta de cores</span>
                  <div className="palette-list">
                    {Object.entries(themes).map(([key, t]) => (
                      <button
                        key={key}
                        className="palette-option"
                        aria-pressed={config.theme === key}
                        onClick={() => change({ theme: key })}
                      >
                        <span className="palette-dots">
                          {[t.bg, t.art, t.ink].map((color) => (
                            <i style={{ background: color }} key={color} />
                          ))}
                        </span>
                        {t.name}
                        {config.theme === key && <Check size={16} />}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="field">
                  <span>Tipografia</span>
                  <button
                    className={`font-option editorial-font ${config.typography === "editorial" ? "selected" : ""}`}
                    aria-pressed={config.typography === "editorial"}
                    onClick={() => change({ typography: "editorial" })}
                  >
                    <span>Um olhar editorial.</span>
                    <small>DM Serif Display + Manrope</small>
                  </button>
                  <button
                    className={`font-option ${config.typography === "sans" ? "selected" : ""}`}
                    aria-pressed={config.typography === "sans"}
                    onClick={() => change({ typography: "sans" })}
                  >
                    <span>Clareza em cada ideia.</span>
                    <small>Manrope</small>
                  </button>
                </div>
                <Field label="Movimento da cena">
                  <select
                    value={config.motion}
                    onChange={(e) => change({ motion: e.target.value })}
                  >
                    <option value="none">Sem movimento</option>
                    <option value="gentle">Suave</option>
                    <option value="full">Expressivo</option>
                  </select>
                </Field>
                <div className="helper-note">
                  <SlidersHorizontal size={18} />
                  <p>
                    O movimento acompanha a rolagem. A preferência de movimento
                    reduzido do dispositivo sempre é respeitada.
                  </p>
                </div>
              </>
            )}
            {tab === "sections" && (
              <>
                <div className="section-toggles">
                  {[
                    { key: "showAbout", name: "Sobre" },
                    {
                      key: "showWork",
                      name: template === "journal" ? "Textos" : "Projetos",
                    },
                    { key: "showContact", name: "Contato" },
                    { key: "demo", name: "Aviso de conteúdo de exemplo" },
                  ].map((item) => (
                    <label className="toggle-row" key={item.key}>
                      <span>{item.name}</span>
                      <input
                        type="checkbox"
                        checked={config[item.key]}
                        onChange={(e) =>
                          change({ [item.key]: e.target.checked })
                        }
                      />
                    </label>
                  ))}
                </div>
                <p className="field-help">
                  Retire o aviso de exemplo somente depois de inserir seu
                  próprio conteúdo.
                </p>
                <h2 className="sidebar-section-heading">
                  {template === "journal" ? "Seus textos" : "Seus projetos"}{" "}
                  <span>{config.items.length}/6</span>
                </h2>
                {config.items.map((item, i) => (
                  <details className="item-editor" key={item.id + "-" + i}>
                    <summary>{item.title || "Novo item"}</summary>
                    <Field label="Título">
                      <input
                        value={item.title}
                        maxLength={100}
                        onChange={(e) =>
                          updateItem(i, { title: e.target.value })
                        }
                      />
                    </Field>
                    <Field label="Categoria">
                      <input
                        value={item.category}
                        maxLength={50}
                        onChange={(e) =>
                          updateItem(i, { category: e.target.value })
                        }
                      />
                    </Field>
                    <Field label="Resumo">
                      <textarea
                        value={item.description}
                        maxLength={350}
                        rows={3}
                        onChange={(e) =>
                          updateItem(i, { description: e.target.value })
                        }
                      />
                    </Field>
                    <Field
                      label={
                        template === "journal"
                          ? "Texto completo"
                          : "Detalhes do projeto"
                      }
                    >
                      <textarea
                        value={item.body}
                        maxLength={18000}
                        rows={7}
                        onChange={(e) =>
                          updateItem(i, { body: e.target.value })
                        }
                      />
                    </Field>
                    <Field label="Link externo (opcional)">
                      <input
                        value={item.url}
                        onChange={(e) => updateItem(i, { url: e.target.value })}
                        placeholder="https://..."
                        aria-invalid={!!item.url && !safeUrl(item.url)}
                      />
                    </Field>
                    {item.url && !safeUrl(item.url) && (
                      <p className="field-error">
                        Use um link completo com https://.
                      </p>
                    )}
                    <button
                      className="danger-button"
                      onClick={() =>
                        change({
                          items: config.items.filter((_, j) => i !== j),
                        })
                      }
                    >
                      <Trash2 size={14} /> Remover item
                    </button>
                  </details>
                ))}
                <button
                  className="secondary-button full-width"
                  disabled={config.items.length >= 6}
                  onClick={() =>
                    change({
                      items: [
                        ...config.items,
                        {
                          id: "item-" + Date.now(),
                          title: "Novo item",
                          category:
                            template === "journal" ? "Notas" : "Projeto",
                          description: "",
                          body: "",
                          url: "",
                        },
                      ],
                    })
                  }
                >
                  <Plus size={16} /> Adicionar{" "}
                  {template === "journal" ? "texto" : "projeto"}
                </button>
              </>
            )}
          </div>
          <div className="sidebar-bottom">
            <div className="project-tools">
              <button
                onClick={() =>
                  download(
                    JSON.stringify(validateConfig(config), null, 2),
                    fileSlug(config.name) + ".astra3d.json",
                    "application/json",
                  )
                }
              >
                <Download size={15} /> Salvar JSON
              </button>
              <button onClick={() => importRef.current.click()}>
                <Upload size={15} /> Importar JSON
              </button>
            </div>
            <button
              className="reset-button"
              onClick={() => setConfirmReset(true)}
            >
              <RotateCcw size={13} /> Restaurar este modelo
            </button>
          </div>
        </aside>
        <section className="preview-area" aria-label="Prévia do site">
          <div className="preview-toolbar">
            <span>
              <span className="live-dot" /> Prévia ao vivo
            </span>
            <div className="device-controls" aria-label="Tamanho da prévia">
              <button
                aria-label="Prévia computador"
                aria-pressed={device === "desktop"}
                onClick={() => setDevice("desktop")}
              >
                <Monitor size={17} />
              </button>
              <button
                aria-label="Prévia celular"
                aria-pressed={device === "mobile"}
                onClick={() => setDevice("mobile")}
              >
                <Smartphone size={17} />
              </button>
            </div>
            <span className="preview-size">
              {device === "mobile" ? "390 px" : "Adaptável"}
            </span>
          </div>
          <div
            className={`preview-stage ${device === "mobile" ? "device-mobile" : ""}`}
          >
            <iframe
              title="Prévia do seu site"
              srcDoc={html}
              sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox"
            />
          </div>
          <div className="preview-footer">
            <span>Role dentro da prévia para explorar o site.</span>
            <a href="#versoes">
              <MessageSquare size={14} /> Chat nos próximos passos{" "}
              <ArrowUpRight size={13} />
            </a>
          </div>
        </section>
      </main>
      {!saved && (
        <div className="storage-warning" role="alert">
          Não foi possível salvar neste navegador. Baixe o JSON para guardar
          suas alterações.
        </div>
      )}
      {notice && (
        <div className="toast" role="status">
          {notice}
          <button aria-label="Fechar aviso" onClick={() => setNotice("")}>
            <X size={15} />
          </button>
        </div>
      )}
      <input
        ref={importRef}
        type="file"
        accept=".json,application/json"
        hidden
        onChange={importProject}
      />
      <input
        ref={imageRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        hidden
        onChange={uploadImage}
      />
      {confirmReset && (
        <dialog
          ref={resetRef}
          className="reset-dialog"
          onCancel={() => setConfirmReset(false)}
        >
          <h2>Restaurar o modelo?</h2>
          <p>
            Textos, imagem e aparência voltam ao exemplo inicial. Você pode
            desfazer essa ação durante esta sessão.
          </p>
          <div>
            <button
              className="secondary-button"
              autoFocus
              onClick={() => setConfirmReset(false)}
            >
              Continuar editando
            </button>
            <button
              className="primary-button"
              onClick={() => {
                change(defaultConfig(template));
                setConfirmReset(false);
              }}
            >
              Restaurar modelo
            </button>
          </div>
        </dialog>
      )}
    </div>
  );
}

export default Editor;
