---
slug: word-ladder
categorySlug: code
title: "Word Ladder"
navTitle: "Word Ladder"
summary: "BFS em um grafo implícito: palavras são nós e duas palavras são vizinhas se diferem em uma letra."
level: avancado
order: 71
section: bfs
group: BFS on Graph
---

## Enunciado

Dadas `begin`, `end` e uma lista de palavras, retorne o **menor número de palavras** em uma sequência de `begin` até `end` em que cada passo troca **uma única letra** e a palavra resultante está na lista. Se não houver, retorne `0`.

```
begin = "hit", end = "cog"
wordList = ["hot", "dot", "dog", "lot", "log", "cog"]
Saída: 5      // hit → hot → dot → dog → cog
```

## Grafo implícito

Não há lista de adjacência pronta: os vizinhos de uma palavra são **gerados na hora** trocando cada posição por cada letra de `a` a `z` e conferindo se o resultado está no dicionário (um `HashSet`). Como cada troca custa 1 passo, é um problema de **menor caminho em grafo não ponderado** → BFS.

```graphviz
{
  "title": "word ladder — BFS em um grafo implícito",
  "code": {
    "lang": "java",
    "content": "public int ladderLength(String begin, String end, List<String> wordList) {\n    Set<String> words = new HashSet<>(wordList);\n    if (!words.contains(end)) return 0;\n    Deque<String> queue = new ArrayDeque<>();\n    Set<String> seen = new HashSet<>();\n    queue.offer(begin);\n    seen.add(begin);\n    int steps = 1;\n    while (!queue.isEmpty()) {\n        int size = queue.size();\n        for (int i = 0; i < size; i++) {\n            String word = queue.poll();\n            if (word.equals(end)) return steps;\n            char[] chars = word.toCharArray();\n            for (int p = 0; p < chars.length; p++) {\n                char original = chars[p];\n                for (char ch = 'a'; ch <= 'z'; ch++) {\n                    chars[p] = ch;\n                    String next = new String(chars);\n                    if (words.contains(next) && seen.add(next)) queue.offer(next);\n                }\n                chars[p] = original;\n            }\n        }\n        steps++;\n    }\n    return 0;\n}"
  },
  "examples": [
    {
      "id": "a",
      "label": "hit → cog, dicionário [hot, dot, dog, lot, log, cog]",
      "nodes": [{"id": "hit", "x": 40, "y": 80}, {"id": "hot", "x": 130, "y": 80}, {"id": "dot", "x": 220, "y": 30}, {"id": "lot", "x": 220, "y": 130}, {"id": "dog", "x": 310, "y": 30}, {"id": "log", "x": 310, "y": 130}, {"id": "cog", "x": 400, "y": 80}],
      "edges": [["hit", "hot"], ["hot", "dot"], ["hot", "lot"], ["dot", "lot"], ["dot", "dog"], ["lot", "log"], ["dog", "log"], ["dog", "cog"], ["log", "cog"]],
      "steps": [
        {"current": "hit", "frontier": ["hit"], "queue": ["hit"], "values": {"hit": "1"}, "line": 6, "caption": "Cada palavra é um nó; duas palavras são vizinhas se diferem em uma letra. Começamos em \"hit\" (passo 1)."},
        {"current": "hit", "frontier": ["hot"], "queue": ["hot"], "values": {"hit": "1", "hot": "2"}, "activeEdge": ["hit", "hot"], "line": 20, "caption": "Sai \"hit\" (passo 1). Vizinhos novos no dicionário: ['hot'] → passo 2."},
        {"current": "hot", "visited": ["hit"], "frontier": ["dot", "lot"], "queue": ["dot", "lot"], "values": {"hit": "1", "hot": "2", "dot": "3", "lot": "3"}, "activeEdge": ["hot", "dot"], "line": 20, "caption": "Sai \"hot\" (passo 2). Vizinhos novos no dicionário: ['dot', 'lot'] → passo 3."},
        {"current": "dot", "visited": ["hit", "hot"], "frontier": ["lot", "dog"], "queue": ["lot", "dog"], "values": {"hit": "1", "hot": "2", "dot": "3", "lot": "3", "dog": "4"}, "activeEdge": ["dot", "dog"], "line": 20, "caption": "Sai \"dot\" (passo 3). Vizinhos novos no dicionário: ['dog'] → passo 4."},
        {"current": "lot", "visited": ["hit", "hot", "dot"], "frontier": ["dog", "log"], "queue": ["dog", "log"], "values": {"hit": "1", "hot": "2", "dot": "3", "lot": "3", "dog": "4", "log": "4"}, "activeEdge": ["lot", "log"], "line": 20, "caption": "Sai \"lot\" (passo 3). Vizinhos novos no dicionário: ['log'] → passo 4."},
        {"current": "dog", "visited": ["hit", "hot", "dot", "lot"], "frontier": ["log", "cog"], "queue": ["log", "cog"], "values": {"hit": "1", "hot": "2", "dot": "3", "lot": "3", "dog": "4", "log": "4", "cog": "5"}, "activeEdge": ["dog", "cog"], "line": 20, "caption": "Sai \"dog\" (passo 4). Vizinhos novos no dicionário: ['cog'] → passo 5."},
        {"current": "log", "visited": ["hit", "hot", "dot", "lot", "dog"], "frontier": ["cog"], "queue": ["cog"], "values": {"hit": "1", "hot": "2", "dot": "3", "lot": "3", "dog": "4", "log": "4", "cog": "5"}, "line": 12, "caption": "Sai \"log\" (passo 4). Nenhum vizinho novo."},
        {"current": "cog", "visited": ["hit", "hot", "dot", "lot", "dog", "log"], "queue": [], "values": {"hit": "1", "hot": "2", "dot": "3", "lot": "3", "dog": "4", "log": "4", "cog": "5"}, "found": true, "line": 13, "caption": "Saiu \"cog\" no passo 5 → é a menor transformação. Retorna 5."}
      ]
    }
  ]
}
```

## Código

```java
public int ladderLength(String begin, String end, List<String> wordList) {
    Set<String> words = new HashSet<>(wordList);
    if (!words.contains(end)) return 0;
    Deque<String> queue = new ArrayDeque<>();
    Set<String> seen = new HashSet<>();
    queue.offer(begin);
    seen.add(begin);
    int steps = 1;
    while (!queue.isEmpty()) {
        int size = queue.size();
        for (int i = 0; i < size; i++) {
            String word = queue.poll();
            if (word.equals(end)) return steps;
            char[] chars = word.toCharArray();
            for (int p = 0; p < chars.length; p++) {
                char original = chars[p];
                for (char ch = 'a'; ch <= 'z'; ch++) {
                    chars[p] = ch;
                    String next = new String(chars);
                    if (words.contains(next) && seen.add(next)) queue.offer(next);
                }
                chars[p] = original;
            }
        }
        steps++;
    }
    return 0;
}
```

## Complexidade

- **Tempo:** O(N · L · 26 · L): `N` palavras, tamanho `L`; cada troca cria uma string de tamanho `L`.
- **Espaço:** O(N · L).

## Erros comuns

- Comparar cada palavra com todas as outras para achar vizinhas (O(N² · L)).
- Esquecer o `seen` e revisitar palavras.
- Confundir o resultado (número de **palavras**) com o número de trocas (uma a menos).

Otimização clássica: **BFS bidirecional** (começando também em `end` e encontrando no meio).
