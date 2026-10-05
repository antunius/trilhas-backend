---
slug: cap-pratica-entrevista
categorySlug: system-design
title: "CAP na prática e na entrevista"
navTitle: Na prática e na entrevista
summary: "Ajustar o nível de consistência por operação, tratar o erro do lado CP e responder em entrevista"
level: intermediario
order: 41
section: tecnologias-chave
group: "Teorema CAP"
---

## Objetivos de aprendizagem

- [ ] Escolher o nível de consistência por consulta
- [ ] Tratar bem o erro de um sistema CP

*Retomando o cenário da unidade: um serviço de saldo de conta replicado em dois data centers, São Paulo e Frankfurt, cuja rede entre os dois pode falhar.*

## Na prática

### Escolhendo o nível de consistência por operação (Cassandra com Spring Data)

```java
@Service
public class SaldoService {

    private final CassandraTemplate cassandra;

    public SaldoService(CassandraTemplate cassandra) {
        this.cassandra = cassandra;
    }

    // Saldo: precisa ser o mais recente => QUORUM (comportamento CP)
    public Saldo lerSaldo(String contaId) {
        SimpleStatement leitura = SimpleStatement
            .newInstance("SELECT * FROM saldo WHERE conta_id = ?", contaId)
            .setConsistencyLevel(DefaultConsistencyLevel.QUORUM);
        return cassandra.getCqlOperations().queryForObject(leitura, saldoMapper);
    }

    // Contador de curtidas: pode estar levemente velho => ONE (comportamento AP)
    public long lerCurtidas(String postId) {
        SimpleStatement leitura = SimpleStatement
            .newInstance("SELECT total FROM curtidas WHERE post_id = ?", postId)
            .setConsistencyLevel(DefaultConsistencyLevel.ONE);
        return cassandra.getCqlOperations().queryForObject(leitura, Long.class);
    }
}
```

A mesma aplicação faz uma escolha CP para o saldo e AP para as curtidas.

### Lidando com o erro do lado CP

Um sistema CP devolve erro quando não consegue confirmar. A aplicação precisa tratá-lo bem, sem fingir que deu certo:

```java
@RestControllerAdvice
public class ErrosDeConsistencia {

    @ExceptionHandler(CassandraInsufficientReplicasAvailableException.class)
    public ResponseEntity<Erro> aoFaltarQuorum() {
        // 503: o serviço não pode responder com segurança agora; o cliente pode tentar de novo
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
            .header("Retry-After", "5")
            .body(new Erro("Não foi possível confirmar o saldo agora. Tente novamente."));
    }
}
```

Mostrar ao usuário um erro claro é muito melhor do que exibir um saldo que pode estar errado.

## O que separa uma resposta de nível médio de uma de nível sênior

| Nível | O que costuma ser entregue |
|---|---|
| Júnior/Pleno | Cita "escolha 2 de 3" e associa bancos a CP ou AP |
| Sênior | Explica que a escolha é entre C e A **durante uma partição**, mostra o exemplo da réplica desatualizada, e escolhe por operação conforme o custo do erro |
| Staff+ | Cita PACELC e o custo de latência fora da partição, usa quóruns (W + R > N) para ajustar o nível por operação, e descreve como reconciliar dados depois de uma partição AP (resolução de conflitos) |

## Erros comuns

- Tratar o teorema CAP como uma escolha permanente e global do sistema, quando diferentes partes podem escolher diferente.
- Esquecer que a tolerância a partição não é realmente opcional em sistemas distribuídos reais.
- Achar que "CA" é um sistema distribuído possível: um sistema sem tolerância a partição só existe em uma máquina só.
- Dizer "NoSQL é AP e SQL é CP" como regra fixa: muitos bancos permitem ajustar.
- Esquecer que, sem partição, o sistema pode ter as duas propriedades, e que o custo da consistência então é latência.

## Perguntas de aprofundamento que um entrevistador pode fazer

- "Por que não dá para ter as três propriedades?" (numa partição, uma réplica que não consegue falar com a outra só pode responder com dado possivelmente velho ou recusar.)
- "Como você escolhe entre CP e AP para um carrinho de compras?" (pelo custo do erro: um item a mais no carrinho é barato de corrigir no pagamento, então AP.)
- "O que significa W + R > N?" (as leituras e escritas se sobrepõem em pelo menos uma réplica, garantindo ver a escrita mais recente.)
- "O que acontece com os dados de um sistema AP depois que a rede volta?" (as réplicas se reconciliam, por exemplo com "última escrita vence" ou merge de conflitos, o que pode perder atualizações se não for bem desenhado.)

## Lembre

- A mesma aplicação pode ser **CP para o saldo** e **AP para as curtidas**.
- Num sistema CP, devolva **503 com Retry-After**, e não um dado que pode estar errado.
- Explique o que acontece com os dados de um sistema **AP** depois que a rede volta.
