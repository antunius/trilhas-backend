---
slug: zookeeper-znodes-watches
categorySlug: system-design
title: "ZooKeeper: znodes e watches"
navTitle: Znodes e watches
summary: "Entender o namespace hierárquico, os tipos de znode e as notificações por watch"
level: intermediario
order: 93
section: deep-dives-tecnologias
group: "ZooKeeper"
---

## Objetivos de aprendizagem

- [ ] Diferenciar znodes persistente, efêmero e sequencial
- [ ] Explicar o que é um watch e por que ele evita polling

## Cenário de referência da unidade

Vamos usar um cluster de processamento de dados com 5 máquinas trabalhadoras idênticas, onde exatamente uma delas precisa atuar como coordenadora (decidindo qual worker processa qual lote de trabalho) a qualquer momento — e o sistema precisa se recuperar automaticamente se essa coordenadora cair.

## Fundamentos: znodes, o namespace hierárquico

ZooKeeper organiza seus dados como um sistema de arquivos: um namespace hierárquico de nós chamados **znodes**, cada um identificado por um caminho (ex: `/coordenador`, `/workers/worker-1`), e cada um podendo guardar um pequeno pedaço de dado (tipicamente poucos KB, não um armazenamento de propósito geral).

Znodes vêm em variações que mudam completamente seu comportamento:

- **Persistente**: existe até ser explicitamente removido.
- **Efêmero**: existe apenas enquanto a sessão do cliente que o criou estiver ativa — se esse cliente desconectar (incluindo por uma falha, não só um encerramento normal), o znode é automaticamente removido pelo ZooKeeper.
- **Sequencial**: ao criar o znode, o ZooKeeper anexa automaticamente um número sequencial e crescente ao nome (ex: `worker-0000000001`, `worker-0000000002`), garantindo uma ordem total mesmo entre criações concorrentes.

Essas duas últimas variações, combinadas, são a base de praticamente todo padrão de coordenação construído sobre ZooKeeper.

### Watches: notificação sem polling

Um cliente pode registrar um **watch** sobre um znode específico, sendo notificado de forma assíncrona quando esse znode muda (é modificado ou removido) — sem precisar ficar perguntando repetidamente "isso já mudou?" (polling). Isso é o mecanismo de notificação em tempo real usado pelos padrões de coordenação a seguir.

### Uma árvore de exemplo

```
/                       (raiz)
├── eleicao             (persistente)
│   ├── n_0000000001    (efêmero + sequencial: worker A)
│   ├── n_0000000002    (efêmero + sequencial: worker B)
│   └── n_0000000003    (efêmero + sequencial: worker C)
└── config
    └── limite-lote     (persistente, valor: "500")
```

Se o worker B perder a conexão e sua sessão expirar, `/eleicao/n_0000000002` **desaparece sozinho**, e quem observava esse nó é avisado. É a base de toda a coordenação do ZooKeeper.

## Lembre

- **Persistente**: fica até ser removido. **Efêmero**: some com a sessão. **Sequencial**: ganha um número crescente.
- Efêmero + sequencial são a base dos padrões de coordenação.
- Um **watch** avisa de uma mudança sem polling.
