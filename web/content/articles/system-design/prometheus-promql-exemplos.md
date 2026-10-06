---
slug: prometheus-promql-exemplos
categorySlug: system-design
title: "PromQL: consultas da loja na prática"
navTitle: "PromQL: exemplos na prática"
summary: "Montar as consultas do dia a dia da loja, como taxa de sucesso, erro por instância, top rotas, p99 e saturação, resolvendo cada uma no playground"
level: intermediario
order: 108
section: deep-dives-tecnologias
group: "Prometheus e Grafana"
---

## Objetivos de aprendizagem

- [ ] Escrever as consultas RED e a taxa de sucesso do serviço de pedidos
- [ ] Usar topk, histogram_quantile, deriv e up em perguntas reais de operação
- [ ] Interpretar o resultado de cada consulta, não só escrevê-la

## Retomando o cenário

*Sexta-feira de promoção. O gerente pergunta: quantos pedidos por segundo estamos recebendo, qual a taxa de sucesso, qual instância falha mais, e se a fila de pagamentos está encostando. Cada pergunta vira uma consulta.*

## Do enunciado à consulta

Quase toda consulta operacional segue três passos:

1. **Filtrar** as séries certas (`uri="/pedidos"`).
2. **Transformar** counters em velocidade (`rate(...[5m])`).
3. **Agregar** como a pergunta pede (`sum`, `sum by (instance)`, `topk`).

Para perguntas de **razão** (sucesso, erro), calcule dois agregados com os mesmos labels e divida: `sum(rate(2xx)) / sum(rate(total))`. Se a resposta for `0.927`, são 92,7% de sucesso.

## Como interpretar

- **Taxa de sucesso**: é uma fração de 0 a 1. O complemento (`1 - sucesso`) é a taxa de erro.
- **Erro por instância**: se uma instância tem taxa bem maior que a outra, o problema é local (deploy ruim, máquina doente) e não do sistema todo.
- **p99 de 0,93 s**: 99% das requisições terminam em até ~0,93 s. É uma **estimativa por interpolação** dentro do bucket, e o 1% mais lento fica de fora.
- **`deriv` positivo na fila**: chega mais pagamento do que sai; é saturação (método USE).
- **`up == 0`**: o Prometheus não conseguiu coletar aquela instância: ela caiu ou o endereço está errado.

## Cuidados que valem em produção

- `topk(3, rate(...))` sem agregar ranqueia **séries** (rota + status + instância), não rotas. Some por `uri` antes.
- No p99, mantenha `sum by (le)`; sem isso, o cálculo é por instância e por status.
- Compare com o passado usando `offset`: `pagamentos_fila_tamanho offset 30m` mostra a fila de 30 minutos atrás.
- Um vetor que só filtra (`> 0`, `== 0`) devolve **só as séries que passam**; sem resultado, a condição está falsa para todas, o que costuma ser a boa notícia.

## Desafios

Resolva cada pergunta do gerente. A saída é conferida contra o resultado esperado.

```promqlplay
{
  "challenges": [
    {
      "task": "Quantos **pedidos por segundo** a rota `/pedidos` recebe no total (todas as instâncias e status)?",
      "solution": "sum(rate(http_server_requests_seconds_count{uri=\"/pedidos\"}[5m]))",
      "hint": "Filtre a rota, aplique rate com janela de 5m e some tudo."
    },
    {
      "task": "Calcule a **taxa de sucesso** de `/pedidos`: requisições 2xx divididas pelo total.",
      "solution": "sum(rate(http_server_requests_seconds_count{uri=\"/pedidos\", status=~\"2..\"}[5m])) / sum(rate(http_server_requests_seconds_count{uri=\"/pedidos\"}[5m]))",
      "hint": "Divida duas somas de rate; a de cima filtra status=~\"2..\"."
    },
    {
      "task": "Calcule a **taxa de erro por instância** de `/pedidos` (status 5xx dividido pelo total de cada instância).",
      "solution": "sum by (instance) (rate(http_server_requests_seconds_count{uri=\"/pedidos\", status=~\"5..\"}[5m])) / sum by (instance) (rate(http_server_requests_seconds_count{uri=\"/pedidos\"}[5m]))",
      "hint": "O mesmo sum by (instance) dos dois lados faz os labels casarem."
    },
    {
      "task": "Quais são as **3 rotas com mais tráfego** (requisições por segundo)?",
      "solution": "topk(3, sum by (uri) (rate(http_server_requests_seconds_count[5m])))",
      "hint": "Some por uri primeiro e só depois aplique topk."
    },
    {
      "task": "Qual o **p99 da latência** de `/pedidos`, em segundos?",
      "solution": "histogram_quantile(0.99, sum by (le) (rate(http_server_requests_seconds_bucket{uri=\"/pedidos\"}[5m])))",
      "hint": "Use os buckets (_bucket), rate, e some mantendo o label le."
    },
    {
      "task": "Mostre **só as instâncias cuja fila de pagamentos está crescendo** nos últimos 10 minutos.",
      "solution": "deriv(pagamentos_fila_tamanho[10m]) > 0",
      "hint": "deriv mede a inclinação; compare o resultado com zero."
    },
    {
      "task": "Quais instâncias o Prometheus **não consegue coletar** (métrica up igual a 0)?",
      "solution": "up == 0",
      "hint": "up vale 1 quando o scrape funciona e 0 quando falha."
    }
  ]
}
```

## Lembre

- Filtrar, aplicar `rate`, agregar: nessa ordem.
- Razão = divisão de dois agregados com **os mesmos labels**.
- `topk` depois de `sum by`; p99 com `sum by (le)`.
- `deriv(...) > 0` e `up == 0` retornam só o que está com problema.
