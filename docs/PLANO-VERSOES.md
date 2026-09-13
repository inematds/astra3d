# Astra3D — plano de todas as versões

Decisão de produto, 13/09/2026. A sequência abaixo é um plano de evolução, não uma previsão de prazo. V1 e V2.0 estão implementadas; V2.1–V2.2 e V3–V6 dependem dos critérios e integrações indicados. O produto é uma biblioteca própria, inspirada nas famílias de experiências do material fornecido, sem redistribuir o prompt pack.

## Visão e fluxo

Escolher um modelo → personalizar → visualizar → exportar/publicar. A interface visual opera primeiro; o chat será um segundo modo de editar a MESMA configuração validada. A pessoa mantém o controle, vê mudanças antes de aplicá-las e pode desfazer.

## V1 — Estúdio local (implementação inicial)

**Pessoa atendida:** profissional, agência ou autor que precisa colocar seu conteúdo num site apresentável.

**Entregas:** galeria com três modelos, editor à esquerda e prévia à direita, desktop/celular, cores e fontes em combinações testadas, intensidade de movimento, imagem enviada pelo usuário, seções opcionais, até seis projetos/artigos, salvamento local, histórico de sessão, importar/exportar JSON, exportar um único HTML com cenas e fontes incluídas, guia e publicação do próprio editor no GitHub Pages.

**Modelos:** Órbita (portfólio com portal geométrico), Forma (agência com fita escultórica), Caderno (publicação com livro tridimensional). Os conteúdos de demonstração são identificados como exemplos. A V1 não reproduz o astronauta articulado nem oferece tour arquitetônico.

**Arquitetura:** React/Vite para o editor; Three.js para cenas locais originais; runtime compartilhado entre prévia e HTML exportado; configuração estrita com versão de schema, sem execução de código de usuário. Armazenamento local pode falhar ou ser apagado: exportação JSON é o backup portátil.

**Critérios de aceite:** personalizar, recarregar e recuperar rascunho; desfazer/refazer; rejeitar JSON inválido e URLs executáveis; rolagem reversível; texto disponível sem WebGL; preferência de movimento reduzido; exportar e abrir HTML offline; navegação, busca e leitura do modelo editorial funcionando; testes em desktop e celular. Publicar app/guia e registrar nos catálogos INEMA.

**Fora desta versão:** chat/LLM, geração de assets, conta, sincronização, checkout real, CMS, hospedagem dos sites de cada visitante e promessas de conversão comercial.

## V2 — Biblioteca e projetos

**V2.0 implementada:** demonstrações em páginas próprias, biblioteca de projetos, criação/renomeação/duplicação, arquivo/restauração, busca e filtros, backup JSON completo, até cinco versões salvas, migração preservando rascunhos V1 e detecção de conflitos entre abas. Armazenamento em IndexedDB; nada é enviado a um servidor.

**V2.1 planejada:** novos blocos e ordenação acessível de seções.

**V2.2 planejada:** biblioteca de imagens, exportação ZIP, artigos multipágina e metadados de publicação.

**Plano detalhado e critérios de aceite:** [PLANO-V2.md](PLANO-V2.md).

## V3 — Chat de personalização

**Objetivo:** permitir pedidos como “troque a chamada e use o tema azul”, mantendo a previsibilidade do editor.

**Entregas:** conversa recolhível; explicação do que pode alterar; proposta de alterações com antes/depois; aplicar/rejeitar; desfazer; pedidos ambíguos recebem esclarecimento; interface e chat mostram o mesmo estado.

**Arquitetura:** backend autenticado recebe contexto mínimo e retorna operações tipadas sobre a configuração. Validar estrutura, limites, URLs, versão de base e capacidades do template no servidor e no cliente. Proibir HTML/JS arbitrário. Chave do provedor fica somente no servidor. Política de dados, cota por usuário, limite de custo por pedido, cancelamento, timeout e logs sem conteúdo sensível por padrão.

**Aceite:** conjunto de pedidos com mudanças esperadas, comandos fora de escopo, prompt injection em conteúdo, resposta truncada, indisponibilidade e concorrência. Nenhuma mudança é aplicada sem revisão. Falha de IA preserva o trabalho e o editor segue disponível. Custos reais medidos antes de estabelecer preço ou gratuidade.

**Dependências:** definir provedor, credencial segura, backend e política de acesso. GitHub Pages sozinho não hospeda esse backend. Não colocar chaves em JavaScript público ou no JSON exportado.

## V4 — Produto e jornada de esculturas

**Objetivo:** acrescentar duas famílias que exigem assets e percursos mais específicos.

**Produto:** modelo GLB consistente, órbita, peças com pivôs nomeados, sequência de desmontagem/remontagem, variações reais de cor, ficha técnica e galeria. Carrinho inicialmente demonstrativo, claramente marcado. Pagamento real exige integração própria e testes de pedido.

**Esculturas:** quatro capítulos num mesmo ambiente, câmera com caminho validado, pausas legíveis, títulos HTML, navegação direta e convite final. Assets próprios ou licenciados; reflexos simplificados conforme dispositivo.

**Implementação:** contratos de assets (escala, pivôs, textura, orçamento de memória), carregamento progressivo, inventário de licenças, níveis de detalhe e imagens alternativas. Suporte a sequências de imagens para câmera fixa, identificado como outra técnica.

**Aceite:** peças retornam à posição inicial; sem atravessar geometria; rolagem inversa coerente; próximo capítulo compreensível; comportamento aceitável em aparelhos de referência documentados; botões e variantes testados.

**Dependências:** pipeline de produção e revisão humana de assets; não depender de novas gerações para cada visitante.

## V5 — Narrativas e arquitetura

**História interativa:** capítulos, bifurcação, persistência da escolha, reinício, dois finais verificáveis, áudio somente mediante ação explícita e versão textual completa.

**Arquitetura:** exterior/interior consistentes, tour guiado, órbita manual, retorno ao tour sem salto, separação de pavimentos, materiais e iluminação. Plantas ou modelos fornecidos delimitam o projeto; exemplos fictícios recebem rótulo de conceito.

**Aceite:** ambos os finais e retorno aos capítulos funcionam; câmera nunca atravessa paredes; selecionar pavimentos e voltar ao tour mantém coerência; projetos conceituais não aparecem como obras reais.

**Dependências:** V4 e assets especializados. O astronauta articulado/vidro pode entrar como experiência adicional após um protótipo próprio; não é requisito escondido dos modelos básicos.

## V6 — Publicação e colaboração

**Objetivo:** publicar sites dos usuários e manter histórico compartilhado.

**Entregas:** contas, espaços de trabalho, permissões, convite a colaboradores, histórico remoto, domínio/subdomínio, rascunho e versão pública separados, prévia de publicação e rollback. Integração opcional com GitHub mediante autorização do usuário.

**Arquitetura:** armazenamento de projetos/arquivos, jobs de build isolados, proveniência de assets, quotas, auditoria, backups e política de retenção. Publicação com operação idempotente e status verificável. Cobrança apenas após definir custos, limites e suporte.

**Aceite:** isolamento entre contas; alterações simultâneas resolvidas sem perda silenciosa; restauração de backup e rollback exercitados; falha de build não substitui o site publicado; revogação de acesso funciona.

**Dependências:** definir hospedagem, autenticação, responsabilidades operacionais e orçamento. A publicação desta V1 no portal não significa que o sistema já publica sites dos visitantes.

## Backlog transversal

- Acessibilidade: teclado, foco, contraste, movimento reduzido e alternativa sem WebGL em toda versão.
- Segurança: validar entradas e URLs, preservar escape contextual e limites de arquivos; chat nunca executa código recebido.
- Desempenho: medir em aparelho móvel e conexão limitados; suspender renderização fora de tela/aba oculta; nunca bloquear leitura pelo 3D.
- Qualidade: teste automatizado de fluxos críticos, revisão visual, manutenção de dependências e documentação de limitações.
- Distribuição: app público, guia INEMA, repositório e catálogos atualizados apenas com recursos entregues.

## Ordem recomendada

V1 → V2.0 (disponível) → uso real → V2.1–V2.2 → V3. V4 e V5 ampliam a biblioteca após estabilizar o contrato de assets. V6 requer decisão operacional separada. Sem estimativas artificiais de minutos ou promessa de preço por site.
