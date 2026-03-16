import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CodeBlock } from "@/components/ui/code-block";
import { ScoreRing } from "@/components/ui/score-ring";
import { trpcCaller } from "@/lib/trpc/server";

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
      </div>
    </div>
  );
}
