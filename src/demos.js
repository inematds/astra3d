import { defaultConfig } from "./config.js";
const start = "https://inematds.github.io/astra3d/#novo/";
export function demoConfig(template) {
  const c = defaultConfig(template);
  c.contactLabel = "Criar um site como este";
  c.contactUrl = start + template;
  if (template === "portfolio") {
    c.name = "Lia Costa · Design";
    c.title = "Boas ideias merecem\num novo olhar.";
    c.description =
      "Identidades visuais e experiências digitais construídas com atenção às pessoas. Um portfólio conceitual para explorar o modelo Órbita.";
    c.about =
      "Lia Costa é uma personagem fictícia criada para esta demonstração. Seu portfólio reúne três estudos conceituais sobre identidade, experiência e estratégia.\n\nExplore os trabalhos, abra os detalhes e role para ver o portal mudar de perspectiva. Você pode criar seu próprio site a partir desse modelo.";
    c.items = [
      {
        id: "item-1",
        title: "Casa do encontro",
        category: "Identidade visual",
        description:
          "Um espaço cultural imaginário que aproxima histórias e pessoas.",
        url: "",
        body: "Projeto conceitual de demonstração.\n\nO desafio\nCriar uma identidade para uma casa cultural que recebe exposições, rodas de conversa e oficinas. A proposta parte de um símbolo de portas abertas.\n\nO processo\nA combinação de formas circulares e tipografia legível ajuda a organizar uma programação diversa. Uma paleta natural aproxima cartazes, sinalização e telas.\n\nA entrega proposta\nSistema visual, cartaz de programação e direção para um site. Não é um trabalho contratado nem um resultado comercial real.",
      },
      {
        id: "item-2",
        title: "Caminhos próximos",
        category: "Experiência digital",
        description: "Uma forma simples de descobrir iniciativas do bairro.",
        url: "",
        body: "Estudo conceitual de demonstração.\n\nO desafio\nComo tornar mais fácil encontrar uma oficina, feira ou atividade perto de casa?\n\nO processo\nO estudo organiza atividades por interesse, local e horário. As informações essenciais aparecem antes dos detalhes para ajudar na decisão.\n\nA proposta\nUma experiência acessível de descoberta de eventos. Este texto ilustra como apresentar contexto, processo e entrega no portfólio.",
      },
      {
        id: "item-3",
        title: "Raiz e horizonte",
        category: "Direção de arte",
        description: "Memória e movimento em uma coleção editorial fictícia.",
        url: "",
        body: "Estudo conceitual de demonstração.\n\nA ideia\nUma coleção de publicações sobre lugares que estão mudando. A direção de arte conecta registros de memória com formas que sugerem continuidade.\n\nAs escolhas\nMargens generosas, títulos claros e uma estrutura que oferece espaço às histórias. O projeto pode se desdobrar em impressos, exposição e arquivo digital.\n\nTodos os projetos desta demonstração são fictícios.",
      },
    ];
  } else if (template === "agency") {
    c.name = "Estúdio Forma";
    c.title = "Uma ideia encontra\nsua melhor forma.";
    c.description =
      "Estratégia, identidade e presença digital. Conheça uma demonstração de como um estúdio pode apresentar seu trabalho com movimento.";
    c.about =
      "O Estúdio Forma é uma marca fictícia criada para demonstrar este modelo. A proposta combina pensamento estratégico, direção de arte e desenvolvimento de experiências digitais.\n\nOs cases abaixo mostram como apresentar o desafio, o processo e a entrega. Não representam clientes reais ou resultados comerciais.";
    c.items = c.items.map((item, i) => ({
      ...item,
      title: [
        "Semente · identidade",
        "Vértice · experiência",
        "Trama · direção de arte",
      ][i],
      description: [
        "Um sistema visual para uma iniciativa de educação imaginária.",
        "Uma presença digital para um espaço criativo fictício.",
        "Um estudo de linguagem visual inspirado em conexões.",
      ][i],
      body: [
        "Case conceitual.\n\nDesafio\nApresentar uma iniciativa educacional com linguagem clara e acolhedora.\n\nProcesso\nOrganizar a mensagem, desenhar uma identidade e explorar aplicações para materiais e ambiente digital.\n\nEntrega proposta\nSistema de identidade, apresentação institucional e direção visual para uma página de inscrição. Não houve cliente ou venda real neste exemplo.",
        "Case conceitual.\n\nDesafio\nReunir programação, apresentação do espaço e contato em uma experiência fácil de explorar.\n\nProcesso\nDefinir uma ordem de leitura, testar navegação e criar uma direção de interface.\n\nEntrega proposta\nUm site responsivo com informações essenciais e espaço para mostrar projetos.",
        "Case conceitual.\n\nDesafio\nCriar uma linguagem que represente a colaboração entre diferentes especialidades.\n\nProcesso\nEstudar curvas, encontros e intervalos entre elementos. A escultura do início da página é um exemplo dessa exploração.\n\nEntrega proposta\nDireção de arte para imagens de campanha e uma apresentação digital. Este é um exercício de demonstração.",
      ][i],
    }));
  } else {
    c.name = "Caderno aberto";
    c.title = "Uma pausa para\nabrir novas ideias.";
    c.description =
      "Ensaios breves sobre criatividade, tecnologia e processo. Leia, busque por uma palavra ou explore as categorias desta publicação de demonstração.";
    c.about =
      "Caderno aberto é uma publicação fictícia criada para você experimentar este modelo. Os três textos são exemplos originais e podem ser lidos na íntegra.\n\nExperimente buscar “ferramentas” e selecionar uma categoria. Depois, personalize o modelo com seus próprios artigos.";
  }
  return c;
}
