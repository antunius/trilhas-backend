---
slug: speedrun-two-pointers
categorySlug: code
title: "Two Pointers Speedrun"
navTitle: "Two Pointers Speedrun"
summary: "Revisão rápida: os templates de dois ponteiros em uma página, para consultar antes de treinar."
level: intermediario
order: 34
section: two-pointers
group: Speedrun
---

## Templates

**Escrita + leitura**
```java
int slow = 0;
for (int fast = 0; fast < n; fast++) {
    if (keep(nums[fast])) nums[slow++] = nums[fast];
}
```

**Direção oposta**
```java
int l = 0, r = n - 1;
while (l < r) {
    // decide qual ponteiro descartar
}
```

**Janela mais longa**
```java
for (int r = 0; r < n; r++) {
    add(r);
    while (invalid()) remove(l++);
    best = Math.max(best, r - l + 1);
}
```

**Janela mais curta**
```java
for (int r = 0; r < n; r++) {
    add(r);
    while (valid()) { best = Math.min(best, r - l + 1); remove(l++); }
}
```

**Lento e rápido**
```java
while (fast != null && fast.next != null) {
    slow = slow.next; fast = fast.next.next;
}
```

**Prefix sum**
```java
prefix[i + 1] = prefix[i] + nums[i];   // soma(l..r) = prefix[r+1] - prefix[l]
```

## Perguntas relâmpago

- Contíguo e positivo? Janela. Contíguo com negativos? Prefix + hash.
- "Mais longo": registra fora do `while`. "Mais curto": dentro.
- Ordenado e busca par? Direção oposta.
- Lista e ciclo? Lento/rápido.
