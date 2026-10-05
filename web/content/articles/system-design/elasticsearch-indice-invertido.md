---
slug: elasticsearch-indice-invertido
categorySlug: system-design
title: "Elasticsearch: o índice invertido e os analyzers"
navTitle: Índice invertido
summary: "Construir à mão um índice invertido e entender o pipeline de análise que prepara o texto para a busca"
level: intermediario
order: 73
section: deep-dives-tecnologias
group: "Elasticsearch"
---

## Objetivos de aprendizagem

- [ ] Explicar como um índice invertido evita escanear o texto de cada documento
- [ ] Descrever o papel do analyzer: tokenização, normalização e stemming

## Cenário de referência da unidade

Vamos usar uma plataforma de vagas de emprego, onde candidatos buscam vagas por palavra-chave ("engenheiro de dados remoto"), com filtros (localização, faixa salarial) e ordenação por relevância — um caso clássico de busca textual combinada com filtros estruturados.

## Fundamentos: o índice invertido, construído à mão

A peça central que faz o Elasticsearch (por baixo, construído sobre a biblioteca Lucene) ser rápido é o **índice invertido**. A melhor forma de entender isso é construir um pequeno exemplo manualmente.

Imagine três vagas, reduzidas a uma frase cada, para simplificar:

- **Vaga 1**: "engenheiro de dados remoto"
- **Vaga 2**: "engenheiro de software remoto"
- **Vaga 3**: "analista de dados presencial"

Um índice tradicional (por linha) armazenaria essas três frases como estão. Um índice **invertido** faz o oposto: para cada palavra (termo), mantém a lista de documentos onde ela aparece:

```
"engenheiro" -> [Vaga 1, Vaga 2]
"de"         -> [Vaga 1, Vaga 2, Vaga 3]
"dados"      -> [Vaga 1, Vaga 3]
"remoto"     -> [Vaga 1, Vaga 2]
"software"   -> [Vaga 2]
"analista"   -> [Vaga 3]
"presencial" -> [Vaga 3]
```

![Índice invertido: de termo para lista de documentos](/diagrams/elasticsearch-indice-invertido.svg)

Para buscar "engenheiro dados", o motor simplesmente consulta as duas listas (`engenheiro` → [1,2], `dados` → [1,3]) e calcula a interseção: Vaga 1 aparece em ambas, então é a melhor correspondência — sem nunca precisar examinar o texto completo de nenhuma vaga. Essa é a diferença estrutural fundamental: buscar vira uma operação de consultar listas pré-computadas, não escanear texto.

### O que acontece entre a palavra digitada e o índice: analyzers

Antes de uma palavra virar uma entrada no índice invertido, ela passa por um pipeline de **análise**: tokenização (quebrar o texto em palavras individuais), normalização (minúsculas, remover acentuação), e às vezes stemming (reduzir "engenheiros" e "engenheiro" à mesma raiz, para que a busca encontre ambos). Esse pipeline é o motivo de uma busca por "ENGENHEIRO" encontrar um documento escrito como "engenheiro" — sem ele, a comparação seria exatamente literal, caractere por caractere.

## Lembre

- Índice invertido: **de cada termo para a lista de documentos** que o contêm.
- Buscar vira **consultar listas pré-computadas e interseccionar**, não escanear texto.
- O **analyzer** normaliza o texto na indexação e na busca, para "ENGENHEIRO" achar "engenheiro".
