---
slug: cap-teorema
categorySlug: system-design
title: "O teorema CAP e por que a escolha é entre C e A"
navTitle: O teorema
summary: "Entender o teorema com um exemplo passo a passo e por que a tolerância a partição não é opcional"
level: intermediario
order: 39
section: tecnologias-chave
group: "Teorema CAP"
---

## Objetivos de aprendizagem

- [ ] Explicar o teorema CAP com o exemplo das réplicas
- [ ] Justificar por que a escolha real é entre C e A

*Retomando o cenário da unidade: um serviço de saldo de conta replicado em dois data centers, São Paulo e Frankfurt, cuja rede entre os dois pode falhar.*

## O teorema

O teorema CAP afirma que, **durante uma partição de rede**, um sistema distribuído não pode garantir ao mesmo tempo consistência e disponibilidade. É preciso sacrificar uma das duas.

### Por que é assim: o exemplo

A rede entre São Paulo e Frankfurt cai. A Ana, em São Paulo, deposita R$ 100. Depois, o marido dela, em Frankfurt, consulta o saldo.

1. São Paulo registra o depósito: saldo 1.100.
2. Ele tenta avisar Frankfurt, mas a rede está cortada. Frankfurt continua com 1.000.
3. Frankfurt recebe a consulta do marido. O que ela responde?

Só há **duas saídas**:

- **Responder "1.000"**: o sistema continua **disponível**, mas entrega um dado desatualizado (**inconsistente**).
- **Recusar a consulta** com um erro ("não consigo confirmar"): o sistema permanece **consistente** (nunca mente), mas fica **indisponível** naquela requisição.

Não existe terceira saída. Frankfurt não tem como saber o saldo atual sem falar com São Paulo, e a rede está cortada. É isso que o teorema diz.

![CAP: sob partição escolha C ou A](/diagrams/sd-teorema-cap.svg)

*A imagem mostra o ponto: com a partição, cada lado precisa escolher entre responder com o que tem (A) ou esperar/recusar até poder confirmar (C).*

## Por que a escolha real é entre C e A

O "P" do CAP não é uma opção que você pode simplesmente dispensar. Em sistemas distribuídos reais, partições **acontecem**: cabos, roteadores, sobrecarga, falhas de software. Um sistema que não tolera partição simplesmente falha quando uma ocorre. Então a pergunta prática é:

> **Quando a rede falhar, o sistema prioriza consistência ou disponibilidade?**

- **CP** (consistência + tolerância a partição): durante a partição, recusa operações que não consegue garantir. Prefere um erro a um dado errado.
- **AP** (disponibilidade + tolerância a partição): durante a partição, continua respondendo, mesmo com dados possivelmente defasados, e reconcilia depois.

E **quando não há partição**? Aí o sistema pode ter as duas coisas. O CAP só obriga a escolher **durante a falha**, que é a parte menos frequente do tempo.

## Lembre

- Sob partição, uma réplica só pode **responder com o que tem (A)** ou **recusar (C)**.
- Partições **acontecem**: o P não é opcional.
- Sem partição, o sistema pode ter **as duas** propriedades.
