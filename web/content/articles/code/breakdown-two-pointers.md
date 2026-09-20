---
slug: breakdown-two-pointers
categorySlug: code
title: "Two Pointers: Breakdown de Problemas"
navTitle: "Monster Breakdown | Two Pointers"
summary: "Como quebrar um problema desconhecido de dois ponteiros em invariante, movimento e condição de parada."
level: avancado
order: 35
section: two-pointers
group: Speedrun
---

## Exemplo guiado

**Problema:** dado `nums` ordenado, retorne o número de pares `(i, j)`, `i < j`, com `nums[i] + nums[j] < target`.

### 1. Classifique

Entrada ordenada, busca de pares → **direção oposta**.

### 2. Invariante

Para `l < r`, se `nums[l] + nums[r] < target`, então **todos** os pares `(l, l+1..r)` também servem, pois os valores só crescem.

### 3. Movimento

- Soma < target: some `r - l` pares e avance `l`.
- Soma ≥ target: diminua `r`.

### 4. Parada

Quando `l == r`.

```java
public int countPairs(int[] nums, int target) {
    int l = 0, r = nums.length - 1, count = 0;
    while (l < r) {
        if (nums[l] + nums[r] < target) { count += r - l; l++; }
        else r--;
    }
    return count;
}
```

## Receita reutilizável

1. **Classifique** o padrão pelas pistas do enunciado.
2. **Escreva o invariante** em uma frase.
3. **Defina o que cada movimento descarta.**
4. **Defina a parada** e os casos de borda.
5. **Só então codifique.**

## Erro mais comum

Escrever o laço antes de entender o que ele descarta. Se você não sabe justificar o movimento, volte ao passo 2.
