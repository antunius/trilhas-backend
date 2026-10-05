---
slug: atualizacoes-tempo-real
categorySlug: system-design
title: "Padrão: Atualizações em Tempo Real"
navTitle: Atualizações em Tempo Real
summary: Conhecer as principais técnicas para entregar atualizações em tempo real a um cliente
level: intermediario
order: 112
section: padroes-recorrentes
group: "Tempo real e arquivos"
---

## Objetivos de aprendizagem

- [ ] Conhecer as principais técnicas para entregar atualizações em tempo real a um cliente
- [ ] Escolher entre elas com base nos requisitos do problema

## Conteúdo

### Polling

![WebSocket / SSE push](/diagrams/sd-atualizacoes-tempo-real.svg)

O cliente pergunta periodicamente ao servidor "há algo novo?". É a solução mais simples de implementar, mas gera tráfego desnecessário quando não há atualização, e introduz um atraso proporcional ao intervalo entre as perguntas. Funciona bem quando atualizações não são tão frequentes e um pequeno atraso é aceitável.

### Long polling

Uma variação do polling em que o servidor segura a resposta em aberto até ter uma atualização real para entregar (ou até um tempo limite), reduzindo o número de requisições vazias em comparação ao polling simples, ao custo de manter conexões abertas por mais tempo no servidor.

### Server-Sent Events (SSE)

Permite que o servidor envie atualizações continuamente para o cliente através de uma única conexão HTTP mantida aberta, em uma via de mão única (servidor → cliente). É mais simples de implementar que WebSockets quando o cliente só precisa receber atualizações, sem necessidade de enviar dados de volta pelo mesmo canal.

### WebSockets

Estabelece um canal de comunicação bidirecional persistente entre cliente e servidor, permitindo que ambos os lados enviem mensagens a qualquer momento pela mesma conexão. É a escolha natural quando o cliente também precisa enviar atualizações em tempo real (ex: um chat), não apenas recebê-las.

### Escolhendo entre as opções

A pergunta central é: a comunicação precisa ser bidirecional (WebSockets) ou só o servidor precisa empurrar dados (SSE)? E o volume de atualizações justifica manter uma conexão persistente aberta, ou um polling simples já seria suficiente dado o requisito de atraso aceitável?

## Exemplo aplicado

Em um placar esportivo ao vivo, onde o cliente só precisa receber atualizações (nunca enviar dados pela mesma via), Server-Sent Events é uma escolha mais simples que WebSockets, já que a comunicação é unidirecional por natureza.

## Implementando na prática (Java + Spring Boot)

### Como implementar

Entre polling, SSE e WebSockets, a escolha padrão para atualizações que fluem apenas do servidor para o cliente — como o status de uma tarefa em processamento ou um placar ao vivo — é o Server-Sent Events: mantém uma única conexão HTTP aberta, é mais simples de implementar e operar que WebSockets, e dispensa infraestrutura extra além de um `Content-Type` diferente. WebSockets só entram em cena quando o cliente também precisa enviar dados pelo mesmo canal em tempo real, como em um chat ou em uma colaboração simultânea sobre um mesmo documento.

### Como usar em Java com Spring Boot

```java
@RestController
@RequestMapping("/api/videos")
class VideoStatusStreamController {

    private final Map<UUID, SseEmitter> emitters = new ConcurrentHashMap<>();

    @GetMapping(value = "/tasks/{taskId}/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    SseEmitter streamStatus(@PathVariable UUID taskId) {
        SseEmitter emitter = new SseEmitter(30_000L);
        emitters.put(taskId, emitter);

        emitter.onCompletion(() -> emitters.remove(taskId));
        emitter.onTimeout(() -> emitters.remove(taskId));

        return emitter;
    }

    // chamado pelo serviço de processamento a cada mudança de status
    void notifyStatusChange(UUID taskId, TaskStatus status) {
        SseEmitter emitter = emitters.get(taskId);
        if (emitter == null) {
            return;
        }
        try {
            emitter.send(SseEmitter.event().name("status").data(status));
            if (status == TaskStatus.COMPLETED) {
                emitter.complete();
            }
        } catch (IOException e) {
            emitter.completeWithError(e);
        }
    }
}
```

Quando a comunicação precisa ser bidirecional, a alternativa é um handler de WebSocket:

```java
@Component
class ChatWebSocketHandler implements WebSocketHandler {

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        // registrar a sessão para futuras mensagens
    }

    @Override
    public void handleMessage(WebSocketSession session, WebSocketMessage<?> message) throws IOException {
        // mensagem recebida do cliente; ecoar ou distribuir para outras sessões
        session.sendMessage(new TextMessage("recebido: " + message.getPayload()));
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        // remover a sessão do registro
    }
}

@Configuration
@EnableWebSocket
class WebSocketConfig implements WebSocketConfigurer {

    private final ChatWebSocketHandler chatWebSocketHandler;

    WebSocketConfig(ChatWebSocketHandler chatWebSocketHandler) {
        this.chatWebSocketHandler = chatWebSocketHandler;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(chatWebSocketHandler, "/ws/chat");
    }
}
```

### Como configurar

```yaml
app:
  sse:
    timeout: 30000 # ms; deve ser menor que o timeout de proxies/load balancers na frente da aplicação
```

Para o exemplo de WebSockets, é necessária a dependência do starter correspondente:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-websocket</artifactId>
</dependency>
```

## Erros comuns

- Propor WebSockets por padrão, mesmo quando a comunicação é claramente unidirecional (do servidor para o cliente apenas).
- Ignorar polling como opção válida quando o requisito de atraso é tolerante e o volume de atualizações é baixo.
