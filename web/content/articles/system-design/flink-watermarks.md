---
slug: flink-watermarks
categorySlug: system-design
title: "Eventos fora de ordem e watermarks"
navTitle: Watermarks
summary: "Entender como o Flink decide quando uma janela pode fechar, apesar de eventos chegarem atrasados"
level: intermediario
order: 89
section: deep-dives-tecnologias
group: "Flink"
---

## Objetivos de aprendizagem

- [ ] Explicar o que é um watermark e a margem de tolerância
- [ ] Descrever o trade-off entre latência e completude

*Retomando o cenário da unidade: um painel de métricas em tempo real para uma plataforma de anúncios, com cliques por minuto por campanha.*

## Eventos fora de ordem: watermarks

Em um sistema distribuído real, eventos não chegam necessariamente na ordem em que aconteceram — uma instabilidade de rede pode atrasar um clique que "aconteceu" antes de outro que já chegou. Isso levanta uma pergunta prática: quanto tempo o sistema espera antes de considerar uma janela definitivamente "fechada" e emitir seu resultado final?

Um **watermark** é a resposta do Flink a essa pergunta: um marcador que avança ao longo do stream, indicando "não esperamos mais ver eventos com timestamp anterior a X" (com alguma margem de tolerância configurável, ex: 10 segundos). Quando o watermark ultrapassa o fim de uma janela, essa janela é considerada fechada e seu resultado é emitido — eventos que chegarem depois disso, atrasados além da margem tolerada, são tratados como "atrasados demais" (descartados, ou tratados por uma lógica de atualização tardia separada, dependendo da configuração).

**No nosso cenário**: se configurarmos uma margem de tolerância de 10 segundos, um clique com timestamp de 10:00:58 que chega às 10:01:05 (7 segundos de atraso) ainda é incluído corretamente na janela das 10:00; um clique que chega às 10:01:15 (17 segundos de atraso) já ultrapassou a margem e não seria mais incluído — essa margem é, na prática, um trade-off entre latência de resposta (esperar mais = métricas mais tardias, porém mais completas) e completude do resultado.

### Em Java

```java
WatermarkStrategy<Clique> estrategia = WatermarkStrategy
    .<Clique>forBoundedOutOfOrderness(Duration.ofSeconds(10))   // tolera 10 s de atraso
    .withTimestampAssigner((clique, ts) -> clique.getTimestamp());  // tempo do evento

DataStream<Clique> cliques = env.fromSource(fonteKafka, estrategia, "cliques");
```

`forBoundedOutOfOrderness(10 s)` diz: "não espero ver eventos com timestamp mais de 10 segundos atrás do maior já visto". Um watermark é emitido de acordo, e quando ele passa do fim de uma janela, o resultado dela é emitido.

Para eventos que chegam depois disso, o Flink permite configurar uma tolerância extra (`allowedLateness`) que reabre a janela e emite uma atualização, ou desviar os eventos atrasados para uma saída lateral (`sideOutputLateData`) em vez de descartá-los em silêncio.

## Lembre

- O **watermark** marca "não esperamos mais eventos anteriores a X".
- Margem grande: resultados **completos, porém tardios**. Margem pequena: **rápidos, porém incompletos**.
- Eventos atrasados demais podem ser descartados ou tratados à parte (**side output**).
