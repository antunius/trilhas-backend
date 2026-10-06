---
slug: youtube
categorySlug: system-design
title: "Exercício: Projetar uma Plataforma de Vídeo (estilo YouTube)"
navTitle: Plataforma de Vídeo
summary: Projete uma plataforma de compartilhamento de vídeos, incluindo upload, processamento e reprodução em diferentes qualidades.
level: avancado
order: 129
section: exercicios-praticos
group: "Dados em larga escala"
---

## Objetivos de aprendizagem

- [ ] Praticar o desenho de um pipeline assíncrono de processamento de arquivos grandes
- [ ] Decidir onde cache e CDN entram numa proporção extrema de leitura sobre escrita

## Enunciado

Projete uma plataforma de compartilhamento de vídeos, incluindo upload, processamento e reprodução em diferentes qualidades.

![Vídeo: upload → process → CDN](/diagrams/sd-youtube.svg)

## Perguntas orientadoras (levantamento de requisitos)

- O sistema precisa suportar múltiplas resoluções de vídeo, adaptadas à conexão do espectador?
- Qual a proporção entre upload de vídeos e visualizações (provavelmente muito desbalanceada)?
- É necessário mostrar o progresso do processamento do vídeo para quem fez o upload?

## Requisitos funcionais (exemplos)

- Fazer upload de um arquivo de vídeo.
- Processar o vídeo em múltiplas resoluções.
- Reproduzir o vídeo na melhor qualidade disponível para a conexão do espectador.
- Consultar o status de processamento de um upload em andamento.

## Requisitos não-funcionais (exemplos)

- **Escala:** volume de uploads relativamente baixo comparado a um volume enorme de visualizações.
- **Latência:** reprodução precisa iniciar rapidamente (poucos segundos), mesmo que o processamento do upload tenha levado minutos.
- **Disponibilidade:** altíssima para reprodução — é o produto; upload pode tolerar retry.
- **Consistência:** eventual é aceitável — o vídeo processado aparece disponível pouco depois do upload, não instantaneamente.
- **Leitura vs. escrita:** extremamente dominado por leitura (visualizações ≫ uploads).

## Tecnologias que podem ser usadas

- **Armazenamento de arquivo:** blob storage (S3 ou equivalente) para o vídeo bruto e as versões processadas.
- **Fila de mensagens:** para orquestrar os jobs de transcodificação de forma assíncrona.
- **Processamento:** workers dedicados (ex.: FFmpeg) escaláveis horizontalmente conforme a fila cresce.
- **CDN:** entrega dos vídeos já processados perto do espectador, tirando a carga do armazenamento de origem.

## Pontos centrais a explorar (deep dive sugerido)

- **Blobs Grandes** (Módulo 6): como o upload do arquivo de vídeo bruto deve ser tratado, evitando que ele passe desnecessariamente pelo servidor de aplicação.

![Upload direto ao blob storage → fila de transcodificação → CDN](/diagrams/sd-youtube-pipeline.svg)

- **Tarefas de Longa Duração** (Módulo 6): a transcodificação do vídeo em múltiplas resoluções é um processo demorado e deve ser assíncrono.
- **Escalando Leituras** (Módulo 6): a proporção de visualizações sobre uploads é extrema, o que justifica fortemente o uso de cache e CDN para servir os vídeos já processados.

## O que revisar depois de resolver

- O upload evita passar o arquivo bruto pelo servidor de aplicação (ex.: URL pré-assinada direto ao blob storage)?
- O pipeline de transcodificação é assíncrono, com um jeito do cliente consultar o progresso?
- A escolha de CDN/cache foi justificada pela proporção extrema entre visualizações e uploads?
