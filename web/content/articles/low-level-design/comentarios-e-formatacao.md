---
slug: comentarios-e-formatacao
categorySlug: low-level-design
title: "Clean Code: Comentários e Formatação"
navTitle: Comentários e Formatação
summary: Usar comentários só quando o código não pode falar por si, e manter formatação consistente
level: iniciante
order: 5
section: clean-code
---

## Objetivos de aprendizagem

- [ ] Distinguir comentários úteis de comentários que compensam código ruim
- [ ] Aplicar convenções de formatação que reduzem o esforço de leitura

## Estrutura da aula

1. O comentário ideal é o que você não precisou escrever
2. Comentários que valem a pena
3. Comentários que atrapalham
4. Formatação consistente

## Conteúdo

### O comentário ideal é o que você não precisou escrever

Comentários existem para compensar nossa incapacidade de expressar a intenção só com código. Todo comentário é, de certa forma, uma admissão de derrota. Antes de escrever um comentário explicando o que um trecho faz, pergunte: dá para expressar isso com um nome melhor ou extraindo uma função?

```java
// ruim: comentário compensando um nome ruim
// verifica se o funcionário é elegível para benefício
if (f.idade > 65 && f.tempoDeCasa > 10 && f.tipo == 2) { ... }

// bom: o próprio código explica
if (funcionario.elegivelParaBeneficio()) { ... }
```

### Comentários que valem a pena

Nem todo comentário é ruim. Alguns tipos continuam úteis mesmo em código limpo:

- **Explicar uma decisão não óbvia**: por que um algoritmo aparentemente pior foi escolhido (ex.: um workaround para um bug de uma biblioteca externa).
- **Avisos de consequência**: `// não trocar a ordem: validarCpf depende do CEP já normalizado`.
- **Javadoc de API pública**: quando outras equipes vão consumir a classe sem ver a implementação.

```java
// Usamos busca linear em vez de binária aqui de propósito:
// a lista tem no máximo 20 itens e quase sempre está desordenada
// no momento da chamada — o custo de ordenar seria maior que o ganho.
```

### Comentários que atrapalham

- **Comentário redundante**: `i++; // incrementa i` não agrega nada.
- **Comentário desatualizado**: pior que a ausência de comentário, porque mente sobre o que o código faz depois de uma mudança que ninguém lembrou de atualizar o texto ao lado.
- **Código comentado**: se o código não é mais necessário, delete — o controle de versão já guarda o histórico.

### Formatação consistente

Formatação não é estética pura — ela comunica estrutura. Algumas convenções que valem para qualquer código Java:

- Métodos relacionados ficam próximos uns dos outros na classe (afinidade conceitual reflete proximidade física).
- Indentação consistente reflete a hierarquia lógica do código — nunca misture tabs e espaços.
- Uma classe muito longa (centenas de linhas) é, quase sempre, um sinal de que ela está fazendo mais de uma coisa — veremos isso com mais detalhe no próximo artigo, sobre coesão e acoplamento.

## Erros comuns

- Comentar o "o quê" em vez do "porquê" — o código já diz o que faz; o comentário deveria explicar o que o código não consegue expressar sozinho.
- Deixar blocos de código comentado "por precaução".
- Comentário desatualizado depois de uma refatoração — nunca revisado, nunca removido.
