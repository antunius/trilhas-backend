"use client";

import { useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Check } from "lucide-react";
import { PrismAsyncLight as SyntaxHighlighter } from "react-syntax-highlighter";
import java from "react-syntax-highlighter/dist/esm/languages/prism/java";
import bash from "react-syntax-highlighter/dist/esm/languages/prism/bash";
import sql from "react-syntax-highlighter/dist/esm/languages/prism/sql";
import json from "react-syntax-highlighter/dist/esm/languages/prism/json";
import yaml from "react-syntax-highlighter/dist/esm/languages/prism/yaml";
import properties from "react-syntax-highlighter/dist/esm/languages/prism/properties";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { extractToc, remarkHeadingIds, type TocHeading } from "@/lib/toc";
import {
  ArrayPointerVisualizer,
  type ArrayPointerVisualizerProps,
} from "@/components/visualizers/ArrayPointerVisualizer";
import {
  TreeVisualizer,
  type TreeVisualizerProps,
} from "@/components/visualizers/TreeVisualizer";
import {
  GraphVisualizer,
  type GraphVisualizerProps,
} from "@/components/visualizers/GraphVisualizer";
import {
  GridVisualizer,
  type GridVisualizerProps,
} from "@/components/visualizers/GridVisualizer";
import {
  PromQLPlayground,
  type PromQLPlaygroundProps,
} from "@/components/PromQLPlayground";

SyntaxHighlighter.registerLanguage("java", java);
SyntaxHighlighter.registerLanguage("bash", bash);
SyntaxHighlighter.registerLanguage("sql", sql);
SyntaxHighlighter.registerLanguage("json", json);
SyntaxHighlighter.registerLanguage("yaml", yaml);
SyntaxHighlighter.registerLanguage("properties", properties);

const HIGHLIGHTED_LANGS = new Set([
  "java",
  "bash",
  "sh",
  "sql",
  "json",
  "yaml",
  "yml",
  "properties",
]);

function CodeBlock({ children, lang }: { children: string; lang?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    void navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  const normalizedLang = lang === "sh" ? "bash" : lang === "yml" ? "yaml" : lang;
  const canHighlight = lang ? HIGHLIGHTED_LANGS.has(lang) : false;

  return (
    <div className="my-5 rounded-lg overflow-hidden border border-border bg-[#0a0e14]">
      <div className="flex items-center justify-between px-4 py-2 bg-secondary/60 border-b border-border">
        <span className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
          {lang || "code"}
        </span>
        <button
          type="button"
          onClick={copy}
          className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {copied ? <Check className="w-3 h-3" /> : null}
          {copied ? "copied" : "copy"}
        </button>
      </div>
      {canHighlight ? (
        <SyntaxHighlighter
          language={normalizedLang}
          style={oneDark}
          customStyle={{
            margin: 0,
            padding: "1rem",
            background: "transparent",
            fontSize: "0.875rem",
            lineHeight: "1.625",
          }}
          codeTagProps={{ style: { fontFamily: "var(--font-mono, monospace)" } }}
        >
          {children}
        </SyntaxHighlighter>
      ) : (
        <pre className="p-4 overflow-x-auto">
          <code className="font-mono text-sm leading-relaxed text-foreground/90">
            {children}
          </code>
        </pre>
      )}
    </div>
  );
}

export function MarkdownRenderer({
  content,
  headings,
}: {
  content: string;
  headings?: TocHeading[];
}) {
  const toc = useMemo(
    () => headings ?? extractToc(content || ""),
    [headings, content],
  );

  return (
    <div className="article-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkHeadingIds(toc)]}
        components={{
          h2({ id, children }) {
            return (
              <h2 id={id} className="scroll-mt-28">
                {children}
              </h2>
            );
          },
          h3({ id, children }) {
            return (
              <h3 id={id} className="scroll-mt-28">
                {children}
              </h3>
            );
          },
          h4({ children }) {
            return <h4 className="scroll-mt-28">{children}</h4>;
          },
          blockquote({ children }) {
            return (
              <blockquote className="my-6 rounded-lg border border-border border-l-4 border-l-primary/60 bg-secondary/40 px-4 py-3 text-muted-foreground not-italic">
                {children}
              </blockquote>
            );
          },
          img({ src, alt }) {
            if (!src) return null;
            return (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={src}
                alt={alt || ""}
                className="my-6 w-full max-w-3xl mx-auto rounded-lg border border-border bg-card/80"
                loading="lazy"
              />
            );
          },
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const inline = !match && !String(children).includes("\n");
            if (inline) {
              return (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            }
            const raw = String(children).replace(/\n$/, "");
            if (match?.[1] === "visualizer") {
              try {
                const config = JSON.parse(raw) as ArrayPointerVisualizerProps;
                return <ArrayPointerVisualizer {...config} />;
              } catch {
                return (
                  <CodeBlock lang="json">{raw}</CodeBlock>
                );
              }
            }
            if (match?.[1] === "treeviz") {
              try {
                const config = JSON.parse(raw) as TreeVisualizerProps;
                return <TreeVisualizer {...config} />;
              } catch {
                return <CodeBlock lang="json">{raw}</CodeBlock>;
              }
            }
            if (match?.[1] === "graphviz") {
              try {
                const config = JSON.parse(raw) as GraphVisualizerProps;
                return <GraphVisualizer {...config} />;
              } catch {
                return <CodeBlock lang="json">{raw}</CodeBlock>;
              }
            }
            if (match?.[1] === "gridviz") {
              try {
                const config = JSON.parse(raw) as GridVisualizerProps;
                return <GridVisualizer {...config} />;
              } catch {
                return <CodeBlock lang="json">{raw}</CodeBlock>;
              }
            }
            if (match?.[1] === "promqlplay") {
              try {
                const config = JSON.parse(raw) as PromQLPlaygroundProps;
                return <PromQLPlayground {...config} />;
              } catch {
                return <CodeBlock lang="json">{raw}</CodeBlock>;
              }
            }
            return <CodeBlock lang={match?.[1]}>{raw}</CodeBlock>;
          },
        }}
      >
        {content || ""}
      </ReactMarkdown>
    </div>
  );
}

export default MarkdownRenderer;
