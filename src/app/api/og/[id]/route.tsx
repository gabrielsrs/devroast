import { ImageResponse } from "@takumi-rs/image-response";
import { eq, sql } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { roasts, submissions } from "@/db/schema";

const verdictColors: Record<string, string> = {
  decent_code: "#10B981",
  needs_work: "#F59E0B",
  needs_improvement: "#F97316",
  needs_serious_help: "#EF4444",
};

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isValidUUID(id: string): boolean {
  return UUID_REGEX.test(id);
}

function getVerdict(score: number): string {
  if (score >= 8) return "decent_code";
  if (score >= 6) return "needs_work";
  if (score >= 4) return "needs_improvement";
  return "needs_serious_help";
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  if (!isValidUUID(id)) {
    return new NextResponse("Invalid ID", { status: 400 });
  }

  const result = await db
    .select({
      id: roasts.id,
      score: roasts.score,
      roastContent: roasts.roastContent,
      code: submissions.code,
      language: submissions.language,
    })
    .from(roasts)
    .innerJoin(submissions, sql`${roasts.submissionId} = ${submissions.id}`)
    .where(eq(roasts.id, id))
    .limit(1);

  if (result.length === 0) {
    return new NextResponse("Not found", { status: 404 });
  }

  const row = result[0];
  const score = row.score / 10;
  const verdict = getVerdict(row.score);
  const verdictColor = verdictColors[verdict];
  const lines = row.code.split("\n").length;
  const displayContent =
    row.roastContent.length > 200
      ? row.roastContent.slice(0, 200) + "..."
      : row.roastContent;

  const image = new ImageResponse(
    <div
      style={{
        width: 1200,
        height: 630,
        backgroundColor: "#0C0C0C",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 28,
        padding: 64,
      }}
    >
      {/* Logo */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span style={{ color: "#10B981", fontSize: 24, fontWeight: 700 }}>
          {">"}
        </span>
        <span
          style={{
            color: "#FAFAFA",
            fontSize: 20,
            fontFamily: "JetBrains Mono",
          }}
        >
          devroast
        </span>
      </div>

      {/* Score */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: 4,
        }}
      >
        <span
          style={{
            color: "#F59E0B",
            fontSize: 160,
            fontWeight: 900,
            lineHeight: 1,
          }}
        >
          {score.toFixed(1)}
        </span>
        <span
          style={{
            color: "#737373",
            fontSize: 56,
            lineHeight: 1,
          }}
        >
          /10
        </span>
      </div>

      {/* Verdict */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: 6,
            backgroundColor: verdictColor,
          }}
        />
        <span style={{ color: verdictColor, fontSize: 20 }}>{verdict}</span>
      </div>

      {/* Language info */}
      <span
        style={{
          color: "#737373",
          fontSize: 16,
          fontFamily: "JetBrains Mono",
        }}
      >
        lang: {row.language} · {lines} lines
      </span>

      {/* Roast quote */}
      <p
        style={{
          color: "#FAFAFA",
          fontSize: 22,
          textAlign: "center",
          fontFamily: "IBM Plex Mono",
          lineHeight: 1.5,
          maxWidth: 1000,
          margin: 0,
        }}
      >
        "{displayContent}"
      </p>
    </div>,
    {
      width: 1200,
      height: 630,
      format: "png",
    },
  );

  const arrayBuffer = await image.arrayBuffer();

  return new NextResponse(arrayBuffer, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
