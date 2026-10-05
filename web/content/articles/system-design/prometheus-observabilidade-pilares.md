---
slug: prometheus-observabilidade-pilares
categorySlug: system-design
title: "Observabilidade e os três pilares"
navTitle: Observabilidade e pilares
summary: "Entender a diferença entre monitorar e observar, o papel de métricas, logs e traces, e como SLI e SLO transformam números em metas"
level: intermediario
order: 106
section: deep-dives-tecnologias
group: "Prometheus e Grafana"
---

## Objetivos de aprendizagem

- [ ] Distinguir métricas, logs e traces e saber qual responde a cada pergunta
- [ ] Explicar a diferença entre monitoramento e observabilidade
- [ ] Definir SLI, SLO e orçamento de erro com um exemplo concreto

## O cenário da unidade

Uma **loja online** em Spring Boot tem o serviço de pedidos (`POST /pedidos`), um serviço de pagamentos e uma fila de pagamentos entre eles. Na promoção de sexta, o tráfego chega a 300 pedidos por segundo. Às 21h, o suporte avisa: "o site está lento". O time precisa responder três perguntas, nesta ordem: **está funcionando? está lento? por quê?**

## Monitoramento e observabilidade

**Monitoramento** é olhar para perguntas que você já sabia fazer: "a CPU passou de 80%?", "o serviço responde ao health check?". **Observabilidade** é a capacidade de investigar uma pergunta que você *não* previu, usando só os dados que o sistema emite: "por que só os pedidos pagos com cartão, vindos do app, estão lentos?".

Para isso o sistema emite três tipos de sinal.

## Os três pilares

| Pilar | O que é | Responde melhor | Custo |
|---|---|---|---|
| **Métricas** | Números agregados ao longo do tempo (pedidos por segundo, p99) | "Há um problema? Qual o tamanho dele?" | Baixo e constante |
| **Logs** | Registros de eventos individuais, com texto | "O que aconteceu neste pedido específico?" | Cresce com o volume |
| **Traces** | O caminho de uma requisição por vários serviços, com o tempo de cada trecho | "Onde, entre os serviços, o tempo foi gasto?" | Alto, costuma usar amostragem |

Na prática o fluxo é: a **métrica** dispara o alerta ("a taxa de erro de `/pedidos` subiu para 8%"), o **trace** mostra que a lentidão está na chamada ao serviço de pagamentos, e o **log** daquele trecho traz a exceção exata.

Esta unidade foca em **métricas**, com Prometheus para coletar e armazenar e Grafana para visualizar.

## Por que métricas primeiro

Métricas são agregadas: guardar "300 requisições por segundo" custa o mesmo com 300 ou com 30 mil requisições. Logs e traces crescem com o tráfego. Por isso as métricas são a primeira camada de qualquer sistema em produção, e a que alimenta os alertas.

## SLI, SLO e orçamento de erro

- **SLI** (indicador): uma medida do que o usuário sente. Exemplo: a fração de pedidos que respondem sem erro e em menos de 500 ms.
- **SLO** (objetivo): a meta para esse indicador. Exemplo: 99,9% dos pedidos bons em 30 dias.
- **Orçamento de erro**: o que sobra até 100%. Com 99,9%, 0,1% dos pedidos podem falhar, ou cerca de 43 minutos de indisponibilidade em 30 dias.

O SLO muda a conversa: em vez de "queremos zero erros", o time decide **quanto erro é aceitável** e usa o orçamento para decidir entre lançar uma funcionalidade nova ou estabilizar.

## Os quatro sinais de ouro

O livro de SRE do Google resume o que medir em qualquer serviço: **latência**, **tráfego**, **erros** e **saturação**. A lição de PromQL vai usar a variante **RED** (rate, errors, duration) para o serviço de pedidos.

## Lembre

- **Métricas** dizem *que* há um problema, **traces** dizem *onde* e **logs** dizem *o quê*.
- Observabilidade é poder responder a perguntas que você não previu.
- Um **SLO** de 99,9% em 30 dias deixa cerca de **43 minutos** de orçamento de erro.
