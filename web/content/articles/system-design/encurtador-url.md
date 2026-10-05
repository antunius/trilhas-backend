---
slug: encurtador-url
categorySlug: system-design
title: "Exercício: Projetar um Encurtador de URLs"
navTitle: Encurtador de URLs
summary: Aplicar o framework completo a um problema clássico e relativamente contido
level: avancado
order: 131
section: exercicios-praticos
group: "Infraestrutura e ferramentas"
---

## Objetivos de aprendizagem

- [ ] Aplicar o framework completo a um problema clássico e relativamente contido
- [ ] Praticar a etapa de geração de identificadores únicos em escala

## Enunciado

Projete um sistema de encurtamento de URLs: o usuário envia uma URL longa e recebe uma URL curta que redireciona para o destino original.

![Encurtador: criar (write) e redirecionar (read)](/diagrams/sd-url-shortener.svg)

## Perguntas orientadoras (levantamento de requisitos)

- Qual o volume esperado de criação de links por dia, e qual a proporção entre leitura (redirecionamento) e escrita (criação)?
- É necessário permitir que o usuário escolha um alias customizado?
- Os links devem expirar após um período?
- É necessário rastrear estatísticas de clique por link?

## Requisitos funcionais (exemplos)

- Criar uma URL curta a partir de uma URL longa.
- Redirecionar uma URL curta para a URL longa original.
- Permitir (opcionalmente) que o usuário escolha um alias customizado.
- Expirar um link após uma data definida (se o requisito for confirmado).

## Requisitos não-funcionais (exemplos)

- **Escala:** algumas centenas de criações/segundo, mas dezenas de milhares de redirecionamentos/segundo — o padrão de acesso é fortemente assimétrico.
- **Latência:** redirecionamento precisa responder em poucos milissegundos — é o caminho crítico percebido pelo usuário final.
- **Disponibilidade:** alta para leitura (um link fora do ar é um link quebrado na internet inteira); escrita pode tolerar uma janela curta de indisponibilidade.
- **Consistência:** eventual é aceitável — um link recém-criado poder demorar um instante para propagar não quebra a experiência.
- **Leitura vs. escrita:** fortemente dominado por leitura (ordens de grandeza a mais redirecionamentos do que criações).

## Tecnologias que podem ser usadas

- **Load balancer:** distribui tráfego entre instâncias de API sem estado.
- **Armazenamento:** um banco chave-valor (DynamoDB, Cassandra) ou relacional simples (Postgres) — o padrão de acesso é por chave única, não exige junções complexas.
- **Cache:** Redis ou Memcached na frente do banco para os links mais acessados, dado o padrão de leitura dominante.
- **Geração de ID:** contador distribuído (ex.: Snowflake-like) ou serviço de faixas pré-alocadas, conforme a estratégia escolhida no deep dive.

## Pontos centrais a explorar (deep dive sugerido)

- Como gerar um código curto único, evitando colisões, em um sistema com múltiplas instâncias rodando em paralelo?

![Gerar código único com múltiplas instâncias em paralelo](/diagrams/sd-url-shortener-ids.svg)

- Onde faz sentido introduzir cache, dado que o padrão de acesso costuma ser fortemente dominado por leitura?
- Como lidar com o caso de um alias customizado já estar em uso?

## O que revisar depois de resolver

- O contrato de API cobre tanto a criação quanto o redirecionamento?
- A escolha de banco de dados (aula de Bancos de Dados, Módulo 2) está alinhada ao padrão de acesso simples por chave?
- A estratégia de cache escolhida (aula de Cache, Módulo 2) foi justificada pelo padrão de leitura dominante?
