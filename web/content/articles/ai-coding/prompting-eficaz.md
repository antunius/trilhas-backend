---
slug: prompting-eficaz
categorySlug: ai-coding
title: Prompting Eficaz Durante a Entrevista
summary: Estruturar um prompt inicial claro e específico
level: intermediario
order: 2
section: fundamentals
---

## Objetivos de aprendizagem

- [ ] Estruturar um prompt inicial claro e específico
- [ ] Fornecer contexto suficiente sem sobrecarregar o prompt com informação irrelevante

## Conteúdo

### Elementos de um bom prompt inicial

Um prompt eficaz para uma tarefa de código costuma incluir: o objetivo específico da mudança (não apenas "adicione uma feature", mas o comportamento exato esperado), o contexto relevante da base de código existente (convenções, estrutura, tecnologias já em uso), e quaisquer restrições conhecidas (ex: "sem adicionar novas dependências externas").

### Especificidade sem excesso

Um prompt vago demais ("adicione busca à API") força a IA a assumir detalhes importantes por conta própria, que podem não corresponder ao que o entrevistador espera. Por outro lado, um prompt excessivamente longo e detalhado pode ser tão difícil de processar quanto um vago, especialmente sob pressão de tempo. O equilíbrio é fornecer os detalhes que realmente mudam a implementação esperada, e omitir o que é irrelevante.

### Prompts de acompanhamento

Raramente o primeiro resultado é perfeito. Um bom prompt de acompanhamento é específico sobre o que precisa mudar ("essa função não trata o caso de uma lista vazia, ajuste isso") em vez de vago ("isso está errado, tente de novo") — quanto mais específico o feedback, mais provável que a próxima iteração já resolva o problema identificado.

## Exemplo aplicado

Em vez de "adicione validação a esse formulário", um prompt mais eficaz especifica: "adicione validação ao formulário de cadastro, exigindo e-mail em formato válido e senha com no mínimo 8 caracteres, seguindo o mesmo padrão de mensagens de erro já usado no formulário de login".

## Erros comuns

- Escrever prompts vagos demais, deixando decisões importantes a cargo da IA sem intenção clara.
- Dar feedback genérico ("não está certo") em vez de apontar especificamente o que precisa ser corrigido.
