#!/usr/bin/env node
/**
 * Generate remaining System Design lesson SVGs and embed them in article MD.
 * Run from web/: node scripts/generate-sd-diagrams.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WEB = path.resolve(__dirname, "..");
const DIAG = path.join(WEB, "public/diagrams");
const ART = path.join(WEB, "content/articles/system-design");

function svgShell(id, viewBox, title, body) {
  return `<svg viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg" font-family="Helvetica, Arial, sans-serif" style="background:transparent">
  <style>
    .box { fill: #141a22; stroke: #3d4a5c; stroke-width: 2; rx: 6; }
    .accent { fill: #1e2438; stroke: #818cf8; stroke-width: 1.6; rx: 6; }
    .ok { fill: #14241f; stroke: #34d399; stroke-width: 1.6; rx: 6; }
    .warn { fill: #2a2114; stroke: #fbbf24; stroke-width: 1.6; rx: 6; }
    .label { font-size: 12.5px; fill: #e8eaed; }
    .small { font-size: 11px; fill: #9aa3b2; }
    .title { font-size: 14.5px; font-weight: 600; fill: #e8eaed; }
    .arrow { stroke: #8b95a5; stroke-width: 1.6; fill: none; marker-end: url(#m-${id}); }
  </style>
  <defs>
    <marker id="m-${id}" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
      <path d="M0,0 L7,3.5 L0,7 Z" fill="#8b95a5"/>
    </marker>
  </defs>
  <text x="410" y="26" text-anchor="middle" class="title">${escapeXml(title)}</text>
${body}
</svg>
`;
}

function escapeXml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function flowBoxes(id, title, nodes, edges) {
  // nodes: [{id,x,y,w,h,label,sub?,cls?}]
  // edges: [{from,to,label?}] as indices or we use absolute paths
  const parts = [];
  for (const n of nodes) {
    const cls = n.cls || "box";
    parts.push(
      `  <rect x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" class="${cls}"/>`,
    );
    parts.push(
      `  <text x="${n.x + n.w / 2}" y="${n.y + (n.sub ? n.h / 2 - 4 : n.h / 2 + 5)}" text-anchor="middle" class="label" font-weight="600">${escapeXml(n.label)}</text>`,
    );
    if (n.sub) {
      parts.push(
        `  <text x="${n.x + n.w / 2}" y="${n.y + n.h / 2 + 16}" text-anchor="middle" class="small">${escapeXml(n.sub)}</text>`,
      );
    }
  }
  for (const e of edges) {
    parts.push(`  <path d="${e.d}" class="arrow"/>`);
    if (e.label) {
      parts.push(
        `  <text x="${e.lx}" y="${e.ly}" text-anchor="middle" class="small">${escapeXml(e.label)}</text>`,
      );
    }
  }
  return svgShell(id, "0 0 820 280", title, parts.join("\n"));
}

/** Simple horizontal 3–4 box pipeline */
function pipeline(id, title, labels, note) {
  const n = labels.length;
  const gap = 24;
  const w = 140;
  const start = (820 - (n * w + (n - 1) * gap)) / 2;
  const y = 100;
  const h = 64;
  const nodes = labels.map((lab, i) => {
    const [label, sub] = Array.isArray(lab) ? lab : [lab, null];
    return {
      x: start + i * (w + gap),
      y,
      w,
      h,
      label,
      sub,
      cls: i === 0 ? "box" : i === n - 1 ? "ok" : "accent",
    };
  });
  const edges = [];
  for (let i = 0; i < n - 1; i++) {
    const a = nodes[i];
    const b = nodes[i + 1];
    edges.push({
      d: `M${a.x + a.w},${a.y + h / 2} L${b.x},${b.y + h / 2}`,
    });
  }
  let body = "";
  for (const n of nodes) {
    body += `  <rect x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" class="${n.cls}"/>\n`;
    body += `  <text x="${n.x + n.w / 2}" y="${n.y + (n.sub ? 28 : 38)}" text-anchor="middle" class="label" font-weight="600">${escapeXml(n.label)}</text>\n`;
    if (n.sub)
      body += `  <text x="${n.x + n.w / 2}" y="${n.y + 48}" text-anchor="middle" class="small">${escapeXml(n.sub)}</text>\n`;
  }
  for (const e of edges) body += `  <path d="${e.d}" class="arrow"/>\n`;
  if (note)
    body += `  <text x="410" y="220" text-anchor="middle" class="small">${escapeXml(note)}</text>\n`;
  return svgShell(id, "0 0 820 250", title, body);
}

const DIAGRAMS = {
  // --- Framework ---
  orientacao: {
    file: "sd-orientacao.svg",
    alt: "Entrevista de system design: requisitos → design → trade-offs",
    after: "## Conteúdo",
    svg: pipeline(
      "ori",
      "O que a entrevista avalia (não é decorar arquiteturas)",
      [
        ["Requisitos", "o quê / quanto"],
        ["Design", "como"],
        ["Trade-offs", "por quê"],
      ],
      "Diagramas prontos ajudam pouco se você não explica as escolhas",
    ),
  },
  "levantamento-requisitos": {
    file: "sd-levantamento-requisitos.svg",
    alt: "Funcionais vs não-funcionais",
    after: "## Conteúdo",
    svg: (() => {
      const body = `
  <rect x="60" y="70" width="300" height="160" class="accent"/>
  <text x="210" y="100" text-anchor="middle" class="label" font-weight="600">Funcionais</text>
  <text x="210" y="130" text-anchor="middle" class="small">O que o sistema faz</text>
  <text x="210" y="155" text-anchor="middle" class="small">• criar conta</text>
  <text x="210" y="175" text-anchor="middle" class="small">• postar feed</text>
  <text x="210" y="195" text-anchor="middle" class="small">• pagar pedido</text>

  <rect x="460" y="70" width="300" height="160" class="warn"/>
  <text x="610" y="100" text-anchor="middle" class="label" font-weight="600">Não-funcionais</text>
  <text x="610" y="130" text-anchor="middle" class="small">Como ele se comporta</text>
  <text x="610" y="155" text-anchor="middle" class="small">• latência / QPS</text>
  <text x="610" y="175" text-anchor="middle" class="small">• disponibilidade</text>
  <text x="610" y="195" text-anchor="middle" class="small">• consistência</text>`;
      return svgShell(
        "req",
        "0 0 820 260",
        "Comece separando o quê (funcional) do quanto/como (NFR)",
        body,
      );
    })(),
  },
  "estimativas-capacidade": {
    file: "sd-estimativas-capacidade.svg",
    alt: "Estimativas: usuários → QPS → storage",
    after: "## Conteúdo",
    svg: pipeline(
      "est",
      "Estimativas: de usuários até QPS e storage",
      [
        ["Usuários", "DAU"],
        ["Ações/dia", "posts, reads"],
        ["QPS", "pico ≈ 2–5×"],
        ["Storage", "bytes × retenção"],
      ],
      "Ordem de magnitude importa mais que precisão falsa",
    ),
  },
  "contrato-api": {
    file: "sd-contrato-api.svg",
    alt: "Contrato de API: endpoints e recursos",
    after: "## Conteúdo",
    svg: (() => {
      const body = `
  <rect x="80" y="80" width="280" height="140" class="box"/>
  <text x="220" y="110" text-anchor="middle" class="label" font-weight="600">Cliente</text>
  <text x="220" y="140" text-anchor="middle" class="small">POST /urls</text>
  <text x="220" y="160" text-anchor="middle" class="small">GET /{code}</text>
  <text x="220" y="180" text-anchor="middle" class="small">GET /urls/{id}/stats</text>

  <path d="M360,150 L460,150" class="arrow"/>
  <text x="410" y="138" text-anchor="middle" class="small">HTTP</text>

  <rect x="460" y="80" width="280" height="140" class="accent"/>
  <text x="600" y="110" text-anchor="middle" class="label" font-weight="600">API</text>
  <text x="600" y="145" text-anchor="middle" class="small">recursos + status</text>
  <text x="600" y="165" text-anchor="middle" class="small">erros tipados</text>
  <text x="600" y="185" text-anchor="middle" class="small">paginação / auth</text>`;
      return svgShell(
        "api",
        "0 0 820 260",
        "Contrato de API: o que o cliente pode chamar e o que recebe",
        body,
      );
    })(),
  },
  "modelagem-dados": {
    file: "sd-modelagem-dados.svg",
    alt: "Entidades e relacionamentos",
    after: "## Conteúdo",
    svg: (() => {
      const body = `
  <rect x="80" y="90" width="160" height="80" class="accent"/>
  <text x="160" y="125" text-anchor="middle" class="label" font-weight="600">User</text>
  <text x="160" y="145" text-anchor="middle" class="small">id, name</text>

  <rect x="330" y="90" width="160" height="80" class="ok"/>
  <text x="410" y="125" text-anchor="middle" class="label" font-weight="600">Post</text>
  <text x="410" y="145" text-anchor="middle" class="small">id, userId, text</text>

  <rect x="580" y="90" width="160" height="80" class="warn"/>
  <text x="660" y="125" text-anchor="middle" class="label" font-weight="600">Follow</text>
  <text x="660" y="145" text-anchor="middle" class="small">from → to</text>

  <path d="M240,130 L330,130" class="arrow"/>
  <text x="285" y="118" text-anchor="middle" class="small">1:N</text>
  <path d="M490,130 L580,130" class="arrow"/>
  <text x="535" y="118" text-anchor="middle" class="small">N:N</text>

  <text x="410" y="230" text-anchor="middle" class="small">Comece pelas entidades e chaves de acesso — depois escolha o banco</text>`;
      return svgShell(
        "mod",
        "0 0 820 260",
        "Modelagem: entidades, chaves e padrões de acesso",
        body,
      );
    })(),
  },
  "desenho-alto-nivel": {
    file: "sd-desenho-alto-nivel.svg",
    alt: "Diagrama de alto nível: cliente → API → serviços → dados",
    after: "## Conteúdo",
    svg: pipeline(
      "hl",
      "Desenho de alto nível: caixas e setas que atendem aos requisitos",
      [
        ["Clientes", "web / app"],
        ["API / LB", "entrada"],
        ["Serviços", "domínio"],
        ["Dados", "DB / cache / fila"],
      ],
      "Cada caixa deve existir por um requisito — não por moda",
    ),
  },
  "deep-dives": {
    file: "sd-deep-dives.svg",
    alt: "Deep dive: aprofundar o ponto crítico",
    after: "## Conteúdo",
    svg: (() => {
      const body = `
  <rect x="100" y="70" width="620" height="50" class="box"/>
  <text x="410" y="100" text-anchor="middle" class="label">Visão de alto nível (já desenhada)</text>

  <path d="M410,120 L410,155" class="arrow"/>

  <rect x="250" y="160" width="320" height="70" class="warn"/>
  <text x="410" y="190" text-anchor="middle" class="label" font-weight="600">Deep dive</text>
  <text x="410" y="210" text-anchor="middle" class="small">escala · consistência · falha · latência</text>

  <text x="410" y="270" text-anchor="middle" class="small">Escolha 1–2 pontos críticos — não aprofunde tudo</text>`;
      return svgShell(
        "dd",
        "0 0 820 290",
        "Deep dive: zoom no gargalo ou no risco do design",
        body,
      );
    })(),
  },
  "erros-comuns": {
    file: "sd-erros-comuns.svg",
    alt: "Erros comuns vs abordagem sólida",
    after: "## Conteúdo",
    svg: (() => {
      const body = `
  <rect x="50" y="70" width="340" height="160" class="warn"/>
  <text x="220" y="100" text-anchor="middle" class="label" font-weight="600">Evite</text>
  <text x="220" y="130" text-anchor="middle" class="small">• pular requisitos</text>
  <text x="220" y="150" text-anchor="middle" class="small">• over-engineering cedo</text>
  <text x="220" y="170" text-anchor="middle" class="small">• silêncio nos trade-offs</text>
  <text x="220" y="190" text-anchor="middle" class="small">• diagramas sem “por quê”</text>

  <rect x="430" y="70" width="340" height="160" class="ok"/>
  <text x="600" y="100" text-anchor="middle" class="label" font-weight="600">Prefira</text>
  <text x="600" y="130" text-anchor="middle" class="small">• clarificar NFRs</text>
  <text x="600" y="150" text-anchor="middle" class="small">• começar simples</text>
  <text x="600" y="170" text-anchor="middle" class="small">• verbalizar escolhas</text>
  <text x="600" y="190" text-anchor="middle" class="small">• deep dive onde dói</text>`;
      return svgShell(
        "err",
        "0 0 820 260",
        "Erros comuns na entrevista vs hábitos que pontuam",
        body,
      );
    })(),
  },

  // --- Tecnologias ---
  "fundamentos-rede": {
    file: "sd-fundamentos-rede.svg",
    alt: "DNS → Load Balancer → servidores",
    after: "## Conteúdo",
    svg: pipeline(
      "net",
      "Caminho típico da requisição na borda",
      [
        ["DNS", "nome → IP"],
        ["LB / Proxy", "distribui"],
        ["App servers", "instâncias"],
      ],
      "DNS e LB são peças de entrevista quase sempre",
    ),
  },
  "design-api": {
    file: "sd-design-api.svg",
    alt: "REST vs GraphQL vs RPC",
    after: "## Conteúdo",
    svg: (() => {
      const body = `
  <rect x="40" y="70" width="230" height="150" class="accent"/>
  <text x="155" y="105" text-anchor="middle" class="label" font-weight="600">REST</text>
  <text x="155" y="135" text-anchor="middle" class="small">recursos + HTTP</text>
  <text x="155" y="155" text-anchor="middle" class="small">cacheável, simples</text>
  <text x="155" y="175" text-anchor="middle" class="small">over/under-fetch</text>

  <rect x="295" y="70" width="230" height="150" class="ok"/>
  <text x="410" y="105" text-anchor="middle" class="label" font-weight="600">GraphQL</text>
  <text x="410" y="135" text-anchor="middle" class="small">cliente pede campos</text>
  <text x="410" y="155" text-anchor="middle" class="small">menos round-trips</text>
  <text x="410" y="175" text-anchor="middle" class="small">cache mais difícil</text>

  <rect x="550" y="70" width="230" height="150" class="warn"/>
  <text x="665" y="105" text-anchor="middle" class="label" font-weight="600">RPC</text>
  <text x="665" y="135" text-anchor="middle" class="small">ações tipadas</text>
  <text x="665" y="155" text-anchor="middle" class="small">bom interno</text>
  <text x="665" y="175" text-anchor="middle" class="small">menos “webby”</text>`;
      return svgShell(
        "dap",
        "0 0 820 250",
        "Escolha o estilo de API pelo padrão de acesso",
        body,
      );
    })(),
  },
  "bancos-dados": {
    file: "sd-bancos-dados.svg",
    alt: "Relacional vs documento vs chave-valor",
    after: "## Conteúdo",
    svg: (() => {
      const body = `
  <rect x="40" y="70" width="230" height="150" class="accent"/>
  <text x="155" y="105" text-anchor="middle" class="label" font-weight="600">Relacional</text>
  <text x="155" y="135" text-anchor="middle" class="small">joins, ACID</text>
  <text x="155" y="155" text-anchor="middle" class="small">schema rígido</text>
  <text x="155" y="175" text-anchor="middle" class="small">transações</text>

  <rect x="295" y="70" width="230" height="150" class="ok"/>
  <text x="410" y="105" text-anchor="middle" class="label" font-weight="600">Documento</text>
  <text x="410" y="135" text-anchor="middle" class="small">JSON flexível</text>
  <text x="410" y="155" text-anchor="middle" class="small">agregados</text>
  <text x="410" y="175" text-anchor="middle" class="small">menos joins</text>

  <rect x="550" y="70" width="230" height="150" class="warn"/>
  <text x="665" y="105" text-anchor="middle" class="label" font-weight="600">Chave-valor</text>
  <text x="665" y="135" text-anchor="middle" class="small">get/put rápido</text>
  <text x="665" y="155" text-anchor="middle" class="small">cache, sessões</text>
  <text x="665" y="175" text-anchor="middle" class="small">sem query rica</text>`;
      return svgShell(
        "db",
        "0 0 820 250",
        "Tipo de banco segue o padrão de acesso",
        body,
      );
    })(),
  },
  indexacao: {
    file: "sd-indexacao.svg",
    alt: "Índice acelera lookup, desacelera escrita",
    after: "## Conteúdo",
    svg: (() => {
      const body = `
  <rect x="60" y="80" width="200" height="120" class="box"/>
  <text x="160" y="120" text-anchor="middle" class="label" font-weight="600">Tabela</text>
  <text x="160" y="145" text-anchor="middle" class="small">scan O(n)</text>

  <path d="M260,140 L340,140" class="arrow"/>

  <rect x="340" y="80" width="200" height="120" class="accent"/>
  <text x="440" y="120" text-anchor="middle" class="label" font-weight="600">Índice</text>
  <text x="440" y="145" text-anchor="middle" class="small">lookup O(log n)</text>

  <path d="M540,140 L620,140" class="arrow"/>

  <rect x="620" y="80" width="140" height="120" class="ok"/>
  <text x="690" y="130" text-anchor="middle" class="label" font-weight="600">Linha</text>
  <text x="690" y="150" text-anchor="middle" class="small">rápido</text>

  <text x="410" y="240" text-anchor="middle" class="small">Índice custa espaço e deixa writes mais caros</text>`;
      return svgShell(
        "idx",
        "0 0 820 270",
        "Índice: atalho para encontrar linhas sem varrer a tabela",
        body,
      );
    })(),
  },
  "consistent-hashing": {
    file: "sd-consistent-hashing.svg",
    alt: "Anel de consistent hashing",
    after: "## Conteúdo",
    svg: (() => {
      const body = `
  <circle cx="410" cy="150" r="90" fill="none" stroke="#2b2b3d" stroke-width="2"/>
  <circle cx="410" cy="60" r="14" class="accent"/>
  <text x="410" y="65" text-anchor="middle" class="small" font-weight="600">N1</text>
  <circle cx="500" cy="180" r="14" class="accent"/>
  <text x="500" y="185" text-anchor="middle" class="small" font-weight="600">N2</text>
  <circle cx="320" cy="180" r="14" class="accent"/>
  <text x="320" y="185" text-anchor="middle" class="small" font-weight="600">N3</text>
  <circle cx="450" cy="100" r="8" fill="#b45309"/>
  <text x="470" y="95" class="small">key</text>
  <text x="410" y="260" text-anchor="middle" class="small">Ao adicionar nó, só uma fatia do anel se move — não tudo</text>`;
      return svgShell(
        "ch",
        "0 0 820 290",
        "Consistent hashing: chave no anel → próximo nó",
        body,
      );
    })(),
  },
  "teorema-cap": {
    file: "sd-teorema-cap.svg",
    alt: "CAP: sob partição escolha C ou A",
    after: "## Conteúdo",
    svg: (() => {
      const body = `
  <rect x="80" y="80" width="200" height="100" class="accent"/>
  <text x="180" y="125" text-anchor="middle" class="label" font-weight="600">Consistency</text>
  <text x="180" y="150" text-anchor="middle" class="small">mesma visão</text>

  <rect x="310" y="80" width="200" height="100" class="ok"/>
  <text x="410" y="125" text-anchor="middle" class="label" font-weight="600">Availability</text>
  <text x="410" y="150" text-anchor="middle" class="small">sempre responde</text>

  <rect x="540" y="80" width="200" height="100" class="warn"/>
  <text x="640" y="125" text-anchor="middle" class="label" font-weight="600">Partition</text>
  <text x="640" y="150" text-anchor="middle" class="small">rede quebra</text>

  <text x="410" y="230" text-anchor="middle" class="small">Com partição: você escolhe C ou A — não os três ao mesmo tempo</text>`;
      return svgShell(
        "cap",
        "0 0 820 260",
        "Teorema CAP (na prática da entrevista)",
        body,
      );
    })(),
  },
  "filas-mensageria": {
    file: "sd-filas-mensageria.svg",
    alt: "Produtor → fila → consumidores",
    after: "## Conteúdo",
    svg: pipeline(
      "mq",
      "Fila desacopla produtor e consumidor",
      [
        ["Producer", "publica"],
        ["Fila / Log", "buffer"],
        ["Consumers", "processam"],
      ],
      "Absorve picos e permite retry / fan-out",
    ),
  },
  "numeros-para-saber": {
    file: "sd-numeros-para-saber.svg",
    alt: "Ordens de magnitude de latência",
    after: "## Conteúdo",
    svg: (() => {
      const body = `
  <rect x="60" y="60" width="700" height="40" class="ok"/>
  <text x="80" y="85" class="label">Memória / L1–L3</text>
  <text x="720" y="85" text-anchor="end" class="small">ns – µs</text>

  <rect x="60" y="110" width="700" height="40" class="accent"/>
  <text x="80" y="135" class="label">SSD / rede datacenter</text>
  <text x="720" y="135" text-anchor="end" class="small">~0.1 – 1 ms</text>

  <rect x="60" y="160" width="700" height="40" class="warn"/>
  <text x="80" y="185" class="label">Disco HDD / WAN</text>
  <text x="720" y="185" text-anchor="end" class="small">ms – dezenas ms</text>

  <text x="410" y="240" text-anchor="middle" class="small">Use ordens de magnitude para validar se o design “fecha”</text>`;
      return svgShell(
        "num",
        "0 0 820 270",
        "Números que ancoram estimativas de latência",
        body,
      );
    })(),
  },

  // --- Conceitos ---
  escalabilidade: {
    file: "sd-escalabilidade.svg",
    alt: "Vertical vs horizontal",
    after: "## Conteúdo",
    svg: (() => {
      const body = `
  <rect x="80" y="70" width="280" height="150" class="warn"/>
  <text x="220" y="110" text-anchor="middle" class="label" font-weight="600">Vertical</text>
  <text x="220" y="140" text-anchor="middle" class="small">máquina maior</text>
  <text x="220" y="160" text-anchor="middle" class="small">simples · teto duro</text>
  <text x="220" y="185" text-anchor="middle" class="small">↑ CPU/RAM/disco</text>

  <rect x="460" y="70" width="280" height="150" class="ok"/>
  <text x="600" y="110" text-anchor="middle" class="label" font-weight="600">Horizontal</text>
  <text x="600" y="140" text-anchor="middle" class="small">mais máquinas</text>
  <text x="600" y="160" text-anchor="middle" class="small">escala · complexidade</text>
  <text x="600" y="185" text-anchor="middle" class="small">réplicas / shards</text>`;
      return svgShell(
        "esc",
        "0 0 820 250",
        "Escalar: mais potência na caixa vs mais caixas",
        body,
      );
    })(),
  },
  "disponibilidade-tolerancia-falhas": {
    file: "sd-disponibilidade.svg",
    alt: "Redundância e failover",
    after: "## Conteúdo",
    svg: (() => {
      const body = `
  <rect x="100" y="100" width="140" height="70" class="accent"/>
  <text x="170" y="140" text-anchor="middle" class="label" font-weight="600">Primary</text>

  <path d="M240,135 L320,135" class="arrow"/>
  <text x="280" y="120" text-anchor="middle" class="small">replica</text>

  <rect x="320" y="100" width="140" height="70" class="ok"/>
  <text x="390" y="140" text-anchor="middle" class="label" font-weight="600">Standby</text>

  <path d="M460,135 L540,135" class="arrow"/>
  <text x="500" y="120" text-anchor="middle" class="small">failover</text>

  <rect x="540" y="100" width="140" height="70" class="warn"/>
  <text x="610" y="140" text-anchor="middle" class="label" font-weight="600">Tráfego</text>

  <text x="410" y="220" text-anchor="middle" class="small">Disponibilidade ≈ redundância + detecção de falha + failover</text>`;
      return svgShell(
        "disp",
        "0 0 820 250",
        "Tolerância a falhas: não depender de uma única caixa",
        body,
      );
    })(),
  },
  consistencia: {
    file: "sd-consistencia.svg",
    alt: "Forte vs eventual",
    after: "## Conteúdo",
    svg: (() => {
      const body = `
  <rect x="80" y="70" width="300" height="140" class="accent"/>
  <text x="230" y="110" text-anchor="middle" class="label" font-weight="600">Forte</text>
  <text x="230" y="140" text-anchor="middle" class="small">toda leitura vê o write</text>
  <text x="230" y="165" text-anchor="middle" class="small">mais latência / menos disponibilidade</text>

  <rect x="440" y="70" width="300" height="140" class="ok"/>
  <text x="590" y="110" text-anchor="middle" class="label" font-weight="600">Eventual</text>
  <text x="590" y="140" text-anchor="middle" class="small">replicas convergem depois</text>
  <text x="590" y="165" text-anchor="middle" class="small">mais disponibilidade / stale ok?</text>`;
      return svgShell(
        "cons",
        "0 0 820 240",
        "Consistência: o quão “fresco” o dado precisa ser",
        body,
      );
    })(),
  },
  "trade-offs": {
    file: "sd-trade-offs.svg",
    alt: "Todo design é troca",
    after: "## Conteúdo",
    svg: (() => {
      const body = `
  <rect x="260" y="70" width="300" height="60" class="accent"/>
  <text x="410" y="105" text-anchor="middle" class="label" font-weight="600">Escolha de design</text>

  <path d="M340,130 L220,180" class="arrow"/>
  <path d="M480,130 L600,180" class="arrow"/>

  <rect x="100" y="185" width="240" height="55" class="ok"/>
  <text x="220" y="218" text-anchor="middle" class="label">Ganha: X</text>

  <rect x="480" y="185" width="240" height="55" class="warn"/>
  <text x="600" y="218" text-anchor="middle" class="label">Paga: Y</text>

  <text x="410" y="270" text-anchor="middle" class="small">Na entrevista: diga o que ganha e o que sacrifica</text>`;
      return svgShell(
        "to",
        "0 0 820 290",
        "Trade-off: não existe almoço grátis",
        body,
      );
    })(),
  },

  // --- Patterns ---
  "escalando-leituras": {
    file: "sd-escalando-leituras.svg",
    alt: "Réplicas e cache para leitura",
    after: "## Conteúdo",
    svg: (() => {
      const body = `
  <rect x="60" y="110" width="120" height="60" class="box"/>
  <text x="120" y="145" text-anchor="middle" class="label" font-weight="600">Writes</text>

  <path d="M180,140 L260,140" class="arrow"/>

  <rect x="260" y="110" width="140" height="60" class="warn"/>
  <text x="330" y="145" text-anchor="middle" class="label" font-weight="600">Primary</text>

  <path d="M400,125 L480,80" class="arrow"/>
  <path d="M400,155 L480,200" class="arrow"/>

  <rect x="485" y="50" width="140" height="55" class="ok"/>
  <text x="555" y="82" text-anchor="middle" class="label">Replica</text>
  <rect x="485" y="175" width="140" height="55" class="ok"/>
  <text x="555" y="207" text-anchor="middle" class="label">Replica</text>

  <rect x="665" y="110" width="100" height="60" class="accent"/>
  <text x="715" y="145" text-anchor="middle" class="label">Cache</text>

  <text x="410" y="260" text-anchor="middle" class="small">Leituras pesadas → réplicas + cache; writes ficam no primary</text>`;
      return svgShell(
        "erl",
        "0 0 820 280",
        "Padrão: escalar leituras",
        body,
      );
    })(),
  },
  "lidando-com-contencao": {
    file: "sd-contencao.svg",
    alt: "Locks e filas para contenda",
    after: "## Conteúdo",
    svg: (() => {
      const body = `
  <rect x="80" y="80" width="120" height="50" class="box"/>
  <text x="140" y="110" text-anchor="middle" class="label">Client A</text>
  <rect x="80" y="150" width="120" height="50" class="box"/>
  <text x="140" y="180" text-anchor="middle" class="label">Client B</text>

  <path d="M200,105 L300,140" class="arrow"/>
  <path d="M200,175 L300,150" class="arrow"/>

  <rect x="300" y="110" width="160" height="70" class="warn"/>
  <text x="380" y="140" text-anchor="middle" class="label" font-weight="600">Lock / Fila</text>
  <text x="380" y="160" text-anchor="middle" class="small">serializa</text>

  <path d="M460,145 L560,145" class="arrow"/>

  <rect x="560" y="110" width="160" height="70" class="ok"/>
  <text x="640" y="150" text-anchor="middle" class="label" font-weight="600">Recurso</text>

  <text x="410" y="240" text-anchor="middle" class="small">Hot key / assento / saldo: controle quem mexe e em que ordem</text>`;
      return svgShell(
        "ct",
        "0 0 820 270",
        "Padrão: lidar com contenção",
        body,
      );
    })(),
  },
  "tarefas-longa-duracao": {
    file: "sd-tarefas-longa-duracao.svg",
    alt: "Job assíncrono com status",
    after: "## Conteúdo",
    svg: pipeline(
      "tl",
      "Tarefa longa: aceita rápido, processa depois",
      [
        ["API", "202 + jobId"],
        ["Fila", "buffer"],
        ["Worker", "trabalha"],
        ["Status", "polling"],
      ],
      "Não prenda a request HTTP no trabalho pesado",
    ),
  },
  "atualizacoes-tempo-real": {
    file: "sd-atualizacoes-tempo-real.svg",
    alt: "WebSocket / SSE push",
    after: "## Conteúdo",
    svg: (() => {
      const body = `
  <rect x="80" y="110" width="140" height="60" class="ok"/>
  <text x="150" y="145" text-anchor="middle" class="label" font-weight="600">Servidor</text>

  <path d="M220,130 L340,90" class="arrow"/>
  <path d="M220,140 L340,140" class="arrow"/>
  <path d="M220,150 L340,190" class="arrow"/>
  <text x="280" y="78" text-anchor="middle" class="small">push</text>

  <rect x="345" y="60" width="120" height="50" class="accent"/>
  <text x="405" y="90" text-anchor="middle" class="label">Client 1</text>
  <rect x="345" y="115" width="120" height="50" class="accent"/>
  <text x="405" y="145" text-anchor="middle" class="label">Client 2</text>
  <rect x="345" y="170" width="120" height="50" class="accent"/>
  <text x="405" y="200" text-anchor="middle" class="label">Client 3</text>

  <text x="560" y="145" class="small">WS / SSE / long-poll</text>
  <text x="410" y="260" text-anchor="middle" class="small">Evento chega → fan-out para quem está conectado</text>`;
      return svgShell(
        "rt",
        "0 0 820 280",
        "Padrão: atualizações em tempo real",
        body,
      );
    })(),
  },
  proximidade: {
    file: "sd-proximidade.svg",
    alt: "Busca geoespacial por grade / geohash",
    after: "## Conteúdo",
    svg: (() => {
      const body = `
  <rect x="200" y="60" width="420" height="160" class="box" fill="#fafafa"/>
  <line x1="340" y1="60" x2="340" y2="220" stroke="#d1d5db"/>
  <line x1="480" y1="60" x2="480" y2="220" stroke="#d1d5db"/>
  <line x1="200" y1="113" x2="620" y2="113" stroke="#d1d5db"/>
  <line x1="200" y1="167" x2="620" y2="167" stroke="#d1d5db"/>
  <circle cx="400" cy="140" r="8" fill="#4f5bd5"/>
  <circle cx="400" cy="140" r="36" fill="none" stroke="#4f5bd5" stroke-dasharray="4 3"/>
  <text x="410" y="250" text-anchor="middle" class="small">Usuário + raio → células vizinhas (geohash / quadtree) → candidatos</text>`;
      return svgShell(
        "geo",
        "0 0 820 280",
        "Padrão: proximidade / busca geoespacial",
        body,
      );
    })(),
  },
  "blobs-grandes": {
    file: "sd-blobs-grandes.svg",
    alt: "Upload para object storage + CDN",
    after: "## Conteúdo",
    svg: pipeline(
      "blob",
      "Blobs grandes: não passe pelo app server no caminho quente",
      [
        ["Cliente", "upload"],
        ["Object store", "S3-like"],
        ["CDN", "entrega"],
      ],
      "Metadados no DB; bytes no object storage",
    ),
  },
  "processos-multi-etapas": {
    file: "sd-processos-multi-etapas.svg",
    alt: "Saga / etapas compensáveis",
    after: "## Conteúdo",
    svg: pipeline(
      "saga",
      "Processo multi-etapa: orquestrar e compensar falhas",
      [
        ["Reserva", "estoque"],
        ["Pagamento", "cobrar"],
        ["Envio", "fulfill"],
      ],
      "Se a etapa N falha → compensar 1..N-1 (saga)",
    ),
  },

  // --- Deep dive missing ---
  postgresql: {
    file: "sd-postgresql.svg",
    alt: "PostgreSQL: conexões, índices, WAL",
    after: "## Conteúdo",
    svg: (() => {
      const body = `
  <rect x="60" y="90" width="140" height="70" class="box"/>
  <text x="130" y="130" text-anchor="middle" class="label" font-weight="600">Apps</text>

  <path d="M200,125 L280,125" class="arrow"/>

  <rect x="280" y="80" width="180" height="90" class="accent"/>
  <text x="370" y="115" text-anchor="middle" class="label" font-weight="600">PostgreSQL</text>
  <text x="370" y="140" text-anchor="middle" class="small">MVCC · índices · WAL</text>

  <path d="M460,110 L560,80" class="arrow"/>
  <path d="M460,140 L560,160" class="arrow"/>

  <rect x="560" y="50" width="160" height="55" class="ok"/>
  <text x="640" y="82" text-anchor="middle" class="label">Réplica</text>
  <rect x="560" y="140" width="160" height="55" class="warn"/>
  <text x="640" y="172" text-anchor="middle" class="label">Storage</text>

  <text x="410" y="240" text-anchor="middle" class="small">Pool de conexões + índices certos + WAL para durabilidade</text>`;
      return svgShell(
        "pg",
        "0 0 820 270",
        "Deep dive: PostgreSQL em produção",
        body,
      );
    })(),
  },
};

// Exercise diagrams — high-level architecture sketch
const EXERCISES = [
  ["feed-noticias", "Feed: fan-out on write/read", ["Client", "API", "Feed svc", "Cache/DB"]],
  ["mensagens-tempo-real", "Chat: mensagens + presença", ["Client", "GW/WS", "Chat svc", "Store"]],
  ["outros-problemas", "Problemas clássicos: rate limit / busca / reservas", ["Cliente", "API", "Limiter", "Backend"]],
  ["uber", "Transporte: matching motorista-passageiro", ["Apps", "API", "Matching", "Geo/DB"]],
  ["ticketmaster", "Ingressos: inventário sob contenção", ["Cliente", "API", "Inventory", "Payment"]],
  ["youtube", "Vídeo: upload → process → CDN", ["Upload", "Transcode", "Object store", "CDN"]],
  ["tinder", "Matching: perfil + recomendações", ["App", "API", "Recs", "DB"]],
  ["plataforma-julgamento-codigo", "Judge: fila de execução isolada", ["Submit", "Queue", "Workers", "Results"]],
  ["web-crawler", "Crawler: frontier → fetch → index", ["Frontier", "Fetchers", "Parsers", "Index"]],
  ["editor-colaborativo", "Docs: OT/CRDT + sync", ["Clients", "WS hub", "Doc svc", "Store"]],
  ["cache-distribuido", "Cache distribuído: nós + hashing", ["Client", "Proxy", "Node A", "Node B"]],
  ["agendador-tarefas", "Scheduler: fila de jobs no tempo", ["API", "Scheduler", "Workers", "Store"]],
  ["sistema-pagamentos", "Pagamentos: ledger + provedores", ["Merchant", "API", "Ledger", "PSP"]],
  ["agregador-cliques-anuncios", "Cliques: ingestão → agregação", ["Pixel", "Ingest", "Agg", "OLAP"]],
  ["entrega-local", "Entrega: pedidos + rastreio", ["App", "API", "Dispatch", "Tracking"]],
  ["leilao-online", "Leilão: lances com ordenação", ["Bidder", "API", "Auction", "Store"]],
  ["busca-locais-proximos", "Yelp-like: geo + ranking", ["App", "API", "Geo index", "Ranking"]],
  ["rastreamento-atividades", "Atividades: ingestão de pontos GPS", ["Device", "Ingest", "Process", "Feed"]],
  ["plataforma-negociacao-acoes", "Trading: order book + matching", ["Trader", "GW", "Matching", "Ledger"]],
];

for (const [slug, title, labels] of EXERCISES) {
  DIAGRAMS[slug] = {
    file: `sd-${slug}.svg`,
    alt: title,
    after: "## Enunciado",
    svg: pipeline(slug.slice(0, 8), title, labels, "Esboço de alto nível para orientar o exercício"),
  };
}

function embed(mdPath, alt, file, afterHeading) {
  let md = fs.readFileSync(mdPath, "utf8");
  const img = `![${alt}](/diagrams/${file})`;
  if (md.includes(`/diagrams/${file}`)) return false;

  const lines = md.split("\n");
  let i = lines.findIndex((l) => l.trim() === afterHeading);
  if (i < 0) {
    i = lines.findIndex(
      (l) => l === "## Conteúdo" || l === "## Enunciado" || l.startsWith("## "),
    );
  }
  if (i < 0) return false;

  let j = i + 1;
  while (j < lines.length && lines[j].trim() === "") j++;
  while (j < lines.length && lines[j].trim() !== "") j++;
  lines.splice(j, 0, "", img);
  fs.writeFileSync(mdPath, lines.join("\n"));
  return true;
}

let written = 0;
let embedded = 0;
for (const [slug, spec] of Object.entries(DIAGRAMS)) {
  const svgPath = path.join(DIAG, spec.file);
  fs.writeFileSync(svgPath, spec.svg);
  written++;
  const mdPath = path.join(ART, `${slug}.md`);
  if (!fs.existsSync(mdPath)) {
    console.warn("missing md", slug);
    continue;
  }
  if (embed(mdPath, spec.alt, spec.file, spec.after)) embedded++;
  else console.warn("embed skip", slug);
}

console.log(`SVGs written: ${written}; embeds: ${embedded}`);
