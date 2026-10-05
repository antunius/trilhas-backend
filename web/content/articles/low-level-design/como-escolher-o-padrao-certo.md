---
slug: como-escolher-o-padrao-certo
categorySlug: low-level-design
title: "Síntese: Como Escolher o Padrão Certo"
navTitle: Como Escolher o Padrão Certo
summary: Comparar padrões que se confundem e montar um guia de decisão para entrevista
level: avancado
order: 27
section: sintese
---

## Objetivos de aprendizagem

- [ ] Diferenciar padrões que têm estrutura de código parecida mas resolvem problemas diferentes
- [ ] Ter um guia de decisão rápido para aplicar em uma entrevista de LLD

## Estrutura da aula

1. Pares que se confundem
2. Guia de decisão por sintoma
3. Voltando a SOLID: cada padrão como aplicação de um princípio
4. Critério de pronto do curso

## Conteúdo

### Pares que se confundem

| Par | Diferença central |
|---|---|
| **Strategy vs. State** | Strategy: o cliente escolhe o algoritmo de fora, e ele raramente muda sozinho. State: o próprio objeto transiciona de um estado para outro como consequência de suas operações; o cliente não escolhe o estado diretamente. |
| **Decorator vs. Proxy** | Mesma estrutura de código (uma camada implementando a interface do objeto que envolve). Decorator existe para *adicionar comportamento*, de forma combinável em várias camadas. Proxy existe para *controlar acesso* (cache, permissão, lazy loading), geralmente numa única camada com propósito específico. |
| **Decorator vs. Facade** | Decorator mantém a mesma interface de um único objeto e adiciona comportamento a ele. Facade simplifica o acesso a *vários* objetos diferentes por trás de uma interface nova e mais simples — não preserva a interface original de nenhum deles. |
| **Factory Method vs. Builder** | Factory Method resolve "qual classe concreta instanciar" quando existem variações de um mesmo tipo de produto. Builder resolve "como montar um objeto complexo passo a passo" quando o problema é a quantidade de parâmetros e configurações, não a variação de tipo. |
| **Template Method vs. Strategy** | Os dois permitem trocar parte de um comportamento. Template Method usa herança e fixa a *sequência* de passos na superclasse (só o conteúdo de cada passo varia). Strategy usa composição e troca o *algoritmo inteiro*, sem impor uma sequência de passos compartilhada. |

### Guia de decisão por sintoma

Ao ouvir um enunciado de entrevista, alguns sintomas apontam direto para um padrão:

- "Preciso garantir que só existe um X no sistema todo" → **Singleton**.
- "Tenho um `if/else` decidindo qual classe instanciar, e cresce a cada novo tipo" → **Factory Method**.
- "O objeto tem muitos campos opcionais e o construtor virou ilegível" → **Builder**.
- "Preciso encaixar uma biblioteca externa numa interface que meu sistema já usa" → **Adapter**.
- "Quero adicionar combinações de comportamento sem uma explosão de subclasses" → **Decorator**.
- "Um fluxo de negócio orquestra vários serviços numa ordem fixa, repetida em vários lugares" → **Facade**.
- "Preciso de cache, controle de acesso ou lazy loading na frente de um objeto caro" → **Proxy**.
- "O domínio é uma árvore de partes e todo (pastas/arquivos, menus, componentes)" → **Composite**.
- "Várias partes do sistema precisam reagir quando algo muda em outro lugar" → **Observer**.
- "Um `if/else` decide qual algoritmo rodar, e o algoritmo pode ser trocado de fora" → **Strategy**.
- "O comportamento de um objeto muda conforme ele avança por estágios (pedido, pagamento, etc.)" → **State**.
- "Preciso desfazer ações, enfileirar comandos, ou registrar um histórico de operações" → **Command**.
- "Várias classes compartilham a mesma sequência de passos, com alguns passos variando" → **Template Method**.
- "Minha estrutura de dados customizada precisa ser percorrida sem expor como é armazenada" → **Iterator**.

### Voltando a SOLID: cada padrão como aplicação de um princípio

Vale fechar o curso enxergando os 14 padrões não como truques isolados, mas como consequências diretas dos princípios SOLID vistos antes: Strategy, Factory Method, Decorator e Observer são, cada um à sua forma, aplicações de **OCP** (estender sem modificar). Proxy e Adapter existem para respeitar **DIP** (código cliente depende de uma interface, não de um detalhe concreto). Composite e Iterator entregam **ISP** na prática (interfaces coesas, sem métodos que não fazem sentido para quem as implementa). Se um padrão parece "forçado" num problema, é sinal de que o princípio por trás dele não se aplica ali — o padrão nunca é o objetivo, é a consequência.

## Critério de pronto do curso

- Você consegue explicar, sem consultar a tabela, a diferença entre Strategy e State, e entre Decorator e Proxy.
- Diante de um enunciado de LLD novo, você consegue identificar pelo menos um padrão aplicável antes de escrever qualquer código.
- Você escreve a interface e as classes principais em Java real — não pseudo-código — incluindo os métodos que resolvem o problema central do enunciado.

## Erros comuns

- Forçar um padrão do GoF num problema que não pede por ele, só para "mostrar conhecimento" na entrevista — um entrevistador experiente percebe rápido quando o padrão não resolve nada de real.
- Memorizar a estrutura de código de cada padrão sem entender a intenção por trás — isso quebra assim que o problema muda de detalhe (por exemplo, um enunciado que combina Strategy com Factory Method na mesma solução).
- Ignorar Clean Code e SOLID durante a entrevista porque "isso já foi visto na primeira aula" — são esses princípios que orientam qual padrão (se algum) faz sentido aplicar em cada situação nova.
