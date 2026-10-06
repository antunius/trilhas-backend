---
slug: editor-colaborativo
categorySlug: system-design
title: "Exercício: Projetar um Editor de Documentos Colaborativo (estilo Google Docs)"
navTitle: Editor de Documentos Colaborativo
summary: Projete um editor de texto onde múltiplos usuários podem editar o mesmo documento simultaneamente, vendo as mudanças uns dos outros em tempo real.
level: avancado
order: 120
section: exercicios-praticos
group: "Mensagens e feeds"
---

## Objetivos de aprendizagem

- [ ] Praticar sincronização em tempo real com edições concorrentes
- [ ] Entender por que edição concorrente exige uma técnica de convergência (OT/CRDT), não só "last write wins"

## Enunciado

Projete um editor de texto onde múltiplos usuários podem editar o mesmo documento simultaneamente, vendo as mudanças uns dos outros em tempo real.

![Docs: OT/CRDT + sync](/diagrams/sd-editor-colaborativo.svg)

## Perguntas orientadoras (levantamento de requisitos)

- Quantos usuários costumam editar o mesmo documento ao mesmo tempo?
- É necessário suportar edição offline, sincronizando depois quando a conexão voltar?
- O histórico de versões do documento precisa ser mantido?

## Requisitos funcionais (exemplos)

- Editar o texto de um documento e propagar a mudança aos demais editores em tempo real.
- Mostrar a posição do cursor/seleção de outros usuários no mesmo documento.
- Reconstruir o histórico de versões do documento.
- Suportar reconexão após uma queda de conexão sem perder edições locais.

## Requisitos não-funcionais (exemplos)

- **Escala:** poucas dezenas de editores simultâneos por documento (não milhões — é colaboração, não broadcast).
- **Latência:** propagação de uma edição a outros editores em bem menos de 1 segundo, para parecer "ao vivo".
- **Disponibilidade:** alta — perder conexão momentaneamente não pode perder o texto digitado localmente.
- **Consistência:** todos os editores precisam convergir para o mesmo texto final, mesmo com edições concorrentes na mesma região — esse é o requisito mais difícil do exercício.
- **Leitura vs. escrita:** intercalado e simétrico entre os editores ativos de um mesmo documento.

## Tecnologias que podem ser usadas

- **Tempo real:** WebSockets para propagar operações de edição a todos os clientes conectados ao documento.
- **Algoritmo de convergência:** Operational Transformation (usado pelo Google Docs) ou CRDTs (usado por editores mais recentes) para resolver edições concorrentes.
- **Armazenamento:** snapshots periódicos do documento + log de operações, permitindo reconstruir qualquer versão do histórico.
- **Cache/estado em memória:** o estado atual do documento vive em memória no servidor responsável por aquele documento enquanto há editores ativos.

## Pontos centrais a explorar (deep dive sugerido)

- **Atualizações em Tempo Real** (Módulo 6): como as edições de um usuário são propagadas aos demais que têm o documento aberto.
- O desafio central de edições concorrentes no mesmo trecho de texto — mencionar a existência de técnicas como Operational Transformation ou CRDTs como abordagens conhecidas para resolver esse conflito, sem necessariamente implementá-las em detalhe.

![Duas edições concorrentes na mesma região convergem via OT/CRDT](/diagrams/sd-editor-colaborativo-merge.svg)

- Modelagem de dados que suporte reconstruir o histórico de versões do documento.

## O que revisar depois de resolver

- O design explica concretamente o que acontece quando duas edições concorrentes tocam a mesma região do texto?
- O histórico de versões é reconstruível a partir do que foi armazenado (snapshot + log, ou equivalente)?
- Edição offline e reconexão foram tratadas, se o requisito foi confirmado?
