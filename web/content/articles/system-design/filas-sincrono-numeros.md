---
slug: filas-sincrono-numeros
categorySlug: system-design
title: "Síncrono ou assíncrono e o ganho da fila em números"
navTitle: Síncrono, assíncrono e números
summary: "Decidir o que pode ser assíncrono e dimensionar os workers pela média, e não pelo pico"
level: intermediario
order: 43
section: tecnologias-chave
group: "Filas e mensageria"
---

## Objetivos de aprendizagem

- [ ] Diferenciar síncrono de assíncrono e o custo do segundo
- [ ] Dimensionar workers com a fila absorvendo o pico

*Retomando o cenário da unidade: uma plataforma de vídeo que recebe 200 uploads por minuto no pico e precisa codificar cada vídeo em 4 resoluções.*

## Síncrono vs. assíncrono

**Síncrono**: o cliente espera o resultado. Adequado quando o resultado é necessário **agora**: confirmar um pagamento, validar um login, mostrar o saldo.

**Assíncrono**: o sistema aceita o pedido e responde "recebi", e o trabalho acontece depois. Adequado quando o usuário não precisa esperar: codificar um vídeo, gerar um relatório, enviar um e-mail.

O custo do assíncrono é real: o cliente não sabe imediatamente se deu certo. É preciso um jeito de informar o resultado depois (notificação, *polling* de um status, WebSocket), e o fluxo fica mais difícil de raciocinar e de depurar.

## Por que a fila vale a pena: números

Cada vídeo ocupa um servidor por 4 resoluções × 3 min = **12 minutos**. Com 200 uploads por minuto no pico, o trabalho que chega é 200 × 12 = **2.400 minutos de servidor por minuto**, ou seja, 2.400 servidores trabalhando ao mesmo tempo, só para não acumular. Manter 2.400 servidores o dia todo é absurdo se o pico dura 1 hora e o resto do dia chega 10% disso.

Com a fila, dimensionamos para a **média**, não para o pico. Se a média é 40 uploads por minuto, bastam 480 servidores, e o excedente do pico espera na fila alguns minutos. Trocamos **latência** (o vídeo fica pronto em 15 minutos em vez de 12) por **custo** (cinco vezes menos servidores). Essa é a troca que a fila torna possível, e é o argumento mais forte para propô-la.

Uma segunda vantagem é a **resiliência**: se os workers caem, os uploads continuam sendo aceitos. A fila segura as mensagens até eles voltarem.

## Lembre

- Síncrono quando o resultado é necessário **agora**; assíncrono quando o usuário não precisa esperar.
- Com fila, dimensione pela **média** e deixe o pico esperar.
- Você troca **latência** por **custo**.
