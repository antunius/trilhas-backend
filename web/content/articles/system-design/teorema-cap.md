---
slug: teorema-cap
categorySlug: system-design
title: Teorema CAP e Consistência
summary: Explicar os três elementos do teorema CAP
level: intermediario
order: 16
section: tecnologias-chave
---

## Objetivos de aprendizagem

- [ ] Explicar os três elementos do teorema CAP
- [ ] Entender por que, na prática, a escolha real é entre C e A durante uma partição
- [ ] Relacionar o teorema a decisões concretas de design

## Conteúdo

### Os três elementos

![CAP: sob partição escolha C ou A](/diagrams/sd-teorema-cap.svg)

O teorema CAP afirma que um sistema distribuído não pode garantir simultaneamente as três propriedades a seguir durante uma partição de rede:

- **Consistência (Consistency)**: toda leitura recebe o dado mais recente escrito, ou um erro.
- **Disponibilidade (Availability)**: toda requisição recebe uma resposta (não um erro), mesmo que não seja o dado mais recente.
- **Tolerância a Partição (Partition tolerance)**: o sistema continua operando mesmo quando há falha de comunicação entre nós.

### Por que a escolha real é entre C e A

Em sistemas distribuídos reais, partições de rede eventualmente acontecem — logo, tolerância a partição não é opcional na prática, é uma realidade a se conciliar. Isso reduz a escolha efetiva a: durante uma partição, o sistema prioriza consistência (recusando responder ou respondendo com erro até garantir o dado mais atualizado) ou prioriza disponibilidade (respondendo sempre, mesmo com risco de dado desatualizado).

### Relacionando à prática

Sistemas financeiros costumam priorizar consistência (é preferível recusar uma transação a processá-la com saldo desatualizado). Sistemas como contadores de curtidas ou feeds sociais costumam priorizar disponibilidade (é aceitável mostrar um número levemente desatualizado a deixar de responder).

## Exemplo aplicado

Em um sistema bancário, durante uma partição de rede entre data centers, é preferível que uma transferência falhe explicitamente (priorizando consistência) a permitir que ela seja processada com base em um saldo potencialmente desatualizado, o que poderia gerar inconsistências financeiras reais.

## Erros comuns

- Tratar o teorema CAP como uma escolha permanente e global do sistema, quando na prática diferentes partes do mesmo sistema podem fazer escolhas diferentes.
- Esquecer que a tolerância a partição não é realmente opcional em sistemas distribuídos reais.
