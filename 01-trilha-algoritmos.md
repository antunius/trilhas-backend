# Trilha 1 — Algoritmos e Estruturas de Dados

**150 problemas do LeetCode, agrupados por padrão, em ordem crescente de dificuldade.**
Ritmo: 4-6 problemas por semana, 24 semanas.

> Entrevista de algoritmo não avalia se você “sabe Java”. Avalia se você **reconhece o padrão**, escolhe a estrutura certa e explica o custo. Sem o vocabulário do zero (array, hash, ponteiro, grafo, Big-O), a lista de 150 vira treino de memória.

---

## Mapa mental

Todo problema de entrevista é, no fundo, uma destas três perguntas:

1. **Como o dado está organizado?** (array, hash, lista, árvore, grafo, heap)
2. **O que eu preciso fazer repetidas vezes?** (buscar, contar, ordenar, expandir vizinhos, reusar subproblema)
3. **Qual o custo que cabe no tempo?** (quase sempre O(n) ou O(n log n); O(n²) só em n pequeno)

O **padrão** é o atalho entre o enunciado e a estrutura. “Subarray contígua + máximo” não é um problema novo — é sliding window. Se você não nomeia a estrutura e o padrão em voz alta nos primeiros 2 minutos, o resto é chute.

```
enunciado  →  gatilho linguístico  →  estrutura + padrão  →  complexidade  →  código
     "próximo maior"        stack monotônica         O(n)           ...
     "top K"                heap de tamanho K        O(n log k)
     "ilhas numa matriz"    grafo + DFS/BFS          O(V+E)
```

---

## Glossário do zero — estruturas e o custo de cada uma

### Complexidade (Big-O)

**O que é.** Uma cota superior do crescimento do tempo (ou memória) quando a entrada **n** cresce. Não é o tempo em milissegundos — é “se eu dobrar n, o trabalho multiplica por quanto?”.

| Classe | Intuição | Cabe em entrevista (~10⁷ ops/s de ordem de grandeza) |
|---|---|---|
| O(1) | Não depende de n | sempre |
| O(log n) | Divide o espaço ao meio (busca binária) | sempre |
| O(n) | Um passe no array | sempre |
| O(n log n) | Ordenar, ou n buscas binárias | sempre |
| O(n²) | Dois loops aninhados em n | n ≤ ~10³–10⁴ |
| O(2ⁿ) / O(n!) | Subconjuntos / permutações sem poda | n ≤ ~20 / ~10 |

**Erro comum.** Recitar “HashMap é O(1)” e esquecer: O(1) **médio**; pior caso (tudo no mesmo bucket, Java 8+) é O(log n). E O(1) de lookup não salva um algoritmo O(n²) ao redor.

**Espaço extra.** O(1) extra = algumas variáveis. O(n) extra = outro array/hash do tamanho da entrada. Recursão conta: profundidade da call stack é espaço.

### Array

**O que é.** Bloco contínuo de memória, índice 0..n-1. Acesso por índice **O(1)**. Inserir/remover no meio **O(n)** (desloca o resto).

**Para que serve.** Ordem, acesso aleatório, sliding window, two pointers, prefix sum. É a estrutura padrão de entrevista.

**Erro comum.** Achar que “remover do meio é barato”. Só o fim do `ArrayList` (amortizado) é barato para append.

### HashMap / HashSet (tabela hash)

**O que é.** Array de *buckets*. `hashCode` da chave escolhe o bucket; colisões viram lista/árvore. `HashSet` é um mapa só de chaves.

**Para que serve.** “Já vi este valor?”, “quantas vezes?”, “agrupar anagramas”, “complemento que soma K” (Two Sum). Lookup médio O(1).

**Erro comum.** Usar objeto mutável como chave; quebrar o contrato `equals`/`hashCode`.

### Two pointers

**O que é.** Dois índices (`left`/`right`, ou lento/rápido) andando no mesmo array/lista, em geral depois de ordenar.

**Para que serve.** Par que soma X em array **ordenado**, palíndromo, remover duplicatas in-place, ciclo em lista ligada (Floyd).

**Não é.** Sliding window — window tem um invariante de “janela válida” que cresce e encolhe. Two pointers muitas vezes só convergem das pontas.

### Prefix sum (soma prefixada)

**O que é.** Array `pref[i] = soma dos primeiros i elementos` (ou até o índice i). Soma do intervalo `[L, R]` vira `pref[R] - pref[L-1]` em O(1) depois de O(n) de pré-cálculo.

**Para que serve.** Muitas consultas de soma de subarray; “subarray que soma K” (prefix + HashMap da frequência de prefixos).

### Sliding window (janela deslizante)

**O que é.** Dois ponteiros delimitando um **intervalo contíguo** que só anda para a frente. Você inclui `arr[right]`, e enquanto a janela quebra a regra, solta `arr[left]`.

**Para que serve.** Substring/subarray **contíguo** + máximo/mínimo/mais longo/mais curto. Se o enunciado permite subconjunto *não* contíguo, **não** é window.

### Stack (pilha)

**O que é.** LIFO: último a entrar é o primeiro a sair. `push` / `pop` / `peek` em O(1).

**Para que serve.** Parênteses, desfazer, avaliar expressão, “próximo maior à direita” (monotonic stack: a pilha fica sempre crescente ou decrescente).

### Fila e deque

**Fila (queue):** FIFO. BFS usa fila. **Deque:** duas pontas. Sliding window maximum usa deque monotônico.

### Lista ligada

**O que é.** Nós com `val` + ponteiro `next` (e às vezes `prev`). Sem índice: achar o k-ésimo é O(n). Inserir/remover **se você já está no nó** é O(1).

**Para que serve.** Reverso, merge, ciclo, LRU (HashMap + lista dupla). Sempre **desenhar** os ponteiros antes de codar — um `next` errado perde o resto da lista.

### Árvore binária e BST

**Árvore:** nó com filhos; sem ciclo. **Binária:** no máximo dois filhos. **BST:** esquerda < nó < direita (invariante que permite busca O(h)).

**Percursos:** pré-ordem (nó, esq, dir), em-ordem (esq, nó, dir — na BST sai ordenado), pós-ordem (esq, dir, nó — “resolve filhos e combina”). **BFS:** por nível, com fila.

**Ideia central.** Quase todo problema de árvore é recursão: resolva os filhos, combine, devolva um número/estado.

### Heap (priority queue)

**O que é.** Árvore binária quase completa onde o pai é menor (min-heap) ou maior (max-heap) que os filhos. Inserir e tirar o topo: O(log n). Em Java: `PriorityQueue` é min-heap.

**Para que serve.** Top K, K-ésimo, mediana em fluxo (dois heaps), merge de K listas. **Não** serve para busca arbitrária (achar um valor no meio é O(n)).

### Grafo

**O que é.** Conjunto de **vértices (V)** e **arestas (E)**. Pode ser dirigido ou não, com peso ou sem. Representação: lista de adjacência (o padrão) ou matriz.

**Matriz é grafo.** Cada célula é um nó; vizinhos são cima/baixo/esquerda/direita (às vezes diagonal). “Ilhas” = componentes conexos.

**BFS:** caminho mais curto **sem peso** (em arestas de custo 1). **DFS:** explorar fundo, componentes, backtracking em grid. **Dijkstra:** caminho mínimo com peso **positivo**. **Bellman-Ford:** pesos negativos (sem ciclo negativo útil). **Topológica:** ordem em DAG (pré-requisitos). **Union-Find:** “estão no mesmo conjunto?” / Kruskal.

### Backtracking

**O que é.** Escolher um passo → recursão → **desfazer** o passo (o `remove` no fim da lista). Gera todas as combinações/permutações/caminhos.

**Para que serve.** Subsets, permutations, N-Queens, word search. Sempre defina o **caso base** primeiro.

### Programação dinâmica (DP)

**O que é.** Resolver um problema grande reusando respostas de **subproblemas sobrepostos**. Sem sobreposição é só divisão e conquista.

**Ordem que gruda:** (1) recursão ingênua, (2) ver o que se repete, (3) memoização, (4) opcionalmente tabela iterativa. Pular para a tabela é o motivo de DP parecer magia.

**Gatilho no enunciado.** “Quantas maneiras”, “custo mínimo”, “melhor valor”, “é possível particionar”.

### Greedy (guloso)

**O que é.** Tomar a escolha local ótima e não voltar atrás. Só é correto quando dá para **provar** que não perde o ótimo global (intervalos, Kadane, jump game em versões clássicas). Se não tiver essa prova, é DP ou busca.

---

## Método (isto importa mais que a lista)

### A regra dos 30 minutos
1. **0-5 min** — ler e reformular o problema com as próprias palavras. Identificar o padrão. *Se não identificar o padrão, esse é o aprendizado do dia.*
2. **5-20 min** — resolver. Sem IDE de início: rascunho no papel.
3. **20-30 min** — codar e testar.
4. **Travou em 30 min?** Olhar a solução. Sem culpa. Mas então: **fechar tudo e reescrever do zero, de memória.** Se não conseguir reescrever, não aprendeu.

### Revisão espaçada (não pule)
Todo problema resolvido volta:
- **+3 dias** — refazer
- **+2 semanas** — refazer
- **+2 meses** — refazer

Manter uma planilha simples:

| # | Problema | Padrão | 1ª vez | +3d | +2sem | Confiança (1-5) |
|---|---|---|---|---|---|---|

**120 problemas resolvidos três vezes valem muito mais que 300 resolvidos uma vez.**

### Depois de cada problema, escrever 3 linhas
- Qual era o gatilho que indicava o padrão?
- Qual foi a ideia-chave?
- O que eu errei?

Isso é o que ela vai reler na véspera da entrevista, não os 150 códigos.

### Falar em voz alta
A partir da semana 8, resolver **narrando o raciocínio**. Entrevista de algoritmo não avalia só a solução — avalia a comunicação durante a solução. Quem resolve em silêncio e mostra o código pronto se sai pior que quem pensa alto e chega numa solução mediana.

---

## Bloco 1 — Arrays, Hashing e Two Pointers (semanas 1-3)

Antes de abrir o LeetCode: explique em voz alta o que é array, HashMap e two pointers, e cite a complexidade de busca/inserção de cada um. Sem isso, Two Sum vira “eu decorei o truque”.

### Hashing / Mapa de frequência
**Gatilho:** "existe?", "conta quantas vezes", "agrupa por", "duplicado", "anagrama".

- [ ] 217 · Contains Duplicate · Fácil
- [ ] 242 · Valid Anagram · Fácil
- [ ] 1 · Two Sum · Fácil
- [ ] 49 · Group Anagrams · Médio
- [ ] 347 · Top K Frequent Elements · Médio *(volta no bloco de heap)*
- [ ] 271 · Encode and Decode Strings · Médio *(premium — alternativa: 443 String Compression)*
- [ ] 128 · Longest Consecutive Sequence · Médio ⭐ *(o truque de só começar a contar do início da sequência)*

### Prefix Sum
**Gatilho:** somas de intervalo, "subarray que soma K".

- [ ] 303 · Range Sum Query - Immutable · Fácil
- [ ] 238 · Product of Array Except Self · Médio ⭐ *(prefixo e sufixo, sem divisão)*
- [ ] 560 · Subarray Sum Equals K · Médio ⭐ *(prefix sum + HashMap — combinação clássica)*
- [ ] 525 · Contiguous Array · Médio

### Two Pointers
**Gatilho:** array ordenado, par/trio que soma X, palíndromo.

- [ ] 125 · Valid Palindrome · Fácil
- [ ] 167 · Two Sum II - Input Array Is Sorted · Médio
- [ ] 15 · 3Sum · Médio ⭐ *(ordenar + fixar um + two pointers; cuidado com duplicatas)*
- [ ] 11 · Container With Most Water · Médio ⭐
- [ ] 42 · Trapping Rain Water · Difícil ⭐⭐ *(deixar para a semana 4; resolver primeiro com arrays auxiliares, depois otimizar)*

### Matrizes (aquecimento)
- [ ] 48 · Rotate Image · Médio
- [ ] 54 · Spiral Matrix · Médio
- [ ] 73 · Set Matrix Zeroes · Médio

---

## Bloco 2 — Sliding Window (semanas 4-5) ⭐

**Gatilho:** *subarray/substring contígua* + *máximo, mínimo, mais longo, mais curto*.

**Template:**
```java
int left = 0;
for (int right = 0; right < n; right++) {
    incluir(arr[right]);
    while (janelaInvalida()) {
        remover(arr[left]);
        left++;
    }
    resposta = Math.max(resposta, right - left + 1);
}
```

- [ ] 121 · Best Time to Buy and Sell Stock · Fácil *(sliding window disfarçado)*
- [ ] 3 · Longest Substring Without Repeating Characters · Médio ⭐⭐ *(o mais pedido dessa família)*
- [ ] 424 · Longest Repeating Character Replacement · Médio ⭐
- [ ] 567 · Permutation in String · Médio *(janela fixa + comparação de frequência)*
- [ ] 1004 · Max Consecutive Ones III · Médio
- [ ] 209 · Minimum Size Subarray Sum · Médio
- [ ] 76 · Minimum Window Substring · Difícil ⭐⭐
- [ ] 239 · Sliding Window Maximum · Difícil ⭐ *(precisa de deque monotônico)*

---

## Bloco 3 — Stack e Monotonic Stack (semana 6)

- [ ] 20 · Valid Parentheses · Fácil
- [ ] 155 · Min Stack · Médio
- [ ] 150 · Evaluate Reverse Polish Notation · Médio
- [ ] 22 · Generate Parentheses · Médio *(na verdade é backtracking — bom aperitivo)*
- [ ] 739 · Daily Temperatures · Médio ⭐ *(o "hello world" da monotonic stack)*
- [ ] 496 · Next Greater Element I · Fácil
- [ ] 853 · Car Fleet · Médio
- [ ] 84 · Largest Rectangle in Histogram · Difícil ⭐⭐

---

## Bloco 4 — Binary Search (semana 7)

**Template seguro:**
```java
int left = 0, right = n - 1;
while (left <= right) {
    int mid = left + (right - left) / 2;  // evita overflow
    if (arr[mid] == alvo) return mid;
    if (arr[mid] < alvo) left = mid + 1;
    else right = mid - 1;
}
```

- [ ] 704 · Binary Search · Fácil *(escrever de memória até acertar de primeira)*
- [ ] 74 · Search a 2D Matrix · Médio
- [ ] 875 · Koko Eating Bananas · Médio ⭐ *(primeiro contato com **busca binária na resposta**)*
- [ ] 153 · Find Minimum in Rotated Sorted Array · Médio
- [ ] 33 · Search in Rotated Sorted Array · Médio ⭐
- [ ] 981 · Time Based Key-Value Store · Médio
- [ ] 1011 · Capacity To Ship Packages Within D Days · Médio *(busca na resposta de novo)*
- [ ] 4 · Median of Two Sorted Arrays · Difícil ⭐⭐ *(opcional — deixar para o final do plano)*

---

## Bloco 5 — Linked List (semana 8)

Sempre desenhar os ponteiros no papel antes de codar.

- [ ] 206 · Reverse Linked List · Fácil ⭐ *(escrever iterativo e recursivo)*
- [ ] 21 · Merge Two Sorted Lists · Fácil
- [ ] 141 · Linked List Cycle · Fácil ⭐ *(lento/rápido — Floyd)*
- [ ] 143 · Reorder List · Médio
- [ ] 19 · Remove Nth Node From End of List · Médio
- [ ] 138 · Copy List with Random Pointer · Médio
- [ ] 2 · Add Two Numbers · Médio
- [ ] 287 · Find the Duplicate Number · Médio ⭐ *(Floyd aplicado a array — elegante)*
- [ ] 146 · LRU Cache · Médio ⭐⭐ *(HashMap + lista duplamente ligada; cai muito e é útil no trabalho)*
- [ ] 23 · Merge k Sorted Lists · Difícil ⭐ *(usar heap)*

---

## Bloco 6 — Árvores (semanas 9-10)

**Ideia central:** quase todo problema de árvore é *"resolva para os filhos e combine"* — recursão pós-ordem.

### Recursão básica
- [ ] 226 · Invert Binary Tree · Fácil
- [ ] 104 · Maximum Depth of Binary Tree · Fácil
- [ ] 543 · Diameter of Binary Tree · Fácil ⭐ *(devolver altura, atualizar resposta por fora)*
- [ ] 110 · Balanced Binary Tree · Fácil
- [ ] 100 · Same Tree · Fácil
- [ ] 572 · Subtree of Another Tree · Fácil

### BFS por nível
- [ ] 102 · Binary Tree Level Order Traversal · Médio ⭐
- [ ] 199 · Binary Tree Right Side View · Médio
- [ ] 1448 · Count Good Nodes in Binary Tree · Médio

### BST
- [ ] 235 · Lowest Common Ancestor of a BST · Médio
- [ ] 98 · Validate Binary Search Tree · Médio ⭐ *(propagar limites min/max — o erro comum é só comparar com o pai)*
- [ ] 230 · Kth Smallest Element in a BST · Médio *(percurso em-ordem)*

### Avançado
- [ ] 105 · Construct Binary Tree from Preorder and Inorder · Médio
- [ ] 124 · Binary Tree Maximum Path Sum · Difícil ⭐
- [ ] 297 · Serialize and Deserialize Binary Tree · Difícil
- [ ] 208 · Implement Trie · Médio *(estrutura que aparece em busca por prefixo)*
- [ ] 211 · Design Add and Search Words Data Structure · Médio

---

## Bloco 7 — Heap / Priority Queue (semana 11) ⭐

**Gatilho:** **"top K"**, "K-ésimo maior", "mediana em fluxo", "merge de K".
Em Java: `PriorityQueue<>()` é min-heap; `PriorityQueue<>(Comparator.reverseOrder())` é max-heap.

- [ ] 703 · Kth Largest Element in a Stream · Fácil
- [ ] 1046 · Last Stone Weight · Fácil
- [ ] 973 · K Closest Points to Origin · Médio
- [ ] 215 · Kth Largest Element in an Array · Médio ⭐ *(heap de tamanho K → O(n log k))*
- [ ] 621 · Task Scheduler · Médio
- [ ] 355 · Design Twitter · Médio *(bom para praticar design + heap junto)*
- [ ] 295 · Find Median from Data Stream · Difícil ⭐⭐ *(dois heaps — pergunta clássica)*

---

## Bloco 8 — Backtracking (semana 12)

**Estrutura:** escolher → recursão → **desfazer**. Definir o caso base primeiro.

- [ ] 78 · Subsets · Médio ⭐ *(o mais didático — começar por ele)*
- [ ] 39 · Combination Sum · Médio
- [ ] 46 · Permutations · Médio
- [ ] 90 · Subsets II · Médio *(lidar com duplicatas)*
- [ ] 40 · Combination Sum II · Médio
- [ ] 79 · Word Search · Médio ⭐ *(backtracking em grid)*
- [ ] 131 · Palindrome Partitioning · Médio
- [ ] 17 · Letter Combinations of a Phone Number · Médio
- [ ] 51 · N-Queens · Difícil

---

## Bloco 9 — Grafos (semanas 13-16) ⭐⭐

**A trilha mais valiosa.** Metade dos problemas de grafo chega disfarçada de matriz — reconhecer que cada célula é um nó já resolve meio problema.

Do zero, antes dos exercícios: desenhe um grafo com 5 nós, escreva a lista de adjacência, e simule BFS e DFS no papel (anote a ordem de visita). Depois explique a diferença: BFS usa fila e acha o caminho mais curto em arestas unitárias; DFS usa stack/recursão e serve para componentes e backtracking.

### BFS e DFS em grid
- [ ] 200 · Number of Islands · Médio ⭐ *(o problema de grafo mais pedido do mundo)*
- [ ] 695 · Max Area of Island · Médio
- [ ] 133 · Clone Graph · Médio
- [ ] 994 · Rotting Oranges · Médio ⭐ *(BFS multi-fonte)*
- [ ] 130 · Surrounded Regions · Médio *(o truque de começar pelas bordas)*
- [ ] 417 · Pacific Atlantic Water Flow · Médio ⭐
- [ ] 1091 · Shortest Path in Binary Matrix · Médio

### Ordenação topológica
**Gatilho:** dependências, pré-requisitos, ordem de execução.
- [ ] 207 · Course Schedule · Médio ⭐ *(detecção de ciclo)*
- [ ] 210 · Course Schedule II · Médio ⭐ *(a ordem em si)*
- [ ] 269 · Alien Dictionary · Difícil *(premium — se não tiver acesso, ler a solução e entender)*

### Union-Find
- [ ] 684 · Redundant Connection · Médio ⭐
- [ ] 547 · Number of Provinces · Médio *(dá para resolver com DFS também — fazer das duas formas)*
- [ ] 721 · Accounts Merge · Médio
- [ ] 1584 · Min Cost to Connect All Points · Médio *(Kruskal)*

### Caminho mínimo com peso
- [ ] 743 · Network Delay Time · Médio ⭐ *(Dijkstra)*
- [ ] 787 · Cheapest Flights Within K Stops · Médio ⭐ *(Bellman-Ford / BFS com camadas)*
- [ ] 778 · Swim in Rising Water · Difícil
- [ ] 1631 · Path With Minimum Effort · Médio

### Avançado
- [ ] 127 · Word Ladder · Difícil ⭐ *(BFS onde o grafo é implícito)*

---

## Bloco 10 — Programação Dinâmica (semanas 17-21)

**Sempre nesta ordem:** recursão ingênua → identificar subproblema repetido → memorizar → (opcional) converter para tabela iterativa. Pular direto para a tabela é o motivo de DP parecer impossível.

Climbing Stairs em voz alta, do zero: “para chegar no degrau n eu vim de n-1 ou n-2; isso se repete; então dp[i] = dp[i-1] + dp[i-2]”. Se essa frase não sai fluente, não avance para Coin Change.

### DP 1D
- [ ] 70 · Climbing Stairs · Fácil ⭐ *(começar aqui, sempre)*
- [ ] 746 · Min Cost Climbing Stairs · Fácil
- [ ] 198 · House Robber · Médio ⭐
- [ ] 213 · House Robber II · Médio
- [ ] 5 · Longest Palindromic Substring · Médio
- [ ] 647 · Palindromic Substrings · Médio
- [ ] 91 · Decode Ways · Médio
- [ ] 322 · Coin Change · Médio ⭐⭐ *(o representante da família)*
- [ ] 152 · Maximum Product Subarray · Médio
- [ ] 139 · Word Break · Médio ⭐
- [ ] 300 · Longest Increasing Subsequence · Médio ⭐ *(fazer O(n²) primeiro, depois a versão com busca binária)*
- [ ] 416 · Partition Equal Subset Sum · Médio *(knapsack disfarçado)*

### DP 2D
- [ ] 62 · Unique Paths · Médio
- [ ] 1143 · Longest Common Subsequence · Médio ⭐
- [ ] 309 · Best Time to Buy and Sell Stock with Cooldown · Médio
- [ ] 518 · Coin Change II · Médio
- [ ] 494 · Target Sum · Médio
- [ ] 72 · Edit Distance · Médio ⭐⭐
- [ ] 1remaining · *(se sobrar fôlego)* 312 · Burst Balloons · Difícil

---

## Bloco 11 — Greedy e Intervalos (semana 22)

- [ ] 53 · Maximum Subarray · Médio ⭐ *(Kadane)*
- [ ] 55 · Jump Game · Médio
- [ ] 45 · Jump Game II · Médio
- [ ] 134 · Gas Station · Médio ⭐
- [ ] 846 · Hand of Straights · Médio
- [ ] 56 · Merge Intervals · Médio ⭐
- [ ] 57 · Insert Interval · Médio
- [ ] 435 · Non-overlapping Intervals · Médio
- [ ] 1094 · Car Pooling · Médio *(equivalente gratuito ao 253 Meeting Rooms II, que é premium)*

---

## Bloco 12 — Bit Manipulation e revisão final (semanas 23-24)

- [ ] 136 · Single Number · Fácil ⭐ *(XOR)*
- [ ] 191 · Number of 1 Bits · Fácil
- [ ] 338 · Counting Bits · Fácil
- [ ] 190 · Reverse Bits · Fácil
- [ ] 268 · Missing Number · Fácil
- [ ] 371 · Sum of Two Integers · Médio

**Últimas duas semanas:** nada de problema novo. Refazer os 30 marcados com ⭐⭐ e todos os que ficaram com confiança ≤3 na planilha.

---

## Tabela de reconhecimento de padrão

| Sinal no enunciado | Padrão |
|---|---|
| Array ordenado, par que soma X | Two Pointers |
| "subarray/substring contígua" + máx/mín | **Sliding Window** |
| "conta ocorrências", "anagrama", "existe?" | HashMap de frequência |
| Consultas repetidas de soma de intervalo | Prefix Sum |
| "próximo maior/menor" | Monotonic Stack |
| Parênteses, expressão, desfazer | Stack |
| "menor valor viável", espaço monotônico | Binary Search na resposta |
| "top K", "K-ésimo", "mediana em fluxo" | **Heap** |
| "todas as combinações/permutações/caminhos" | Backtracking |
| Grid, ilhas, regiões conectadas | BFS / DFS |
| Caminho mais curto sem peso | BFS |
| Caminho mais curto com peso positivo | Dijkstra |
| Pré-requisitos, dependências, ordem | Ordenação topológica |
| "estão conectados?", agrupar | Union-Find |
| "quantas maneiras", "custo mínimo" | **DP** |
| Lista de intervalos | Ordenar + varrer |

---

## Complexidades para saber de cor

| Estrutura | Busca | Inserção | Remoção |
|---|---|---|---|
| Array | O(n) | O(n) | O(n) |
| HashMap | O(1) médio | O(1) médio | O(1) médio |
| BST balanceada / TreeMap | O(log n) | O(log n) | O(log n) |
| Heap | O(n) | O(log n) | O(log n) topo |
| Trie | O(m) | O(m) | O(m) |

| Algoritmo | Tempo | Espaço |
|---|---|---|
| BFS / DFS | O(V + E) | O(V) |
| Dijkstra (com heap) | O(E log V) | O(V) |
| Topological sort | O(V + E) | O(V) |
| Union-Find | ~O(1) amortizado | O(V) |
| Ordenação | O(n log n) | O(n) |

---

## Marcos de progresso

| Semana | Ela deve conseguir |
|---|---|
| 4 | Escrever busca binária correta de primeira e identificar sliding window em ≤2 min |
| 8 | Resolver um médio de array/string/stack em ≤25 min |
| 12 | Resolver problemas de árvore por recursão sem hesitar |
| 16 | Resolver Number of Islands e Course Schedule de memória |
| 21 | Escrever a versão memorizada de um DP novo em ≤30 min |
| 24 | 9 de 10 enunciados: padrão identificado em ≤2 min |

---

## Checklist de fluência (60 segundos cada, sem olhar)

- [ ] Big-O: o que mede e quando O(n²) ainda passa
- [ ] Array vs HashMap vs TreeMap vs Heap — uma frase cada
- [ ] Sliding window vs two pointers
- [ ] Offset mental: prefix sum (soma de intervalo em O(1))
- [ ] Stack monotônica: para que serve
- [ ] Lista ligada: por que desenhar ponteiros
- [ ] Árvore: pós-ordem = “filhos depois combina”
- [ ] Grafo: matriz é grafo; BFS vs DFS vs Dijkstra
- [ ] DP: sobreposição de subproblemas, ordem recursão → memo → tabela
- [ ] Recitar a tabela de reconhecimento de padrão do enunciado
