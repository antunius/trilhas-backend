---
slug: filas-fundamentos
categorySlug: system-design
title: "Filas de mensagens: produtor, consumidor, ack e DLQ"
navTitle: Fundamentos de filas
summary: "Entender produtor, consumidor, mensagem, ack, retry e dead-letter queue, e o caminho de um upload"
level: intermediario
order: 42
section: tecnologias-chave
group: "Filas e mensageria"
---

## Objetivos de aprendizagem

- [ ] Definir fila, mensagem, ack, retry e DLQ
- [ ] Descrever o caminho de um upload pela fila

## Cenário de referência da unidade

Vamos usar uma plataforma de vídeo. O usuário faz **upload** de um vídeo de 500 MB, e o sistema precisa **codificá-lo** em 4 resoluções (240p, 480p, 720p, 1080p), o que leva cerca de 3 minutos por resolução num servidor comum. Em horários de pico chegam 200 uploads por minuto. Tentar fazer tudo isso durante a requisição do upload seria impossível, e é aí que a fila entra.

## Fundamentos: o vocabulário básico, peça por peça

### O que é uma fila de mensagens, em uma frase

Uma fila é um **intermediário** que guarda tarefas (mensagens) enviadas por um serviço até que outro serviço esteja pronto para processá-las. É como a caixa de pedidos de uma cozinha: o garçom pendura o pedido e vai embora, e o cozinheiro pega o próximo quando estiver livre. Eles não precisam estar sincronizados.

### Produtor e consumidor

O **produtor** é quem coloca mensagens na fila (o serviço de upload). O **consumidor** é quem retira e processa (o worker de codificação). Pode haver muitos consumidores lendo da mesma fila, dividindo o trabalho.

### Mensagem

É a unidade de trabalho: um pequeno pacote de dados com o suficiente para a tarefa ser feita. No nosso caso, `{ "videoId": "v-9031", "arquivo": "uploads/v-9031.mp4" }`. A mensagem carrega uma **referência** ao arquivo, e não o arquivo de 500 MB.

### Ack (confirmação)

Quando o consumidor termina uma mensagem, ele envia um **ack** (*acknowledgement*) dizendo "pode apagar". Se ele cair antes de dar o ack, a fila entende que a tarefa **não foi concluída** e a entrega de novo a outro consumidor. Essa é a base da confiabilidade.

### Retry e dead-letter queue

Se o processamento falha (o arquivo estava corrompido), a mensagem pode ser tentada de novo (**retry**), em geral com espera crescente entre as tentativas. Se continua falhando depois de um número máximo de tentativas, ela vai para uma **dead-letter queue** (DLQ), uma fila à parte para inspeção humana, para que uma mensagem "venenosa" não trave tudo.

### Juntando as peças: o caminho de um upload

1. O usuário envia o vídeo. O serviço de upload grava o arquivo no armazenamento.
2. O serviço (**produtor**) publica uma **mensagem** na fila e responde imediatamente "upload recebido, processando".
3. Um **worker** (**consumidor**) retira a mensagem e começa a codificar.
4. Ao terminar com sucesso, envia o **ack**, e a mensagem é apagada.
5. Se o worker cai no meio, sem ack, a fila entrega a mensagem a outro worker.

![Produtor → fila → consumidores](/diagrams/sd-filas-mensageria.svg)

*A imagem mostra o desacoplamento: o produtor termina assim que a mensagem entra na fila, e os consumidores trabalham no seu próprio ritmo. Se os consumidores estiverem lentos, a fila cresce, e é isso que absorve os picos.*

## Lembre

- A fila **desacopla no tempo** produtor e consumidor.
- Sem **ack**, a mensagem é reentregue a outro consumidor.
- Mensagens que falham sempre vão para a **DLQ**, para inspeção.
