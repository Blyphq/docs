"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";

type CommandItem = {
  label: string;
  command: string;
  helper: string;
};

type InstallCommandCardProps = {
  items: CommandItem[];
};

export function InstallCommandCard({ items }: InstallCommandCardProps) {
  const [status, setStatus] = useState<string>("");
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  async function handleCopy(command: string) {
    try {
      await navigator.clipboard.writeText(command);
      setStatus(`Copied ${command}`);
    } catch {
      setStatus(`Could not copy ${command}`);
    }

    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
    }

    timerRef.current = window.setTimeout(() => {
      setStatus("");
      timerRef.current = null;
    }, 2000);
  }

  return (
    <div className="border border-border bg-card">
      <div className="flex flex-col gap-3 border-b border-border px-6 py-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[0.72rem] font-medium uppercase tracking-[0.24em] text-primary">
            Quick Start
          </p>
          <p className="mt-3 max-w-[34rem] text-base leading-8 text-muted-foreground">
            Copy the core install, then open Studio locally.
          </p>
        </div>
        <span className="border border-input px-4 py-2 text-[0.72rem] font-medium uppercase tracking-[0.2em] text-primary">
          Bun First
        </span>
      </div>

      <div className="divide-y divide-border">
        {items.map((item) => {
          const copied = status === `Copied ${item.command}`;

          return (
            <div key={item.command} className="grid gap-5 px-6 py-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
              <div className="min-w-0">
                <p className="text-lg font-medium text-foreground">{item.label}</p>
                <p className="mt-2 text-sm leading-7 text-muted-foreground/80">{item.helper}</p>
                <code className="mt-4 block overflow-x-auto whitespace-nowrap border border-border bg-muted/50 px-4 py-4 font-mono text-[0.82rem] text-primary">
                  {item.command}
                </code>
              </div>

              <button
                type="button"
                onClick={() => handleCopy(item.command)}
                aria-label={`Copy command ${item.command}`}
                className="inline-flex items-center justify-center gap-2 border border-border px-4 py-3 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:border-foreground/30 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
              >
                {copied ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          );
        })}
      </div>

      <p aria-live="polite" className="sr-only">
        {status}
      </p>
    </div>
  );
}
