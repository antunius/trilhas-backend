---
slug: revisao-critica-codigo-gerado
categorySlug: ai-coding
title: Revisão Crítica do Código Gerado pela IA
summary: Desenvolver um checklist mental para revisar código gerado antes de aceitá-lo
level: intermediario
order: 3
section: fundamentals
---

## Objetivos de aprendizagem

- [ ] Desenvolver um checklist mental para revisar código gerado antes de aceitá-lo
- [ ] Reconhecer os tipos de erro mais comuns em código gerado por IA

## Conteúdo

### Por que a revisão crítica é essencial

Código gerado por IA pode parecer correto à primeira vista — bem formatado, com nomes de variáveis razoáveis — mas conter erros sutis de lógica, casos extremos não tratados, ou padrões que não se encaixam com o restante da base de código. Aceitar sem revisar é o erro mais penalizado nesse tipo de entrevista.

### O que verificar

- **Casos extremos**: o código trata entradas vazias, nulas, ou nos limites esperados?
- **Consistência com o código existente**: o estilo e as convenções seguem o que já existe na base de código, ou introduzem um padrão diferente sem necessidade?
- **Suposições implícitas**: a IA assumiu algo sobre o comportamento esperado que não foi explicitamente pedido, e essa suposição está correta?
- **Complexidade desnecessária**: o código resolve o problema de forma direta, ou introduz complexidade que o problema não pedia?

### Testando antes de aceitar

Sempre que possível, executar o código gerado contra alguns casos de teste (incluindo casos extremos) antes de declarar a tarefa concluída é uma boa prática — mesmo que a IA "pareça confiante" no código gerado, essa confiança não substitui verificação real.

## Exemplo aplicado

Ao revisar uma função de busca gerada pela IA, um candidato atento percebe que ela não trata o caso de uma busca com string vazia, testando esse caso especificamente antes de aceitar o código como pronto — e ajustando com um prompt de acompanhamento específico sobre esse caso.

## Erros comuns

- Aceitar o código gerado sem testar casos extremos, assumindo que "parece certo".
- Não perceber quando o código gerado introduz um padrão inconsistente com o restante da base de código.
