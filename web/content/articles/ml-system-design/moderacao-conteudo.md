---
slug: moderacao-conteudo
categorySlug: ml-system-design
title: "Exercício: Moderação de Conteúdo"
navTitle: Moderação de Conteúdo
summary: Projete um sistema que identifica automaticamente conteúdo potencialmente prejudicial (discurso de ódio, violência, spam) postado por usuários em uma plataforma.
level: avancado
order: 14
section: question-breakdowns
---

## Enunciado

Projete um sistema que identifica automaticamente conteúdo potencialmente prejudicial (discurso de ódio, violência, spam) postado por usuários em uma plataforma.

## Perguntas orientadoras

- O sistema precisa lidar com múltiplas modalidades de conteúdo (texto, imagem, vídeo) simultaneamente?
- Qual o papel de revisores humanos no fluxo — todo conteúdo sinalizado é removido automaticamente, ou passa por revisão antes?
- Como o sistema deve lidar com diferentes idiomas ou contextos culturais?

## Pontos centrais a explorar

- **Dados: Fontes, Rótulos e Qualidade** (Módulo 1): denúncias de usuários e anotação humana especializada como fontes complementares de rótulo, cada uma com seu próprio viés.
- **Desbalanceamento de Classes** (Módulo 2): conteúdo prejudicial tipicamente representa uma fração pequena do total postado.
- Combinação de um modelo automático com revisão humana para casos de confiança intermediária, evitando tanto remoção automática excessiva quanto sobrecarga da equipe de revisão.
