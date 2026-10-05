---
slug: elasticsearch-tempo-real-hot-shards
categorySlug: system-design
title: "Near-real-time e shards quentes"
navTitle: Near-real-time e hot shards
summary: "Entender por que o documento novo demora a aparecer na busca e o que fazer quando um shard concentra a carga"
level: intermediario
order: 76
section: deep-dives-tecnologias
group: "Elasticsearch"
---

## Objetivos de aprendizagem

- [ ] Explicar o intervalo de refresh e o que "near-real-time" significa
- [ ] Reconhecer um hot shard e como evitá-lo

*Retomando o cenário da unidade: uma plataforma de vagas de emprego, em que candidatos buscam por palavra-chave, com filtros de localização e salário e ordenação por relevância.*

## Near-real-time: o atraso entre escrever e conseguir buscar

Documentos novos não ficam imediatamente buscáveis — eles primeiro vão para um buffer em memória, e só se tornam parte de um segmento buscável do índice em um intervalo de atualização (refresh), tipicamente da ordem de 1 segundo por padrão. Isso é chamado de **near-real-time**, não *real-time* de verdade — uma vaga recém-publicada pode não aparecer em buscas por até esse intervalo.

Esse comportamento se conecta a um ponto mais amplo: o Elasticsearch quase sempre vive **ao lado** de um banco de dados principal (que continua sendo a fonte de verdade), recebendo uma cópia dos dados para fins de indexação — geralmente via um pipeline assíncrono (possivelmente usando Kafka, como visto na aula anterior, para propagar mudanças). Isso significa que existe sempre uma janela, por menor que seja, onde o banco principal e o índice de busca podem estar temporariamente dessincronizados — vale mencionar isso explicitamente ao propor essa arquitetura, e mencionar um processo de reconciliação periódica para casos em que essa sincronização falhe silenciosamente.

## Shards quentes (hot shards)

Se uma fração pequena dos documentos (ex: vagas de uma empresa muito popular, ou um termo de busca viral) concentra desproporcionalmente as consultas, o shard que contém esses documentos populares recebe carga muito maior que os demais — o mesmo fenômeno de hot partition já visto no deep dive de Kafka (Módulo 5), aqui aplicado a shards de busca. As mitigações são similares: cache na camada de aplicação para consultas populares repetidas, aumentar o número de réplicas especificamente para shards identificados como quentes, ou reconsiderar a estratégia de particionamento dos documentos entre shards.

### Ajustando o refresh

O intervalo padrão é de cerca de 1 segundo e pode ser alterado por índice. Em cargas grandes de importação, vale aumentá-lo (ou desligá-lo) e restaurá-lo depois, porque cada refresh cria um segmento novo e custa recursos:

```json
PUT /vagas/_settings
{ "index": { "refresh_interval": "30s" } }
```

Para uma leitura que precise enxergar a própria escrita, existe `refresh=wait_for` na requisição de indexação, ao custo de latência maior naquela chamada.

## Lembre

- O documento só é buscável depois do **refresh** (cerca de 1 s por padrão).
- Aumentar o intervalo **acelera cargas grandes**, mas atrasa a visibilidade.
- Um **hot shard** vem de roteamento desigual; ele limita o paralelismo como uma hot partition.
