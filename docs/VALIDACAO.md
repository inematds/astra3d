# Validação da V1

Executada em 13/09/2026, com build de produção.

- `npm test`: 7 testes aprovados. Round trip de configuração, schema inválido, URLs, descarte de conteúdo não permitido, escape contextual contra injeção, seções e nomes de download.
- `npm run test:e2e`: 8 testes aprovados em Chromium headless. Edição/persistência/histórico, JSON entre modelos, HTML aberto como arquivo offline, conteúdo hostil tratado como texto, busca/categoria/leitura, imagem/reset, uso móvel e tema do guia, conteúdo sem WebGL e navegação de abas por teclado.
- `npm run build`: aprovado. App inicial separado do editor e da biblioteca 3D; recursos compilados e locais.
- Inspeção visual: galeria/editor desktop e mobile, guia mobile. Largura do documento igual à viewport nos cinco casos; mobile a 390 px. A revisão independente verificou identidade, composição e contraste e originou correções de foco, abas, placeholder e guia.

## Limites da evidência

Testes móveis usam viewport em Chromium, não um aparelho físico. Ainda não há validação em Safari/iOS nem estudo de desempenho em aparelhos de entrada. Não há backend, chat, checkout ou publicação de sites de usuários nesta versão. Os links de contato só terão destino real quando preenchidos por quem cria o site.

O arquivo exportado usa fontes e runtime incluídos; acessar links externos, naturalmente, exige conexão. O guia utiliza Google Fonts conforme o template INEMA, com fallback de fonte do navegador.

## Parecer final da revisão visual

**Aprovado.** Os cinco achados foram encerrados: foco do link de salto, navegação de abas, contraste do placeholder, largura do guia no celular e renderização das cenas móveis. As capturas de Forma e Caderno após rolar até os respectivos cards confirmaram a renderização. Canvas fora da viewport pode aparecer vazio em captura da página inteira por causa da suspensão de renderização; isso não ocorre ao explorar os modelos na tela.
