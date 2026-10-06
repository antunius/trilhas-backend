---
slug: prometheus-promql-labels
categorySlug: system-design
title: "PromQL: filtros de label"
navTitle: "PromQL: filtros de label"
summary: "Dominar os quatro operadores de label, a regex ancorada, os filtros combinados e a diferença entre by e without, resolvendo desafios no playground"
level: intermediario
order: 107
section: deep-dives-tecnologias
group: "Prometheus e Grafana"
---

## Objetivos de aprendizagem

- [ ] Escolher entre =, !=, =~ e !~ para filtrar séries por label
- [ ] Explicar por que a regex do Prometheus é ancorada e o que significa label vazio
- [ ] Agrupar com by e without e resolver os desafios no playground

## Retomando o cenário

*O suporte da loja quer olhar só as falhas de `/pedidos`, só uma instância, só o que não é sucesso. Tudo isso se resolve com filtros de label, e o resto da lição é treino.*

## Os quatro operadores

Dentro das chaves de um seletor, cada filtro compara um label com um valor entre aspas:

| Operador | Significa | Exemplo |
|---|---|---|
| `=` | igual | `{status="500"}` |
| `!=` | diferente | `{uri!="/produtos"}` |
| `=~` | casa com a regex | `{status=~"5.."}` |
| `!~` | não casa com a regex | `{status!~"2.."}` |

Vários filtros separados por vírgula valem **todos ao mesmo tempo** (E lógico): `{uri="/pedidos", status=~"5.."}` são as falhas de servidor de `/pedidos`.

O nome da métrica é só um atalho para o label interno `__name__`. Por isso `up{job="pedidos"}` equivale a `{__name__="up", job="pedidos"}`, e dá para escolher várias métricas de uma vez: `{__name__=~"up|pagamentos_fila_tamanho"}`.

## A regex é ancorada

Diferente de `grep`, a expressão do Prometheus casa o valor **inteiro**, como se tivesse `^` e `$`:

- `status=~"5.."` casa `500` e `503` (o ponto vale um caractere), mas **não** `5`.
- `status=~"5"` casa só o valor exato `5`, e a consulta devolve vazio.
- `uri=~"/pedidos.*"` casa `/pedidos`, `/pedidos/12` e qualquer coisa depois.
- `status=~"500|503"` é uma alternativa explícita.

Uma consulta que não casa nada **não dá erro**: devolve vazio. Se o gráfico ficou em branco, suspeite do filtro (ou de um nome de métrica errado).

## Label ausente é label vazio

Se uma série não tem o label, o Prometheus o trata como `""`. Assim, `{job=""}` seleciona as séries **sem** `job`, e `{job!=""}` as que têm. Os valores devem vir sempre entre aspas: `status=500` é erro de sintaxe.

## by e without

Depois de `rate`, cada série ainda carrega todos os labels. Para somar, você escolhe o que **manter** ou o que **remover**:

```promql
sum by (instance) (rate(http_server_requests_seconds_count[5m]))                  # mantém só instance
sum without (status, method, uri) (rate(http_server_requests_seconds_count[5m]))  # remove esses três; o resto fica
```

`by` é o caminho curto quando você sabe o que quer ver. `without` é melhor quando a métrica ganha labels novos e você não quer reescrever a consulta.

## Dividir séries: on e ignoring

Numa divisão, o Prometheus casa as séries pelos labels. Quando os dois lados têm **os mesmos labels** (por exemplo, `sum by (instance)` dos dois lados), basta dividir. Se um lado tem labels a mais, use `on(instance)` para casar só por esse label, ou `ignoring(status)` para ignorar um.

## Desafios

Escreva a consulta, clique em **Executar** e veja se a saída bate com a esperada. Consultas diferentes que produzem a mesma saída também valem.

```promqlplay
{
  "challenges": [
    {
      "task": "Selecione as séries de `http_server_requests_seconds_count` com **status 500**.",
      "solution": "http_server_requests_seconds_count{status=\"500\"}",
      "hint": "Dentro das chaves, escreva o label, o operador = e o valor entre aspas."
    },
    {
      "task": "Agora só a rota `/pedidos` com **erro de servidor** (status que começa com 5), usando uma expressão regular.",
      "solution": "http_server_requests_seconds_count{uri=\"/pedidos\", status=~\"5..\"}",
      "hint": "Dois filtros separados por vírgula; no status use =~ com cada \".\" valendo um caractere."
    },
    {
      "task": "Mostre todas as séries **exceto** as da rota `/produtos`.",
      "solution": "http_server_requests_seconds_count{uri!=\"/produtos\"}",
      "hint": "O operador de diferença é !=."
    },
    {
      "task": "Mostre as séries cujo status **não** é de sucesso (não começa com 2), usando !~.",
      "solution": "http_server_requests_seconds_count{status!~\"2..\"}",
      "hint": "!~ é o oposto de =~."
    },
    {
      "task": "Calcule as requisições por segundo (janela de 5 minutos) **somadas por instância**.",
      "solution": "sum by (instance) (rate(http_server_requests_seconds_count[5m]))",
      "hint": "rate dentro, sum by (instance) por fora."
    },
    {
      "task": "Some o rate de tudo, mas usando **without** para remover os labels status, method e uri.",
      "solution": "sum without (status, method, uri) (rate(http_server_requests_seconds_count[5m]))",
      "hint": "without lista o que sai; o resto dos labels permanece."
    }
  ]
}
```

## Lembre

- `=`, `!=`, `=~`, `!~`; vários filtros valem **ao mesmo tempo**.
- A regex é **ancorada**: `5..` casa `500`, `5` não casa `500`.
- Label ausente é `""`; consulta sem correspondência devolve **vazio**, não erro.
- `by` mantém, `without` remove; `on`/`ignoring` ajustam o casamento da divisão.
