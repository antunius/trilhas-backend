---
slug: prefix-sum-introducao
categorySlug: code
title: "Prefix Sum: Introdução"
navTitle: "Introduction"
summary: "Pré-computar somas acumuladas para responder somas de intervalo em O(1)."
level: iniciante
order: 24
section: two-pointers
group: Prefix Sum
---

## O problema

Você vai responder muitas perguntas do tipo "qual a soma de `nums[l..r]`?". Somar cada intervalo custa O(n) por consulta.

## A ideia

Construa `prefix` com `prefix[0] = 0` e `prefix[i + 1] = prefix[i] + nums[i]`. Então:

```
soma(l..r) = prefix[r + 1] - prefix[l]
```

`prefix[r + 1]` é a soma de tudo até `r`; subtrair `prefix[l]` remove o que vem antes de `l`. Construção O(n), cada consulta O(1).

## Templates

### Prefixo simples (consultas de intervalo)

```java
int[] prefix = new int[nums.length + 1];
for (int i = 0; i < nums.length; i++) {
    prefix[i + 1] = prefix[i] + nums[i];
}
// soma de nums[l..r]
int soma = prefix[r + 1] - prefix[l];
```

**Aplicado em:** [Range Sum Query - Immutable](/category/code/range-sum-query).

### Prefixo + hash map (contar subarrays com soma k)

```java
Map<Integer, Integer> seen = new HashMap<>();
seen.put(0, 1);                       // prefixo vazio
int prefix = 0, count = 0;
for (int x : nums) {
    prefix += x;
    count += seen.getOrDefault(prefix - k, 0);   // consulta antes de registrar
    seen.merge(prefix, 1, Integer::sum);
}
```

**Aplicado em:** [Subarray Sum Equals Target](/category/code/subarray-soma-alvo).

### Prefixo e sufixo (sem divisão)

```java
int[] out = new int[n];
out[0] = 1;
for (int i = 1; i < n; i++) out[i] = out[i - 1] * nums[i - 1];   // esquerda
int suffix = 1;
for (int i = n - 1; i >= 0; i--) {
    out[i] *= suffix;                                            // direita
    suffix *= nums[i];
}
```

**Aplicado em:** [Product of Array Except Self](/category/code/produto-exceto-o-proprio).

## Quando usar

- Muitas consultas de soma em intervalos sobre dados que **não mudam**.
- Contar subarrays com soma alvo (combinado com hash map).
- Funciona com **negativos**, ao contrário de sliding window.

## Variações

- **Diferença**: `prefix[i] - prefix[j]` mede o que aconteceu entre `j` e `i`.
- **Prefixo + sufixo**: [Product of Array Except Self](/category/code/produto-exceto-o-proprio).
- **Hash map de prefixos**: [Subarray Sum Equals Target](/category/code/subarray-soma-alvo).

## Erros comuns

- Esquecer o `prefix[0] = 0` (perde intervalos que começam em 0).
- Confundir o índice: `prefix` tem `n + 1` posições.
