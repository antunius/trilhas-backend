---
slug: consistent-hashing-entrevista
categorySlug: system-design
title: "Consistent hashing na entrevista"
navTitle: Na entrevista
summary: "Saber o que diferencia respostas média e sênior e as perguntas de aprofundamento"
level: intermediario
order: 37
section: tecnologias-chave
group: "Consistent hashing"
---

## Objetivos de aprendizagem

- [ ] Reconhecer os erros comuns
- [ ] Responder com o nível esperado

*Retomando o cenário da unidade: um cluster de cache com 4 servidores guardando 1 milhão de chaves, e a pergunta de o que acontece quando um quinto servidor entra.*

## O que separa uma resposta de nível médio de uma de nível sênior

| Nível | O que costuma ser entregue |
|---|---|
| Júnior/Pleno | Sabe que consistent hashing reduz a movimentação de dados ao adicionar servidores |
| Sênior | Mostra com números por que `hash % N` falha (≈ N/(N+1) das chaves se movem), explica o anel e os nós virtuais, e cita onde é usado |
| Staff+ | Discute o balanceamento com carga desigual (hot keys não se resolvem só com vnodes), replicação das chaves nos N vizinhos seguintes do anel, e a alternativa dos slots fixos |

## Erros comuns

- Confundir consistent hashing com "sharding por hash": o hash por módulo é o problema, e consistent hashing é o que o resolve.
- Não saber explicar por que só uma fração das chaves se move quando um servidor entra ou sai.
- Esquecer os nós virtuais e aceitar uma distribuição desigual por azar de posição.
- Achar que consistent hashing resolve hot keys: uma chave muito popular continua num servidor só.

## Perguntas de aprofundamento que um entrevistador pode fazer

- "Por que `hash % N` é um problema quando o cluster cresce?" (quase todas as chaves mudam de servidor, causando uma avalanche de misses.)
- "O que acontece quando um servidor cai no anel?" (suas chaves passam ao próximo servidor no sentido horário; com vnodes, espalham-se entre vários.)
- "Para que servem os nós virtuais?" (equilibrar a divisão do anel, espalhar a carga quando um servidor sai e permitir pesos por capacidade.)
- "Como replicar dados com consistent hashing?" (guardar cada chave nos N servidores seguintes do anel, como fazem Cassandra e Dynamo.)

## Lembre

- Mostre com **números** por que `hash % N` falha.
- Consistent hashing **não resolve hot keys**.
- Para replicar, guarde a chave nos **N vizinhos seguintes** do anel.
