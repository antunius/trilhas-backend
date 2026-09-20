---
slug: contrato-api
categorySlug: system-design
title: Definindo o Contrato de API
summary: Traduzir requisitos funcionais em endpoints concretos
level: intermediario
order: 4
section: framework-entrega
---

## Objetivos de aprendizagem

- [ ] Traduzir requisitos funcionais em endpoints concretos
- [ ] Escolher entre REST, GraphQL e RPC com justificativa
- [ ] Usar o contrato de API como guia para o restante do desenho

## Estrutura da aula

1. Por que definir a API antes do desenho de alto nível
2. Traduzindo requisitos em endpoints
3. Escolhendo o protocolo certo
4. O contrato como "contrato" mesmo — usado depois para validar o design

## Conteúdo

### Por que definir a API antes

![Contrato de API: endpoints e recursos](/diagrams/sd-contrato-api.svg)

Depois de fechar os requisitos, o próximo passo natural é traduzir cada requisito funcional em uma operação concreta: um endpoint, seus parâmetros de entrada e o formato de resposta. Isso obriga você a pensar de forma explícita sobre o que o sistema expõe, e serve como guia de validação mais tarde — ao terminar o desenho de alto nível, você pode conferir se cada endpoint definido aqui realmente tem um caminho claro na arquitetura.

### Traduzindo requisitos em endpoints

Para cada requisito funcional levantado, pergunte: que operação HTTP representa isso, quais dados são necessários para executá-la, e o que volta como resposta. Não é necessário formalismo excessivo — alguns poucos endpoints, escritos de forma direta (ex: `POST /links` recebendo a URL original e devolvendo o código curto), já cumprem o papel.

### Escolhendo o protocolo

Na prática, REST é a escolha padrão para a maioria dos problemas de entrevista — é o modelo que todo entrevistador reconhece e que raramente precisa de justificativa extensa. GraphQL faz mais sentido quando há múltiplos tipos de cliente (web, mobile) com necessidades de dados muito diferentes entre si, evitando problemas de sub ou sobre-busca de dados. RPC (como gRPC) é mais comum em comunicação interna entre serviços, onde performance importa mais do que a flexibilidade que REST oferece.

A recomendação prática: comece com REST por padrão, e só troque de protocolo se houver uma razão concreta para isso — não é uma decisão que deveria consumir muito tempo da entrevista.

## Exemplo aplicado

Para o encurtador de URLs: `POST /links {url_original, alias_opcional, expira_em}` retornando `{codigo_curto, url_encurtada}`; e `GET /{codigo_curto}` retornando um redirecionamento HTTP para a URL original. Só esses dois endpoints já cobrem o núcleo funcional do sistema.

## Erros comuns

- Definir endpoints demais, cobrindo funcionalidades fora do escopo combinado.
- Escolher GraphQL ou RPC sem justificativa clara, só para parecer mais sofisticado.
- Não voltar ao contrato de API depois do desenho de alto nível para verificar consistência.
