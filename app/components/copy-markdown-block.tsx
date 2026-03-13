"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

type CopyMarkdownBlockProps = {
  source: string;
};

export function CopyMarkdownBlock({ source }: CopyMarkdownBlockProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(source);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-black/10 bg-[color:var(--color-fd-card,#fff)] shadow-sm dark:border-white/10 dark:bg-[color:var(--color-fd-card,#111)]">
      <div className="flex items-center justify-between gap-3 border-b border-black/10 bg-black/[0.03] px-4 py-3 dark:border-white/10 dark:bg-white/[0.04]">
        <div className="min-w-0">
          <p className="m-0 text-sm font-semibold">Canonical skill source</p>
          <p className="m-0 mt-1 text-xs text-black/60 dark:text-white/60">
            Copy the exact markdown file contents and drop them into your agent skill
            directory.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-medium text-black transition hover:bg-black/[0.03] dark:border-white/10 dark:bg-white/[0.06] dark:text-white dark:hover:bg-white/[0.1]"
        >
          {copied ? <Check size={15} /> : <Copy size={15} />}
          {copied ? "Copied" : "Copy Markdown"}
        </button>
      </div>

      <pre className="m-0 overflow-x-auto bg-transparent px-4 py-4 text-sm leading-6 text-[color:var(--color-fd-foreground,#111)] dark:text-[color:var(--color-fd-foreground,#fff)]">
        <code>{source}</code>
      </pre>
    </div>
  );
}
