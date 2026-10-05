---
slug: cap-vocabulario
categorySlug: system-design
title: "Teorema CAP: o vocabulário"
navTitle: Vocabulário do CAP
summary: "Definir sistema distribuído, réplica, partição de rede, consistência, disponibilidade e tolerância a partição"
level: intermediario
order: 38
section: tecnologias-chave
group: "Teorema CAP"
---

## Objetivos de aprendizagem

- [ ] Definir os cinco termos do CAP
- [ ] Distinguir partição de rede de falha de máquina

## Cenário de referência da unidade

Vamos usar um serviço de **saldo de conta** replicado em dois data centers, um em São Paulo e outro em Frankfurt. Cada um guarda uma cópia do saldo, e os dois conversam por uma rede entre continentes. O saldo da Ana é R$ 1.000. O que acontece quando a rede entre os dois data centers **para de funcionar**, enquanto a Ana ainda tenta usar a conta?

## Fundamentos: o vocabulário básico, peça por peça

### Sistema distribuído e réplica

Um **sistema distribuído** é um conjunto de computadores que cooperam para parecer um só. Uma **réplica** é uma cópia dos dados mantida em outra máquina, para tolerar falhas e atender mais gente. As duas cópias do saldo da Ana são réplicas.

### Partição de rede

Uma **partição de rede** acontece quando a comunicação entre grupos de máquinas é interrompida (um cabo cortado, um roteador defeituoso, uma sobrecarga), embora **as máquinas continuem funcionando**. Os dois data centers estão vivos, mas não conseguem se falar. Cada um não sabe se o outro caiu ou só ficou incomunicável.

### Consistência

No CAP, **consistência** significa: toda leitura recebe **o dado mais recente já escrito**, ou um erro. É a ilusão de que existe uma única cópia dos dados. Se a Ana depositou R$ 100 em São Paulo, uma leitura logo depois em Frankfurt deve mostrar 1.100, e não 1.000.

### Disponibilidade

**Disponibilidade** significa: toda requisição a uma máquina saudável recebe uma **resposta**, e não um erro, mesmo que não seja o dado mais recente.

### Tolerância a partição

**Tolerância a partição** significa: o sistema continua operando mesmo quando a rede entre as máquinas falha.

## Lembre

- Numa **partição**, as máquinas estão vivas mas **não se falam**.
- **Consistência**: toda leitura vê a escrita mais recente, ou erro.
- **Disponibilidade**: toda requisição recebe resposta, mesmo que velha.
