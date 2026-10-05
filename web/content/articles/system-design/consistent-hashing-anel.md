---
slug: consistent-hashing-anel
categorySlug: system-design
title: "O anel de consistent hashing e os nós virtuais"
navTitle: O anel e os nós virtuais
summary: "Entender como o anel limita o rebalanceamento e por que os nós virtuais equilibram a carga"
level: intermediario
order: 35
section: tecnologias-chave
group: "Consistent hashing"
---

## Objetivos de aprendizagem

- [ ] Descrever como a chave encontra seu servidor no anel
- [ ] Explicar o papel dos nós virtuais

*Retomando o cenário da unidade: um cluster de cache com 4 servidores guardando 1 milhão de chaves, e a pergunta de o que acontece quando um quinto servidor entra.*

## A solução: o anel

Consistent hashing resolve isso com uma ideia simples: em vez de dividir por N, posicionar tudo num **círculo**.

### Passo a passo

1. Imagine um **anel** que representa todos os valores de hash, de 0 até o máximo, fechado em círculo (depois do maior número volta-se ao 0).
2. Calcule o hash do **nome de cada servidor** e coloque cada um num ponto do anel.
3. Para guardar ou buscar uma chave, calcule o hash dela e coloque-a também no anel.
4. A chave pertence ao **primeiro servidor encontrado andando no sentido horário** a partir da sua posição.

![Anel de consistent hashing](/diagrams/sd-consistent-hashing.svg)

*A imagem mostra servidores (círculos grandes) e chaves (pontos) no mesmo anel. Cada chave "anda" até o próximo servidor. Repare que cada servidor cuida do trecho do anel que vem antes dele.*

### O que acontece quando entra um servidor

O servidor novo cai em algum ponto do anel e passa a cuidar **apenas do trecho** entre ele e o servidor anterior. Só as chaves desse trecho trocam de dono, e todas as outras ficam onde estavam.

Se os 4 servidores dividem o anel igualmente, cada um cuida de 25%. Ao entrar o quinto, ele toma uma parte dos vizinhos, e em média apenas **1/5 = 20%** das chaves se movem. Em vez de 80%.

### O que acontece quando um servidor cai

As chaves dele passam ao **próximo servidor** no sentido horário. As chaves dos demais servidores não mudam de lugar. O estrago fica contido.

| Situação | Hash por módulo | Consistent hashing |
|---|---|---|
| 4 → 5 servidores | ~80% das chaves mudam | ~20% mudam |
| 100 → 101 servidores | ~99% mudam | ~1% muda |
| 1 servidor cai (de 4) | ~75% mudam | ~25% mudam (só as dele) |

## Nós virtuais: a distribuição equilibrada

Com poucos pontos no anel, a divisão sai desigual por puro acaso: um servidor pode ficar com 45% do anel e outro com 10%. Há também um segundo efeito: quando um servidor cai, **todas** as suas chaves vão para **um único vizinho**, que fica sobrecarregado.

A solução são os **nós virtuais** (*virtual nodes*, ou *vnodes*): em vez de um ponto por servidor, cada servidor físico recebe **muitos pontos** no anel, por exemplo 200, calculados com `hash("servidor-A#1")`, `hash("servidor-A#2")` e assim por diante.

Os benefícios:

- A divisão do anel fica muito mais próxima do igual, porque a média de muitos pontos aleatórios é estável.
- Quando um servidor cai, suas chaves se espalham entre **vários** servidores, não para um só vizinho.
- Servidores mais potentes podem receber **mais pontos** e, portanto, mais chaves.

O custo é uma pequena tabela de pontos a manter em memória e ordenada, o que é desprezível.

## Lembre

- A chave pertence ao **primeiro servidor no sentido horário**.
- Ao entrar um servidor, só o **trecho dele** se move: cerca de 1/N.
- **Nós virtuais** equilibram o anel e espalham a carga de um servidor que cai.
