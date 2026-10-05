---
slug: levantamento-requisitos
categorySlug: system-design
title: Levantamento de Requisitos (Funcionais e Não-Funcionais)
navTitle: Levantamento de Requisitos
summary: Diferenciar requisitos funcionais de não-funcionais
level: intermediario
order: 2
section: framework-entrega
group: "Começando"
---

## Objetivos de aprendizagem

- [ ] Diferenciar requisitos funcionais de não-funcionais
- [ ] Saber fazer perguntas que reduzem o escopo do problema
- [ ] Evitar tanto o excesso quanto a falta de perguntas nessa fase

## Estrutura da aula

1. Por que essa etapa existe
2. Requisitos funcionais: o que o sistema faz
3. Requisitos não-funcionais: como o sistema se comporta sob carga
4. Como decidir o que perguntar (e quando parar de perguntar)

## Conteúdo

### Por que essa etapa existe

![Funcionais vs não-funcionais](/diagrams/sd-levantamento-requisitos.svg)

Todo problema de system design em entrevista é propositalmente vago ("projete o Twitter", "projete um sistema de reservas"). Isso não é falha do enunciado — é o próprio teste: o candidato precisa reduzir esse escopo enorme a um conjunto de decisões que caibam em 45 minutos. Quem pula essa etapa acaba desenhando o sistema errado, ou um sistema genérico demais para discutir profundidade em qualquer parte.

### Requisitos funcionais

São as ações que o sistema precisa suportar, do ponto de vista do usuário. Para um encurtador de URLs, por exemplo: criar um link curto, redirecionar para o link original, opcionalmente definir expiração. A armadilha aqui é tentar listar *todas* as funcionalidades possíveis — o ideal é fechar as 3 a 5 mais centrais e deixar claro que outras ficam de fora do escopo.

### Requisitos não-funcionais

Descrevem as qualidades do sistema, não as ações: escala esperada (quantos usuários, quantas requisições por segundo), latência aceitável, disponibilidade exigida, consistência necessária. São esses requisitos que realmente definem a arquitetura — um sistema para 1.000 usuários e outro para 100 milhões de usuários são, na prática, problemas diferentes, mesmo com a mesma lista de funcionalidades.

### Como decidir o que perguntar

Perguntas úteis giram em torno de: quem usa o sistema, em que escala, o que é lido com mais frequência do que é escrito (ou o contrário), e o que acontece em caso de falha. Não é necessário esgotar todas as perguntas possíveis — 3 a 5 perguntas bem direcionadas, seguidas de suposições explícitas ("vou assumir que a leitura é muito mais frequente que a escrita, me avise se estiver errado") já demonstram maturidade suficiente.

## Exemplo aplicado

Para "projete um sistema de encurtamento de URLs", perguntas relevantes seriam: qual o volume diário de novos links? Qual a proporção entre criação e redirecionamento? Links precisam expirar? É necessário suportar alias customizado? As respostas mudam completamente se o sistema precisa suportar 10 mil links/dia versus 10 milhões.

## Erros comuns

- Pular direto para requisitos não-funcionais sem antes fechar o que o sistema faz.
- Fazer perguntas demais, sem nunca convergir para uma suposição e seguir em frente.
- Ignorar completamente escala, tratando o problema como se fosse para poucos usuários.
