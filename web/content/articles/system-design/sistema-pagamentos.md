---
slug: sistema-pagamentos
categorySlug: system-design
title: "Exercício: Projetar um Sistema de Pagamentos"
navTitle: Sistema de Pagamentos
summary: Projete um sistema que processa pagamentos entre usuários (ou entre um usuário e um comerciante), garantindo que cada transação seja processada exatamente uma vez, mesmo diante de falhas de rede.
level: avancado
order: 125
section: exercicios-praticos
group: "Transações e concorrência"
---

## Objetivos de aprendizagem

- [ ] Praticar idempotência em um caminho onde erro tem custo financeiro direto
- [ ] Decidir como compensar uma falha no meio de um fluxo de múltiplas etapas

## Enunciado

Projete um sistema que processa pagamentos entre usuários (ou entre um usuário e um comerciante), garantindo que cada transação seja processada exatamente uma vez, mesmo diante de falhas de rede.

![Pagamentos: ledger + provedores](/diagrams/sd-sistema-pagamentos.svg)

## Perguntas orientadoras (levantamento de requisitos)

- O sistema processa apenas transações internas (entre contas do próprio sistema) ou também integra com processadores de pagamento externos (cartão, banco)?
- O que acontece se uma requisição de pagamento for enviada duas vezes por engano (ex: usuário clicou duas vezes)?
- É necessário manter um histórico de transações consultável posteriormente?

## Requisitos funcionais (exemplos)

- Processar um pagamento entre uma origem e um destino.
- Rejeitar (ou tratar como no-op) uma requisição duplicada da mesma transação.
- Registrar o histórico de transações, consultável posteriormente.
- Reverter uma transação parcialmente concluída em caso de falha numa etapa.

## Requisitos não-funcionais (exemplos)

- **Escala:** depende do produto, mas tipicamente moderado em volume e alto em criticidade por transação.
- **Latência:** aceitável na casa de segundos — correção importa mais que velocidade aqui.
- **Disponibilidade:** alta é desejável, mas nunca à custa de consistência — é preferível recusar uma transação a processá-la errado.
- **Consistência:** forte — este é um dos cenários mais claros do curso onde consistência é priorizada sobre disponibilidade.
- **Leitura vs. escrita:** escrita crítica (a transação em si) e leitura de histórico com exigências de consistência mais leves.

## Tecnologias que podem ser usadas

- **Armazenamento:** banco relacional com transações ACID (Postgres) para o ledger de movimentações.
- **Idempotência:** chave de idempotência única por requisição, armazenada e checada antes de processar.
- **Orquestração de etapas:** padrão saga (coreografado ou orquestrado) para fluxos que envolvem múltiplos passos (ex.: debitar origem, creditar destino, notificar provedor externo).
- **Fila de mensagens:** para desacoplar etapas assíncronas e permitir retry controlado.

## Pontos centrais a explorar (deep dive sugerido)

- **Idempotência**: como garantir que reenviar a mesma requisição de pagamento (por retry de rede, por exemplo) não resulte em cobrança duplicada — geralmente através de uma chave de idempotência única por transação.
- **Consistência forte** (Módulo 3): esse é um dos cenários mais claros onde consistência forte é preferível à disponibilidade, dado o custo de um erro financeiro.

![Chave de idempotência bloqueia retry duplicado; saga compensa falha parcial](/diagrams/sd-sistema-pagamentos-idempotencia.svg)

- **Processos de Múltiplas Etapas** (Módulo 6) e a necessidade de ações de compensação caso uma etapa do fluxo de pagamento falhe após outra já ter sido concluída.

## O que revisar depois de resolver

- A chave de idempotência foi modelada de forma que um retry idêntico nunca duplique o efeito?
- O fluxo de múltiplas etapas tem uma compensação explícita para cada ponto de falha possível?
- A escolha por consistência forte (em vez de eventual) foi justificada explicitamente pelo custo de um erro?
