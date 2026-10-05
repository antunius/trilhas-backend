---
slug: redis-lock-distribuido
categorySlug: system-design
title: "Lock distribuído com Redis"
navTitle: Lock distribuído
summary: "Garantir uma resposta por jogador por pergunta com SET NX EX e conhecer os limites do lock de nó único"
level: intermediario
order: 69
section: deep-dives-tecnologias
group: "Redis"
---

## Objetivos de aprendizagem

- [ ] Implementar um lock com SET NX EX
- [ ] Explicar o limite de confiabilidade de um lock de nó único

*Retomando o cenário da unidade: uma plataforma de quiz ao vivo, com placar, limite de respostas por jogador e um lock para contar uma resposta só por pergunta.*

## Lock Distribuído: garantindo uma resposta por jogador por pergunta

### O problema de contenção

Se o app do jogador reenviar a mesma resposta duas vezes (por uma reconexão de rede, por exemplo), precisamos garantir que ela seja contabilizada só uma vez.

### A implementação básica

```
SET lock:jogador_42:pergunta_7 "1" NX EX 5
```

O modificador `NX` ("only if Not eXists") faz esse comando ter sucesso apenas se a chave ainda não existir — se dois pedidos de lock chegarem quase simultaneamente, só um deles consegue criar a chave; o outro recebe uma resposta de falha e sabe que já existe um processamento em andamento. O `EX 5` garante que o lock expira sozinho em 5 segundos, mesmo que o processo que o criou trave e nunca o libere explicitamente — evitando um lock "preso" para sempre.

### O aviso importante sobre confiabilidade

Um lock Redis de nó único é uma ferramenta de **eficiência**, não uma garantia absoluta de correção em todos os cenários de falha distribuída — em situações raras envolvendo falha do próprio nó Redis no meio da operação, duas partes podem, em teoria, acreditar que possuem o lock simultaneamente. Para a maioria dos problemas de entrevista (incluindo o nosso quiz, onde o pior caso de uma resposta duplicada processada é irrelevante o suficiente), essa garantia "quase sempre correta" já é adequada — mas vale mencionar essa limitação explicitamente, em vez de apresentar o lock Redis como uma garantia perfeita. Para cenários onde essa garantia mais forte é realmente necessária, existe o algoritmo Redlock (coordenando o lock através de múltiplas instâncias Redis independentes), com seus próprios trade-offs de complexidade.

### Em Spring Boot

```java
public boolean adquirir(String jogadorId, long perguntaId) {
    String chave = "lock:" + jogadorId + ":pergunta_" + perguntaId;
    // SET chave valor NX EX 5: só cria se não existir, e expira sozinho
    Boolean ok = redis.opsForValue().setIfAbsent(chave, "1", Duration.ofSeconds(5));
    return Boolean.TRUE.equals(ok);
}
```

Para liberar o lock com segurança, guarde um valor único (por exemplo um UUID) e só apague a chave se o valor ainda for o seu, num script Lua. Caso contrário, um processo lento poderia apagar o lock que já pertence a outro.

## Lembre

- `SET ... NX EX` cria o lock e define a expiração **numa só operação**.
- `GET` seguido de `SET` recria a condição de corrida que o lock deveria evitar.
- O lock de nó único é **eficiência**, não garantia absoluta; para mais rigor existe o Redlock.
