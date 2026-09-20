---
slug: tinder
categorySlug: system-design
title: "Exercício: Projetar um Aplicativo de Relacionamento (estilo Tinder)"
navTitle: Aplicativo de Relacionamento
summary: Projete um aplicativo que mostra perfis de outros usuários próximos geograficamente, permite curtir/rejeitar, e cria uma conexão (match) quando duas pessoas se curtem mutuamente.
level: avancado
order: 30
section: exercicios-praticos
---

## Objetivos de aprendizagem

- [ ] Praticar filtragem por proximidade combinada com exclusão de itens já vistos
- [ ] Decidir como detectar um match mútuo sem varrer todo o histórico de decisões

## Enunciado

Projete um aplicativo que mostra perfis de outros usuários próximos geograficamente, permite curtir/rejeitar, e cria uma conexão (match) quando duas pessoas se curtem mutuamente.

![Matching: perfil + recomendações](/diagrams/sd-tinder.svg)

## Perguntas orientadoras (levantamento de requisitos)

- Como o sistema decide quais perfis mostrar a cada usuário (proximidade, preferências, perfis já vistos)?
- Um "match" precisa ser notificado em tempo real para ambos os usuários?
- O sistema precisa evitar mostrar o mesmo perfil duas vezes ao mesmo usuário?

## Requisitos funcionais (exemplos)

- Exibir um deck de perfis próximos geograficamente, sem repetir perfis já vistos.
- Registrar a decisão do usuário (curtir/rejeitar).
- Detectar e criar um match quando duas pessoas se curtem mutuamente.
- Notificar os dois usuários quando um match ocorre.

## Requisitos não-funcionais (exemplos)

- **Escala:** milhões de usuários ativos, cada um gerando dezenas de decisões (swipes) por sessão.
- **Latência:** carregar o próximo perfil do deck precisa ser quase instantâneo para não quebrar o fluxo de uso.
- **Disponibilidade:** alta — é um app de uso casual, mas indisponibilidade frequente mata retenção.
- **Consistência:** detecção de match pode ser levemente assíncrona (poucos segundos), não precisa ser instantânea nos dois lados ao mesmo tempo.
- **Leitura vs. escrita:** leitura (montar o deck) muito maior que escrita (decisões registradas).

## Tecnologias que podem ser usadas

- **Índice de proximidade:** geo-hash (Redis geo ou equivalente) para candidatos próximos.
- **Armazenamento:** banco chave-valor ou relacional para o registro de decisões, indexado nos dois sentidos (quem decidiu, sobre quem).
- **Cache:** set/bitset por usuário com os perfis já vistos, para excluir do próximo deck sem nova consulta pesada.
- **Tempo real:** WebSockets ou push notification para avisar um match assim que ele acontece.

## Pontos centrais a explorar (deep dive sugerido)

- **Proximidade** (Módulo 6): filtrar candidatos por proximidade geográfica antes de aplicar qualquer outro critério.
- Modelagem de dados para registrar decisões (curtir/rejeitar) e detectar um match de forma eficiente, sem precisar varrer todo o histórico de curtidas a cada nova decisão.

![Deck sem repetição + match mútuo sem varrer histórico](/diagrams/sd-tinder-matching.svg)

- **Atualizações em Tempo Real** (Módulo 6): para notificar um match assim que ele acontece.

## O que revisar depois de resolver

- A exclusão de perfis já vistos foi resolvida sem exigir uma varredura crescente a cada novo deck?
- A detecção de match usa um lookup direto pela chave (A, B), em vez de buscar no histórico completo?
- A escolha entre notificação em tempo real e polling para o match foi justificada?
