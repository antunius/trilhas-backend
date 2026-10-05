---
slug: iterando-com-a-ia
categorySlug: ai-coding
title: "Iterando com a IA: Prompts de Refinamento"
navTitle: Iterando com a IA
summary: Estruturar iterações eficazes quando o primeiro resultado não é satisfatório
level: intermediario
order: 5
section: workflow
---

## Objetivos de aprendizagem

- [ ] Estruturar iterações eficazes quando o primeiro resultado não é satisfatório
- [ ] Saber quando refinar o prompt e quando reescrever a abordagem do zero

## Conteúdo

### Refinando em vez de recomeçar

Na maioria dos casos, o resultado inicial da IA está parcialmente correto — a estratégia mais eficiente costuma ser refinar através de feedback específico sobre a parte que precisa mudar, preservando o que já está funcionando, em vez de descartar tudo e pedir uma nova versão do zero.

### Quando vale recomeçar do zero

Ocasionalmente, a abordagem inicial escolhida pela IA está fundamentalmente equivocada (ex: resolveu um problema diferente do que foi pedido, ou usou uma tecnologia incompatível com o restante do projeto) — nesses casos, tentar "consertar" incrementalmente pode ser mais lento do que simplesmente reformular o prompt inicial com mais contexto e recomeçar.

### Limitando o número de iterações

Um sinal de alerta é entrar em um ciclo de muitas iterações sem progresso real — se depois de duas ou três tentativas de refinamento o problema persiste, vale parar e reconsiderar se a abordagem geral (não apenas os detalhes) precisa ser repensada, possivelmente até fazendo parte da implementação manualmente.

## Exemplo aplicado

Se a IA gerou uma função que funciona para o caso comum, mas falha em um caso extremo específico, o candidato pede um ajuste pontual mencionando esse caso — preservando toda a lógica já correta, em vez de descartar a função inteira e pedir uma nova implementação do zero.

## Erros comuns

- Descartar e recomeçar do zero a cada pequeno problema, mesmo quando um ajuste pontual resolveria.
- Continuar iterando indefinidamente sem perceber que a abordagem de base está equivocada.
