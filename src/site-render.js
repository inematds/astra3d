import {
  validateConfig,
  themes,
  escapeHtml as e,
  scriptJson,
  fileSlug,
} from "./config.js";

function interactions() {
  const c = window.ASTRA_CONFIG;
  const main = document.getElementById("site-main");
  const article = document.getElementById("article-view");
  const list = document.getElementById("work");
  const search = document.getElementById("article-search");
  const category = document.getElementById("category-filter");
  const status = document.getElementById("search-status");
  const norm = (s) =>
    s
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  function filter() {
    let count = 0;
    document.querySelectorAll(".item").forEach((el, i) => {
      const item = c.items[i];
      const matches =
        (!search ||
          norm(
            item.title + " " + item.description + " " + item.category,
          ).includes(norm(search.value))) &&
        (!category || !category.value || item.category === category.value);
      el.hidden = !matches;
      if (matches) count++;
    });
    if (status) {
      status.textContent = count
        ? `${count} texto${count === 1 ? "" : "s"} encontrado${count === 1 ? "" : "s"}.`
        : "Nenhum texto encontrado. Tente outra palavra ou categoria.";
    }
  }
  search?.addEventListener("input", filter);
  category?.addEventListener("change", filter);
  function route() {
    const id = location.hash.startsWith("#leitura-")
      ? location.hash.slice(9)
      : null;
    const item = c.items.find((x) => x.id === id);
    if (!item) {
      const wasOpen = !article.hidden;
      main.hidden = false;
      article.hidden = true;
      if (wasOpen) {
        list?.scrollIntoView({ behavior: "instant" });
        document
          .querySelector(`[data-read="${article.dataset.item}"]`)
          ?.focus({ preventScroll: true });
      }
      return;
    }
    article.dataset.item = item.id;
    article.querySelector("h1").textContent = item.title;
    article.querySelector(".article-body").textContent =
      item.body || item.description;
    article.querySelector(".article-meta").textContent =
      item.category +
      " · " +
      Math.max(
        1,
        Math.ceil((item.body || item.description).split(/\s+/).length / 200),
      ) +
      " min de leitura";
    const external = article.querySelector(".external-link");
    external.hidden = !item.url;
    external.href = item.url || "#work";
    main.hidden = true;
    article.hidden = false;
    window.scrollTo({ top: 0, behavior: "instant" });
    article.querySelector("h1").focus({ preventScroll: true });
  }
  document.querySelectorAll("[data-read]").forEach((button) =>
    button.addEventListener("click", () => {
      location.hash = "leitura-" + button.dataset.read;
    }),
  );
  document.getElementById("back-to-work").addEventListener("click", () => {
    location.hash = "work";
  });
  window.addEventListener("hashchange", route);
  route();
  const host = document.getElementById("scene");
  if (host && window.AstraScene)
    window.AstraScene.mount(host, {
      template: c.template,
      color: window.ASTRA_THEME.art,
      background: window.ASTRA_THEME.bg,
      motion: c.motion,
    });
}

export function buildSite(raw, { runtime = "", fonts = "", css = "" } = {}) {
  const c = validateConfig(raw),
    t = themes[c.theme];
  const workTitle =
    c.template === "journal"
      ? "Últimas notas"
      : c.template === "agency"
        ? "Projetos com intenção"
        : "Trabalhos selecionados";
  const contact = c.contactUrl
    ? `<a class="action" href="${e(c.contactUrl)}" target="_blank" rel="noopener noreferrer">${e(c.contactLabel)} <span aria-hidden="true">↗</span></a>`
    : "";
  const section = (id, title) => `<a href="#${id}">${title}</a>`;
  const items = c.items
    .map(
      (item, i) =>
        `<article class="item"><div class="item-art" aria-hidden="true"><span></span></div><span class="item-category">${e(item.category)}</span><h3>${e(item.title)}</h3><p>${e(item.description)}</p><button type="button" class="read-button" data-read="${item.id}">${c.template === "journal" ? "Ler texto" : "Conhecer projeto"} <span aria-hidden="true">↗</span></button></article>`,
    )
    .join("");
  const categories = [...new Set(c.items.map((x) => x.category))];
  const script = `${runtime}\nwindow.ASTRA_CONFIG=${scriptJson(c)};window.ASTRA_THEME=${scriptJson(t)};(${interactions.toString()})();`;
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="${e(c.description)}"><meta name="theme-color" content="${t.bg}"><title>${e(c.name)} — ${e(c.title.replace(/\n/g, " "))}</title><style>${fonts}\n:root{--bg:${t.bg};--ink:${t.ink};--accent:${t.accent};--soft:${t.soft};--display:'${c.typography === "sans" ? "Manrope" : "DM Serif Display"}';--weight:${c.typography === "sans" ? 700 : 400}}${css}</style></head><body class="${c.template} ${c.motion === "none" ? "no-motion" : ""}">
 <a class="sr-only" href="#site-main">Pular para o conteúdo</a>
 <header class="site-nav"><a class="brand" href="#top">${e(c.name)}</a><nav class="nav-links" aria-label="Navegação principal">${c.showAbout ? section("about", "Sobre") : ""}${c.showWork ? section("work", c.template === "journal" ? "Textos" : "Projetos") : ""}${c.showContact ? section("contact", "Contato") : ""}</nav></header>
 ${c.demo ? '<p class="demo-note">Conteúdo de exemplo · personalize com suas informações antes de publicar.</p>' : ""}
 <main id="site-main" tabindex="-1"><section class="hero" id="top"><div class="hero-copy"><h1>${e(c.title)}</h1><p>${e(c.description)}</p>${contact || (c.showWork ? `<a class="action" href="#work">${c.template === "journal" ? "Explorar as notas" : "Explorar o trabalho"} <span aria-hidden="true">↘</span></a>` : "")}</div><div class="hero-art"><div id="scene" class="scene-host" aria-hidden="true"><div class="fallback-art"></div></div>${c.image ? `<img class="portrait" src="${e(c.image)}" alt="${e(c.imageAlt || c.name)}" width="500" height="650">` : ""}</div><span class="scroll-note">${c.motion === "none" ? "Explore no seu ritmo" : "Role para descobrir outra perspectiva"} ↓</span></section>
 ${c.showAbout ? `<section class="content-section about" id="about"><h2>${c.template === "agency" ? "Um estúdio.\nMuitas perspectivas." : c.template === "journal" ? "Por trás das palavras" : "Prazer, " + e(c.name) + "."}</h2><p>${e(c.about)}</p></section>` : ""}
 ${c.showWork ? `<section class="content-section" id="work"><div class="section-head"><h2>${workTitle}</h2><span>${c.items.length} ${c.template === "journal" ? "textos" : "projetos"}</span></div>${c.template === "journal" ? `<div class="search-row"><label class="sr-only" for="article-search">Buscar textos</label><input id="article-search" type="search" placeholder="Buscar uma ideia..."><label class="sr-only" for="category-filter">Categoria</label><select id="category-filter"><option value="">Todas as categorias</option>${categories.map((x) => `<option value="${e(x)}">${e(x)}</option>`).join("")}</select></div><p class="article-meta" id="search-status" role="status" aria-live="polite"></p>` : ""}<div class="items">${items || '<p class="empty">Novos trabalhos serão apresentados aqui.</p>'}</div></section>` : ""}
 ${c.showContact ? `<section class="content-section contact" id="contact"><div><h2>${e(c.contactLabel)}</h2><p>${c.contactUrl ? "Toda boa colaboração começa com uma conversa." : c.demo ? "Adicione seu link de contato no editor para receber mensagens." : "Novas possibilidades começam por aqui."}</p></div>${contact}</section>` : ""}</main>
 <section id="article-view" class="article-view" hidden aria-label="Leitura"><button class="read-button" id="back-to-work">← Voltar</button><p class="article-meta"></p><h1 tabindex="-1"></h1><p class="article-body"></p><a class="action external-link" target="_blank" rel="noopener noreferrer">Visitar link ↗</a></section>
 <footer class="site-footer"><span>${e(c.name)}</span><a href="https://inematds.github.io/astra3d/" target="_blank" rel="noopener noreferrer">Criado com Astra3D</a></footer>
 <script>${script.replace(/<\/script/gi, "<\\/script")}</script></body></html>`;
}
