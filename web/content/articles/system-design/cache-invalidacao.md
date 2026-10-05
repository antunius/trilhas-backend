---
slug: cache-invalidacao
categorySlug: system-design
title: "Invalidação de cache e cache stampede"
navTitle: Invalidação e stampede
summary: "Entender por que invalidar é difícil, a ordem segura entre banco e cache e as defesas contra o stampede"
level: intermediario
order: 27
section: tecnologias-chave
group: "Cache"
---

## Objetivos de aprendizagem

- [ ] Escolher entre expirar, invalidar e atualizar o cache
- [ ] Defender-se do cache stampede

*Retomando o cenário da unidade: a página de produto de uma loja online, com 200 mil visitas por minuto no pico e poucos produtos concentrando o tráfego.*

## O problema da invalidação

Há uma frase famosa na área: as duas coisas difíceis em computação são invalidar cache e dar nome às coisas. O motivo é simples: um cache é uma cópia, e toda cópia pode ficar diferente do original.

**Invalidar** é descartar ou atualizar uma entrada quando o dado original muda. Há três abordagens, que podem ser combinadas:

- **Expirar por TTL**: simples e sem coordenação, mas o dado fica velho até o prazo acabar. Serve quando a defasagem é aceitável (descrição do produto, 5 minutos).
- **Invalidar na escrita**: quando o preço muda, a aplicação apaga `produto:42` do cache. A próxima leitura causa um miss e recarrega o valor novo. É preciso lembrar de fazer isso em **todos** os caminhos que alteram o dado.
- **Atualizar na escrita**: em vez de apagar, a aplicação grava o valor novo no cache. É mais rápido na leitura seguinte, mas abre uma condição de corrida: duas escritas quase simultâneas podem deixar no cache o valor mais antigo.

Em geral, **apagar é mais seguro que atualizar**, porque apagar não pode deixar um valor errado para trás.

### Cache stampede: quando a entrada expira de uma vez

Imagine que o produto mais vendido da liquidação expira. No mesmo instante, mil visitantes pedem esse produto, todos recebem miss, e mil consultas idênticas vão ao banco ao mesmo tempo. O banco, que o cache deveria proteger, cai. Isso é o *stampede* (ou *thundering herd*).

Três defesas comuns:

- **Lock de recarga**: só o primeiro pedido vai ao banco e os demais esperam o resultado dele.
- **TTL com variação aleatória** (*jitter*): em vez de 60 s para todos, usar 60 s mais um valor aleatório entre 0 e 10 s, para que as entradas não expirem juntas.
- **Renovar antes de expirar**: um processo recarrega as entradas mais quentes antes do prazo.

## Lembre

- **Apagar** é mais seguro que atualizar.
- Grave no **banco primeiro**, depois invalide o cache.
- Stampede: **lock de recarga**, **jitter** no TTL ou renovar antes de expirar.
