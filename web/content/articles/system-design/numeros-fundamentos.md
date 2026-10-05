---
slug: numeros-fundamentos
categorySlug: system-design
title: "Números: ordem de grandeza, latência, vazão e unidades"
navTitle: Fundamentos dos números
summary: "Entender ordem de grandeza, latência, vazão e as unidades de tempo e de dados"
level: intermediario
order: 46
section: tecnologias-chave
group: "Números para saber"
---

## Objetivos de aprendizagem

- [ ] Estimar por ordem de grandeza
- [ ] Converter entre unidades de tempo e de dados

## Cenário de referência da unidade

Vamos usar um serviço de **encurtador de URLs**. Ele recebe 100 milhões de links novos por mês, e cada link criado é lido em média 100 vezes. Precisamos descobrir, só com contas de cabeça, quantas requisições por segundo ele atende, quanto armazenamento ocupa em 5 anos e se um único banco aguenta. Esses números guiam o desenho.

## Fundamentos: o vocabulário básico, peça por peça

### Ordem de grandeza

Estimar por **ordem de grandeza** significa acertar a potência de 10, não o número exato. Dizer que algo leva "uns 100 ms" em vez de "87 ms" já basta para decidir. O objetivo em entrevista não é a precisão, é perceber se o resultado é 1.000 ou 1.000.000, porque isso muda o desenho.

### Latência e vazão

**Latência** é quanto tempo uma operação leva do início ao fim (10 ms para uma consulta). **Vazão** (*throughput*) é quantas operações cabem por unidade de tempo (5.000 consultas por segundo). São coisas diferentes: uma estrada pode ter vazão enorme (muitas pistas) e latência alta (é longa).

### Unidades de tempo

| Unidade | Valor | Exemplo |
|---|---|---|
| Nanossegundo (ns) | 10⁻⁹ s | Acesso à memória cache da CPU |
| Microssegundo (µs) | 10⁻⁶ s = 1.000 ns | Leitura de SSD |
| Milissegundo (ms) | 10⁻³ s = 1.000 µs | Rede no mesmo data center |
| Segundo (s) | 1.000 ms | Transferência entre continentes de um arquivo |

### Unidades de dados

KB = mil bytes (10³), MB = milhão (10⁶), GB = bilhão (10⁹), TB = trilhão (10¹²), PB = quatrilhão (10¹⁵). Em estimativas, tratar 1 KB como 1.000 bytes e não 1.024 simplifica as contas sem estragar a ordem de grandeza.

## Lembre

- Acertar a **potência de 10** basta para decidir.
- **Latência** é o tempo de uma operação; **vazão** é quantas cabem por tempo.
- Trate 1 KB como 1.000 bytes para simplificar as contas.
