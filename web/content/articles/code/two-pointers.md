---
slug: two-pointers
categorySlug: code
title: "Dois Ponteiros: Introdução"
navTitle: Introdução
summary: O que é a técnica de dois ponteiros, por que ela existe e as duas famílias principais de problemas que ela resolve.
level: intermediario
order: 4
section: two-pointers
group: Intro
---

## O que é a técnica

Two pointers usa duas posições (índices, ou referências a nós) que se movem através de uma estrutura de dados — geralmente um array, string ou lista encadeada — de forma coordenada. Em vez de comparar todos os pares possíveis de elementos (o que custaria O(n²) na maioria dos casos), os dois ponteiros permitem eliminar combinações inteiras a cada passo, resolvendo o problema em O(n).

O que torna a técnica funcionar é sempre a mesma coisa: um **invariante** — uma condição que os ponteiros mantêm verdadeira a cada passo, e que garante que a resposta não pode estar em uma região que já foi descartada. As próximas páginas ([Entendendo Invariantes](/category/code/entendendo-invariantes) e [Formatos Comuns de Invariante](/category/code/formas-de-invariante)) entram em detalhe sobre isso.

## As duas famílias

### Mesma direção (Same Direction)

Os dois ponteiros começam no início da estrutura e avançam para frente, mas em ritmos ou com propósitos diferentes — um ponteiro "lento" que marca uma posição de escrita ou de referência, e um ponteiro "rápido" que varre a estrutura à procura de algo. É a família usada para:

- Modificações in-place com espaço extra O(1), como remover ou reorganizar elementos.
- Detectar ciclos ou encontrar o meio de uma lista encadeada (par lento/rápido).
- Percorrer duas listas ou dois arrays em paralelo.

### Direção oposta (Opposite Direction)

Um ponteiro começa no início, outro no final, e eles se movem um em direção ao outro. É a família típica de problemas sobre **pares (ou mais) de elementos em uma estrutura ordenada**, como:

- Encontrar um par de números que soma um valor-alvo.
- Verificar se uma string é um palíndromo.
- Encontrar a maior área possível entre duas paredes.

## Templates

Antes dos problemas, aqui estão os esqueletos que você vai reaproveitar. Cada um tem um **invariante** — a frase que justifica cada movimento de ponteiro.

| Variação | Ponteiros | Invariante | Quando usar |
|---|---|---|---|
| Escrita + leitura | `slow`, `fast` na mesma direção | `[0, slow)` já está no estado final | Modificar in-place |
| Lento e rápido | `slow` 1 passo, `fast` 2 passos | a diferença de velocidade codifica a posição | Lista encadeada: meio, ciclo |
| Direção oposta | `left` no início, `right` no fim | o par ótimo está em `[left, right]` | Array ordenado, pares, palíndromo |
| Janela fixa | `left`/`right` a distância `k` | métrica = soma dos `k` últimos | Subarray de tamanho `k` |
| Janela variável | `left ≤ right` | a janela é válida após o `while` | Maior/menor intervalo contíguo |

### Escrita + leitura

```java
int slow = 0;
for (int fast = 0; fast < nums.length; fast++) {
    if (deveManter(nums[fast])) {
        nums[slow] = nums[fast];
        slow++;
    }
}
// nums[0..slow) contém o resultado
```

**Aplicado em:** [Remove Duplicates](/category/code/remover-duplicatas), [Move Zeroes](/category/code/mover-zeros).

### Lento e rápido (lista encadeada)

```java
ListNode slow = head, fast = head;
while (fast != null && fast.next != null) {
    slow = slow.next;
    fast = fast.next.next;
    // if (slow == fast) -> há ciclo
}
// se não houve ciclo, slow está no meio
```

**Aplicado em:** [Middle of a Linked List](/category/code/meio-lista-encadeada), [Linked List Cycle](/category/code/ciclo-lista-encadeada).

### Direção oposta

```java
int left = 0, right = nums.length - 1;
while (left < right) {
    int soma = nums[left] + nums[right];
    if (soma == target) {
        return new int[] { left, right };
    } else if (soma < target) {
        left++;      // precisamos de um valor maior
    } else {
        right--;     // precisamos de um valor menor
    }
}
return new int[] { -1, -1 };
```

**Aplicado em:** [Two Sum Sorted](/category/code/two-sum-ordenado), [Valid Palindrome](/category/code/palindromo-valido), [Container com Mais Água](/category/code/container-com-mais-agua).

### Janela deslizante (fixa e variável)

```java
// Fixa: tamanho k
for (int right = 0; right < n; right++) {
    entra(right);
    if (right >= k) sai(right - k);
    if (right >= k - 1) atualizaResposta();
}

// Variável: mais longa
int left = 0;
for (int right = 0; right < n; right++) {
    entra(right);
    while (invalida()) sai(left++);
    best = Math.max(best, right - left + 1);
}
```

**Aplicado em:** [Mapa Sliding Window](/category/code/mapa-sliding-window) e os problemas do grupo. Detalhes na [Introdução ao Sliding Window](/category/code/sliding-window).

## Como reconhecer o padrão

Considere dois ponteiros quando o problema pedir:

- Encontrar um par (ou mais) de elementos que satisfaça uma condição de soma ou comparação, em uma estrutura ordenada (ou que pode ser ordenada sem perder informação relevante).
- Uma modificação in-place com espaço extra limitado, reorganizando elementos em vez de criar uma nova estrutura.
- Comparar elementos a partir das duas pontas de uma estrutura.
- Detectar um ciclo, ou encontrar uma posição relativa (como o meio) em uma lista encadeada.

## Erros comuns

- Tentar aplicar dois ponteiros em uma estrutura não ordenada sem antes considerar se ordenar (ou usar outra estrutura) resolveria o problema de forma mais simples.
- Confundir quando usar ponteiros de mesma direção versus ponteiros de direção oposta.
- Mover um ponteiro sem ter certeza de que isso preserva o invariante — é isso que garante que nenhuma resposta válida está sendo descartada.

## Nesta seção

- **Conceitos Centrais** — [Entendendo Invariantes](/category/code/entendendo-invariantes), [Formatos Comuns de Invariante](/category/code/formas-de-invariante)
- **Mesma Direção** — [Mapa da Família de Mesma Direção](/category/code/mapa-mesma-direcao), [Remove Duplicates](/category/code/remover-duplicatas), [Middle of a Linked List](/category/code/meio-lista-encadeada), [Move Zeroes](/category/code/mover-zeros), [Remove N-th Node From End of List](/category/code/remover-nth-do-fim)
- **Direção Oposta** — [Mapa da Família de Direção Oposta](/category/code/mapa-direcao-oposta), [Two Sum Sorted](/category/code/two-sum-ordenado), [Valid Palindrome](/category/code/palindromo-valido), [Container com Mais Água](/category/code/container-com-mais-agua)
