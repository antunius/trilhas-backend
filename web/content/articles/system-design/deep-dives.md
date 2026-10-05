---
slug: deep-dives
categorySlug: system-design
title: "Deep Dives: aprofundando nos pontos críticos"
navTitle: Deep Dives
summary: Escolher quais pontos do sistema merecem aprofundamento
level: intermediario
order: 7
section: framework-entrega
group: "Desenhar e aprofundar"
---

## Objetivos de aprendizagem

- [ ] Escolher quais pontos do sistema merecem aprofundamento
- [ ] Conduzir uma discussão de trade-offs de forma estruturada
- [ ] Responder bem quando o entrevistador direciona o aprofundamento

## Estrutura da aula

1. O que é um deep dive e por que essa etapa decide a entrevista
2. Como escolher onde aprofundar
3. Estrutura de uma boa resposta de deep dive
4. Quando o entrevistador escolhe o tema por você

## Conteúdo

### Por que essa etapa decide a entrevista

![Deep dive: aprofundar o ponto crítico](/diagrams/sd-deep-dives.svg)

Se o desenho de alto nível mostra que você entende o problema, os deep dives mostram se você entende profundidade técnica de verdade. É aqui que a maior parte da nota costuma ser definida — um candidato que entrega um desenho de alto nível mediano mas se aprofunda bem em um ou dois pontos críticos tende a ir melhor do que quem cobre tudo superficialmente.

### Como escolher onde aprofundar

Bons candidatos entrevistam a si mesmos: "qual parte deste sistema realmente quebraria em escala?" Normalmente, isso está relacionado ao requisito não-funcional mais desafiador levantado no início — se o sistema é dominado por leitura, o deep dive natural é cache e réplicas de leitura; se a escrita é o gargalo, sharding e filas de escrita assíncrona tendem a ser mais relevantes.

### Estrutura de uma boa resposta

Um deep dive bem conduzido normalmente segue esta forma: (1) nomear o problema específico que está sendo resolvido, (2) apresentar 2 ou 3 alternativas de solução, (3) comparar os trade-offs de cada uma, (4) escolher uma e justificar a escolha com base nos requisitos já levantados. Não existe resposta "certa" isolada — existe uma escolha bem justificada.

### Quando o entrevistador direciona

É comum e esperado que o entrevistador interrompa o desenho de alto nível e peça para você aprofundar em um ponto específico ("e se o volume de escrita for 100x maior?"). Isso não é um sinal de que algo está errado — é a forma mais comum de conduzir essa etapa. A resposta certa é tratar como uma pergunta genuína: reconhecer a mudança de requisito e ajustar o design de acordo, em vez de tentar defender o design anterior a todo custo.

## Exemplo aplicado

No encurtador de URLs, um deep dive natural é: "como gerar códigos curtos únicos sem colisão em escala?" — comparando um contador distribuído, hashing da URL original com truncamento, e um serviço dedicado de geração de IDs, discutindo os trade-offs de cada abordagem em termos de simplicidade, previsibilidade e risco de colisão.

## Erros comuns

- Tentar cobrir muitos pontos superficialmente em vez de se aprofundar de verdade em um ou dois.
- Defender a primeira ideia a qualquer custo, mesmo diante de uma boa objeção do entrevistador.
- Não conectar a escolha final aos requisitos levantados no início da entrevista.
