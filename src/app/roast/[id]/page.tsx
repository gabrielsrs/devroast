import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CodeBlock } from "@/components/ui/code-block";
import { ScoreRing } from "@/components/ui/score-ring";
import { trpcCaller } from "@/lib/trpc/server";

interface DiffLine {
  type: "context" | "removed" | "added";
  content: string;
  lineNumber?: number;
}

function computeDiff(original: string, improved: string): DiffLine[] {
  const originalLines = original.split("\n");
  const improvedLines = improved.split("\n");
  const diff: DiffLine[] = [];

  const maxLen = Math.max(originalLines.length, improvedLines.length);

  for (let i = 0; i < maxLen; i++) {
    const origLine = originalLines[i];
    const imprLine = improvedLines[i];

    if (origLine === imprLine) {
      if (origLine !== undefined) {
        diff.push({ type: "context", content: origLine, lineNumber: i + 1 });
      }
    } else {
      if (origLine !== undefined) {
        diff.push({ type: "removed", content: origLine, lineNumber: i + 1 });
      }
      if (imprLine !== undefined) {
        diff.push({ type: "added", content: imprLine, lineNumber: i + 1 });
      }
    }
  }

  return diff;
}

interface RoastResultPageProps {
  params: Promise<{
    id: string;
  }>;
}

function getVerdict(score: number): string {
  if (score >= 8) return "decent_code";
  if (score >= 6) return "needs_work";
  if (score >= 4) return "needs_improvement";
  return "needs_serious_help";
}

function generateIssues(roastContent: string, score: number) {
  const issues = [];

  if (score < 5) {
    issues.push({
      severity: "critical" as const,
      title: "overall_quality",
      description: roastContent,
    });
  }

  issues.push({
    severity: score >= 7 ? ("good" as const) : ("warning" as const),
    title: "code_style",
    description:
      score >= 7
        ? "Your code follows decent practices. Keep it up!"
        : "Consider improving your code structure and readability.",
  });

  return issues;
}

export async function generateMetadata() {
  return {
    title: "Roast Result | devroast",
    description: "Your code got roasted",
  };
}

export default async function RoastResultPage({
  params,
}: RoastResultPageProps) {
  const { id } = await params;

  let roast: Awaited<
    ReturnType<typeof trpcCaller.metrics.getRoastById>
  > | null = null;
  try {
    roast = await trpcCaller.metrics.getRoastById({ id });
  } catch {
    return (
      <div className="flex w-full flex-col items-center justify-center gap-4 pb-16 pt-10">
        <h1 className="font-jetbrains text-[20px] text-accent-red">
          roast_not_found
        </h1>
        <p className="font-ibm-plex-mono text-[14px] text-text-secondary">
          this roast doesn&apos;t exist or was deleted
        </p>
      </div>
    );
  }

  const verdict = getVerdict(roast.score);
  const issues = generateIssues(roast.roastContent, roast.score);
  const lines = roast.code.split("\n").length;

  return (
    <div className="flex w-full flex-col gap-10 pb-16 pt-10">
      <div className="flex flex-col gap-12 px-20">
        <div className="flex items-start gap-12">
          <ScoreRing score={roast.score} />

          <div className="flex flex-col items-start gap-4">
            <Badge
              variant={
                verdict as
                  | "needs_serious_help"
                  | "needs_improvement"
                  | "needs_work"
                  | "decent_code"
              }
            >
              verdict: {verdict}
            </Badge>
            <h1 className="max-w-[600px] font-ibm-plex-mono text-[20px] leading-[1.5] text-text-primary">
              {roast.roastContent}
            </h1>
            <div className="flex items-center gap-4">
              <span className="font-jetbrains text-[12px] text-text-tertiary">
                lang: {roast.language}
              </span>
              <span className="font-jetbrains text-[12px] text-text-tertiary">
                ·
              </span>
              <span className="font-jetbrains text-[12px] text-text-tertiary">
                {lines} lines
              </span>
            </div>
            <Button variant="outline" size="sm" disabled>
              <span>$</span>
              <span>share_roast</span>
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="font-jetbrains text-[14px] font-[700] text-accent-green">
              {"//"}
            </span>
            <span className="font-jetbrains text-[14px] font-[700] text-text-primary">
              your_submission
            </span>
          </div>
          <CodeBlock
            code={roast.code}
            showLineNumbers={true}
            showHeader={false}
            className="rounded-none border border-border"
          />
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <span className="font-jetbrains text-[14px] font-[700] text-accent-green">
              {"//"}
            </span>
            <span className="font-jetbrains text-[14px] font-[700] text-text-primary">
              detailed_analysis
            </span>
          </div>
          <div className="grid grid-cols-2 gap-5">
            {issues.map((issue) => (
              <Card
                key={issue.title}
                status={issue.severity}
                statusLabel={issue.severity}
              >
                <span className="font-jetbrains text-[13px] font-[500] text-text-primary">
                  {issue.title}
                </span>
                <span className="font-ibm-plex-mono text-[12px] leading-[1.5] text-text-secondary">
                  {issue.description}
                </span>
              </Card>
            ))}
          </div>
        </div>

        {roast.suggestedFix && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="font-jetbrains text-[14px] font-[700] text-accent-green">
                {"//"}
              </span>
              <span className="font-jetbrains text-[14px] font-[700] text-text-primary">
                suggested_fix
              </span>
            </div>
            <div className="flex flex-col rounded-none border border-border bg-bg-surface">
              <div className="flex h-10 items-center gap-2 border-b border-border px-4">
                <span className="font-jetbrains text-[12px] text-text-secondary">
                  {roast.language}.ts
                </span>
                <span className="font-jetbrains text-[12px] text-text-tertiary">
                  →
                </span>
                <span className="font-jetbrains text-[12px] text-accent-green">
                  improved_{roast.language}.ts
                </span>
              </div>
              <div className="max-h-[300px] overflow-auto p-1">
                {computeDiff(roast.code, roast.suggestedFix).map((line) => (
                  <div
                    key={`${line.lineNumber}-${line.type}`}
                    className={`flex font-jetbrains text-[12px] leading-[1.5] ${
                      line.type === "removed"
                        ? "bg-accent-red/10 text-accent-red"
                        : line.type === "added"
                          ? "bg-accent-green/10 text-accent-green"
                          : "text-text-secondary"
                    }`}
                  >
                    <span className="w-8 flex-shrink-0 select-none px-2 text-right text-text-tertiary">
                      {line.lineNumber}
                    </span>
                    <span className="w-4 flex-shrink-0 select-none px-1">
                      {line.type === "removed"
                        ? "-"
                        : line.type === "added"
                          ? "+"
                          : " "}
                    </span>
                    <span className="flex-1 whitespace-pre-wrap px-2">
                      {line.content}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
