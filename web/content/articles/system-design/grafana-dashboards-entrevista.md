---
slug: grafana-dashboards-entrevista
categorySlug: system-design
title: "Grafana, dashboards e escala na entrevista"
navTitle: Grafana e entrevista
summary: "Montar o dashboard RED da loja no Grafana, provisioná-lo por arquivo, e saber escalar o Prometheus e responder a perguntas de entrevista"
level: intermediario
order: 104
section: deep-dives-tecnologias
group: "Prometheus e Grafana"
---

## Objetivos de aprendizagem

- [ ] Montar um dashboard RED com variáveis e provisioná-lo por arquivo
- [ ] Descrever como escalar o Prometheus com federation, remote_write e Thanos
- [ ] Reconhecer o que diferencia uma resposta de nível médio de uma de nível sênior

## Retomando o cenário

*O serviço de pedidos publica métricas e já tem alertas. Falta o painel que o time e o suporte abrem durante uma promoção para ver, de relance, se está tudo bem.*

## Grafana: visualizar, não armazenar

O **Grafana** não guarda métricas: ele consulta **fontes de dados** (Prometheus, Loki, Tempo, bancos SQL) e desenha os resultados. O Prometheus é o banco; o Grafana, a vitrine.

## O dashboard RED da loja

Um bom dashboard de serviço segue o método RED, com um painel por pergunta, de cima para baixo:

| Painel | Consulta (resumo) | Tipo |
|---|---|---|
| Pedidos por segundo | `sum(rate(..._count{uri="/pedidos"}[$__rate_interval]))` | Série temporal |
| Taxa de erro | razão dos 5xx pelo total | Série ou *stat* com limite vermelho |
| p50, p95, p99 | `histogram_quantile` sobre `sum by (le)` | Série temporal, três linhas |
| Fila de pagamentos | `pagamentos_fila_tamanho` | Série temporal |

Duas dicas: use `$__rate_interval` em vez de uma janela fixa, para o Grafana ajustar a janela ao zoom; e crie **variáveis** (por exemplo, `$application`, `$instance`) para o mesmo painel servir a vários serviços.

## Provisioning: dashboards como código

Montar painéis à mão no navegador não escala. O Grafana carrega fontes de dados e dashboards de **arquivos**, que ficam no Git:

```yaml
# grafana/provisioning/datasources/prometheus.yml
apiVersion: 1
datasources:
  - name: Prometheus
    type: prometheus
    url: http://prometheus:9090
    isDefault: true
```

Os dashboards também podem ser definidos em JSON e versionados com o código do serviço. Assim, subir um ambiente novo já traz tudo pronto.

## Onde entram logs e traces

O Grafana é a porta de entrada dos três pilares: **Loki** guarda logs e **Tempo** guarda traces. Com um *exemplar* ou um `trace_id` nos logs, você clica em um ponto lento do gráfico e chega ao trace correspondente. O Grafana também sabe alertar, mas o pipeline Prometheus + Alertmanager costuma ser preferido para alertas de produção.

## Escalando o Prometheus

Um Prometheus é um servidor único com disco local: simples e rápido, mas limitado.

- **Retenção:** o padrão é de 15 dias. Para guardar meses, aumente a retenção e o disco, ou envie os dados para fora.
- **Alta disponibilidade:** rode **dois Prometheus idênticos** coletando os mesmos alvos; o Alertmanager remove as duplicatas.
- **Federation:** um Prometheus central coleta agregados de Prometheus regionais.
- **`remote_write`:** envia as amostras a um armazenamento de longo prazo e escalável, como **Thanos**, **Mimir** ou **Cortex**, com consulta global e retenção longa.
- **Cardinalidade:** é o limite real. Monitore `prometheus_tsdb_head_series` e derrube labels de alta cardinalidade antes de adicionar mais máquinas.

## O que separa uma resposta de nível médio de uma de nível sênior

| Nível | O que costuma ser entregue |
|---|---|
| Júnior/Pleno | Cita "Prometheus coleta e Grafana mostra" e sugere alertar quando a CPU passa de 80% |
| Sênior | Escolhe métricas pelo RED e USE, explica o pull, alerta por sintoma com `for` e fala de cardinalidade |
| Staff+ | Define SLOs com orçamento de erro e alertas por burn rate, e propõe `remote_write` com retenção longa e HA |

## Erros comuns

- Usar `user_id` ou URL completa como label.
- Plotar um counter sem `rate`.
- Calcular p99 sem `sum by (le)` ou fazer média de percentis.
- Alertar por CPU em vez de por sintoma.
- Dashboards com 40 painéis que ninguém consegue ler.

## Perguntas de aprofundamento

- "Como o Prometheus sabe que um serviço caiu?" (a métrica `up` vira 0 quando o scrape falha.)
- "E se o próprio Prometheus cair?" (dois Prometheus idênticos; um alerta de "watchdog" externo.)
- "Como guardar métricas por 1 ano?" (`remote_write` para Thanos/Mimir, ou downsampling.)

## Lembre

- O **Grafana consulta**; o Prometheus **armazena**. Versione dashboards com **provisioning**.
- O dashboard de um serviço segue o **RED** e usa `$__rate_interval`.
- Para escalar: **HA em par**, **federation**, **`remote_write`** para Thanos/Mimir; o limite real é a **cardinalidade**.
