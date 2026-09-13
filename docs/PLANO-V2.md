# Astra3D V2 — biblioteca, demonstrações e continuidade

## Direção

A V1 permitia personalizar um rascunho por modelo. A V2 transforma o editor em um espaço com projetos independentes. A pessoa pode ver um site completo antes de escolher, guardar alternativas e voltar a um estado anterior. A V3 continua responsável pelo chat; nenhum chat simulado foi acrescentado.

## V2.0 — implementado

| Recurso | Uso | Critério de aceite |
|---|---|---|
| Demonstrações completas | Abrir Órbita, Forma ou Caderno sem editor e sem download | URLs próprias, navegação, leitura e botão para usar o exemplo |
| Meus projetos | Criar vários sites do mesmo modelo | IDs distintos e recuperação após recarga |
| Renomear e duplicar | Organizar clientes, ideias e alternativas | Nome interno separado da marca; cópia não altera o original |
| Arquivar e restaurar | Guardar projetos fora da lista ativa | Arquivados preservam conteúdo e versões |
| Busca, modelo e ordenação | Encontrar o projeto certo | Filtros combinados, ordem por data ou nome, estado vazio claro |
| Backup da biblioteca | Transferir e recuperar trabalho | JSON com projetos ativos, arquivados e versões; importação cria novas cópias |
| Versões salvas | Guardar um ponto de retorno | Até cinco checkpoints nomeados por projeto, persistentes; restauração guarda o estado anterior |
| Migração da V1 | Continuar rascunhos existentes | Importação idempotente; chaves antigas preservadas; dados inválidos não são apagados |
| Proteção entre abas | Evitar sobrescrever trabalho sem perceber | Revisões conflitantes são rejeitadas; usuário pode salvar uma cópia ou baixar o JSON |

### Limites conhecidos

- Armazenamento é local, em IndexedDB. Não há conta ou sincronização entre aparelhos. Limpar dados do navegador remove a biblioteca; o backup é a cópia externa.
- Arquivar não exclui dados. Não há exclusão permanente na interface desta entrega.
- Cinco versões por projeto. Ao criar a sexta, a mais antiga sai da lista. Restaurar também grava “Antes da restauração” dentro desse limite. O backup inclui as versões que ainda estão na lista.
- Backup completo aceita até 100 projetos e 64 MB por arquivo. Para bibliotecas maiores, use exportações individuais. Importações são aditivas: não mesclam nem sobrescrevem projetos existentes.
- O JSON individual continua no schema de conteúdo V1, para manter compatibilidade. A biblioteca usa um envelope próprio `format: astra3d-library`, `version: 2`.
- Os exemplos são fictícios e estão identificados. Seus botões finais levam à criação de um site no Astra3D; não fingem contato com uma pessoa real.
- Sites exportados continuam em HTML único. O ZIP, a organização livre de seções e a biblioteca de assets pertencem às próximas etapas.

## V2.1 — próxima prioridade: composição de páginas

**Problema:** os três modelos ainda oferecem uma estrutura fixa de Sobre, Projetos/Textos e Contato.

**Proposta:** adicionar blocos de serviços, galeria, perguntas frequentes e chamada final; permitir ordenar, ocultar e duplicar blocos. Usar controles de subir/descer acessíveis por teclado antes de adicionar arrastar-e-soltar. Prévia preserva posição de rolagem durante ajustes.

**Implementação:** nova versão de schema com seções identificadas, migração automática dos projetos V1, catálogo de blocos com campos validados e capacidades por modelo. Editor e exportador compartilham o mesmo contrato. Ordem da navegação acompanha a ordem das seções.

**Aceite:** migrar backup V2.0 sem perder dados; reordenar por teclado e no celular; remover um bloco sem deixar links mortos; desfazer; exportar na mesma ordem vista na prévia. Blocos de depoimentos só aceitam conteúdo fornecido e não inventam prova social.

**Prioridade:** alta. Amplia utilidade sem exigir conta ou serviço externo.

## V2.2 — portabilidade e conteúdo

**Biblioteca de imagens:** reutilizar imagens entre projetos, editar texto alternativo e registrar autoria/licença. Armazenar binários separadamente para checkpoints não repetirem arquivos grandes. Exclusão de asset usado precisa mostrar dependências.

**Exportação ZIP:** HTML, CSS, JavaScript, fontes e imagens em arquivos separados, caminhos relativos e instruções de publicação. Testar descompactação e hospedagem em subpasta. Manter HTML único para uso simples.

**Publicação editorial:** artigos com páginas reais, metadados por página, sitemap e navegação entre textos. Escolher entre exportação multipágina e hospedagem convencional sem quebrar os backups atuais.

**Verificação antes de publicar:** apresentar links não preenchidos, imagens sem descrição, conteúdo de exemplo ainda ativo e tamanho estimado do pacote. São informações úteis para revisão, sem alegar certificação automática de acessibilidade ou SEO.

**Aceite:** nenhum arquivo faltando no ZIP, nenhum recurso dependente da máquina do criador, referências de imagem preservadas, links internos válidos, páginas de artigos acessíveis diretamente e testes de regressão em desktop/celular.

**Prioridade:** média, após validar a V2.1 com usuários.

## Ideias para avaliar com uso real

- Recuperação de histórico por comparação lado a lado, além de nome/data.
- Favoritos e categorias de projetos para bibliotecas maiores.
- Pacotes temáticos de modelos (profissional, curso, negócio local).
- Exportar/importar somente projetos selecionados quando backups atingirem os limites.
- Verificação em Safari/iOS e aparelhos de entrada, com orçamento de memória/tempo documentado.

## O que fica fora da V2

Chat e geração de assets por IA (V3 ou pipeline próprio), lojas com pagamento, modelos de produto/escultura/arquitetura (V4–V5), contas, domínio e publicação automática de sites dos usuários (V6). Esses recursos precisam de decisões e testes próprios.
