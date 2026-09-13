---
name: Astra3D
description: Bancada de criação com branco mineral, tinta verde, acento lima e arte tridimensional.
colors:
  paper: "#f7f8f4"
  white: "#fff"
  ink: "#242d27"
  muted: "#60695f"
  line: "#dfe4da"
  soft: "#eef1e9"
  accent: "#d0ec86"
  green: "#384b36"
  focus: "#537a35"
  primary-hover: "#405137"
  export-ink: "#2a3921"
  field-line: "#d8dfd2"
  field-invalid: "#ac432a"
  error: "#a13e22"
  selected-line: "#547337"
  selected-bg: "#f3f7ec"
  preview-bg: "#e9ece5"
typography:
  display:
    fontFamily: "Manrope, sans-serif"
    fontSize: "clamp(36px, 4.25vw, 61px)"
    fontWeight: 600
    lineHeight: 1.12
    letterSpacing: "-0.04em"
  display-editorial:
    fontFamily: "DM Serif Display, serif"
    fontWeight: 400
  title:
    fontFamily: "Manrope, sans-serif"
    fontSize: "23px"
    fontWeight: 600
    letterSpacing: "-0.03em"
  body:
    fontFamily: "Manrope, sans-serif"
    fontSize: "15px"
    lineHeight: 1.8
  control:
    fontFamily: "Manrope, sans-serif"
    fontSize: "12px"
    fontWeight: 700
    lineHeight: 1.5
  label:
    fontFamily: "Manrope, sans-serif"
    fontSize: "11px"
    fontWeight: 700
rounded:
  control: "6px"
  icon: "5px"
  preview: "9px"
  surface: "12px"
  mobile-preview: "20px"
spacing:
  field-gap: "8px"
  control-gap: "9px"
  panel: "24px"
  gallery-gap: "27px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.white}"
    rounded: "{rounded.control}"
    padding: "11px 17px"
    typography: "{typography.control}"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-export:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.export-ink}"
    rounded: "{rounded.control}"
    padding: "11px 17px"
    typography: "{typography.control}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "11px 17px"
    typography: "{typography.control}"
  field:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "11px 12px"
  filter-selected:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.control}"
    padding: "9px 16px"
  template-visual:
    rounded: "{rounded.surface}"
---

# Design System: Astra3D

## Overview

**Creative North Star: “Bancada de criação”.** Direção registrada no contrato de `index.html`: branco mineral, tinta verde, acento lima, controles precisos e arte tridimensional em grande escala. A interface usa superfícies claras e tipografia contida para dar espaço ao trabalho da pessoa.

Este documento descreve a implementação V1 e sua extensão V2.0 em `src/style.css`, `src/site.css`, `src/config.js`, `src/App.jsx`, `src/Editor.jsx` e `src/Projects.jsx`. Os tokens acima pertencem à galeria e ao editor; as paletas dos sites e a identidade INEMA do guia têm escopos próprios.

Características: composição espaçosa na galeria; controles compactos no editor; hierarquia por contraste, divisórias e escala; conteúdo HTML legível com ou sem WebGL. Idioma da interface: português brasileiro.

## Colors

A paleta da aplicação combina neutros minerais levemente verdes com tinta escura e lima.

- **Primary:** `accent` destaca exportação, disponibilidade e alguns estados de interação. `green` identifica abas ativas; `focus` destaca navegação por teclado.
- **Neutral:** `paper` é o fundo geral; `white`, os controles e o painel; `ink`, o texto principal; `muted`, descrições e metadados; `line`, separadores; `soft`, superfícies secundárias. `preview-bg` distingue a bancada da página exibida.
- **Estados:** seleção usa `selected-line` e `selected-bg`; links inválidos usam `field-invalid` e uma explicação em `error`. Não depender apenas da cor para informar seleção ou erro.

**Regra de escopo.** Alterar a paleta de um site não altera a identidade do editor. Os cinco conjuntos completos de fundo/tinta/acento/arte/superfície estão em `themes`, em `src/config.js`: Jardim, Ateliê, Argila, Oceano e Grafite. Preserve esses pares ao criar variantes; cores da arte 3D não são automaticamente cores adequadas para texto.

O guia em `guia/index.html` segue o template INEMA separado: fundo escuro (#0c0c10), cards (#16161e), texto (#e9e9ee), âmbar (#E2A23B) e marca INEMA em sky (#38bdf8). Seu tema claro possui tokens próprios em `body.light`. Esse conjunto não substitui os tokens minerais da aplicação.

## Typography

Manrope sustenta a aplicação, com pesos locais 400–800; DM Serif Display local, peso 400, cria a inflexão editorial nos títulos e modelos. Fallbacks: `sans-serif` e `serif`.

A chamada da galeria e das versões usa `display`, com uma linha editorial; títulos de modelos usam `title`. Introduções usam `body`; campos e ações, texto de 12px; rótulos, 11px. Metadados secundários chegam a 9–11px na interface desktop. Não reduzir ainda mais essa escala.

Nos sites exportados, o corpo é Manrope (16px/1.7); a chamada varia entre 44px e 92px, com entrelinha 1.04. A escolha editorial usa DM Serif Display e a escolha sem serifa usa Manrope. Textos longos ocupam aproximadamente 65–70ch. Caderno apresenta títulos de artigos editoriais e linhas de leitura, sem miniaturas geométricas na lista.

O guia usa Sora para títulos e ações, Inter para corpo (16px/1.65), JetBrains Mono para código, com fontes externas declaradas no próprio HTML.

## Layout

A galeria tem largura máxima de 1440px, margens automáticas e padding lateral de 5%. Cabeçalho de 91px; introdução com 76px acima e 60px abaixo. Três colunas iguais, intervalo de 27px e visuais com proporção 0.91. O roteiro de versões usa um contêiner de até 1250px e linhas com colunas de versão, descrição e entregas.

O editor ocupa 100dvh. Cabeçalho de 72px, controles à esquerda em painel rolável de 338px e prévia flexível à direita. O painel usa padding de 24px; a prévia tem margens de 25px e rolagem dentro do iframe. O seletor de celular limita a página a 390px, respeitando o espaço disponível.

- Até 1050px: galeria com intervalo de 18px, painel de 305px e informações secundárias do cabeçalho ocultas.
- Até 760px: galeria em coluna única e margens de 6%; chamada de 38px; cabeçalho quebra a navegação para uma segunda linha. Editor com cabeçalho de 62px e alternância “Personalizar” / “Ver prévia”; apenas um painel aparece por vez. Campos passam a 16px. As versões passam a duas colunas.
- A partir de 1600px: painel de 370px, margens da prévia de 38px.
- Sites exportados: hero de duas colunas; a partir de 1200px, hero mínimo de 790px e arte de 640px. Até 650px, hero, projetos, sobre e contato passam a fluxo vertical; arte de 370px, seções com padding de 55px e 6%.

O guia tem contêiner de 1160px com padding de 22px. Seus próprios breakpoints reorganizam grades (820px/540px), hero (780px), exemplos (680px) e navegação (760px/560px). Conteúdo flexível usa `min-width:0`, URLs podem quebrar e blocos de código rolam dentro da própria largura.

## Elevation & Depth

A aplicação usa principalmente fundos tonais e bordas finas, sem sombra nos cards da galeria. A profundidade vem das geometrias e da composição 3D. O aviso flutuante usa sombra discreta (`0 8px 30px #19251c25`); o diálogo usa backdrop escuro (#17231dc0).

O guia mantém sua própria linguagem de brilho âmbar e sombra de figura (`0 30px 80px -30px #000`). Não transportar esses efeitos para o editor por associação de marca.

## Shapes

Superfícies maiores usam curvas de 12px; campos e botões, 6px; ícones, 5px; prévia, 9px ou 20px no modo celular. Ações circulares e marcadores numerados contrastam com os retângulos discretos. Linhas de 1px separam conteúdo; a aba ativa usa linha de 2px.

As geometrias originais identificam Órbita, Forma e Caderno. O fallback sem WebGL mantém uma forma gráfica e preserva o texto HTML.

## Components

- **Botões:** primário em tinta sobre branco; exportação em lima com texto escuro; secundário transparente com borda. Primário muda de fundo no hover; secundário recebe `soft`. Desabilitados têm opacidade 0.4 e cursor indisponível. Ícones recebem nome acessível.
- **Filtros e escolhas:** filtros usam `aria-pressed`; estado selecionado em tinta. Paletas e tipografia usam borda verde e fundo suave, com estado semântico de seleção. Tags da galeria são metadados textuais separados por pontos.
- **Cards:** arte arredondada, título e descrição abaixo, ação circular lateral. O visual inteiro abre o modelo e tem nome acessível. A hierarquia não depende da cena renderizar.
- **Campos:** fundo branco, borda `field-line`, padding de 11px/12px; textarea redimensionável. Erros exibem `aria-invalid` e texto explicativo. Upload mostra estado ocupado e imagem escolhida com ação para remoção.
- **Navegação e abas:** página atual com `aria-current` e sublinhado. Abas Conteúdo/Aparência/Seções possuem `tablist`, `tab`, `tabpanel`, IDs relacionados e tabulação itinerante; setas, Home e End movem foco e seleção.
- **Prévia:** iframe nomeado, controles de dispositivo com `aria-pressed`, rótulo de largura e instrução de rolagem. Atualização após 250ms permite digitação contínua.
- **Feedback e confirmação:** salvamento e avisos usam `role=status`; falha de armazenamento usa `role=alert`. Avisos fecham após 7s ou pela ação explícita. Restauração abre diálogo nativo modal e começa com foco em “Continuar editando”.

Na aplicação, foco visível usa outline de 3px em `focus`, afastado 4px, incluindo campos, links e summaries. O atalho para conteúdo revela-se ao receber foco e move foco ao conteúdo principal. Sites exportados têm atalho equivalente e outline com acento do tema, afastado 5px.

Movimento reduzido desliga animações e transições da aplicação e a rolagem suave dos sites/guia; a preferência também é respeitada pelas cenas. Oferecer Sem movimento, Suave e Expressivo, mantendo conteúdo legível em todos os modos.

## Do's and Don'ts

- **Do** preservar foco visível, nomes acessíveis, seleção semântica e texto explicativo dos estados.
- **Do** testar galeria, editor e página exportada em largura móvel; os breakpoints são distintos.
- **Do** reutilizar as paletas completas e manter texto editorial em HTML.
- **Do** distinguir disponibilidade V1/V2.0 dos planos V2.1–V6 visualmente e no texto.
- **Don't** aplicar as fontes, glow e cores INEMA do guia à aplicação automaticamente.
- **Don't** substituir conteúdo ou controles por canvas, nem tornar animação necessária para ler e navegar.
- **Don't** apresentar recursos planejados com aparência de ações já disponíveis.


## Extensão V2.0: biblioteca e demonstrações

Meus projetos reutiliza o cabeçalho, botões e tokens da aplicação. O conteúdo é organizado em linhas com swatch do modelo, nome interno, marca, data, quantidade de versões e ações. Busca, filtro por modelo e ordenação ficam na mesma barra; no celular passam a linhas sem overflow. Renomeação ocorre na própria linha. Arquivo é reversível; não há diálogo de exclusão.

Cada card da galeria oferece ações textuais distintas: Ver demonstração (nova aba) e Criar meu site. Demonstrações mantêm o CSS do site exportado e acrescentam uma faixa simples com retorno aos modelos, indicação de ficção e Usar este exemplo. Não usam o chrome do editor.

O editor acrescenta Versões salvas no rodapé da barra lateral, com limite e ação de restauração em diálogo nativo. Estado Salvando dura até o commit no IndexedDB. Conflito ou falha fica em aviso persistente com opção para salvar uma cópia. Não apresentar erro transitório como gravação bem-sucedida.

Detalhes observados da extensão:

- **Linhas da biblioteca:** contêiner de até 1440px, padding de 55px/5%/65px. Linhas planas com divisórias de 1px, padding vertical de 24px e gap de 22px. Swatch de 80px por no mínimo 85px, raio de 9px, usando `soft` e `ink` do tema do projeto; título de 19px, descrição de 12px e metadados de 10px. Editar é uma ação textual com borda; renomear, duplicar, exportar e arquivar usam ícones nomeados. Projetos arquivados oferecem restauração e não exibem Editar.
- **Filtros e busca:** Ativos/Arquivados reutilizam filtros com `aria-pressed`; busca por nome interno ou marca ignora acentos e caixa. Busca e selects têm fundo branco, borda `line` e raio de 6px. Modelo e ordenação usam selects nativos nomeados. Contagem de resultados usa `role=status`; vazio inicial, arquivo vazio e busca sem resultados têm textos distintos. Até 760px, filtros e busca ocupam linhas próprias; busca e renomeação usam 16px. Swatch passa a 58px por no mínimo 72px e ações passam para uma linha de largura total.
- **Avisos da biblioteca:** sucesso/informação usa `soft`, `role=status` e fechamento explícito; erro usa fundo #f8e9dc, texto #7a301b, `role=alert` e Tentar novamente. Ambos usam raio de 7px, padding de 17px/20px e texto de 13px/1.8 (12px no celular). Estes avisos persistem; a duração de 7s acima se refere ao toast do editor.
- **Pontos de retorno:** Versões salvas usa `details`/`summary` nativo, título de 12px em negrito e contador à direita. Campo opcional de nome e botão de largura total antecedem a lista, com divisórias e padding vertical de 12px. Nome de 11px e data de 10px quebram sem alargar o painel. O limite é cinco; nova versão substitui a mais antiga. Salvar/restaurar ficam desabilitados enquanto há gravação pendente ou operação de versão em andamento.
- **Faixa da demonstração:** faixa flexível em `ink` do site com texto em `bg`, padding de 12px/5%, gap de 20px e Manrope 12px/1.6; links têm peso 700, indicação central tem 11px. Até 650px, padding lateral de 6%, gap de 12px e texto de 11px; a indicação central é ocultada. A faixa herda a paleta do site demonstrado.
