"use client";

import { useState } from "react";

type Pick = "http" | "fila" | "kafka";

const SCENES = [
  {
    id: "email",
    title: "E-mail de “pedido confirmado”",
    body: "O checkout já gravou o pedido 99. Precisa avisar o serviço de e-mail. O cliente não está olhando a tela esperando o SMTP.",
    best: "kafka" as Pick,
    notes: {
      http: "O checkout fica acoplado à disponibilidade do SMTP. Se o mailer cair, o POST /pedidos falha — ou você finge que enviou.",
      fila: "Funciona para um trabalhador só. Se amanhã analytics também quiser o mesmo fato, a mensagem já saiu da fila.",
      kafka: "Fato consumado: PedidoCriado. E-mail, analytics e fiscal leem o mesmo log, cada um no seu ritmo.",
    },
  },
  {
    id: "frete",
    title: "“Quanto fica o frete agora?”",
    body: "A pessoa está no checkout, digitou o CEP, espera o número na cara. Sem esse número ela não clica em pagar.",
    best: "http" as Pick,
    notes: {
      http: "Consulta na cara do usuário. GET síncrono no serviço de frete (com timeout). Kafka aqui é teatro: o clique não espera um consumidor.",
      fila: "Publicar e esperar a resposta voltar por outro canal vira request/response mal disfarçado. Pior de debugar.",
      kafka: "Tópico não é RPC. O usuário não vai ficar 800 ms olhando um spinner enquanto um grupo consome o CEP.",
    },
  },
  {
    id: "loja",
    title: "Time de três pessoas, 20 pedidos por dia",
    body: "Loja pequena. Ninguém precisa reprocessar o passado. Um worker manda o e-mail e pronto.",
    best: "fila" as Pick,
    notes: {
      http: "Dá, se o mailer quase nunca cai. No primeiro timeout no meio do POST você começa a inventar retry na API.",
      fila: "SQS/Rabbit resolvem “faz isso depois” sem cluster, schema registry nem consumer group. O preço do Kafka não se paga.",
      kafka: "Você comprou log distribuído, retenção, partição e operação. O problema era uma fila de 20 mensagens.",
    },
  },
  {
    id: "dois",
    title: "Faturamento e analytics no mesmo pedido",
    body: "Os dois times precisam do PedidoPago. Faturamento não pode apagar a linha. Analytics atrasa de propósito e relê a semana.",
    best: "kafka" as Pick,
    notes: {
      http: "Checkout chamando os dois. Se analytics estiver lento, o pagamento do cliente espera. Se um dos POSTs falhar, os dois mundos divergem.",
      fila: "Uma fila, um trabalhador. O segundo time ou compete pela mensagem ou você duplica a publicação — e a fila clássica não é log.",
      kafka: "Dois group.id, dois committed offsets. A mensagem continua. Replay é política de retenção, não favor do produtor.",
    },
  },
] as const;

const LABEL: Record<Pick, string> = {
  http: "HTTP / gRPC",
  fila: "Fila clássica",
  kafka: "Kafka",
};

export function WhenKafka() {
  const [picks, setPicks] = useState<Record<string, Pick>>({});

  return (
    <div className="explorer" aria-label="Quando usar Kafka">
      <p className="explorer-lead">
        Quatro cenas. Marca o canal. O certo não é “sempre Kafka”.
      </p>
      <div className="when-list">
        {SCENES.map((scene) => {
          const pick = picks[scene.id];
          return (
            <article key={scene.id} className="when-card">
              <h4>{scene.title}</h4>
              <p>{scene.body}</p>
              <div className="when-opts">
                {(Object.keys(LABEL) as Pick[]).map((opt) => (
                  <button
                    type="button"
                    key={opt}
                    className={pick === opt ? "on" : undefined}
                    onClick={() =>
                      setPicks((prev) => ({ ...prev, [scene.id]: opt }))
                    }
                  >
                    {LABEL[opt]}
                  </button>
                ))}
              </div>
              {pick ? (
                <div
                  className={`choice-why ${pick === scene.best ? "bom" : pick === "fila" && scene.best !== "fila" ? "meio" : "ruim"}`}
                >
                  <strong>
                    {pick === scene.best
                      ? "Essa segura."
                      : pick === "fila" && scene.best === "kafka"
                        ? "Quase — falta o log."
                        : "Por aqui quebra."}
                  </strong>{" "}
                  {scene.notes[pick]}
                </div>
              ) : null}
            </article>
          );
        })}
      </div>
    </div>
  );
}
