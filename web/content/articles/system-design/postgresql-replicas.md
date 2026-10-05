---
slug: postgresql-replicas
categorySlug: system-design
title: "Réplicas de leitura e atraso de replicação"
navTitle: Réplicas de leitura
summary: "Escalar leitura com réplicas e lidar com o atraso para o usuário não deixar de ver a própria escrita"
level: intermediario
order: 57
section: deep-dives-tecnologias
group: "PostgreSQL"
---

## Objetivos de aprendizagem

- [ ] Explicar o atraso de replicação assíncrona com números
- [ ] Rotear leituras após uma escrita do próprio usuário

*Retomando o cenário da unidade: uma plataforma de reviews de restaurantes, com dados relacionais e busca de restaurantes dentro de um raio geográfico.*

## Réplicas de leitura e o atraso de replicação, com números

Para escalar leitura antes de considerar sharding (Módulo 2), réplicas de leitura recebem as escritas do banco primário de forma assíncrona e atendem consultas de leitura, distribuindo a carga.

**Um exemplo numérico concreto**: se a replicação assíncrona tem um atraso típico de 50-200ms (variando com carga e distância de rede), um usuário que acabou de publicar uma review e imediatamente recarrega a página pode, na pior das hipóteses, não ver sua própria review ainda — porque a leitura foi atendida por uma réplica que ainda não recebeu essa escrita específica. Uma mitigação comum é rotear a leitura imediatamente após uma escrita do próprio usuário para o banco primário (ou para uma réplica com garantia mais forte de estar atualizada), e só usar réplicas comuns para leituras que toleram esse atraso.

### Roteando leitura e escrita no Spring Boot

Uma forma simples: duas fontes de dados (primário e réplica) e uma anotação para escolher qual usar. Transações somente leitura vão à réplica, e escritas ao primário:

```java
public class RoteadorDataSource extends AbstractRoutingDataSource {
    @Override
    protected Object determineCurrentLookupKey() {
        boolean somenteLeitura = TransactionSynchronizationManager.isCurrentTransactionReadOnly();
        return somenteLeitura ? "replica" : "primario";
    }
}

@Service
public class ReviewService {

    @Transactional                      // escrita: vai ao primário
    public Review publicar(NovaReview nova) { /* ... */ }

    @Transactional(readOnly = true)     // leitura: vai à réplica
    public List<Review> listar(Long restauranteId) { /* ... */ }
}
```

Logo após o `publicar`, a leitura da própria review do usuário deve ir ao **primário** (ou esperar a réplica alcançar), para ele não achar que a review sumiu.

## Lembre

- Replicação assíncrona atrasa tipicamente **50 a 200 ms**.
- O usuário pode **não ver a própria escrita** se a leitura cair numa réplica atrasada.
- Mitigação: ler do **primário** logo após a escrita do mesmo usuário.
