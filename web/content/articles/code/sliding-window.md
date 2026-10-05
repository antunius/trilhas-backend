---
slug: sliding-window
categorySlug: code
title: Sliding Window
navTitle: Introdução ao Sliding Window
summary: Reconhecer problemas de subarray ou substring contínua
level: intermediario
order: 16
section: two-pointers
group: Sliding Window
---

## Objetivos de aprendizagem

- [ ] Reconhecer problemas de subarray ou substring contínua
- [ ] Diferenciar janela de tamanho fixo de janela de tamanho variável

## Conteúdo

### O que é a técnica

Sliding window mantém uma "janela" contígua (um intervalo de índices) sobre uma estrutura sequencial, expandindo e contraindo essa janela conforme uma condição é avaliada, evitando recalcular do zero a cada nova posição — reduzindo o que seria O(n²) em força bruta para O(n).

### Janela de tamanho fixo

O tamanho da janela é conhecido de antemão (ex: "encontre a soma máxima de qualquer subarray de tamanho k"). A cada passo, a janela avança uma posição: remove o elemento que sai de um lado e adiciona o que entra do outro, atualizando o resultado de forma incremental.

### Janela de tamanho variável

O tamanho da janela muda dinamicamente conforme uma condição (ex: "encontre a menor substring que contém todos os caracteres de um padrão"). A janela expande enquanto a condição não é satisfeita, e contrai assim que é satisfeita, buscando o melhor resultado possível.

### Como reconhecer o padrão

Pistas comuns: o problema pede algo sobre um subarray ou substring *contínuo* (não qualquer subconjunto), e envolve otimizar (máximo, mínimo, mais curto, mais longo) alguma propriedade desse intervalo contínuo.

## Templates

### Janela de tamanho fixo

```java
int sum = 0, best = Integer.MIN_VALUE;
for (int right = 0; right < nums.length; right++) {
    sum += nums[right];                    // entra
    if (right >= k) sum -= nums[right - k]; // sai
    if (right >= k - 1) best = Math.max(best, sum);
}
```

**Invariante:** depois de `right >= k - 1`, `sum` é a soma exata dos `k` últimos elementos. **Aplicado em:** [Subarray Sum - Fixed](/category/code/soma-subarray-fixa), [Find All Anagrams](/category/code/anagramas-na-string).

### Janela variável — a mais longa

```java
int left = 0, best = 0;
for (int right = 0; right < nums.length; right++) {
    adiciona(nums[right]);
    while (janelaInvalida()) {
        remove(nums[left]);
        left++;
    }
    best = Math.max(best, right - left + 1);   // fora do while
}
```

**Invariante:** ao registrar, a janela `[left, right]` é válida. **Aplicado em:** [Sliding Window - Longest](/category/code/janela-mais-longa), [Longest Substring without Repeating Characters](/category/code/substring-sem-repeticao).

### Janela variável — a mais curta

```java
int left = 0, best = Integer.MAX_VALUE;
for (int right = 0; right < nums.length; right++) {
    adiciona(nums[right]);
    while (janelaValida()) {
        best = Math.min(best, right - left + 1);   // dentro do while
        remove(nums[left]);
        left++;
    }
}
return best == Integer.MAX_VALUE ? 0 : best;
```

**Invariante:** ao sair do `while`, a janela deixou de ser válida; todo início antes de `left` já foi considerado. **Aplicado em:** [Sliding Window - Shortest](/category/code/janela-mais-curta), [Minimum Window Substring](/category/code/minimum-window-substring).

> Regra de bolso: **mais longa** registra *fora* do `while`; **mais curta** registra *dentro*.

## Exemplo aplicado

Para encontrar a maior soma de qualquer subarray de tamanho fixo k, uma janela desliza pelo array: a soma da janela é atualizada subtraindo o elemento que sai e somando o que entra a cada passo, em vez de recalcular a soma inteira da janela a cada nova posição.

## Erros comuns

- Recalcular a métrica da janela do zero a cada movimento, em vez de atualizá-la de forma incremental.
- Aplicar sliding window a um problema que não envolve um intervalo contínuo, onde a técnica não se encaixa.
