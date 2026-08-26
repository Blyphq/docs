import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") ?? "Blyp Docs";
  const description = searchParams.get("description") ?? "";

  const imageResponse = new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#000000",
        padding: "0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "55px",
          left: 0,
          right: 0,
          height: "1px",
          backgroundColor: "rgba(255,255,255,0.18)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "80px",
          left: 0,
          right: 0,
          height: "1px",
          backgroundColor: "rgba(255,255,255,0.18)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "79px",
          width: "1px",
          height: "100%",
          backgroundColor: "rgba(255,255,255,0.14)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          right: "79px",
          width: "1px",
          height: "100%",
          backgroundColor: "rgba(255,255,255,0.14)",
        }}
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "18px 80px",
          position: "relative",
          zIndex: 10,
        }}
      >
        <div
          style={{
            height: "12px",
            width: "1px",
            backgroundColor: "rgba(255,255,255,0.5)",
          }}
        />
        <span
          style={{
            fontFamily: "monospace",
            fontSize: "11px",
            color: "rgba(255,255,255,0.35)",
            letterSpacing: "-0.02em",
            textTransform: "uppercase" as const,
          }}
        >
          blyp
        </span>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "0 80px",
          marginTop: "auto",
          marginBottom: "100px",
          position: "relative",
          zIndex: 10,
        }}
      >
        <h1
          style={{
            fontFamily: "sans-serif",
            fontSize: title.length > 40 ? "48px" : title.length > 25 ? "56px" : "68px",
            fontWeight: 700,
            color: "#ffffff",
            letterSpacing: "-0.04em",
            lineHeight: 0.95,
            margin: 0,
            padding: 0,
            maxWidth: "850px",
          }}
        >
          {title}
        </h1>

        {description && (
          <p
            style={{
              fontFamily: "monospace",
              fontSize: "14px",
              color: "rgba(255,255,255,0.4)",
              letterSpacing: "0.03em",
              textTransform: "uppercase" as const,
              lineHeight: 1.6,
              margin: 0,
              marginTop: "20px",
              maxWidth: "650px",
            }}
          >
            {description}
          </p>
        )}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 80px",
          position: "relative",
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span
            style={{
              fontFamily: "monospace",
              fontSize: "10px",
              color: "rgba(255,255,255,0.25)",
              textTransform: "uppercase" as const,
              letterSpacing: "0.08em",
            }}
          >
            documentation
          </span>
          <div
            style={{
              height: "10px",
              width: "1px",
              backgroundColor: "rgba(255,255,255,0.15)",
            }}
          />
          <span
            style={{
              fontFamily: "monospace",
              fontSize: "10px",
              color: "rgba(255,255,255,0.2)",
              textTransform: "uppercase" as const,
              letterSpacing: "0.05em",
            }}
          >
            github.com/Blyphq/blyp
          </span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#ffffff",
            color: "#000000",
            padding: "7px 18px",
            fontFamily: "monospace",
            fontSize: "10px",
            textTransform: "uppercase" as const,
            letterSpacing: "0.06em",
          }}
        >
          Read docs →
        </div>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
    },
  );

  return imageResponse;
}
