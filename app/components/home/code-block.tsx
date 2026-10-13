import type { ReactNode } from "react";

const TOKEN =
  /(\/\/.*$)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`[^`]*`)|\b(import|from|export|default|const|await|async|return|new|function|true|false|type)\b|([A-Za-z_$][\w$]*)(?=\()|\b(\d[\d_]*)\b/gm;

function highlight(line: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  for (const m of line.matchAll(TOKEN)) {
    const i = m.index ?? 0;
    if (i > last) out.push(line.slice(last, i));
    const [text, comment, string, keyword, call, number] = m;
    const cls = comment
      ? "text-muted-foreground/70 italic"
      : string
        ? "text-level-ok"
        : keyword
          ? "text-primary"
          : call
            ? "text-level-info"
            : number
              ? "text-level-warn"
              : "";
    out.push(
      <span key={i} className={cls}>
        {text}
      </span>,
    );
    last = i + text.length;
  }
  if (last < line.length) out.push(line.slice(last));
  return out;
}

export function CodeBlock({
  code,
  file,
  badge,
  highlightLines = [],
  className = "",
}: {
  code: string;
  file?: string;
  badge?: ReactNode;
  highlightLines?: number[];
  className?: string;
}) {
  const lines = code.replace(/\n$/, "").split("\n");
  return (
    <div className={`overflow-hidden rounded-lg border border-border bg-card shadow-xs ${className}`}>
      {file ? (
        <div className="flex h-9 items-center justify-between border-b border-border bg-muted/50 px-3.5">
          <span className="flex items-center gap-2 font-mono text-[0.7rem] text-muted-foreground">
            <span className="flex gap-1" aria-hidden>
              <span className="size-2 rounded-full bg-border-strong" />
              <span className="size-2 rounded-full bg-border-strong" />
              <span className="size-2 rounded-full bg-border-strong" />
            </span>
            {file}
          </span>
          {badge}
        </div>
      ) : null}
      <pre className="overflow-x-auto py-3 font-mono text-[0.75rem] leading-[1.7] sm:text-[0.78rem]">
        <code>
          {lines.map((line, i) => (
            <span
              key={i}
              className={`flex px-3.5 ${highlightLines.includes(i + 1) ? "bg-primary/[0.07] shadow-[inset_2px_0_0_var(--signal)]" : ""}`}
            >
              <span className="w-7 shrink-0 select-none tabular-nums text-muted-foreground/45">{i + 1}</span>
              <span className="whitespace-pre text-foreground">{highlight(line)}</span>
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}
