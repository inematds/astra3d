# Arquitetura e manutenção

## Fluxo de dados

`src/config.js` define e valida a configuração → `src/App.jsx` controla edição/histórico → `src/site.js` gera HTML → `src/scene/runtime.js` desenha geometrias originais. A prévia e o download usam o mesmo gerador de HTML. Não existem duas implementações independentes do site.

O build usa esbuild para incorporar Three.js num runtime IIFE, e Vite para compilar o editor. O arquivo gerado em `src/generated/` não é versionado: `npm run dev` e `npm run build` o criam. Fontes WOFF2 e o runtime ficam embutidos no HTML exportado para funcionar offline. O guia é copiado para `dist/guia`.

## Configuração V1

Objeto `{schemaVersion:1, template, name, title, description, about, contactLabel, contactUrl, theme, typography, motion, image, imageAlt, showAbout, showWork, showContact, items}`. Items: `{id, title, category, description, url, body}`. Entrada estrita, limites de tamanho, cores/fontes enumeradas, links HTTP(S)/mailto e imagens raster data URL. Campos desconhecidos são descartados. JSON inválido não substitui o rascunho.

A imagem é reduzida localmente para WebP com dimensão máxima de 1400 px. Nenhum upload é feito. Os rascunhos são independentes por modelo; histórico de desfazer/refazer é da sessão. O aviso de armazenamento informa quando a persistência está indisponível.

## Segurança

Textos escapados em HTML; dados de runtime escapados para contexto de script; URLs por allowlist. A prévia usa iframe sandbox sem `allow-same-origin`: impede que código interno acesse o armazenamento do editor. Links externos abrem em nova aba com `noopener`. O HTML gerado contém código do produto, nunca JavaScript enviado pelo visitante. Importação aceita até 4 MB; imagens até 8 MB antes da redução. Configuração final limita a imagem a 3 MB de caracteres.

## Movimento

A cena usa progresso absoluto de rolagem, não acumulação de deltas, para permitir voltar ao mesmo estado. Uma opção sem movimento e `prefers-reduced-motion` suspendem mudanças de pose. Renderização ocorre sob demanda, suspensa quando invisível. Sem WebGL, o conteúdo HTML e um motivo gráfico estático continuam disponíveis. O 3D é decorativo nesta versão: não contém informação exclusiva.

## Evolução

V2 migra o schema antes de adicionar recursos. V3 retorna patches com versão de base, nunca código livre; operações são validadas pelo mesmo contrato. Modelos futuros declaram capacidades para o chat não prometer operações que não existem. Veja `PLANO-VERSOES.md`.

## Referências técnicas

- https://vite.dev/guide/static-deploy.html — build estático e GitHub Pages.
- https://threejs.org/docs/ — renderização e recursos Three.js.

O app usa URLs relativas e roteamento por hash para funcionar na subpasta `/astra3d/`. O workflow publica somente `dist`, não arquivos de desenvolvimento. Dependências são fixadas por `package-lock.json`.
