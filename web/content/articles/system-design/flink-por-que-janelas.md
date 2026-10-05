---
slug: flink-por-que-janelas
categorySlug: system-design
title: "Por que Flink e as janelas de tempo"
navTitle: Janelas de tempo
summary: "Saber quando usar Flink em vez de um consumidor simples ou de um batch, e escolher entre janelas tumbling, sliding e session"
level: intermediario
order: 88
section: deep-dives-tecnologias
group: "Flink"
---

## Objetivos de aprendizagem

- [ ] Justificar o Flink frente a um consumidor simples e a um batch
- [ ] Escolher entre janelas tumbling, sliding e session

*Retomando o cenário da unidade: um painel de métricas em tempo real para uma plataforma de anúncios, com cliques por minuto por campanha.*

## Por que não um consumidor simples, nem um batch

Duas alternativas aparecem naturalmente, e vale saber por que não bastam aqui.

**Um consumidor comum com um contador em memória.** Funciona até o processo cair: a contagem parcial some, e as janelas em andamento ficam erradas. Também não tem um mecanismo pronto para eventos atrasados, nem para dividir o estado quando um processo só não aguenta o volume.

**Um batch a cada hora.** Simples, mas o painel só mostraria a campanha com até uma hora de atraso. Para marketing ajustar uma campanha no ar, isso é tarde demais.

Números do nosso cenário: com 50 mil cliques por segundo, são 3 milhões de cliques por minuto. Um contador por campanha cabe em memória, mas o fluxo de entrada exige paralelismo, e a recuperação depois de falha exige estado durável. Se o checkpoint acontece a cada 30 segundos, uma falha obriga a reprocessar **até 30 s de eventos**, cerca de 1,5 milhão de cliques, o que o Flink faz em poucos segundos relendo do Kafka.

Use Flink quando houver **agregação contínua com estado ao longo do tempo** e requisitos de correção e baixa latência. Se for só transformar cada evento isoladamente, um consumidor comum basta.

## Janelas de tempo: os três tipos principais

- **Tumbling window (janela fixa, sem sobreposição)**: intervalos consecutivos e não sobrepostos — ex: 10:00:00-10:01:00, depois 10:01:00-10:02:00. Cada evento pertence a exatamente uma janela. É o tipo natural para "cliques por minuto" no nosso cenário.
- **Sliding window (janela deslizante, com sobreposição)**: uma janela de duração fixa (ex: 5 minutos) que se recalcula a cada intervalo menor (ex: a cada 1 minuto) — útil para uma métrica tipo "média móvel dos últimos 5 minutos", atualizada a cada minuto, em vez de esperar 5 minutos entre cada atualização.
- **Session window**: agrupa eventos por períodos de atividade separados por um intervalo de inatividade (ex: agrupar os cliques de uma mesma sessão de navegação, fechando a janela após 30 minutos sem nenhum clique novo) — o tamanho da janela não é fixo, depende do comportamento real dos eventos.

![Tumbling vs. sliding window ao longo do tempo](/diagrams/flink-janelas.svg)

## Lembre

- Use Flink quando há **agregação contínua com estado ao longo do tempo**.
- **Tumbling**: fixa e sem sobreposição. **Sliding**: com sobreposição. **Session**: por inatividade.
- "Cliques por minuto" é o caso de uma janela **tumbling**.
