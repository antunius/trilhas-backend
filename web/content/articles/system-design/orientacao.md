---
slug: orientacao
categorySlug: system-design
title: "Orientação: como funciona uma entrevista de system design"
navTitle: Orientação
summary: Entender o que um entrevistador de system design está avaliando de fato
level: intermediario
order: 1
section: framework-entrega
group: "Começando"
---

## Objetivos de aprendizagem

Ao final desta aula, o aluno será capaz de:

- [ ] Entender o que um entrevistador de system design está avaliando de fato
- [ ] Reconhecer o formato típico de uma entrevista (tempo, dinâmica, papel do candidato)
- [ ] Saber por que ter um framework (roteiro) importa mais do que decorar arquiteturas prontas

## Estrutura da aula

1. O que é uma entrevista de system design e por que ela existe
2. Como o tempo costuma ser dividido
3. O que o entrevistador está avaliando (e o que não importa tanto)
4. Por que candidatos bons tecnicamente ainda vão mal nessa entrevista
5. Visão geral do framework que o curso vai seguir

## Conteúdo

### O que é essa entrevista

![Entrevista de system design: requisitos → design → trade-offs](/diagrams/sd-orientacao.svg)

A entrevista de system design não testa se você conhece a resposta "certa" para um problema — não existe uma única arquitetura correta para "projete o Twitter" ou "projete um encurtador de URLs". Ela testa como você pensa diante de um problema ambíguo e com escopo enorme, sob pressão de tempo. O entrevistador quer ver seu processo: como você reduz um problema vago a decisões concretas, como você prioriza, e como você conversa sobre trade-offs.

Isso muda completamente a forma de estudar. Decorar diagramas de arquiteturas famosas ajuda pouco se você não consegue explicar *por que* cada peça está ali e o que aconteceria se você tivesse escolhido outra coisa.

### Como o tempo costuma ser dividido

Entrevistas desse tipo giram normalmente em torno de 45 a 60 minutos, e o tempo é curto para a quantidade de território que pode ser coberto. Uma divisão aproximada e comum:

- **5–10 min** — entendimento do problema e definição de escopo
- **15–20 min** — desenho de alto nível (arquitetura, componentes principais, fluxo de dados)
- **15–20 min** — aprofundamento em 1 ou 2 pontos críticos escolhidos por você ou pelo entrevistador
- **5 min** — fechamento, perguntas do candidato

Um erro comum é gastar tempo demais na primeira fase e chegar no fim sem ter mostrado profundidade técnica em nada.

### O que o entrevistador está avaliando

De forma geral, quatro coisas costumam pesar mais do que qualquer solução específica:

1. **Comunicação** — você consegue narrar seu raciocínio de forma clara, sem o entrevistador ter que arrancar informação de você?
2. **Gestão de ambiguidade** — você faz as perguntas certas para reduzir o escopo antes de desenhar qualquer coisa?
3. **Conhecimento técnico aplicado** — você entende os componentes que está propondo (cache, banco de dados, fila, etc.) o suficiente para justificar a escolha, não só nomeá-los?
4. **Julgamento sobre trade-offs** — você reconhece que toda decisão tem um custo, e consegue argumentar por que aceita esse custo?

Note que "chegar na arquitetura perfeita" não está nessa lista. Isso é sintoma, não causa: quem comunica bem, reduz escopo direito e entende trade-offs tende a naturalmente propor um design razoável — mas o design em si não é o critério principal de avaliação.

### Por que bons engenheiros vão mal nessa entrevista

É comum ver gente tecnicamente forte se sair mal aqui, por alguns motivos recorrentes:

- **Pular direto para a solução** sem entender requisitos, e depois ter que redesenhar tudo no meio da entrevista.
- **Ficar em silêncio pensando**, deixando o entrevistador sem visibilidade do raciocínio.
- **Tentar cobrir tudo superficialmente**, sem se aprofundar em nada — o que passa a impressão de conhecimento raso.
- **Ignorar sinais do entrevistador** — perguntas ou comentários que geralmente indicam "vá mais fundo aqui" ou "isso já está bom, avance".

Ter um roteiro mental — um framework — resolve boa parte disso, porque tira de você a carga de decidir "o que eu faço agora" no meio da pressão da entrevista, liberando espaço mental para pensar no conteúdo técnico.

### O framework que este curso segue

Ao longo deste módulo, vamos detalhar cada uma destas etapas, na ordem em que elas normalmente acontecem em uma entrevista real:

1. Levantamento de requisitos (funcionais e não-funcionais)
2. Estimativas de capacidade (quando fizer sentido)
3. Contrato de API
4. Modelagem de dados
5. Desenho de alto nível
6. Deep dives nos pontos críticos

Esse roteiro não é uma fórmula rígida — em alguns problemas você vai passar rápido por uma etapa e devagar em outra —, mas ele te dá um ponto de partida confiável em vez de começar do zero a cada problema novo.

## Exemplo aplicado

Imagine que o problema seja "projete um sistema de encurtamento de URLs". Um candidato sem framework provavelmente já começa desenhando caixinhas de "servidor" e "banco de dados" sem saber ainda se o sistema precisa suportar 100 requisições por dia ou 100 mil por segundo — o que muda tudo sobre como o banco deve ser desenhado.

Um candidato com o framework começa perguntando: qual o volume esperado de criação e de leitura de links? Precisa suportar links customizados? Links expiram? Só depois de responder isso é que faz sentido desenhar qualquer coisa.

## Erros comuns

- Começar a desenhar a arquitetura antes de fechar o escopo do problema.
- Tratar a entrevista como uma prova de "quem sabe mais nomes de tecnologia".
- Não verbalizar o raciocínio, forçando o entrevistador a perguntar "por que você escolheu isso?" repetidamente.
- Ignorar completamente requisitos não-funcionais (escala, disponibilidade, latência) e só desenhar o "caminho feliz" funcional.
