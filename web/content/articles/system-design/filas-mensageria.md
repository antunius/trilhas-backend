---
slug: filas-mensageria
categorySlug: system-design
title: Filas e Sistemas de Mensageria
summary: Entender o papel de filas no desacoplamento entre serviços
level: intermediario
order: 17
section: tecnologias-chave
---

## Objetivos de aprendizagem

- [ ] Entender o papel de filas no desacoplamento entre serviços
- [ ] Diferenciar processamento síncrono de assíncrono
- [ ] Reconhecer quando introduzir uma fila resolve um problema real

## Conteúdo

### Por que usar filas

![Produtor → fila → consumidores](/diagrams/sd-filas-mensageria.svg)

Uma fila de mensagens permite que um serviço produtor envie uma tarefa sem esperar que ela seja processada imediatamente, e um ou mais serviços consumidores processem essas tarefas em seu próprio ritmo. Isso desacopla os dois lados no tempo: o produtor não precisa que o consumidor esteja disponível no exato momento do envio, e picos de tráfego podem ser absorvidos pela fila em vez de sobrecarregar o consumidor diretamente.

### Síncrono vs. assíncrono

Processamento síncrono exige que o cliente espere a operação terminar para receber uma resposta — adequado quando o resultado é necessário imediatamente (ex: confirmar um pagamento). Processamento assíncrono permite responder ao cliente imediatamente ("recebemos sua solicitação") enquanto o trabalho pesado acontece em segundo plano, adequado para tarefas que não precisam de resposta instantânea (ex: gerar um relatório, enviar um e-mail).

### Quando introduzir uma fila

Filas fazem sentido quando: a tarefa pode ser processada de forma assíncrona sem prejudicar a experiência do usuário, existe risco de picos de tráfego que sobrecarregariam um processamento síncrono direto, ou é necessário desacoplar serviços que evoluem e escalam de forma independente.

## Exemplo aplicado

Em uma plataforma de vídeo, o upload de um arquivo pode responder imediatamente ao usuário ("upload recebido, processando"), enquanto uma fila distribui a tarefa de codificação do vídeo em diferentes resoluções para um conjunto de workers, que processam essa fila em seu próprio ritmo sem travar a experiência de quem está fazendo upload.

## Erros comuns

- Tornar assíncrono um fluxo que realmente precisa de resposta imediata (ex: confirmação de pagamento).
- Introduzir uma fila sem identificar claramente qual problema de acoplamento ou pico de carga ela resolve.
