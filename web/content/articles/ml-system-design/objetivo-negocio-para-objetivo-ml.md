---
slug: objetivo-negocio-para-objetivo-ml
categorySlug: ml-system-design
title: Do Objetivo de Negócio ao Objetivo de ML
summary: Traduzir um objetivo de negócio vago em uma métrica de ML bem definida
level: intermediario
order: 2
section: framework
---

## Objetivos de aprendizagem

- [ ] Traduzir um objetivo de negócio vago em uma métrica de ML bem definida
- [ ] Reconhecer quando um objetivo de ML mal definido cria incentivos perversos

## Conteúdo

### Por que essa tradução é a primeira etapa

Um objetivo de negócio ("aumentar o engajamento na plataforma") não é, por si só, algo que um modelo de ML pode otimizar diretamente — ele precisa ser traduzido em uma métrica ou tarefa concreta (ex: "prever a probabilidade de um usuário interagir com um item específico"). Essa tradução é uma das habilidades mais importantes avaliadas nessa entrevista, e frequentemente subestimada por candidatos que pulam direto para modelagem.

### O risco de objetivos mal definidos

Um objetivo de ML mal escolhido pode criar incentivos perversos que prejudicam o objetivo de negócio real. Por exemplo, otimizar puramente por "tempo gasto na plataforma" pode incentivar um modelo a promover conteúdo viciante, mas prejudicial à satisfação de longo prazo do usuário — um trade-off que vale mencionar explicitamente ao propor um objetivo.

### Como conduzir essa etapa na entrevista

Uma boa prática é propor o objetivo de negócio percebido, verificar com o entrevistador se está correto, e então propor explicitamente a métrica de ML que se aproxima desse objetivo, reconhecendo os trade-offs dessa aproximação (já que raramente a métrica de ML captura o objetivo de negócio de forma perfeita).

## Exemplo aplicado

Para um sistema de detecção de bots em uma rede social, o objetivo de negócio é proteger a integridade da plataforma, mas a métrica de ML mais direta pode ser "prever a probabilidade de uma conta ser um bot" — reconhecendo explicitamente que otimizar agressivamente essa métrica pode aumentar falsos positivos, penalizando usuários legítimos, um trade-off que vale nomear ao entrevistador.

## Erros comuns

- Pular direto para a escolha de modelo, sem antes traduzir claramente o objetivo de negócio em uma métrica de ML.
- Escolher uma métrica que otimiza um proxy do objetivo real sem reconhecer os riscos dessa aproximação.
