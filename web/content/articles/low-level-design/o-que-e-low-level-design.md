---
slug: o-que-e-low-level-design
categorySlug: low-level-design
title: "O que é Low Level Design"
navTitle: O que é Low Level Design
summary: Entender o que a entrevista de LLD avalia e como ela difere de System Design
level: iniciante
order: 1
section: fundamentos
---

## Objetivos de aprendizagem

- [ ] Diferenciar Low Level Design (LLD) de System Design (HLD)
- [ ] Entender os critérios que um entrevistador de LLD usa para avaliar

## Estrutura da aula

1. O que muda entre HLD e LLD
2. O que é avaliado numa entrevista de LLD
3. Por que Clean Code, SOLID e padrões de projeto formam a base do curso

## Conteúdo

### HLD vs. LLD

System Design (High Level Design) pergunta "quais serviços, bancos e filas compõem o sistema, e como eles se comunicam pela rede". Low Level Design pergunta uma escala abaixo: "dentro de um único serviço, como as classes se organizam para resolver o problema de forma extensível, testável e fácil de manter". Um exercício típico de LLD é "projete as classes de um sistema de estacionamento" ou "projete as classes de uma máquina de vendas" — não há rede, não há bancos de dados distribuídos, o problema inteiro cabe num processo Java.

### O que é avaliado

Um entrevistador de LLD raramente está testando se você conhece a sintaxe de Java. Ele está observando:

- **Modelagem de objetos**: você identifica as entidades certas (classes, interfaces) e as responsabilidades de cada uma?
- **Extensibilidade**: se um novo requisito aparecer no meio da entrevista ("agora o estacionamento também aceita motos"), seu design absorve a mudança sem reescrever tudo?
- **Uso correto de princípios e padrões**: você aplica SOLID e os padrões do GoF onde eles resolvem um problema real — não como decoração, "porque é isso que se espera dizer numa entrevista".
- **Código que compila e faz sentido**: interfaces, classes, e pelo menos os métodos principais escritos em Java de verdade, não pseudo-código vago.

### Por que este curso começa por Clean Code e SOLID

Padrões de projeto (GoF) são soluções recorrentes para problemas de design — mas um padrão aplicado sobre um código malcheiroso (nomes ruins, classes que fazem de tudo, funções gigantes) não resolve o problema de fundo, só o disfarça. Por isso a ordem do curso é: primeiro **Clean Code** (como escrever classes e funções legíveis), depois **SOLID** (os princípios que explicam *por que* um design é bom ou ruim), e só então os **padrões do GoF** — que, na prática, são a aplicação concreta desses princípios em situações conhecidas.

## Erros comuns

- Ir direto para "que padrão eu uso aqui" sem primeiro entender o problema e os requisitos.
- Tratar LLD como um teste de memorização dos 23 padrões do GoF, em vez de um teste de raciocínio de design.
- Escrever pseudo-código genérico demais para demonstrar domínio real da linguagem.
