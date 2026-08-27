import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

const gridColumns = Array.from({ length: 25 }, (_, index) => index * 48);
const gridRows = Array.from({ length: 14 }, (_, index) => index * 48);
const brandPixels = Array.from({ length: 9 }, (_, index) => index);
const signalPixels = [
  [0, 1, 0, 0, 1, 0, 0],
  [1, 0, 0, 1, 0, 0, 1],
  [0, 0, 1, 0, 0, 1, 0],
  [0, 1, 0, 1, 1, 0, 0],
  [1, 0, 0, 1, 0, 0, 1],
  [0, 0, 1, 0, 0, 1, 0],
  [0, 1, 0, 0, 1, 0, 0],
];

function truncate(value: string, length: number) {
  const normalized = value.trim().replace(/\s+/g, " ");
  return normalized.length > length
    ? `${normalized.slice(0, length - 3).trimEnd()}...`
    : normalized;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = truncate(searchParams.get("title") ?? "Blyp Docs", 76);
  const description = truncate(searchParams.get("description") ?? "", 190);
  const isLight = searchParams.get("theme") === "light";

  const colors = isLight
    ? {
        background: "#fafafa",
        panel: "#f3f3f1",
        foreground: "#191919",
        muted: "#676763",
        faint: "rgba(25,25,25,0.08)",
        border: "rgba(25,25,25,0.18)",
        pixel: "rgba(25,25,25,0.14)",
        accent: "#e85757",
      }
    : {
        background: "#111111",
        panel: "#171717",
        foreground: "#f4f4f2",
        muted: "#9a9a96",
        faint: "rgba(255,255,255,0.055)",
        border: "rgba(255,255,255,0.15)",
        pixel: "rgba(255,255,255,0.12)",
        accent: "#ff6b6b",
      };

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        overflow: "hidden",
        backgroundColor: colors.background,
        color: colors.foreground,
        fontFamily: "monospace",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          opacity: 0.72,
        }}
      >
        {gridColumns.map((left) => (
          <div
            key={`column-${left}`}
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left,
              width: 1,
              backgroundColor: colors.faint,
            }}
          />
        ))}
        {gridRows.map((top) => (
          <div
            key={`row-${top}`}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top,
              height: 1,
              backgroundColor: colors.faint,
            }}
          />
        ))}
      </div>

      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 440,
          height: 630,
          display: "flex",
          background: `linear-gradient(90deg, transparent, ${colors.panel})`,
          borderLeft: `1px solid ${colors.border}`,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 104,
            right: 68,
            width: 294,
            display: "flex",
            flexWrap: "wrap",
            gap: 18,
          }}
        >
          {signalPixels.flatMap((row, rowIndex) =>
            row.map((active, columnIndex) => (
              <div
                key={`signal-${rowIndex}-${columnIndex}`}
                style={{
                  width: 24,
                  height: 24,
                  display: "flex",
                  backgroundColor:
                    rowIndex === 3 && columnIndex === 3
                      ? colors.accent
                      : active
                        ? colors.pixel
                        : "transparent",
                  border:
                    active || (rowIndex === 3 && columnIndex === 3)
                      ? "none"
                      : `1px solid ${colors.faint}`,
                }}
              />
            )),
          )}
        </div>

        <div
          style={{
            position: "absolute",
            right: 68,
            bottom: 92,
            display: "flex",
            alignItems: "center",
            gap: 10,
            color: colors.muted,
            fontSize: 11,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
          }}
        >
          <span>signal</span>
          <div
            style={{
              width: 54,
              height: 1,
              display: "flex",
              backgroundColor: colors.border,
            }}
          />
          <span style={{ color: colors.accent }}>live</span>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          inset: 28,
          display: "flex",
          border: `1px solid ${colors.border}`,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 28,
          left: 28,
          width: 82,
          height: 2,
          display: "flex",
          backgroundColor: colors.accent,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 28,
          right: 28,
          width: 82,
          height: 2,
          display: "flex",
          backgroundColor: colors.accent,
        }}
      />

      <header
        style={{
          position: "absolute",
          top: 29,
          left: 29,
          right: 29,
          height: 76,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 28px",
          borderBottom: `1px solid ${colors.border}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 31,
              height: 31,
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            {brandPixels.map((pixel) => (
              <div
                key={`brand-${pixel}`}
                style={{
                  width: 9,
                  height: 9,
                  display: "flex",
                  backgroundColor:
                    pixel === 4 ? colors.accent : colors.foreground,
                }}
              />
            ))}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 10,
            }}
          >
            <span
              style={{
                fontSize: 20,
                fontWeight: 700,
                letterSpacing: "-0.06em",
              }}
            >
              BLYP
            </span>
            <span
              style={{
                color: colors.muted,
                fontSize: 10,
                letterSpacing: "0.14em",
              }}
            >
              DOCS / 01
            </span>
          </div>
        </div>
        <span
          style={{
            color: colors.muted,
            fontSize: 10,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
          }}
        >
          Runtime-adaptive logging
        </span>
      </header>

      <main
        style={{
          position: "absolute",
          top: 105,
          left: 29,
          bottom: 89,
          width: 730,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "38px 48px",
          borderRight: `1px solid ${colors.border}`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 24,
            color: colors.accent,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.19em",
            textTransform: "uppercase",
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              display: "flex",
              backgroundColor: colors.accent,
            }}
          />
          Documentation
        </div>
        <h1
          style={{
            maxWidth: 650,
            margin: 0,
            color: colors.foreground,
            fontSize:
              title.length > 58 ? 46 : title.length > 38 ? 54 : 66,
            fontWeight: 700,
            letterSpacing: "-0.065em",
            lineHeight: 0.98,
          }}
        >
          {title}
        </h1>
        {description ? (
          <p
            style={{
              maxWidth: 620,
              margin: "24px 0 0",
              color: colors.muted,
              fontSize: 16,
              lineHeight: 1.55,
              letterSpacing: "-0.015em",
            }}
          >
            {description}
          </p>
        ) : null}
      </main>

      <footer
        style={{
          position: "absolute",
          left: 29,
          right: 29,
          bottom: 29,
          height: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 28px",
          borderTop: `1px solid ${colors.border}`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            color: colors.muted,
            fontSize: 11,
            letterSpacing: "0.08em",
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              display: "flex",
              backgroundColor: colors.accent,
            }}
          />
          <div
            style={{
              width: 18,
              height: 1,
              display: "flex",
              backgroundColor: colors.border,
            }}
          />
          <span>www.blyp.dev/docs</span>
        </div>
        <span
          style={{
            color: colors.muted,
            fontSize: 10,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
          }}
        >
          Grep less. Understand more.
        </span>
      </footer>
    </div>,
    {
      width: 1200,
      height: 630,
      headers: {
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      },
    },
  );
}
