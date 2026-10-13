"use client";

import {
  createContext,
  Fragment,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { animate, motion, useMotionValue, useTransform, type MotionValue } from "motion/react";

type Box = { x1: number; y1: number; x2: number; y2: number; w: number; h: number; baseline: number };
type Speck = { x: number; y: number; size: number; hollow: boolean; alpha: number; duration: number; delay: number };

const PAD = 6;
const SPRING = { type: "spring", stiffness: 320, damping: 22 } as const;

let measureCtx: CanvasRenderingContext2D | null = null;

const signed = (value: number) => (value > 0 ? `+${value}` : value < 0 ? `−${-value}` : "0");

function measure(el: HTMLElement, probe: HTMLElement, text: string): Box | null {
  measureCtx ??= document.createElement("canvas").getContext("2d");
  if (!measureCtx) return null;
  const cs = getComputedStyle(el);
  const ctx = measureCtx;
  ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
  if ("letterSpacing" in ctx) ctx.letterSpacing = cs.letterSpacing === "normal" ? "0px" : cs.letterSpacing;
  const m = ctx.measureText(text);
  const baseline = probe.offsetTop;
  return {
    x1: -m.actualBoundingBoxLeft - PAD,
    x2: m.actualBoundingBoxRight + PAD,
    y1: baseline - m.actualBoundingBoxAscent - PAD,
    y2: baseline + m.actualBoundingBoxDescent + PAD,
    w: Math.round(m.actualBoundingBoxLeft + m.actualBoundingBoxRight),
    h: Math.round(m.actualBoundingBoxAscent + m.actualBoundingBoxDescent),
    baseline,
  };
}

function scatter(box: Box): Speck[] {
  const w = box.x2 - box.x1;
  const h = box.y2 - box.y1;
  const perimeter = 2 * (w + h);
  return Array.from({ length: 14 }, () => {
    let d = Math.random() * perimeter;
    let p: [number, number, number, number];
    if (d < w) p = [d, 0, 0, -1];
    else if ((d -= w) < h) p = [w, d, 1, 0];
    else if ((d -= h) < w) p = [w - d, h, 0, 1];
    else p = [0, h - (d - w), -1, 0];
    const pick = Math.random();
    const size = pick < 0.46 ? 2 : pick < 0.7 ? 3 : pick < 0.84 ? 5 : pick < 0.94 ? 8 : 11;
    const large = size >= 8;
    const out = (large ? 9 : 4) + Math.floor(Math.random() * 5) * 3;
    return {
      x: p[0] + p[2] * out,
      y: p[1] + p[3] * out,
      size,
      hollow: Math.random() < (large ? 0.78 : 0.26),
      alpha: large ? 0.3 + Math.random() * 0.4 : 0.3 + Math.random() * 0.6,
      duration: 0.5 + Math.random() * 1.2,
      delay: -Math.random() * 1.7,
    };
  });
}

function useFinePointer() {
  const [fine, setFine] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setFine(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return fine;
}

function Outline({ text, baseline }: { text: string; baseline: number }) {
  return (
    <svg className="pointer-events-none absolute left-0 top-0 block size-full overflow-visible" aria-hidden>
      <text x="0" y={baseline} fill="none" stroke="currentColor" strokeWidth={1.5} strokeDasharray="4 2" strokeLinejoin="round">
        {text}
      </text>
    </svg>
  );
}

function Frame({
  box,
  specks,
  visible,
  label,
}: {
  box: Box;
  specks: Speck[];
  visible: boolean;
  label: string | MotionValue<string>;
}) {
  return (
    <span
      className="pointer-events-none absolute text-[var(--signal)] transition-opacity duration-150"
      style={{ left: box.x1, top: box.y1, width: box.x2 - box.x1, height: box.y2 - box.y1, opacity: visible ? 1 : 0 }}
    >
      <span className="absolute inset-0 border border-current opacity-50" />
      <span className="absolute -left-[2.5px] -top-[2.5px] size-[5px] bg-current" />
      <span className="absolute -right-[2.5px] -top-[2.5px] size-[5px] bg-current" />
      <span className="absolute -bottom-[2.5px] -right-[2.5px] size-[5px] bg-current" />
      <span className="absolute -bottom-[2.5px] -left-[2.5px] size-[5px] bg-current" />
      <motion.span className="absolute bottom-full left-0 mb-[7px] whitespace-pre font-sans text-[11px] font-medium leading-none tracking-normal tabular-nums opacity-70">
        {label}
      </motion.span>
      {visible
        ? specks.map((s, i) => (
            <span
              key={i}
              className={`blyp-speck absolute ${s.hollow ? "border border-current" : "bg-current"}`}
              style={
                {
                  left: Math.round(s.x - s.size / 2),
                  top: Math.round(s.y - s.size / 2),
                  width: s.size,
                  height: s.size,
                  "--a": s.alpha,
                  animationDuration: `${s.duration}s`,
                  animationDelay: `${s.delay}s`,
                } as React.CSSProperties
              }
            />
          ))
        : null}
    </span>
  );
}

type Group = { active: string | null; setActive: (id: string | null) => void; initial?: string };

const GroupContext = createContext<Group | null>(null);

export function TechTypeGroup({ initial, children }: { initial?: string; children: ReactNode }) {
  const [active, setActive] = useState<string | null>(null);
  return <GroupContext.Provider value={{ active, setActive, initial }}>{children}</GroupContext.Provider>;
}

function Glyph({ text, live }: { text: string; live: boolean }) {
  const id = useId();
  const group = useContext(GroupContext);
  const ref = useRef<HTMLSpanElement>(null);
  const probeRef = useRef<HTMLSpanElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [box, setBox] = useState<Box | null>(null);
  const [specks, setSpecks] = useState<Speck[]>([]);
  const [localHover, setLocalHover] = useState(false);
  const [dragging, setDragging] = useState(false);
  const distance = useTransform(() => Math.hypot(x.get(), y.get()));
  const ghost = useTransform(distance, [1, 24], [0, 0.55]);
  const angle = useTransform(() => (Math.atan2(y.get(), x.get()) * 180) / Math.PI);
  const offset = useTransform(() => `${signed(Math.round(x.get()))}, ${signed(Math.round(-y.get()))}`);

  const hover = group ? group.active === id : localHover;
  const isInitial = live && group?.initial === text;
  const setActive = group?.setActive;

  useEffect(() => {
    if (!isInitial || !setActive) return;
    let cancelled = false;
    void document.fonts.ready.then(() => {
      if (!cancelled) setActive(id);
    });
    return () => {
      cancelled = true;
    };
  }, [isInitial, setActive, id]);

  useLayoutEffect(() => {
    if (!hover || !live) return;
    const update = () => {
      if (!ref.current || !probeRef.current) return;
      const next = measure(ref.current, probeRef.current, text);
      if (!next) return;
      setBox(next);
      setSpecks(scatter(next));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [hover, live, text]);

  if (!live) return <span className="inline-block">{text}</span>;

  const engage = () => {
    if (dragging) return;
    if (group) group.setActive(id);
    else setLocalHover(true);
  };

  const active = hover || dragging;
  const outlined = hover && !dragging;

  return (
    <span className="relative inline-block" style={{ zIndex: active ? 20 : undefined }}>
      {box ? (
        <>
          <motion.span className="pointer-events-none absolute inset-0" style={{ opacity: ghost }}>
            <Outline text={text} baseline={box.baseline} />
          </motion.span>
          <motion.span
            className="pointer-events-none absolute h-0 origin-left border-t border-dashed border-[color-mix(in_oklch,var(--signal)_70%,transparent)]"
            style={{ left: (box.x1 + box.x2) / 2, top: (box.y1 + box.y2) / 2, width: distance, rotate: angle, opacity: ghost }}
          />
        </>
      ) : null}
      <motion.span
        ref={ref}
        className="relative inline-block cursor-grab touch-none select-none active:cursor-grabbing"
        style={{ x, y }}
        drag
        dragMomentum={false}
        onPointerEnter={engage}
        onPointerLeave={() => {
          if (!group) setLocalHover(false);
        }}
        onDragStart={() => setDragging(true)}
        onDragEnd={() => {
          setDragging(false);
          animate(x, 0, SPRING);
          animate(y, 0, SPRING);
        }}
      >
        <span className="transition-opacity duration-150" style={{ opacity: outlined ? 0 : 1 }}>
          {text}
        </span>
        <span ref={probeRef} className="inline-block h-0 w-0" />
        {box ? (
          <>
            <span className="pointer-events-none absolute inset-0 transition-opacity duration-150" style={{ opacity: outlined ? 1 : 0 }}>
              <Outline text={text} baseline={box.baseline} />
            </span>
            <Frame box={box} specks={specks} visible={active} label={dragging ? offset : `${text}  ${box.w} × ${box.h}`} />
          </>
        ) : null}
      </motion.span>
    </span>
  );
}

export function TechType({ text, unit = "letter" }: { text: string; unit?: "letter" | "word" }) {
  const live = useFinePointer();
  const parts = text.split(/(\s+)/);

  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {parts.map((part, i) => {
          if (!part.trim()) return <Fragment key={i}>{part}</Fragment>;
          if (unit === "word") return <Glyph key={i} text={part} live={live} />;
          return (
            <span key={i} className="inline-block whitespace-nowrap">
              {Array.from(part).map((char, j) => (
                <Glyph key={j} text={char} live={live} />
              ))}
            </span>
          );
        })}
      </span>
    </>
  );
}
