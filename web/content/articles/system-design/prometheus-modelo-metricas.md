---
slug: prometheus-modelo-metricas
categorySlug: system-design
title: "Modelo de dados e coleta do Prometheus"
navTitle: Modelo de métricas e pull
summary: "Entender séries temporais, labels, os tipos de métrica, o modelo pull de coleta e por que a cardinalidade é o maior risco"
level: intermediario
order: 104
section: deep-dives-tecnologias
group: "Prometheus e Grafana"
---

## Objetivos de aprendizagem

- [ ] Descrever uma série temporal e o papel dos labels
- [ ] Escolher entre counter, gauge e histogram para cada medida da loja
- [ ] Explicar o modelo pull e calcular o risco de cardinalidade

## Retomando o cenário

*O serviço de pedidos da loja precisa expor números que o Prometheus possa guardar: quantos pedidos entram, quantos falham, quanto tempo levam e quantos pagamentos esperam na fila.*

## Série temporal e labels

O Prometheus guarda **séries temporais**: sequências de pares (instante, valor). Cada série é identificada pelo **nome da métrica** mais um conjunto de **labels** (pares chave/valor):

```
http_server_requests_seconds_count{method="POST", uri="/pedidos", status="201"}  18432
http_server_requests_seconds_count{method="POST", uri="/pedidos", status="500"}  37
```

Essas são duas séries diferentes, e os labels permitem filtrar e agrupar depois ("só os 5xx", "por URI"). Os dados ficam em um banco próprio otimizado para séries temporais (o **TSDB**), local ao servidor.

## Os tipos de métrica

| Tipo | Comportamento | Exemplo na loja |
|---|---|---|
| **Counter** | Só cresce (ou zera ao reiniciar) | `pedidos_criados_total` |
| **Gauge** | Sobe e desce | `pagamentos_fila_tamanho` |
| **Histogram** | Conta observações em faixas (buckets) e soma os valores | duração do `POST /pedidos` |

Regra prática: se a pergunta é "quantos até agora?", use counter e calcule a taxa depois. Se é "quanto agora?", gauge. Se é "qual a distribuição do tempo?", histogram, porque só ele permite calcular **percentis** (p95, p99) de forma agregável entre instâncias.

O valor de um counter isolado quase não diz nada; o que importa é **quanto ele cresceu por segundo**, e isso é papel da função `rate` (lição de PromQL).

## Modelo pull

O Prometheus **busca** as métricas: a cada `scrape_interval` ele faz um `GET` em `/metrics` de cada alvo (no Spring, `/actuator/prometheus`). A aplicação não envia nada.

Vantagens do pull:

- Se um alvo some, o Prometheus percebe na hora (a métrica `up` vira 0).
- Você pode abrir o endpoint no navegador para depurar.
- A aplicação não precisa saber onde está o Prometheus.

Para jobs curtos que terminam antes do scrape, existe o **Pushgateway**, mas é a exceção.

Os alvos são descobertos por configuração estática ou por **service discovery** (Kubernetes, Consul). O intervalo padrão é de 1 minuto; os exemplos desta unidade usam 15 segundos.

## Cardinalidade: o risco que derruba o servidor

Cada combinação única de valores de labels cria **uma série nova**, e cada série custa memória. O número de séries é, aproximadamente, o produto dos valores possíveis de cada label.

A conta da loja: 20 URIs × 5 métodos HTTP × 10 códigos de status = 1.000 séries por instância. Aceitável. Agora alguém adiciona o label `user_id`, com 1 milhão de usuários: o número de séries pode saltar para dezenas de milhões e o Prometheus fica sem memória.

**Regra:** labels devem ter poucos valores, conhecidos e limitados. `user_id`, `pedido_id`, e-mail e URL com parâmetros não pertencem a labels. Para dados de alta cardinalidade, use logs ou traces.

## Lembre

- Uma série = nome da métrica + **conjunto de labels**.
- **Counter** só cresce, **gauge** oscila, **histogram** permite percentis.
- O Prometheus **puxa** (pull) as métricas a cada `scrape_interval`; o padrão é 1 minuto.
- Cada valor novo de label multiplica as séries: **nunca** use `user_id` como label.
