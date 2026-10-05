---
slug: pistas-no-enunciado
categorySlug: code
title: Pistas no Enunciado que Apontam para Cada Padrão
summary: Associar frases e estruturas comuns de enunciado a padrões específicos
level: intermediario
order: 41
section: pattern-recognition
---

## Objetivos de aprendizagem

- [ ] Associar frases e estruturas comuns de enunciado a padrões específicos
- [ ] Praticar essa associação antes mesmo de pensar na implementação

## Conteúdo

### Tabela de pistas comuns

- **"Array ordenado" + "par de elementos"** → Two Pointers.
- **"Subarray/substring contínua" + "máximo/mínimo/mais curto/mais longo"** → Sliding Window.
- **"Encontre o menor/maior valor que satisfaz uma condição"** (especialmente quando testar um valor é mais fácil que calculá-lo diretamente) → Busca Binária (possivelmente sobre a resposta).
- **"Caminho mais curto"** em grafo não ponderado → BFS. **"Todos os caminhos possíveis"** ou detecção de estrutura → DFS.
- **"Todas as combinações/permutações/formas possíveis"** satisfazendo uma restrição → Backtracking.
- **"Número máximo/mínimo de formas de fazer algo"**, com subproblemas que se repetem → Programação Dinâmica.
- **"Os k maiores/menores"** ou **"o elemento mediano de um fluxo"** → Heap / Fila de Prioridade.

### Por que isso funciona como primeira hipótese, não como certeza

Essas pistas são um ponto de partida rápido para gerar uma hipótese, não uma garantia absoluta — alguns problemas combinam mais de um padrão, ou têm uma pegadinha que torna a pista textual enganosa. A prática (Módulo 4) é o que constrói a intuição fina para além dessas pistas superficiais.

### Um hábito útil

Ao ler um problema novo, antes de pensar em qualquer código, é útil parar por 30 segundos e perguntar: "isso se parece com qual dos padrões que já conheço?" — mesmo que a resposta inicial esteja errada, isso já direciona o raciocínio de forma muito mais produtiva do que partir do zero.

## Exemplo aplicado

Um enunciado como "encontre a menor substring que contém todos os caracteres de um padrão dado" combina duas pistas: "substring contínua" (Sliding Window) e "mínimo" — apontando fortemente para uma solução de janela deslizante de tamanho variável.

## Erros comuns

- Tratar a primeira pista identificada como certeza absoluta, sem validar se ela realmente se encaixa em todos os detalhes do problema.
- Não desenvolver o hábito de parar e associar o enunciado a um padrão conhecido antes de partir para o código.
