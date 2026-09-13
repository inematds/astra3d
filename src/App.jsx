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
const Editor = lazy(() => import("./Editor.jsx"));
const Scene = lazy(() => import("./Scene.jsx"));
const REPO = "https://github.com/inematds/astra3d";
const GUIDE = "./guia/";
function routeFromHash() {
  const r = location.hash.slice(1);
  return r.startsWith("editor/") &&
    templates.some((t) => t.id === r.split("/")[1])
    ? r
    : r === "versoes"
      ? r
      : "modelos";
}
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
function App() {
  const [route, setRoute] = useState(routeFromHash);
  useEffect(() => {
    const cb = () => {
      setRoute(routeFromHash());
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", cb);
    return () => window.removeEventListener("hashchange", cb);
  }, []);
  const editor = route.startsWith("editor/");
  return (
    <>
      <a
        className="skip-link"
        href="#main"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById("main")?.focus();
        }}
      >
        Pular para o conteúdo
      </a>
      {!editor && (
        <header className="app-header">
          <Logo />
          <nav aria-label="Navegação principal">
            <a
              href="#modelos"
              aria-current={route === "modelos" ? "page" : undefined}
            >
              Modelos
            </a>
            <a
              href="#versoes"
              aria-current={route === "versoes" ? "page" : undefined}
            >
              Próximas versões
            </a>
            <a href={GUIDE}>
              Guia de uso <ArrowUpRight size={13} />
            </a>
          </nav>
          <a
            className="community-link"
            href="https://inema.club"
            target="_blank"
            rel="noopener noreferrer"
          >
            Uma criação INEMA <ArrowUpRight size={14} />
          </a>
        </header>
      )}
      {editor ? (
        <Suspense
          fallback={
            <main id="main" tabIndex={-1} className="loading-editor">
              Preparando seu estúdio...
            </main>
          }
        >
          <Editor key={route} template={route.split("/")[1]} />
        </Suspense>
      ) : route === "versoes" ? (
        <Roadmap />
      ) : (
        <Gallery />
      )}
      {!editor && (
        <footer className="app-footer">
          <Logo />
          <p>Ferramentas para transformar ideias em presença.</p>
          <div>
            <a
              href="https://inema.club"
              target="_blank"
              rel="noopener noreferrer"
            >
              INEMA.CLUB ↗
            </a>
            <a href={REPO} target="_blank" rel="noopener noreferrer">
              <Code2 size={16} /> Código aberto
            </a>
          </div>
        </footer>
      )}
    </>
  );
}
function Gallery() {
  const [filter, setFilter] = useState("Todos");
  const categories = ["Todos", "Portfólio", "Agência", "Publicação"];
  return (
    <main id="main" tabIndex={-1} className="gallery-main">
      <section className="gallery-intro">
        <div>
          <h1>
            Seu próximo site.
            <br />
            <span>Com outra dimensão.</span>
          </h1>
          <p>
            Escolha um ponto de partida, dê o seu toque
            <br className="desktop-break" /> e leve uma experiência 3D para o
            mundo.
          </p>
        </div>
        <div className="intro-note">
          <span className="note-dot" />
          Seu conteúdo. Seu site.
          <p>
            Sem conta. Sem código.
            <br />
            Feito para você experimentar.
          </p>
          <a href={GUIDE}>
            Como funciona <ArrowUpRight size={17} />
          </a>
        </div>
      </section>
      <section aria-label="Biblioteca de modelos">
        <div className="library-toolbar">
          <div className="filter-group" aria-label="Filtrar modelos">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                aria-pressed={c === filter}
              >
                {c}
              </button>
            ))}
          </div>
          <span className="model-count">3 modelos para começar</span>
        </div>
        <div className="template-grid">
          {templates
            .filter((t) => filter === "Todos" || t.kind === filter)
            .map((t, i) => (
              <article className={`template-card ${t.id}`} key={t.id}>
                <a
                  className="template-visual"
                  href={`#editor/${t.id}`}
                  style={{ background: t.color }}
                  aria-label={`Personalizar ${t.name}`}
                >
                  <span className="mini-brand">
                    {t.id === "portfolio"
                      ? "um novo olhar"
                      : t.id === "agency"
                        ? "forma / estúdio"
                        : "notas de um caderno"}
                  </span>
                  <span className="mini-title">
                    {t.id === "portfolio" ? (
                      <>
                        Além
                        <br />
                        do óbvio.
                      </>
                    ) : t.id === "agency" ? (
                      <>
                        Ideias
                        <br />
                        em forma.
                      </>
                    ) : (
                      <>
                        Entre
                        <br />
                        as ideias.
                      </>
                    )}
                  </span>
                  <div className="card-scene">
                    <Suspense fallback={<div className="scene-placeholder" />}>
                      <Scene
                        template={t.id}
                        color={
                          themes[
                            t.id === "agency"
                              ? "violet"
                              : t.id === "journal"
                                ? "clay"
                                : "sage"
                          ].art
                        }
                      />
                    </Suspense>
                  </div>
                  <span className="visual-bottom">
                    {t.kind} · 3D interativo
                    <span>
                      Explorar <ArrowUpRight size={15} />
                    </span>
                  </span>
                </a>
                <div className="template-meta">
                  <div>
                    <h2>{t.name}</h2>
                    <p>{t.description}</p>
                  </div>
                  <a
                    className="circle-link"
                    href={`#editor/${t.id}`}
                    aria-label={`Abrir editor ${t.name}`}
                  >
                    <ArrowUpRight size={21} />
                  </a>
                </div>
                <div className="template-tags">
                  <span>{t.kind}</span>
                  <span>Responsivo</span>
                  <span>Exportável</span>
                </div>
              </article>
            ))}
        </div>
      </section>
      <section className="how-strip">
        <div className="how-heading">
          <h2>Da ideia ao seu site.</h2>
          <a href={GUIDE}>
            Veja o guia completo <ArrowUpRight size={15} />
          </a>
        </div>
        <ol>
          <li>
            <span>1</span>
            <div>
              <strong>Escolha a experiência</strong>
              <p>Comece com um modelo que combina com você.</p>
            </div>
          </li>
          <li>
            <span>2</span>
            <div>
              <strong>Deixe com a sua cara</strong>
              <p>Textos, imagens e cores. Veja tudo na prévia.</p>
            </div>
          </li>
          <li>
            <span>3</span>
            <div>
              <strong>Leve para o mundo</strong>
              <p>Baixe o site pronto e publique onde preferir.</p>
            </div>
          </li>
        </ol>
      </section>
      <section className="future-strip">
        <div>
          <MessageSquare size={24} />
          <div>
            <h2>Uma conversa também pode criar.</h2>
            <p>O chat de personalização faz parte dos próximos passos.</p>
          </div>
        </div>
        <a className="text-link" href="#versoes">
          Conheça os planos <ArrowRight size={18} />
        </a>
      </section>
    </main>
  );
}
function Roadmap() {
  return (
    <main id="main" tabIndex={-1} className="roadmap-main">
      <a className="back-link" href="#modelos">
        <ArrowLeft size={16} /> Voltar aos modelos
      </a>
      <div className="roadmap-intro">
        <h1>
          Um estúdio em construção.
          <br />
          <span>Um caminho aberto.</span>
        </h1>
        <p>
          A primeira versão já pode ser usada. Aqui está a evolução planejada —
          cada etapa tem entregas e critérios próprios, sem datas prometidas.
        </p>
        <a className="text-link" href="./docs/PLANO-VERSOES.md" download>
          Baixar o plano completo <Download size={17} />
        </a>
      </div>
      <div className="version-list">
        {versions.map((v) => (
          <article className="version-row" key={v.number}>
            <div className="version-number">
              {v.number}
              <span className={v.number === "V1" ? "status live" : "status"}>
                {v.status}
              </span>
            </div>
            <div>
              <h2>{v.title}</h2>
              <p>{v.text}</p>
            </div>
            <ul>
              {v.items.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
      <p className="roadmap-footnote">
        O chat precisará de um serviço de IA e backend próprios. A versão atual
        funciona localmente no navegador e exporta os sites em HTML.
      </p>
    </main>
  );
}
export default App;
