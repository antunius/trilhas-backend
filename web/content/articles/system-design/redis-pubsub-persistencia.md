---
slug: redis-pubsub-persistencia
categorySlug: system-design
title: "Pub/Sub e persistência no Redis"
navTitle: Pub/Sub e persistência
summary: "Saber quando o Pub/Sub basta, quando é preciso Streams, e o que RDB e AOF garantem se o Redis reiniciar"
level: intermediario
order: 70
section: deep-dives-tecnologias
group: "Redis"
---

## Objetivos de aprendizagem

- [ ] Dizer quando o Pub/Sub é suficiente e quando é preciso Streams ou Kafka
- [ ] Comparar RDB e AOF e escolher conforme a fonte de verdade do sistema

*Retomando o cenário da unidade: uma plataforma de quiz ao vivo, com placar, limite de respostas por jogador e um lock para contar uma resposta só por pergunta.*

## Pub/Sub: notificando jogadores em tempo real

Redis Pub/Sub permite publicar uma mensagem em um "canal", entregue imediatamente a todos os assinantes conectados naquele momento — sem persistência: quem não estava conectado no momento da publicação simplesmente não recebe aquela mensagem.

No nosso quiz, isso serve bem para notificar "a próxima pergunta está disponível" a todos os jogadores conectados simultaneamente — se a conexão de um jogador cair por um segundo e ele perder essa notificação específica, o impacto é tolerável (a próxima ação do jogador, como abrir o app, pode simplesmente buscar o estado atual). Já para algo que não pode se dar ao luxo de perder mensagens (como o histórico de respostas de um jogador), Pub/Sub não é a ferramenta certa — Streams (o tipo de dado visto nos fundamentos) ou um sistema como Kafka seriam mais apropriados, já que retêm o histórico mesmo para quem não estava conectado no momento.

## Persistência: o que acontece se o Redis reiniciar

Por padrão, Redis prioriza velocidade sobre durabilidade — mas oferece dois mecanismos opcionais de persistência em disco:

- **RDB (snapshot)**: salva uma foto completa do estado em disco em intervalos configuráveis (ex: a cada 5 minutos). Rápido de restaurar, mas qualquer escrita entre o último snapshot e uma falha é perdida.
- **AOF (Append-Only File)**: registra cada comando de escrita em um log sequencial, permitindo reconstruir o estado exato replay-ando o log. Mais durável (perde, no máximo, uma fração de segundo de escritas, dependendo da configuração de sincronização), mas mais lento e o arquivo de log cresce continuamente.

**No nosso quiz**: o placar de uma partida ao vivo provavelmente não precisa de durabilidade perfeita — se o Redis reiniciar no meio de uma partida e perder os últimos segundos de pontuação, isso é recuperável re-computando a partir do log de respostas do banco principal (que continua sendo a fonte de verdade durável). Essa é uma justificativa concreta para aceitar a persistência mais fraca (RDB, ou até nenhuma) em troca de desempenho, desde que exista uma fonte de verdade durável em outro lugar do sistema.

## Lembre

- **Pub/Sub não guarda histórico**: quem não estava conectado perde a mensagem.
- **RDB** é um snapshot periódico; **AOF** registra cada escrita e perde menos.
- Aceite persistência fraca só se há uma **fonte de verdade durável** em outro lugar.
