---
slug: entendendo-invariantes
categorySlug: code
title: "Entendendo Invariantes"
navTitle: Entendendo Invariantes
summary: O que é o invariante que os ponteiros mantêm a cada passo, e por que ele garante que a resposta nunca é descartada por engano.
level: intermediario
order: 5
section: two-pointers
group: Conceitos Centrais
---

## O que é um invariante

Um invariante é uma afirmação sobre o estado da sua solução que permanece **verdadeira antes e depois de cada passo** do algoritmo. Em problemas de dois ponteiros, o invariante normalmente descreve uma garantia sobre a região da estrutura que ainda **não foi eliminada** — ou seja, a região onde a resposta ainda pode estar.

O invariante não é um detalhe acadêmico: é a peça que transforma "mover um ponteiro" de uma decisão arbitrária em uma decisão **comprovadamente segura**. Sem ele, não há como argumentar por que o algoritmo funciona — só há um algoritmo que parece funcionar nos exemplos testados.

## Um exemplo concreto

Em [Two Sum Sorted](/category/code/two-sum-ordenado), o invariante é:

> Se a resposta existir, ela está em algum par `(i, j)` com `left ≤ i < j ≤ right`.

No início, `left = 0` e `right = n - 1`, então o invariante vale trivialmente (todo par possível está dentro do intervalo). A cada passo:

- Se `nums[left] + nums[right] > target`, sabemos que **nenhum par terminando em `right`** pode ser a resposta (porque todo par com o mesmo `right` e um `left` menor teria soma ainda maior — o array está ordenado). Diminuir `right` em 1 preserva o invariante: a resposta, se existir, ainda está dentro do novo intervalo.
- O raciocínio simétrico vale para aumentar `left` quando a soma é pequena demais.

Note que o invariante é o que justifica **cada movimento individual** — antes de mover qualquer ponteiro, você deveria conseguir explicar por que a região descartada não pode conter a resposta.

## Como usar isso ao resolver um problema novo

1. Escreva explicitamente qual é o invariante que você pretende manter (geralmente: "a resposta, se existir, está no intervalo/região X").
2. Verifique que o invariante vale na inicialização dos ponteiros.
3. Para cada movimento possível de cada ponteiro, verifique que o invariante continua valendo depois do movimento.
4. Se não conseguir justificar o passo 3, o algoritmo provavelmente está incorreto — mesmo que "pareça" funcionar em alguns exemplos.

## Erros comuns

- Mover um ponteiro "porque parece certo", sem conseguir articular qual garantia isso preserva.
- Assumir que o invariante de um problema se aplica a outro parecido sem verificar as condições que o tornam válido (por exemplo, exigir que a estrutura esteja ordenada).
