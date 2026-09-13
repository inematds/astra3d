export const templates = [
  {
    id: "portfolio",
    name: "Órbita",
    kind: "Portfólio",
    description: "Uma nova perspectiva sobre o seu trabalho.",
    detail: "Portal tridimensional, apresentação e projetos.",
    color: "#dae5ce",
    version: "V1",
  },
  {
    id: "agency",
    name: "Forma",
    kind: "Agência",
    description: "Ideias que ganham presença e movimento.",
    detail: "Escultura em movimento, estúdio e cases.",
    color: "#ddd7eb",
    version: "V1",
  },
  {
    id: "journal",
    name: "Caderno",
    kind: "Publicação",
    description: "Um lugar para suas ideias encontrarem leitores.",
    detail: "Livro 3D, busca e artigos com leitura expandida.",
    color: "#eadbc8",
    version: "V1",
  },
];
export const themes = {
  sage: {
    name: "Jardim",
    bg: "#eef1e9",
    ink: "#243a2e",
    accent: "#3c664a",
    art: "#a0b58a",
    soft: "#dce4d3",
  },
  violet: {
    name: "Ateliê",
    bg: "#f0edf5",
    ink: "#352747",
    accent: "#71508e",
    art: "#ab8bc6",
    soft: "#e2d9ed",
  },
  clay: {
    name: "Argila",
    bg: "#f5eee5",
    ink: "#483024",
    accent: "#975536",
    art: "#c69264",
    soft: "#ead8c3",
  },
  ocean: {
    name: "Oceano",
    bg: "#eaf0f5",
    ink: "#203a50",
    accent: "#2b6187",
    art: "#80a8c1",
    soft: "#d2e1ec",
  },
  ink: {
    name: "Grafite",
    bg: "#212723",
    ink: "#f0f2e9",
    accent: "#c7e499",
    art: "#a9c084",
    soft: "#333e35",
  },
};
export const versions = [
  {
    number: "V1",
    title: "Estúdio visual",
    status: "Disponível",
    text: "Três modelos, prévia, edição local e exportação do seu site.",
    items: [
      "Órbita, Forma e Caderno",
      "Conteúdo, imagem, aparência e seções",
      "Salvar, importar, desfazer e exportar HTML",
    ],
  },
  {
    number: "V2",
    title: "Sua biblioteca",
    status: "Planejado",
    text: "Mais projetos, blocos e possibilidades de personalização.",
    items: [
      "Vários projetos e duplicação",
      "Histórico persistente e organização de seções",
      "Exportação ZIP e biblioteca de assets",
    ],
  },
  {
    number: "V3",
    title: "Criação por conversa",
    status: "Planejado",
    text: "Um chat que propõe ajustes no mesmo projeto do editor.",
    items: [
      "Revisar antes de aplicar",
      "Desfazer mudanças feitas pelo chat",
      "Backend seguro, limites de uso e custos definidos",
    ],
  },
  {
    number: "V4",
    title: "Produtos e esculturas",
    status: "Planejado",
    text: "Duas novas famílias de experiências para explorar.",
    items: [
      "Produto 3D com peças e variantes",
      "Jornada contínua de esculturas",
      "Pipeline de assets e carregamento progressivo",
    ],
  },
  {
    number: "V5",
    title: "Histórias e espaços",
    status: "Planejado",
    text: "Narrativas com escolhas e arquitetura explorável.",
    items: [
      "História com dois caminhos",
      "Tour arquitetônico e pavimentos",
      "Cenas especializadas e versões acessíveis",
    ],
  },
  {
    number: "V6",
    title: "Publicar em equipe",
    status: "Planejado",
    text: "Projetos compartilhados, domínios e publicação integrada.",
    items: [
      "Contas e permissões",
      "Histórico remoto e rollback",
      "Hospedagem dos sites dos usuários",
    ],
  },
];
const copy = {
  portfolio: {
    name: "Seu nome",
    title: "Um olhar diferente.\nNovas possibilidades.",
    description:
      "Transformo ideias em experiências que aproximam pessoas. Conheça meu trabalho e o que podemos criar juntos.",
    about:
      "Este é o espaço para contar sua história. Fale sobre o que você faz, como trabalha e quais desafios gosta de resolver.",
    contactLabel: "Vamos conversar",
    items: [
      {
        title: "Identidade em movimento",
        category: "Design",
        description: "Uma nova forma de apresentar uma ideia.",
        body: "Descreva o contexto do projeto, sua participação e as decisões que fizeram a diferença. Substitua este texto por informações reais.",
      },
      {
        title: "Conexões que importam",
        category: "Experiência",
        description: "Pessoas no centro de cada decisão.",
        body: "Conte como você entendeu o problema e desenvolveu a solução. Use este espaço para mostrar seu processo.",
      },
      {
        title: "Do conceito à prática",
        category: "Estratégia",
        description: "Um caminho claro entre pensar e fazer.",
        body: "Apresente o trabalho com suas próprias palavras. Evite resultados não comprovados e adicione um link para o projeto.",
      },
    ],
  },
  agency: {
    name: "Seu estúdio",
    title: "Damos forma\nao que vem depois.",
    description:
      "Estratégia, identidade e experiências digitais. Um estúdio para marcas que têm algo a dizer.",
    about:
      "Somos um estúdio independente. Acreditamos em boas perguntas, colaboração e ideias construídas com intenção. Apresente aqui a sua equipe e os seus serviços.",
    contactLabel: "Começar um projeto",
    items: [
      {
        title: "Novos pontos de vista",
        category: "Identidade",
        description: "Uma marca que encontra sua própria voz.",
        body: "Desafio: apresente a necessidade do cliente.\n\nProcesso: explique as escolhas de estratégia e design.\n\nEntrega: mostre o que foi produzido. Este é um case de exemplo; substitua por um trabalho real.",
      },
      {
        title: "Uma presença digital",
        category: "Digital",
        description: "Uma experiência desenhada para pessoas.",
        body: "Desafio, processo e entrega. Descreva aqui um projeto real do seu estúdio. Não publique nomes de clientes ou resultados fictícios.",
      },
      {
        title: "Movimento com intenção",
        category: "Direção de arte",
        description: "Expressão em cada detalhe.",
        body: "Use este espaço para explicar o conceito, as referências e a execução. Conteúdo de demonstração.",
      },
    ],
  },
  journal: {
    name: "Seu caderno",
    title: "Ideias merecem\num lugar no mundo.",
    description:
      "Notas sobre criatividade, tecnologia e as pequenas descobertas do caminho. Uma publicação independente.",
    about:
      "Escrevo para organizar pensamentos e encontrar novas perguntas. Conte aos leitores quem você é e o que podem encontrar nesta publicação.",
    contactLabel: "Conhecer a newsletter",
    items: [
      {
        title: "O espaço entre as ideias",
        category: "Criatividade",
        description:
          "Por que deixar uma pergunta descansar pode abrir novos caminhos.",
        body: "Artigo de exemplo.\n\nNem toda ideia precisa nascer pronta. Às vezes, o primeiro passo é fazer uma pergunta melhor e reservar um pouco de espaço para explorá-la.\n\nNo cotidiano, podemos registrar observações sem exigir uma conclusão imediata. Um caderno reúne fragmentos que, com o tempo, começam a conversar.\n\nExperimente escolher uma observação do seu dia e escrever sobre ela por alguns minutos. Este texto demonstra a leitura do modelo; substitua por um artigo seu.",
      },
      {
        title: "Ferramentas e intenção",
        category: "Tecnologia",
        description: "Escolher o que ajuda, entender o que importa.",
        body: "Artigo de exemplo.\n\nUma ferramenta pode encurtar o caminho entre imaginar e experimentar. Mas a direção continua dependendo das perguntas que fazemos.\n\nAntes de adotar um novo recurso, descreva a tarefa que você quer realizar. Teste com um exemplo pequeno e observe o resultado.\n\nEste é um conteúdo demonstrativo. Publique sua própria experiência aqui.",
      },
      {
        title: "Aprender a observar",
        category: "Processo",
        description: "Pequenos registros de um trabalho em construção.",
        body: "Artigo de exemplo.\n\nObservar é dedicar atenção ao que normalmente passa rápido. Uma conversa, uma forma ou uma escolha podem virar matéria para um novo projeto.\n\nGuarde referências com uma frase explicando por que chamaram a sua atenção. Quando voltar a elas, você terá mais do que uma coleção de imagens.\n\nSubstitua este exemplo pelas suas próprias notas.",
      },
    ],
  },
};
export function defaultConfig(template = "portfolio") {
  const seed = copy[template] || copy.portfolio;
  return {
    schemaVersion: 1,
    template: copy[template] ? template : "portfolio",
    ...seed,
    theme:
      template === "agency"
        ? "violet"
        : template === "journal"
          ? "clay"
          : "sage",
    typography: template === "agency" ? "sans" : "editorial",
    motion: "gentle",
    image: "",
    imageAlt: "",
    contactUrl: "",
    showAbout: true,
    showWork: true,
    showContact: true,
    demo: true,
    items: seed.items.map((item, i) => ({
      ...item,
      id: `item-${i + 1}`,
      url: "",
    })),
  };
}
export function safeUrl(value) {
  if (typeof value !== "string" || !value.trim()) return "";
  const s = value.trim();
  if (/[\u0000-\u0020\u007f]/.test(s)) return "";
  try {
    const u = new URL(s);
    return ["https:", "http:", "mailto:"].includes(u.protocol) ? s : "";
  } catch {
    return "";
  }
}
function str(value, max, fallback = "") {
  return typeof value === "string" ? value.slice(0, max) : fallback;
}
export function validateConfig(raw) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw))
    throw new Error("O arquivo precisa conter um projeto Astra3D.");
  if (raw.schemaVersion !== 1)
    throw new Error(
      "Versão de projeto incompatível. Use um JSON exportado pelo Astra3D V1.",
    );
  if (!templates.some((t) => t.id === raw.template))
    throw new Error("Modelo não reconhecido.");
  if (!Array.isArray(raw.items) || raw.items.length > 6)
    throw new Error("O projeto deve conter uma lista de até 6 itens.");
  const d = defaultConfig(raw.template);
  const c = { schemaVersion: 1, template: raw.template };
  for (const [key, max] of Object.entries({
    name: 70,
    title: 160,
    description: 500,
    about: 2000,
    contactLabel: 60,
    imageAlt: 200,
  }))
    c[key] = str(raw[key], max, d[key]);
  c.name = c.name.trim() || d.name;
  c.theme = Object.hasOwn(themes, raw.theme) ? raw.theme : d.theme;
  c.typography = ["editorial", "sans"].includes(raw.typography)
    ? raw.typography
    : d.typography;
  c.motion = ["none", "gentle", "full"].includes(raw.motion)
    ? raw.motion
    : "gentle";
  c.contactUrl = safeUrl(raw.contactUrl);
  c.image =
    typeof raw.image === "string" &&
    raw.image.length <= 3000000 &&
    /^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/]+=*$/.test(raw.image)
      ? raw.image
      : "";
  for (const key of ["showAbout", "showWork", "showContact", "demo"])
    c[key] = typeof raw[key] === "boolean" ? raw[key] : d[key];
  c.items = raw.items.map((item, i) => {
    if (!item || typeof item !== "object" || Array.isArray(item))
      throw new Error("Um dos itens do projeto está inválido.");
    return {
      id: `item-${i + 1}`,
      title: str(item.title, 100, "Novo item"),
      category: str(item.category, 50, "Projeto"),
      description: str(item.description, 350),
      body: str(item.body, 18000),
      url: safeUrl(item.url),
    };
  });
  return c;
}
export const escapeHtml = (v) =>
  String(v ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
export const scriptJson = (value) =>
  JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
export function fileSlug(name) {
  return (
    name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 60) || "meu-site"
  );
}
