---
slug: numeros-para-saber
categorySlug: system-design
title: Números que Todo Engenheiro Deveria Saber
summary: Ter referências de ordem de grandeza para latências comuns
level: intermediario
order: 18
section: tecnologias-chave
---

## Objetivos de aprendizagem

- [ ] Ter referências de ordem de grandeza para latências comuns
- [ ] Usar esses números para embasar decisões durante estimativas de capacidade

## Conteúdo

Ter uma noção aproximada da ordem de grandeza de operações comuns ajuda a raciocinar rapidamente sobre gargalos, sem precisar memorizar números exatos — o que importa é a diferença de escala entre eles, não a precisão milimétrica:

![Ordens de magnitude de latência](/diagrams/sd-numeros-para-saber.svg)

- Acesso à memória (RAM) é ordens de magnitude mais rápido que acesso a disco.
- Acesso a um SSD é significativamente mais rápido que a um disco rígido tradicional (HDD).
- Uma chamada de rede dentro do mesmo data center é rápida, mas ainda assim muito mais lenta que acesso à memória local.
- Uma chamada de rede entre regiões geográficas diferentes (ex: entre continentes) é a operação mais lenta da lista, podendo levar dezenas a centenas de milissegundos.

O ponto prático desses números não é decorá-los com precisão, mas internalizar a hierarquia: memória < disco local < rede local < rede entre regiões. Essa hierarquia justifica decisões recorrentes, como preferir cache em memória a uma nova consulta ao banco, ou evitar múltiplas chamadas sequenciais entre regiões diferentes dentro do caminho crítico de uma requisição.

## Exemplo aplicado

Se um deep dive revela que uma requisição faz três chamadas sequenciais entre regiões geográficas diferentes antes de responder ao usuário, isso por si só já é um sinal de possível gargalo de latência — mesmo sem saber os números exatos, a hierarquia (rede entre regiões é a operação mais lenta) já aponta para esse ponto como prioridade de otimização.

## Erros comuns

- Tentar decorar valores exatos de latência em vez de internalizar a hierarquia relativa entre eles.
- Ignorar completamente latência de rede entre regiões ao desenhar sistemas geograficamente distribuídos.
