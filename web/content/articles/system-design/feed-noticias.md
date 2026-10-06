---
slug: feed-noticias
categorySlug: system-design
title: "Exercício: Projetar um Feed de Notícias em Escala"
navTitle: Feed de Notícias em Escala
summary: Aplicar o framework a um problema com relacionamentos sociais complexos (seguidores)
level: avancado
order: 118
section: exercicios-praticos
group: "Mensagens e feeds"
---

## Objetivos de aprendizagem

- [ ] Aplicar o framework a um problema com relacionamentos sociais complexos (seguidores)
- [ ] Praticar a decisão entre gerar o feed no momento da leitura ou no momento da escrita

## Enunciado

Projete um sistema de feed de notícias, no qual usuários seguem outros usuários e veem, em ordem cronológica (ou por relevância), os posts de quem seguem.

![Feed: fan-out on write/read](/diagrams/sd-feed-noticias.svg)

## Perguntas orientadoras (levantamento de requisitos)

- Qual a escala esperada de usuários e de posts criados por dia?
- Existem usuários com um número extremamente alto de seguidores (o problema clássico do "usuário celebridade")?
- O feed precisa ser estritamente cronológico, ou pode envolver algum critério de relevância/ranqueamento?

## Requisitos funcionais (exemplos)

- Publicar um post visível a todos os seguidores do autor.
- Seguir e deixar de seguir outros usuários.
- Visualizar o feed com os posts de quem se segue, em ordem cronológica (ou ranqueada).
- Suportar autores com um número extremamente alto de seguidores sem degradar o sistema.

## Requisitos não-funcionais (exemplos)

- **Escala:** milhões de usuários, com distribuição de seguidores extremamente desigual (a maioria com poucos, alguns com dezenas de milhões).
- **Latência:** abrir o feed precisa ser rápido (poucas centenas de milissegundos), mesmo agregando posts de centenas de pessoas seguidas.
- **Disponibilidade:** alta para leitura do feed — é o uso mais frequente do produto.
- **Consistência:** eventual é aceitável — um post pode demorar alguns segundos para aparecer no feed de todos os seguidores.
- **Leitura vs. escrita:** leitura (abrir o feed) muito maior que escrita (publicar um post).

## Tecnologias que podem ser usadas

- **Fan-out na escrita:** pré-computar o feed de cada seguidor num banco chave-valor (Redis, Cassandra) assim que um post é criado.
- **Fan-out na leitura:** para contas com muitos seguidores, montar a parte do feed vinda delas sob demanda, na hora de abrir o app.
- **Fila de mensagens:** para processar o fan-out de escrita de forma assíncrona, sem bloquear a publicação do post.
- **Cache:** posts recentes e populares em cache, para reduzir carga no banco principal na leitura.

## Pontos centrais a explorar (deep dive sugerido)

- **Fan-out no momento da escrita**: pré-computar o feed de cada seguidor assim que um post é criado — leitura rápida, mas custoso para usuários com milhões de seguidores.
- **Fan-out no momento da leitura**: montar o feed apenas quando o usuário abre o aplicativo, buscando posts recentes de quem ele segue — evita o problema do usuário celebridade, mas torna a leitura mais lenta.

![Fan-out na escrita (normal) vs. na leitura (celebridade)](/diagrams/sd-feed-noticias-fanout.svg)

- Uma abordagem híbrida costuma ser necessária: fan-out na escrita para a maioria dos usuários, e fan-out na leitura especificamente para contas com número muito alto de seguidores.

## O que revisar depois de resolver

- A escolha entre fan-out na escrita ou na leitura foi justificada com base na distribuição de seguidores, e não escolhida arbitrariamente?
- O modelo de dados (aula de Modelagem de Dados, Módulo 1) reflete corretamente o relacionamento de "seguir" entre usuários?
- Cache (Módulo 2) foi considerado para os posts mais acessados?
