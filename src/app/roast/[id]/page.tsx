import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CodeBlock } from "@/components/ui/code-block";
import { DiffLine } from "@/components/ui/diff-line";
import { ScoreRing } from "@/components/ui/score-ring";

interface RoastResultPageProps {
  params: Promise<{
    id: string;
  }>;
}

const MOCK_ROAST_DATA = {
  id: "123e4567-e89b-12d3-a456-426614174000",
  score: "3.5",
  verdict: "needs_serious_help",
  roastTitle:
    '"this code looks like it was written during a power outage... in 2005."',
  language: "javascript",
  lines: 16,
  code: `function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total = total + items[i].price;
  }
  if (total > 100) {
    console.log("discount applied");
    total = total * 0.9;
  }
  // TODO: handle tax calculation
  // TODO: handle currency conversion
  return total;
}`,
  issues: [
    {
      severity: "critical" as const,
      title: "using var instead of const/let",
      description:
        "var is function-scoped and leads to hoisting bugs. use const by default, let when reassignment is needed.",
    },
    {
      severity: "warning" as const,
      title: "imperative loop pattern",
      description:
        "for loops are verbose and error-prone. use .reduce() or .map() for cleaner, functional transformations.",
    },
    {
      severity: "good" as const,
      title: "clear naming conventions",
      description:
        "calculateTotal and items are descriptive, self-documenting names that communicate intent without comments.",
    },
    {
      severity: "good" as const,
      title: "single responsibility",
      description:
        "the function does one thing well — calculates a total. no side effects, no mixed concerns, no hidden complexity.",
    },
  ],
  suggestedFix: `function calculateTotal(items) {
-   var total = 0;
-   for (var i = 0; i < items.length; i++) {
-     total = total + items[i].price;
-   }
-   return total;
+   return items.reduce((sum, item) => sum + item.price, 0);
}`,
};

export async function generateMetadata() {
  return {
    title: "Roast Result | devroast",
    description: "Your code got roasted",
  };
}

export default async function RoastResultPage({
  params,
}: RoastResultPageProps) {
  const { id: _id } = await params;
  const data = MOCK_ROAST_DATA;

  return (
    <div className="flex w-full flex-col gap-10 pb-16 pt-10">
      <div className="flex flex-col gap-12 px-20">
        <div className="flex items-start gap-12">
          <ScoreRing score={parseFloat(data.score)} />

          <div className="flex flex-col items-start gap-4">
            <Badge variant="needs_serious_help">verdict: {data.verdict}</Badge>
            <h1 className="max-w-[600px] font-ibm-plex-mono text-[20px] leading-[1.5] text-text-primary">
              {data.roastTitle}
            </h1>
            <div className="flex items-center gap-4">
              <span className="font-jetbrains text-[12px] text-text-tertiary">
                lang: {data.language}
              </span>
              <span className="font-jetbrains text-[12px] text-text-tertiary">
                ·
              </span>
              <span className="font-jetbrains text-[12px] text-text-tertiary">
                {data.lines} lines
              </span>
            </div>
            <Button variant="outline" size="sm">
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
            code={data.code}
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
            {data.issues.map((issue) => (
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

        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <span className="font-jetbrains text-[14px] font-[700] text-accent-green">
              {"//"}
            </span>
            <span className="font-jetbrains text-[14px] font-[700] text-text-primary">
              suggested_fix
            </span>
          </div>
          <div className="flex flex-col rounded-none border border-border bg-input">
            <div className="flex h-10 items-center gap-2 border-b border-border px-4">
              <span className="font-jetbrains text-[12px] font-[500] text-text-secondary">
                your_code.ts → improved_code.ts
              </span>
            </div>
            <DiffLine variant="context">
              function calculateTotal(items) {"{"}
            </DiffLine>
            <DiffLine variant="removed" prefix="-">
              var total = 0;
            </DiffLine>
            <DiffLine variant="removed" prefix="-">
              for (var i = 0; i &lt; items.length; i++) {"{"}
            </DiffLine>
            <DiffLine variant="removed" prefix="-">
              total = total + items[i].price;
            </DiffLine>
            <DiffLine variant="removed" prefix="-">
              {"}"}
            </DiffLine>
            <DiffLine variant="removed" prefix="-">
              return total;
            </DiffLine>
            <DiffLine variant="added" prefix="+">
              return items.reduce((sum, item) =&gt; sum + item.price, 0);
            </DiffLine>
            <DiffLine variant="context">{"}"}</DiffLine>
          </div>
        </div>
      </div>
    </div>
  );
}
