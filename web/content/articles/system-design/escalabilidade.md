---
slug: escalabilidade
categorySlug: system-design
title: "Escalabilidade: Vertical vs. Horizontal"
navTitle: Escalabilidade
summary: Diferenciar escalabilidade vertical e horizontal
level: intermediario
order: 19
section: conceitos-centrais
---

## Objetivos de aprendizagem

- [ ] Diferenciar escalabilidade vertical e horizontal
- [ ] Reconhecer os limites práticos de cada abordagem

## Conteúdo

### Escalabilidade vertical

![Vertical vs horizontal](/diagrams/sd-escalabilidade.svg)

Consiste em aumentar a capacidade de uma única máquina — mais CPU, mais memória, discos mais rápidos. É simples de implementar (geralmente não exige mudança de arquitetura), mas tem um limite físico claro: existe um teto de hardware disponível, e o custo tende a crescer de forma desproporcional perto desse teto. Além disso, uma única máquina continua sendo um ponto único de falha.

### Escalabilidade horizontal

Consiste em adicionar mais máquinas trabalhando em paralelo, distribuindo carga entre elas (geralmente com um load balancer à frente). Não tem um teto tão evidente quanto a escalabilidade vertical, e naturalmente melhora a tolerância a falhas (a perda de uma máquina não derruba o sistema inteiro) — mas exige que a aplicação seja desenhada para funcionar de forma distribuída, o que nem sempre é trivial (ex: gerenciar estado compartilhado entre instâncias).

### Como decidir

Na prática, sistemas modernos de larga escala favorecem escalabilidade horizontal como estratégia principal, reservando a escalabilidade vertical como uma otimização mais simples e barata nos estágios iniciais, antes que a complexidade de uma arquitetura distribuída se justifique.

## Exemplo aplicado

Um sistema em estágio inicial, com poucos milhares de usuários, pode perfeitamente rodar em uma única máquina razoavelmente potente (escala vertical). Ao crescer para milhões de usuários, a mesma aplicação provavelmente precisa ser redesenhada para rodar em múltiplas instâncias atrás de um load balancer (escala horizontal), já que nenhuma máquina única, por mais potente, sustentaria esse volume sozinha.

## Erros comuns

- Assumir que escalabilidade horizontal é sempre a resposta certa, mesmo em sistemas pequenos onde ela adiciona complexidade desnecessária.
- Ignorar que aplicações precisam ser desenhadas (sem estado local crítico, por exemplo) para se beneficiarem de escala horizontal.
