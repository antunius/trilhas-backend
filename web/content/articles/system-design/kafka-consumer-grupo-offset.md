---
slug: kafka-consumer-grupo-offset
categorySlug: system-design
title: "Consumer, consumer group e offset"
navTitle: Consumer, grupo e offset
summary: "Entender como os consumidores dividem as partições, o que é um consumer group e como o offset marca o progresso"
level: intermediario
order: 83
section: deep-dives-tecnologias
group: "Kafka"
---

## Objetivos de aprendizagem

- [ ] Definir consumer, consumer group e offset
- [ ] Explicar por que dois consumer groups leem o mesmo tópico sem interferir
- [ ] Calcular quantos consumers de um grupo realmente trabalham em paralelo

## Consumer

O consumer é qualquer serviço que lê eventos de um tópico. No nosso cenário há três consumers completamente independentes: o serviço que atualiza o mapa no app do cliente, o painel da equipe de suporte e o pipeline de analytics. Cada um lê o mesmo tópico, para propósitos diferentes.

## Consumer group

Este é o ponto que mais confunde quem aprende Kafka. Um **consumer group** é um conjunto de consumers que, juntos, dividem entre si o trabalho de ler as partições de um tópico, como se fossem "um único leitor lógico" dividido em várias instâncias para dar paralelismo.

Duas regras explicam quase tudo:

1. **Cada grupo tem o seu próprio progresso de leitura**, independente de qualquer outro grupo. É isso que permite ao app do cliente, ao suporte e ao analytics lerem o mesmo tópico sem se atrapalhar: cada um é seu próprio grupo, com seu próprio ponteiro de leitura.
2. **Dentro de um grupo, cada partição é lida por exatamente um consumer por vez.** Duas instâncias do mesmo grupo nunca leem a mesma partição simultaneamente.

A segunda regra é o mecanismo de paralelismo horizontal. Se o grupo do app do cliente tem 4 instâncias e o tópico tem 8 partições, cada instância cuida, em média, de 2 partições.

![Arquitetura: um producer, um tópico com 4 partições, dois consumer groups independentes](/diagrams/kafka-arquitetura.svg)

*A imagem mostra a peça que mais confunde iniciantes: o grupo "app-cliente" e o grupo "analytics" leem o **mesmo** tópico, mas cada um mantém seu próprio progresso. Um não sabe nem se importa com o offset do outro.*

### O teto do paralelismo

Se o grupo tem **mais** consumers do que o tópico tem partições, os excedentes ficam ociosos. Com 8 partições e 12 instâncias, 8 trabalham e 4 esperam. O paralelismo de um grupo é limitado pelo número de partições.

## Offset

O offset é um número sequencial, a posição de um evento dentro de uma partição (0, 1, 2, 3...). Cada grupo, em cada partição, registra até qual offset já processou. É o "marcador de página": se um consumer cai e volta, retoma a partir do último offset confirmado (commitado), e não do início.

## Juntando as peças: o caminho de um evento

1. O app de um entregador (**producer**) gera uma atualização de posição.
2. A chave (ID do entregador) decide a **partição** do tópico `atualizacoes-entrega`.
3. O evento é anexado ao fim do log daquela partição, num **broker**, e recebe um **offset** sequencial.
4. Cada **consumer group** interessado tem instâncias lendo as partições que lhe foram atribuídas, avançando o próprio offset conforme processa.

## Na prática com Spring Boot

Um consumer do grupo `app-cliente`. O Spring Kafka cria o laço de leitura e chama o método para cada mensagem:

```java
@Component
public class MapaClienteConsumer {

    private final MapaService mapa;

    public MapaClienteConsumer(MapaService mapa) {
        this.mapa = mapa;
    }

    @KafkaListener(topics = "atualizacoes-entrega", groupId = "app-cliente")
    public void aoReceber(ConsumerRecord<String, String> registro) {
        // registro.key() = id do entregador, registro.value() = posição
        mapa.atualizar(registro.key(), registro.value());
    }
}
```

O `groupId` é o que define a identidade do grupo. Para ter um segundo grupo lendo os mesmos eventos (o analytics), basta outro `@KafkaListener` com outro `groupId`. Para escalar o primeiro, basta subir mais instâncias da aplicação com o mesmo `groupId`.

## Lembre

- Cada **consumer group** tem seu próprio offset, e grupos diferentes não interferem.
- Dentro de um grupo, **uma partição é lida por um consumer só**.
- Consumers a mais que partições ficam ociosos, então o teto do paralelismo é o número de partições.
