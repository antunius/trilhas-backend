---
slug: lidando-com-contencao
categorySlug: system-design
title: "Padrão: Lidando com Contenção"
navTitle: Lidando com Contenção
summary: Reconhecer problemas de contenção (concorrência sobre um recurso limitado)
level: intermediario
order: 112
section: padroes-recorrentes
group: "Escala e concorrência"
---

## Objetivos de aprendizagem

- [ ] Reconhecer problemas de contenção (concorrência sobre um recurso limitado)
- [ ] Diferenciar bloqueio pessimista de controle otimista de concorrência

## Conteúdo

### Reconhecendo o padrão

![Locks e filas para contenda](/diagrams/sd-contencao.svg)

Contenção acontece quando múltiplos usuários competem por um recurso limitado ao mesmo tempo: o último assento de um show, o último item em estoque, uma reserva de hotel. O risco central é a condição de corrida — dois usuários lendo o mesmo estado (ex: "1 assento disponível") e ambos tentando reservá-lo antes que qualquer um dos dois confirme sua operação.

### Bloqueio pessimista

Trava o recurso assim que um usuário começa a operação, impedindo qualquer outro de tocá-lo até a operação terminar (ou expirar, no caso de um lock com tempo limite). É mais simples de raciocinar, mas reduz a taxa de operações concorrentes possíveis, já que outros usuários ficam bloqueados enquanto o lock existe.

### Controle otimista de concorrência

Permite que múltiplos usuários leiam e tentem operar sobre o mesmo recurso simultaneamente, mas verifica, no momento de confirmar a escrita, se o estado ainda é o mesmo que foi lido originalmente (normalmente através de um número de versão). Se o estado mudou entre a leitura e a escrita, a operação é rejeitada e pode ser tentada novamente. Isso tende a ter melhor desempenho sob baixa taxa de conflito real, mas exige lidar explicitamente com o caso de rejeição e nova tentativa.

### Escolhendo entre os dois

Bloqueio pessimista se encaixa melhor quando conflitos são frequentes e o custo de uma operação falhar e ter que ser refeita é alto. Controle otimista se encaixa melhor quando conflitos são raros na prática, mesmo que múltiplos usuários acessem o recurso — a maioria das operações passa sem nunca colidir de verdade.

## Exemplo aplicado

Em um sistema de venda de ingressos, um lock pessimista de curta duração (poucos minutos) pode reservar temporariamente um assento assim que o usuário inicia o checkout, liberando o assento automaticamente caso o pagamento não seja concluído a tempo — evitando que dois usuários finalizem a compra do mesmo assento simultaneamente.

## Implementando na prática (Java + Spring Boot)

### Como implementar

Para contenção com baixa taxa de conflito real — como a reserva de um assento entre poucos usuários simultâneos — o controle otimista de concorrência é a escolha natural em uma aplicação Spring: o JPA já suporta versionamento nativo via `@Version`, rejeitando a escrita com uma exceção quando o registro mudou entre a leitura e a tentativa de atualização, e a aplicação decide se tenta novamente. Já quando a contenção é pessimista por natureza e precisa coordenar múltiplas instâncias da aplicação (não apenas o banco), um lock distribuído — como o oferecido pelo Redisson sobre Redis — garante que só uma instância execute a seção crítica (por exemplo, o início do checkout de um assento) por vez, com expiração automática para não travar o recurso indefinidamente.

### Como usar em Java com Spring Boot

```java
@Entity
public class SeatReservation {

    @Id
    private Long id;

    private String status; // DISPONIVEL, RESERVADO, VENDIDO

    @Version
    private Long version;

    // getters e setters
}

@Service
public class SeatReservationService {

    private final SeatReservationRepository repository;

    public SeatReservationService(SeatReservationRepository repository) {
        this.repository = repository;
    }

    // Controle otimista: a exceção só ocorre se o "version" mudou
    @Retryable(
        retryFor = OptimisticLockingFailureException.class,
        maxAttempts = 3,
        backoff = @Backoff(delay = 100))
    @Transactional
    public void reserveSeat(Long seatId) {
        SeatReservation seat = repository.findById(seatId)
                .orElseThrow(() -> new IllegalArgumentException("Assento não encontrado"));

        if (!"DISPONIVEL".equals(seat.getStatus())) {
            throw new IllegalStateException("Assento indisponível");
        }
        seat.setStatus("RESERVADO");
        repository.save(seat); // falha aqui se outro processo já alterou o "version"
    }
}

@Service
public class CheckoutLockService {

    private final RedissonClient redissonClient;

    public CheckoutLockService(RedissonClient redissonClient) {
        this.redissonClient = redissonClient;
    }

    // Lock distribuído: garante exclusividade entre instâncias da aplicação
    public void startCheckout(Long seatId, Runnable checkoutAction) {
        RLock lock = redissonClient.getLock("checkout:seat:" + seatId);
        boolean acquired = false;
        try {
            acquired = lock.tryLock(2, 300, TimeUnit.SECONDS); // espera 2s, expira em 5min
            if (!acquired) {
                throw new IllegalStateException("Assento já em processo de checkout");
            }
            checkoutAction.run();
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new IllegalStateException("Checkout interrompido", e);
        } finally {
            if (acquired && lock.isHeldByCurrentThread()) {
                lock.unlock();
            }
        }
    }
}
```

### Como configurar

```yaml
spring:
  redis:
    host: redis
    port: 6379

redisson:
  address: redis://redis:6379
  connection-pool-size: 20
  connection-minimum-idle-size: 5
  timeout: 3000
```

```xml
<dependency>
    <groupId>org.redisson</groupId>
    <artifactId>redisson-spring-boot-starter</artifactId>
    <version>3.34.1</version>
</dependency>
```

## Erros comuns

- Ignorar completamente o problema de condição de corrida em um cenário onde múltiplos usuários competem pelo mesmo recurso.
- Escolher bloqueio pessimista sem considerar o impacto na taxa de operações concorrentes possíveis.
