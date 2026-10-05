---
slug: bfs-sintese
categorySlug: code
title: "BFS: Síntese"
navTitle: "BFS Synthesis"
summary: "Resumo de todos os padrões de BFS, com quando usar cada um e um checklist antes de codar."
level: avancado
order: 74
section: bfs
group: Advanced
---

## Padrões

| Padrão | Sinal no enunciado | Estado extra | Exemplo |
|---|---|---|---|
| Level order | "nível por nível" | `size` da fila | [Level Order](/category/code/ordem-por-niveis) |
| Último/primeiro do nível | "visível", "vista" | índice no nível | [Right Side View](/category/code/visao-lado-direito) |
| Parar cedo | "mais raso", "primeira folha" | retorno dentro do laço | [Minimum Depth](/category/code/profundidade-minima) |
| Flood fill | "conte regiões/ilhas" | `visited` | [Number of Islands](/category/code/numero-de-ilhas) |
| Menor caminho em grade | "menor número de passos" | `dist` na fila | [Maze](/category/code/caminho-minimo-labirinto) |
| Multi-fonte | "ao mesmo tempo", "minutos" | todas as fontes na fila | [Rotting Oranges](/category/code/laranjas-podres) |
| Grafo implícito | "uma letra por vez", "estados" | vizinhos gerados | [Word Ladder](/category/code/word-ladder) |
| Kahn | "dependências", "ordem" | `indeg[]` | [Topological Sort](/category/code/ordenacao-topologica) |

## BFS × DFS

| | BFS | DFS |
|---|---|---|
| Estrutura | fila | pilha / recursão |
| Menor caminho (não ponderado) | ✅ garante | ❌ |
| Memória | O(largura) | O(altura) |
| Todos os caminhos / combinações | ruim | ✅ |
| Ciclos em grafo direcionado | Kahn | 3 cores |

## Checklist

1. O que é um **nó** (célula, palavra, estado)? Quem são os **vizinhos**?
2. Onde **marcar visitado**? (ao enfileirar)
3. Preciso de **níveis**? (`size` congelado)
4. Existe **mais de uma origem**? (enfileire todas antes)
5. Qual é o **critério de parada**? (destino, fila vazia, primeira folha)
6. O que guardar junto do nó? (`dist`, `parent`, estado)

## Erros que mais custam pontos em entrevista

- Marcar visitado ao sair da fila.
- Esquecer limites da grade.
- Não tratar origem = destino ou destino inalcançável.
- Usar BFS em grafo ponderado sem avisar que a resposta só vale para pesos iguais.

Revise: [BFS: Introdução](/category/code/bfs-introducao) e [DFS: Introdução](/category/code/dfs-introducao).
