---
slug: consistencia
categorySlug: system-design
title: "Consistência: Forte, Eventual e Variações"
navTitle: Consistência
summary: Diferenciar consistência forte de consistência eventual
level: intermediario
order: 21
section: conceitos-centrais
---

## Objetivos de aprendizagem

- [ ] Diferenciar consistência forte de consistência eventual
- [ ] Saber em quais cenários cada uma é aceitável

## Conteúdo

### Consistência forte

![Forte vs eventual](/diagrams/sd-consistencia.svg)

Garante que, assim que uma escrita é confirmada, qualquer leitura subsequente (de qualquer nó do sistema) retorna esse valor mais recente. É a garantia mais intuitiva, mas normalmente exige coordenação entre nós antes de confirmar uma escrita, o que aumenta a latência e pode reduzir disponibilidade durante falhas de rede (voltando à discussão do teorema CAP).

### Consistência eventual

Garante apenas que, se não houver novas escritas, todas as réplicas eventualmente convergirão para o mesmo valor — mas não há garantia de quando isso acontece, nem de que uma leitura imediatamente após uma escrita retorne o valor mais recente. Em troca, permite maior disponibilidade e menor latência, já que réplicas podem responder sem esperar confirmação de outras.

### Escolhendo entre elas

A escolha depende do custo real de uma leitura desatualizada. Um saldo bancário exibido de forma incorreta pode causar problemas sérios — favorecendo consistência forte. Já um contador de curtidas ligeiramente desatualizado por alguns segundos raramente causa problema prático — um bom candidato a consistência eventual, em troca de mais disponibilidade e melhor desempenho.

## Exemplo aplicado

Em uma rede social, o número de curtidas exibido pode usar consistência eventual (pequenos atrasos na atualização são imperceptíveis para a maioria dos usuários), enquanto uma operação de compra dentro do mesmo aplicativo (ex: um item de edição limitada) provavelmente exige consistência forte, para evitar vender o mesmo item duas vezes.

## Erros comuns

- Assumir que consistência forte é sempre a opção "mais segura" e, portanto, sempre preferível — ignorando o custo real em disponibilidade e latência.
- Aplicar o mesmo nível de consistência a todas as partes de um sistema, mesmo quando diferentes partes têm necessidades claramente diferentes.
