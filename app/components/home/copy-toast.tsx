"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { Check, Copy } from "lucide-react";
import SwipeToast from "@/app/components/react-bits/micro/swipe-toast";

type CopyFn = (text: string, label?: string) => Promise<void>;

const CopyContext = createContext<CopyFn>(async () => {});

type ToastState = { id: number; title: string; description: string; ok: boolean };

export function CopyToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null);

  const copy = useCallback<CopyFn>(async (text, label = "Copied to clipboard") => {
    let ok = true;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      ok = false;
    }
    setToast({
      id: Date.now(),
      title: ok ? label : "Couldn't reach the clipboard",
      description: text,
      ok,
    });
  }, []);

  return (
    <CopyContext.Provider value={copy}>
      {children}
      {toast ? (
        <SwipeToast
          key={toast.id}
          title={toast.title}
          description={<code className="font-mono text-[12px] opacity-70">{toast.description}</code>}
          icon={
            <span className="grid size-full place-items-center rounded-full bg-[var(--signal)] text-[var(--primary-foreground)]">
              <Check className="size-3" strokeWidth={3} aria-hidden />
            </span>
          }
          background="var(--ink)"
          color="var(--paper)"
          fuseColor="var(--signal)"
          radius={10}
          duration={2600}
          onClose={() => setToast((t) => (t?.id === toast.id ? null : t))}
        />
      ) : null}
    </CopyContext.Provider>
  );
}

export function useCopy() {
  return useContext(CopyContext);
}

/** Inline command pill with a tactile copy button. */
export function CopyCommand({
  command,
  className = "",
  prompt = "$",
}: {
  command: string;
  className?: string;
  prompt?: string;
}) {
  const copy = useCopy();
  const [pressed, setPressed] = useState(false);

  return (
    <button
      type="button"
      onClick={() => {
        setPressed(true);
        void copy(command);
        window.setTimeout(() => setPressed(false), 1400);
      }}
      aria-label={`Copy ${command}`}
      className={`group/copy inline-flex h-11 items-center gap-3 rounded-md border border-border-strong bg-card pl-4 pr-1.5 font-mono text-[0.8125rem] text-foreground shadow-xs transition-[border-color,box-shadow,transform] duration-200 ease-out-expo hover:border-foreground/25 hover:shadow-sm active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${className}`}
    >
      <span className="select-none text-muted-foreground/60">{prompt}</span>
      <span className="whitespace-nowrap">{command}</span>
      <span className="relative ml-1 grid size-8 place-items-center overflow-hidden rounded-[5px] bg-muted text-muted-foreground transition-colors duration-200 group-hover/copy:bg-primary-soft group-hover/copy:text-primary-soft-foreground">
        <Copy
          className={`absolute size-3.5 transition-all duration-300 ease-out-expo ${pressed ? "-translate-y-5 opacity-0" : ""}`}
          aria-hidden
        />
        <Check
          className={`absolute size-3.5 transition-all duration-300 ease-out-expo ${pressed ? "" : "translate-y-5 opacity-0"}`}
          strokeWidth={2.5}
          aria-hidden
        />
      </span>
    </button>
  );
}
