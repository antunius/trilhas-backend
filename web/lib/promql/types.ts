export type Labels = Record<string, string>;

/** Série com amostras (instante em segundos, valor), em ordem crescente de tempo. */
export type Series = { labels: Labels; points: [number, number][] };

export type Sample = { labels: Labels; value: number };

export type RangeSeries = { labels: Labels; points: [number, number][] };

export type Value =
  | { t: "scalar"; v: number }
  | { t: "vector"; s: Sample[] }
  | { t: "range"; s: RangeSeries[]; rangeSec: number };

export class PromQLError extends Error {}
