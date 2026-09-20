---
slug: indexacao
categorySlug: system-design
title: Indexação de Banco de Dados
summary: Entender por que índices aceleram leituras
level: intermediario
order: 12
section: tecnologias-chave
---

## Objetivos de aprendizagem

- [ ] Entender por que índices aceleram leituras
- [ ] Entender o custo de manter índices
- [ ] Saber quando propor um índice em uma entrevista

## Conteúdo

### Por que índices aceleram leituras

![Índice acelera lookup, desacelera escrita](/diagrams/sd-indexacao.svg)

Sem um índice, encontrar um registro específico exige, no pior caso, examinar a tabela inteira (*full scan*). Um índice mantém uma estrutura ordenada (tipicamente uma árvore B ou variação) que aponta diretamente para a localização do dado, reduzindo drasticamente o tempo de busca — de forma similar ao índice de um livro, que evita ler todas as páginas para achar um assunto.

### O custo de manter índices

Índices não são gratuitos: cada escrita (inserção, atualização, remoção) também precisa atualizar todo índice relacionado, o que torna escritas mais lentas e consome espaço adicional em disco. Por isso, a decisão de indexar uma coluna deve levar em conta o padrão de leitura versus escrita — sistemas dominados por escrita se beneficiam menos de índices adicionais.

### Quando propor um índice na entrevista

Vale mencionar indexação quando uma consulta específica e frequente do sistema (ex: "buscar todos os pedidos de um usuário") seria lenta sem ela. Não é necessário detalhar a estrutura interna do índice — o que importa é reconhecer o trade-off entre leitura mais rápida e escrita/armazenamento mais custosos.

## Exemplo aplicado

Em um sistema de pedidos, se a consulta mais frequente é "listar pedidos de um usuário específico", um índice na coluna `usuario_id` da tabela de pedidos evita uma varredura completa da tabela a cada consulta — um ganho relevante se essa consulta acontece com muito mais frequência do que novos pedidos são criados.

## Erros comuns

- Sugerir indexar todas as colunas, ignorando o custo em escritas e armazenamento.
- Não conseguir explicar por que um índice ajuda em uma consulta específica.
