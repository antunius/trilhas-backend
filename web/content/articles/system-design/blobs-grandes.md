---
slug: blobs-grandes
categorySlug: system-design
title: "Padrão: Blobs Grandes (Arquivos)"
navTitle: Blobs Grandes
summary: Reconhecer quando um sistema precisa lidar com arquivos grandes de forma diferente de dados estruturados comuns
level: intermediario
order: 115
section: padroes-recorrentes
group: "Tempo real e arquivos"
---

## Objetivos de aprendizagem

- [ ] Reconhecer quando um sistema precisa lidar com arquivos grandes de forma diferente de dados estruturados comuns
- [ ] Conhecer estratégias de upload eficiente para arquivos grandes

## Conteúdo

### Por que arquivos grandes são um caso especial

![Upload para object storage + CDN](/diagrams/sd-blobs-grandes.svg)

Vídeos, imagens em alta resolução e outros arquivos grandes não devem ser armazenados diretamente em um banco de dados tradicional — isso sobrecarrega o banco com dados binários volumosos que ele não foi otimizado para servir. A prática padrão é armazenar esses arquivos em um serviço de armazenamento de objetos (blob storage), guardando no banco de dados apenas os metadados e uma referência (URL ou identificador) para o arquivo real.

### Upload direto vs. via servidor

Uma escolha importante é se o upload do arquivo passa pelo servidor da aplicação (que repassa para o armazenamento de objetos) ou se o cliente recebe uma URL assinada temporária e faz o upload diretamente para o armazenamento, sem o arquivo nunca transitar pelo próprio servidor da aplicação. A segunda abordagem evita que o servidor da aplicação se torne um gargalo, já que ele não precisa processar o volume bruto de dados do arquivo.

### Upload em múltiplas partes (multipart)

Para arquivos muito grandes, dividir o upload em partes menores, enviadas de forma independente (e possivelmente em paralelo), reduz o risco de ter que reiniciar o upload inteiro em caso de falha de rede no meio do processo — apenas a parte que falhou precisa ser reenviada.

## Exemplo aplicado

Em um serviço de armazenamento de arquivos ao estilo Dropbox, o cliente solicita ao servidor da aplicação uma URL de upload temporária e assinada, e envia o arquivo diretamente para o armazenamento de objetos usando essa URL — o servidor da aplicação nunca recebe o conteúdo bruto do arquivo, apenas registra os metadados depois que o upload é confirmado.

## Implementando na prática (Java + Spring Boot)

### Como implementar

O servidor da aplicação nunca deve receber os bytes brutos do arquivo. Em vez disso, ele gera uma URL assinada temporária (presigned URL) que autoriza o cliente a fazer upload diretamente no armazenamento de objetos (por exemplo, Amazon S3), dentro de uma janela de tempo curta e para uma chave específica. Depois que o upload termina, o cliente (ou um webhook/evento de notificação do próprio storage) avisa o servidor, que então grava apenas os metadados do arquivo — nome, tamanho, dono, chave no bucket — sem nunca ter processado o conteúdo binário.

### Como usar em Java com Spring Boot

```java
@RestController
@RequestMapping("/api/arquivos")
public class ArquivoUploadController {

    private final S3Presigner s3Presigner;
    private final ArquivoMetadadoRepository repository;
    private static final String BUCKET = "meu-app-arquivos";

    public ArquivoUploadController(S3Presigner s3Presigner, ArquivoMetadadoRepository repository) {
        this.s3Presigner = s3Presigner;
        this.repository = repository;
    }

    // Passo 1: cliente pede uma URL de upload temporária
    @PostMapping("/upload-url")
    public UploadUrlResponse gerarUrlDeUpload(@RequestBody UploadUrlRequest request) {
        String chave = "uploads/%s/%s".formatted(request.usuarioId(), request.nomeArquivo());

        PutObjectRequest objectRequest = PutObjectRequest.builder()
                .bucket(BUCKET)
                .key(chave)
                .contentType(request.contentType())
                .build();

        PutObjectPresignRequest presignRequest = PutObjectPresignRequest.builder()
                .signatureDuration(Duration.ofMinutes(10))
                .putObjectRequest(objectRequest)
                .build();

        PresignedPutObjectRequest presigned = s3Presigner.presignPutObject(presignRequest);

        return new UploadUrlResponse(presigned.url().toString(), chave);
    }

    // Passo 2: cliente confirma que o upload direto ao S3 terminou
    @PostMapping("/upload-concluido")
    public ResponseEntity<Void> confirmarUpload(@RequestBody UploadConcluidoRequest request) {
        ArquivoMetadado metadado = new ArquivoMetadado(
                request.chave(),
                request.usuarioId(),
                request.tamanhoBytes(),
                Instant.now());

        repository.save(metadado);
        return ResponseEntity.ok().build();
    }
}
```

### Como configurar

```yaml
cloud:
  aws:
    region:
      static: us-east-1
    s3:
      bucket: meu-app-arquivos
```

```xml
<dependency>
    <groupId>software.amazon.awssdk</groupId>
    <artifactId>s3</artifactId>
</dependency>
```

## Erros comuns

- Armazenar arquivos grandes diretamente em um banco de dados relacional ou de documentos.
- Fazer o upload de arquivos grandes passar pelo servidor da aplicação sem necessidade, criando um gargalo evitável.
