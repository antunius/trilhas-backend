---
slug: prometheus-promql
categorySlug: system-design
title: "PromQL e o método RED"
navTitle: PromQL e RED
summary: "Consultar métricas com PromQL: rate sobre counters, agregações, taxa de erro e p99, aplicados ao serviço de pedidos"
level: intermediario
order: 106
section: deep-dives-tecnologias
group: "Prometheus e Grafana"
---

## Objetivos de aprendizagem

- [ ] Usar rate sobre counters e explicar por que o valor cru não serve
- [ ] Agregar com sum by e calcular uma taxa de erro em porcentagem
- [ ] Escrever as três consultas do método RED e calcular p99 com histogram_quantile

## Retomando o cenário

*O serviço de pedidos já publica métricas. Agora o time precisa responder, com consultas, às perguntas do suporte: quantos pedidos por segundo estamos recebendo? Quantos falham? Quanto tempo levam?*

## Seletores

A forma mais simples de consulta é o nome da métrica com filtros de label:

```promql
http_server_requests_seconds_count{uri="/pedidos", status=~"5.."}
```

`=` é igualdade, `!=` diferença e `=~` expressão regular (aqui, qualquer status 5xx). A próxima lição detalha os quatro operadores de label e tem desafios para praticar. O resultado é um **vetor instantâneo**: o valor mais recente de cada série. Acrescentar `[5m]` cria um **vetor de intervalo** com os últimos 5 minutos de cada série, que é o que funções como `rate` consomem.

## rate: transformar counter em velocidade

O valor cru de um counter só cresce (18.432, 18.900...), então não mostra nada útil em um gráfico. O que importa é a **velocidade**:

```promql
rate(http_server_requests_seconds_count{uri="/pedidos"}[5m])
```

`rate` calcula o crescimento médio **por segundo** na janela e ainda compensa os reinícios do counter (quando zera). Regra prática: use uma janela de pelo menos **4 vezes o scrape_interval**; com 15 s, `[1m]` é o mínimo, e `[5m]` é o comum. `increase` devolve o crescimento total na janela, em vez de por segundo.

## Agregações: sum by

`rate` devolve uma série por instância, por URI e por status. Para somar entre instâncias e manter só o que interessa, use `sum by`:

```promql
sum by (uri) (rate(http_server_requests_seconds_count[5m]))
```

## O método RED

Três consultas respondem ao "está funcionando e está rápido?" de qualquer serviço que atende requisições:

```promql
# R (Rate): pedidos por segundo
sum(rate(http_server_requests_seconds_count{uri="/pedidos"}[5m]))

# E (Errors): taxa de erro, em fração
sum(rate(http_server_requests_seconds_count{uri="/pedidos", status=~"5.."}[5m]))
  /
sum(rate(http_server_requests_seconds_count{uri="/pedidos"}[5m]))

# D (Duration): p99 da latência, em segundos
histogram_quantile(0.99,
  sum by (le) (rate(http_server_requests_seconds_bucket{uri="/pedidos"}[5m])))
```

Se a divisão devolver `0.08`, são **8% de erro**. Multiplique por 100 para exibir em porcentagem.

## Atenção ao histogram_quantile

O `histogram_quantile` precisa dos **buckets** (`_bucket`) em forma de **taxa**, agrupados por `le` (o limite superior de cada bucket). Dois erros comuns:

- Esquecer o `rate`: o p99 passa a refletir toda a história desde o início do processo, e não os últimos 5 minutos.
- Esquecer o `sum by (le)`: o resultado fica separado por instância e não representa o serviço como um todo. Se quiser o p99 por URI, mantenha também o `uri`: `sum by (le, uri)`.

O valor é uma **estimativa por interpolação** dentro do bucket, por isso a precisão depende de os buckets cobrirem bem a faixa de interesse.

## O método USE

Para **recursos** (CPU, disco, pool de conexões, fila), o complemento do RED é o **USE**: **U**tilização, **S**aturação e **E**rros. Exemplo: o tamanho da fila de pagamentos subindo por minutos é saturação.

```promql
# a fila de pagamentos cresce ao longo do tempo?
deriv(pagamentos_fila_tamanho[10m]) > 0
```

## Próximos passos

A lição seguinte aprofunda os **filtros de label** (`=`, `!=`, `=~`, `!~`, `by` e `without`) e a depois traz as consultas da loja resolvidas em um playground.

## Lembre

- **rate** converte um counter em "por segundo" e trata reinícios; use janela ≥ 4× o scrape.
- **sum by** agrega; erros em % = `rate(5xx) / rate(total)`.
- p99 = `histogram_quantile(0.99, sum by (le) (rate(..._bucket[5m])))`.
- **RED** para serviços (rate, errors, duration); **USE** para recursos.
