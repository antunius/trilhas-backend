---
slug: kafka-producer-ordenacao
categorySlug: system-design
title: "Producer, chave de particionamento e ordenação"
navTitle: Producer e ordenação
summary: "Entender como o producer escolhe a partição, o que é uma mensagem e qual garantia de ordem o Kafka oferece"
level: intermediario
order: 82
section: deep-dives-tecnologias
group: "Kafka"
---

## Objetivos de aprendizagem

- [ ] Descrever os componentes de uma mensagem e o papel da chave
- [ ] Explicar a garantia de ordem do Kafka e o que ela não cobre
- [ ] Escolher uma chave de particionamento e reconhecer o risco de mudar o número de partições

## Producer

O producer é qualquer serviço que escreve eventos no Kafka. No nosso cenário, o aplicativo do entregador, que envia a localização a cada poucos segundos, é um producer. Para cada evento, ele decide **em qual partição** ele deve cair, normalmente por meio de uma **chave de particionamento**.

## Anatomia de uma mensagem

Cada evento publicado carrega, em geral, quatro componentes:

- **Chave (key):** usada para decidir a partição, como o ID do entregador.
- **Valor (value):** o conteúdo real, como latitude, longitude e horário.
- **Timestamp:** quando o evento foi gerado ou recebido.
- **Headers (opcionais):** metadados extras, como um ID de rastreamento para depuração.

Quem fala só em "a mensagem" e não sabe que a chave é um campo separado do valor costuma ter dificuldade para explicar como o particionamento funciona por baixo.

## Ordenação: a garantia que existe, e a que não existe

O Kafka garante a ordem de escrita e de leitura **dentro de uma partição**, e nunca entre partições diferentes do mesmo tópico.

Isso tem uma consequência real. Se dois eventos do mesmo entregador ("saiu para entrega" e "chegou ao destino") caíssem em partições diferentes, um consumidor poderia processar "chegou" antes de "saiu", corrompendo a lógica de negócio.

**A solução padrão** é usar uma chave derivada da entidade cuja ordem importa, aqui o ID do entregador. O Kafka aplica um hash à chave para escolher a partição, e a mesma chave sempre mapeia para a mesma partição:

> partição = hash(chave) % número de partições

Isso garante a ordem *por entregador*, que é a granularidade que importa. Não precisamos de ordem global entre entregadores diferentes.

![Como a chave decide a partição: hash(chave) % número de partições](/diagrams/kafka-particionamento.svg)

*Note que "entregador_101" aparece duas vezes à esquerda (dois eventos diferentes) e as duas vezes cai na Partition 1. É isso que preserva a ordem relativa entre eventos do mesmo entregador, mesmo com várias partições no tópico.*

### Uma armadilha operacional

Se for preciso aumentar o número de partições do tópico no futuro, o hash de uma mesma chave pode passar a apontar para **outra** partição, porque o divisor mudou. Isso quebra a garantia de ordem para os eventos que estavam em trânsito na mudança. Mencionar esse detalhe demonstra profundidade real, e é um dos motivos para dimensionar as partições com folga desde o início.

## Na prática com Spring Boot

Um producer publicando posições, com o ID do entregador como chave. A configuração `acks: all` faz o producer esperar a confirmação de todas as réplicas sincronizadas:

```yaml
spring:
  kafka:
    bootstrap-servers: localhost:9092
    producer:
      acks: all
      key-serializer: org.apache.kafka.common.serialization.StringSerializer
      value-serializer: org.apache.kafka.common.serialization.StringSerializer
```

```java
@Service
public class PosicaoProducer {

    private static final Logger log = LoggerFactory.getLogger(PosicaoProducer.class);
    private final KafkaTemplate<String, String> kafka;

    public PosicaoProducer(KafkaTemplate<String, String> kafka) {
        this.kafka = kafka;
    }

    public void publicar(String entregadorId, double lat, double lon) {
        String payload = "{\"lat\":%s,\"lon\":%s,\"ts\":%d}"
            .formatted(lat, lon, System.currentTimeMillis());

        kafka.send("atualizacoes-entrega", entregadorId, payload) // chave = entregadorId
            .whenComplete((resultado, erro) -> {
                if (erro != null) {
                    log.error("Falha ao publicar posição de {}", entregadorId, erro);
                } else {
                    log.debug("Partição {} offset {}",
                        resultado.getRecordMetadata().partition(),
                        resultado.getRecordMetadata().offset());
                }
            });
    }
}
```

## Lembre

- A ordem só é garantida **dentro de uma partição**.
- A mesma chave vai sempre para a mesma partição: use como chave a entidade cuja ordem importa.
- Aumentar as partições depois pode mover a chave para outra partição e quebrar a ordem.
