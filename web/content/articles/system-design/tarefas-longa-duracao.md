---
slug: tarefas-longa-duracao
categorySlug: system-design
title: "Padrão: Tarefas de Longa Duração"
navTitle: Tarefas de Longa Duração
summary: Reconhecer quando uma operação não deve ser tratada de forma síncrona
level: intermediario
order: 53
section: padroes-recorrentes
---

## Objetivos de aprendizagem

- [ ] Reconhecer quando uma operação não deve ser tratada de forma síncrona
- [ ] Conhecer estratégias para acompanhar o progresso de uma tarefa longa

## Conteúdo

### Reconhecendo o padrão

![Job assíncrono com status](/diagrams/sd-tarefas-longa-duracao.svg)

Algumas operações levam tempo demais para que o cliente espere uma resposta síncrona: processar um vídeo, gerar um relatório complexo, treinar um modelo. Forçar o cliente a manter uma conexão aberta esperando esse processamento terminar é frágil (qualquer instabilidade de rede derruba a operação) e não escala bem.

### A solução geral

O padrão típico é responder imediatamente ao cliente com uma confirmação de que a tarefa foi aceita (e um identificador para acompanhá-la), processar o trabalho de forma assíncrona (frequentemente via uma fila, como visto no Módulo 2), e permitir que o cliente consulte o status posteriormente — seja através de polling periódico, seja através de uma atualização em tempo real (o próximo padrão deste módulo).

### Dividindo a tarefa em etapas menores

Tarefas muito longas se beneficiam de serem divididas em etapas menores e independentes, cada uma podendo ser reprocessada individualmente em caso de falha, em vez de reiniciar a tarefa inteira do zero. Isso também permite reportar progresso parcial ao cliente ("2 de 5 etapas concluídas"), em vez de um status binário de "pronto" ou "não pronto".

## Exemplo aplicado

No processamento de um vídeo enviado por um usuário, o upload responde imediatamente com uma confirmação e um identificador de tarefa, enquanto o processamento real (transcodificação em diferentes resoluções) acontece de forma assíncrona em segundo plano, dividido em etapas menores por resolução — permitindo, inclusive, que uma falha na transcodificação de uma resolução específica seja reprocessada sem repetir as demais.

## Implementando na prática (Java + Spring Boot)

### Como implementar

A forma mais simples de aplicar o padrão é aceitar a requisição, criar imediatamente um registro de tarefa com status `PENDING` e devolver ao cliente um `202 Accepted` com o identificador dessa tarefa, sem bloquear a thread da requisição esperando o processamento terminar. O trabalho pesado é delegado a uma execução assíncrona: para cenários mais simples, um método anotado com `@Async` rodando em um pool de threads dedicado já resolve; para cenários que exigem sobreviver a reinícios da aplicação ou distribuir o processamento entre múltiplas instâncias, o ideal é publicar a tarefa em uma fila ou tópico (Kafka, por exemplo) e processá-la em um consumidor separado. Em ambos os casos, o status da tarefa é atualizado conforme cada etapa avança, e um endpoint de consulta permite ao cliente fazer polling pelo identificador recebido.

### Como usar em Java com Spring Boot

```java
@RestController
@RequestMapping("/api/videos")
class VideoProcessingController {

    private final TaskRepository taskRepository;
    private final VideoProcessingService videoProcessingService;

    VideoProcessingController(TaskRepository taskRepository,
                               VideoProcessingService videoProcessingService) {
        this.taskRepository = taskRepository;
        this.videoProcessingService = videoProcessingService;
    }

    @PostMapping
    ResponseEntity<TaskResponse> uploadVideo(@RequestBody VideoUploadRequest request) {
        Task task = taskRepository.save(Task.pending());

        videoProcessingService.processAsync(task.getId(), request);

        URI location = URI.create("/api/videos/tasks/" + task.getId());
        return ResponseEntity.accepted().location(location)
                .body(new TaskResponse(task.getId(), task.getStatus()));
    }

    @GetMapping("/tasks/{taskId}")
    ResponseEntity<TaskResponse> getStatus(@PathVariable UUID taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        return ResponseEntity.ok(new TaskResponse(task.getId(), task.getStatus()));
    }
}

@Service
class VideoProcessingService {

    private final TaskRepository taskRepository;
    private final List<String> resolutions = List.of("480p", "720p", "1080p");

    VideoProcessingService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @Async("videoTaskExecutor")
    CompletableFuture<Void> processAsync(UUID taskId, VideoUploadRequest request) {
        taskRepository.updateStatus(taskId, TaskStatus.IN_PROGRESS);

        for (String resolution : resolutions) {
            transcode(request.sourcePath(), resolution);
            taskRepository.updateProgress(taskId, resolution);
        }

        taskRepository.updateStatus(taskId, TaskStatus.COMPLETED);
        return CompletableFuture.completedFuture(null);
    }

    private void transcode(String sourcePath, String resolution) {
        // transcodificação da resolução específica
    }
}
```

### Como configurar

```java
@Configuration
@EnableAsync
class AsyncConfig {

    @Bean("videoTaskExecutor")
    Executor videoTaskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(4);
        executor.setMaxPoolSize(16);
        executor.setQueueCapacity(100);
        executor.setThreadNamePrefix("video-task-");
        executor.initialize();
        return executor;
    }
}
```

```yaml
app:
  video-processing:
    thread-pool:
      core-size: 4
      max-size: 16
      queue-capacity: 100
```

## Erros comuns

- Manter uma conexão síncrona aberta para uma operação que pode levar minutos ou horas para terminar.
- Tratar uma tarefa longa como uma unidade única e indivisível, dificultando recuperação parcial em caso de falha.
