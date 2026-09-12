/** Troca analogia da trilha de arquitetura pelos nomes técnicos. */
export function arqTerms(s) {
  let t = String(s);
  t = t.replace(/Analogia da aula\.?/gi, "");
  t = t.replace(/Analogia do remissivo\.?/gi, "");
  t = t.replace(/Analogia martelo\.?/gi, "");
  t = t.replace(/\bAnalogia\.?/gi, "");
  t = t.replace(/Na analogia do supermercado,?\s*/gi, "");
  t = t.replace(/Na analogia,? ?/gi, "");
  t = t.replace(/Post-it na mesa/g, "Cache");
  t = t.replace(/post-it na mesa/gi, "cache");
  t = t.replace(/Post-it/g, "Cache");
  t = t.replace(/post-it/gi, "cache");
  t = t.replace(/fotocópia do livro/gi, "cópia das mesmas linhas");
  t = t.replace(/fotocópia/gi, "cópia");
  t = t.replace(/fotocopia o mesmo livro/gi, "copia as mesmas linhas");
  t = t.replace(/a mesma geladeira/gi, "o mesmo banco");
  t = t.replace(/Geladeira compartilhada/g, "Banco compartilhado");
  t = t.replace(/geladeira compartilhada/gi, "banco compartilhado");
  t = t.replace(/geladeira fechada/gi, "fronteira fechada");
  t = t.replace(/geladeira aberta/gi, "fronteira vazada");
  t = t.replace(/entra na geladeira/gi, "acessa o modelo interno");
  t = t.replace(/na geladeira/gi, "no modelo interno");
  t = t.replace(/geladeira/gi, "banco compartilhado");
  t = t.replace(/Cardápio ≠ banco compartilhado/g, "Contrato ≠ implementação");
  t = t.replace(/Apartamento com chave e banco compartilhado\.?/g, "Deploy, banco próprio e time que opera.");
  t = t.replace(/Apartamento com chave e geladeira\.?/g, "Deploy, banco próprio e time que opera.");
  t = t.replace(/Casa com cômodos\.?/g, "Módulos num deploy.");
  t = t.replace(/Um telefone não ocupa todas as linhas\.?/g, "Uma dependência lenta não esgota o processo.");
  t = t.replace(/CDC é um carteiro de outbox/gi, "CDC é outro publisher de outbox");
  t = t.replace(/carteiro de outbox/gi, "publisher de outbox");
  t = t.replace(/\bcarteiro\b/gi, "poller");
  t = t.replace(
    /Todo mundo se chama Ana: o shard A não sente nada\.?/gi,
    "Hot shard: uma chave absorve o volume e o pedaço não sente nada.",
  );
  t = t.replace(
    /Todo mundo se chama Ana: o shard A pega fogo\.?/gi,
    "Hot shard: uma chave absorve o volume e aquele pedaço pega fogo.",
  );
  t = t.replace(/Todo mundo se chama Ana/gi, "Uma chave absorve o volume");
  t = t.replace(/Vitrine quase sempre aceita/g, "Catálogo quase sempre aceita");
  t = t.replace(/Kafka no caderno/gi, "O log Kafka");
  t = t.replace(/caderno Kafka/gi, "log Kafka");
  t = t.replace(/o caderno/gi, "o log");
  t = t.replace(/Use o caderno/gi, "Use o log");
  return t.replace(/\s+/g, " ").trim();
}
