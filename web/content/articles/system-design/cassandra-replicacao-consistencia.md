---
slug: cassandra-replicacao-consistencia
categorySlug: system-design
title: "Replicação e consistência ajustável"
navTitle: Replicação e consistência
summary: "Ajustar por operação quantas réplicas confirmam e usar W + R > N para obter consistência forte"
level: intermediario
order: 62
section: deep-dives-tecnologias
group: "Cassandra e DynamoDB"
---

## Objetivos de aprendizagem

- [ ] Explicar o fator de replicação e os níveis de leitura e escrita
- [ ] Aplicar W + R > N para justificar um nível de consistência

*Retomando o cenário da unidade: o histórico de mensagens de um chat (estilo WhatsApp), com bilhões de escritas por dia e a leitura mais comum sendo "as últimas N mensagens de uma conversa".*

## Replicação e consistência ajustável

Cada partição é replicada em múltiplos nós (um **fator de replicação**, tipicamente 3). A parte interessante é que, ao contrário de "consistente" ou "eventualmente consistente" como escolha única e global, esses bancos permitem ajustar, **por operação**, quantas réplicas precisam confirmar:

- **Nível de escrita**: se o fator de replicação é 3 e o nível de escrita exigido é 2 (`QUORUM`), a escrita só é confirmada como bem-sucedida depois que 2 das 3 réplicas a receberam.
- **Nível de leitura**: da mesma forma, uma leitura pode exigir resposta de 1, 2, ou todas as 3 réplicas antes de retornar um resultado.

**A matemática da consistência forte "ajustada"**: se `nível_escrita + nível_leitura > fator_de_replicação`, é matematicamente garantido que pelo menos uma réplica consultada na leitura também recebeu a escrita mais recente — obtendo consistência forte sem exigir que todas as réplicas participem de toda operação. No nosso exemplo (fator 3), escrita com nível 2 e leitura com nível 2 (2+2=4 > 3) garante essa propriedade; escrita com nível 1 e leitura com nível 1 (1+1=2, não > 3) não garante, priorizando velocidade sobre essa garantia.

**No nosso cenário de chat**: para o envio de uma mensagem, prioriza-se disponibilidade e baixa latência (nível de escrita baixo, ex: 1) — perder momentaneamente a garantia de leitura mais recente em um cenário raro de falha é aceitável, dado que o histórico de chat tolera uma inconsistência breve muito mais do que, digamos, um saldo bancário.

### Em Spring Boot

O nível de consistência pode ser definido por consulta. O histórico de chat tolera leituras mais rápidas e possivelmente atrasadas, e a escrita da mensagem prioriza baixa latência:

```java
SimpleStatement escrita = SimpleStatement
    .newInstance("INSERT INTO mensagem (id_conversa, ts, texto) VALUES (?, ?, ?)", idConversa, ts, texto)
    .setConsistencyLevel(DefaultConsistencyLevel.ONE);      // W = 1

SimpleStatement leitura = SimpleStatement
    .newInstance("SELECT * FROM mensagem WHERE id_conversa = ? LIMIT 50", idConversa)
    .setConsistencyLevel(DefaultConsistencyLevel.LOCAL_QUORUM);  // R = 2 de 3 na região
```

Com fator de replicação 3, escrever em `ONE` e ler em `LOCAL_QUORUM` dá W + R = 1 + 2 = 3, que **não** é maior que 3. Se a leitura recente precisar ser garantida, use `QUORUM` nos dois lados (2 + 2 = 4 > 3).

## Lembre

- Cada partição é replicada (**fator 3**, em geral).
- **W + R > N** garante que a leitura cruza com a escrita mais recente.
- Para chat, escrita com nível baixo é aceitável; para saldo, não.
