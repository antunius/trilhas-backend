---
slug: prometheus-alertas-alertmanager
categorySlug: system-design
title: "Alertas com Prometheus e Alertmanager"
navTitle: Alertas e Alertmanager
summary: "Escrever regras de alerta com for, rotear com o Alertmanager, alertar por sintoma e evitar fadiga de alerta, com burn rate de SLO"
level: intermediario
order: 108
section: deep-dives-tecnologias
group: "Prometheus e Grafana"
---

## Objetivos de aprendizagem

- [ ] Escrever uma regra de alerta com expr, for e severidade
- [ ] Explicar o que o Alertmanager faz que o Prometheus não faz
- [ ] Escolher alertas por sintoma e entender burn rate

## Retomando o cenário

*Ninguém quer ficar olhando o dashboard às 3h da manhã. A loja precisa que o sistema acorde a pessoa certa quando os pedidos falharem, e só quando valer a pena.*

## Regra de alerta

O Prometheus avalia regras periodicamente. Uma regra é uma expressão PromQL que, enquanto for verdadeira, mantém o alerta ativo:

```yaml
# regras.yml
groups:
  - name: pedidos
    rules:
      - alert: PedidosErroAlto
        expr: |
          sum(rate(http_server_requests_seconds_count{uri="/pedidos", status=~"5.."}[5m]))
            /
          sum(rate(http_server_requests_seconds_count{uri="/pedidos"}[5m])) > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "Mais de 5% dos pedidos estão falhando"
```

O campo **`for: 5m`** é o que evita alarmes falsos: o alerta só dispara se a condição se mantiver por 5 minutos seguidos. Enquanto isso, ele fica em estado *pending*. Um pico de 30 segundos não acorda ninguém.

## Prometheus avalia, Alertmanager entrega

O Prometheus **só avalia** as regras e envia os alertas ativos ao **Alertmanager**. O Alertmanager cuida de tudo o que acontece depois:

- **Agrupamento** (`group_by`): 40 instâncias com o mesmo problema viram **uma** notificação, e não 40.
- **Roteamento**: `severity: critical` vai para o plantão (PagerDuty ou telefone); `warning` vai para um canal do Slack.
- **Silêncio** (silence): durante uma manutenção planejada, o alerta é calado por um período.
- **Inibição**: se o banco inteiro caiu, não adianta avisar também que cada serviço dependente falhou.
- **Repetição** (`repeat_interval`): relembra um alerta ainda ativo, sem enviar a cada avaliação.

```yaml
# alertmanager.yml
route:
  group_by: [alertname, application]
  group_wait: 30s
  repeat_interval: 4h
  receiver: slack
  routes:
    - matchers: [severity="critical"]
      receiver: plantao
```

## Alerte por sintoma, não por causa

| Alerta por causa | Alerta por sintoma |
|---|---|
| CPU acima de 80% | Mais de 5% dos pedidos falhando |
| Fila com 1.000 itens | p99 de `/pedidos` acima de 2 s |
| Pool de conexões em 90% | Fila de pagamentos crescendo por 15 min |

CPU a 80% pode ser perfeitamente saudável; pedidos falhando nunca é. Alertas de **sintoma** refletem o que o usuário sente e quase não geram falso positivo. Os de causa servem como **dashboards** de diagnóstico, não para acordar alguém.

## Fadiga de alerta

Quando metade dos alertas é ruído, o plantão passa a ignorar todos, inclusive os importantes. Cada alerta que acorda alguém deve ser **acionável** (há algo a fazer agora) e **urgente**. Se não for, vira ticket ou painel.

## Burn rate: alertar pelo SLO

Com um SLO de 99,9%, o orçamento de erro é 0,1%. O **burn rate** mede a velocidade com que ele é consumido: burn rate 1 gasta o orçamento exatamente em 30 dias; burn rate **14,4** gasta 2% do orçamento em 1 hora (e esgotaria tudo em cerca de 2 dias).

O padrão recomendado combina duas janelas: alerta **crítico** com burn rate alto em janela curta (1 h) e alerta de **atenção** com burn rate baixo em janela longa (6 h). Assim você pega tanto o incêndio rápido quanto o vazamento lento.

## Lembre

- **`for`** exige que a condição persista, evitando alarmes falsos.
- O **Prometheus avalia**; o **Alertmanager** agrupa, roteia, silencia e inibe.
- Alerte por **sintoma** (o que o usuário sente), não por causa.
- **Burn rate** liga alertas ao SLO: janela curta para urgência, longa para vazamentos.
