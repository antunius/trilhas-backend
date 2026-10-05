---
slug: zookeeper-eleicao-lider
categorySlug: system-design
title: "Eleição de líder com znodes efêmeros sequenciais"
navTitle: Eleição de líder
summary: "Construir passo a passo a eleição de líder e entender por que cada worker observa só o znode anterior"
level: intermediario
order: 94
section: deep-dives-tecnologias
group: "ZooKeeper"
---

## Objetivos de aprendizagem

- [ ] Montar o algoritmo de eleição de líder passo a passo
- [ ] Explicar o efeito thundering herd e como evitá-lo

*Retomando o cenário da unidade: um cluster de 5 workers idênticos, em que exatamente um precisa atuar como coordenador a qualquer momento, com recuperação automática.*

## Construindo eleição de líder com essas peças

Vamos construir o algoritmo passo a passo, aplicado ao nosso cluster de 5 workers.

**Passo 1**: cada worker, ao iniciar, cria um znode efêmero e sequencial sob `/eleicao/` — por exemplo, o worker A cria `/eleicao/n_0000000001`, o worker B cria `/eleicao/n_0000000002`, e assim por diante conforme cada um sobe.

**Passo 2**: cada worker lista os znodes existentes sob `/eleicao/` e verifica: "meu número sequencial é o menor de todos?" Se sim, esse worker é a líder. Se não, ele não é.

**Passo 3 — o detalhe que evita um problema sério de escala**: um worker que não é líder não deveria colocar um watch diretamente no znode da líder (`n_0000000001`). Se fizesse isso, quando a líder caísse, **todos** os 4 workers restantes seriam notificados ao mesmo tempo, e todos tentariam simultaneamente verificar e reagir — um efeito conhecido como "thundering herd" (manada trovejante), desperdiçando trabalho e coordenação. Em vez disso, cada worker coloca um watch apenas no znode **imediatamente anterior ao seu** na sequência: o worker com `n_0000000003` observa apenas `n_0000000002`, não `n_0000000001`.

![Eleição de líder com znodes efêmeros sequenciais e watches em cadeia](/diagrams/zookeeper-eleicao-lider.svg)

**Passo 4**: se a líder (`n_0000000001`) cair, sua sessão expira, e o ZooKeeper remove automaticamente seu znode efêmero. Isso dispara o watch do worker que o observava (`n_0000000002`), que então verifica novamente "sou eu o menor agora?" — e, sendo o caso, se torna a nova líder. A falha se propaga em cadeia, um passo de cada vez, não como uma notificação em massa.

## Lembre

- O worker com o **menor número** sequencial é o líder.
- Cada worker observa **só o znode imediatamente anterior**.
- A falha da líder se propaga **em cadeia**, um passo de cada vez.
