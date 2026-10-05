---
slug: elasticsearch-relevancia
categorySlug: system-design
title: "Relevância: como o Elasticsearch ordena os resultados"
navTitle: Relevância (BM25)
summary: "Entender os três fatores do BM25 e por que um título com o termo supera uma menção solta"
level: intermediario
order: 75
section: deep-dives-tecnologias
group: "Elasticsearch"
---

## Objetivos de aprendizagem

- [ ] Nomear os fatores que o BM25 considera
- [ ] Explicar por que um termo raro pesa mais que um comum

*Retomando o cenário da unidade: uma plataforma de vagas de emprego, em que candidatos buscam por palavra-chave, com filtros de localização e salário e ordenação por relevância.*

## Relevância: como o Elasticsearch decide o que é "melhor"

Além de encontrar documentos que correspondem, o Elasticsearch calcula uma pontuação de relevância para ordenar os resultados — o algoritmo padrão (BM25) considera, essencialmente: quantas vezes o termo buscado aparece no documento (mais aparições, mais relevante, com retornos decrescentes), quão raro é esse termo no conjunto total de documentos (um termo raro que aparece é mais informativo que um termo comum), e o tamanho do documento (um termo aparecendo em um documento curto pesa mais que no mesmo termo perdido em um documento longo).

No nosso cenário, isso explica por que uma vaga com "engenheiro de dados" no título aparece à frente de uma vaga onde "dados" aparece uma única vez, de passagem, em uma descrição de 500 palavras — mesmo que ambas tecnicamente "correspondam" à busca.

### Um exemplo para fixar

Suponha duas vagas que "correspondem" à busca *engenheiro de dados*:

| Vaga | Onde aparece "dados" | Tamanho do texto |
|---|---|---|
| A | No título, junto com "engenheiro" | 20 palavras |
| B | Uma única vez, de passagem | 500 palavras |

O BM25 coloca a vaga A à frente por três razões somadas:

1. **Frequência do termo:** na A o termo ocupa uma fração grande do texto, e na B é uma entre centenas de palavras.
2. **Raridade do termo:** "engenheiro" é mais raro que "de". Um termo raro que aparece diz mais sobre o documento do que um termo comum.
3. **Tamanho do documento:** o mesmo termo pesa mais num texto curto do que perdido num longo.

O Elasticsearch também permite dar **peso maior a um campo**, por exemplo fazendo o título valer o dobro da descrição:

```json
{
  "query": {
    "multi_match": {
      "query": "engenheiro de dados",
      "fields": ["titulo^2", "descricao"]
    }
  }
}
```

## Lembre

- BM25 combina **frequência**, **raridade** do termo e **tamanho** do documento.
- Mais ocorrências ajudam, mas com **retornos decrescentes**.
- Dá para **ponderar campos**: `titulo^2` vale o dobro de `descricao`.
