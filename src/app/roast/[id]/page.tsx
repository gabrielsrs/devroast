import { CodeBlock } from "@/components/ui/code-block";

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
      severity: "critical",
      title: "using var instead of const/let",
      description:
        "var is function-scoped and leads to hoisting bugs. use const by default, let when reassignment is needed.",
    },
    {
      severity: "warning",
      title: "imperative loop pattern",
      description:
        "for loops are verbose and error-prone. use .reduce() or .map() for cleaner, functional transformations.",
    },
    {
      severity: "good",
      title: "clear naming conventions",
      description:
        "calculateTotal and items are descriptive, self-documenting names that communicate intent without comments.",
    },
    {
      severity: "good",
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
          <div className="flex flex-col items-center gap-4">
            <div className="relative flex h-[180px] w-[180px] items-center justify-center">
              <div className="absolute h-[180px] w-[180px] rounded-full border-4 border-border" />
              <div
                className="absolute h-[180px] w-[180px] rounded-full border-4"
                style={{
                  borderColor: "transparent",
                  borderTopColor: "#ef4444",
                  borderRightColor: "#f59e0b",
                  transform: "rotate(45deg)",
                }}
              />
              <span className="font-jetbrains text-[48px] font-[700] text-accent-amber">
                {data.score}
              </span>
            </div>
            <span className="font-jetbrains text-[16px] text-text-tertiary">
              /10
            </span>
          </div>

          <div className="flex flex-col items-start gap-4">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-accent-red" />
              <span className="font-jetbrains text-[13px] font-[500] text-accent-red">
                verdict: {data.verdict}
              </span>
            </div>
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
            <button
              type="button"
              className="flex items-center gap-2 rounded-none border border-border px-4 py-2 font-jetbrains text-[12px] text-text-primary hover:bg-border/50"
            >
              <span>$</span>
              <span>share_roast</span>
            </button>
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
              <div
                key={issue.title}
                className="flex flex-col gap-3 rounded-none border border-border p-5"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      issue.severity === "critical"
                        ? "bg-accent-red"
                        : issue.severity === "warning"
                          ? "bg-accent-amber"
                          : "bg-accent-green"
                    }`}
                  />
                  <span
                    className={`font-jetbrains text-[12px] font-[500] ${
                      issue.severity === "critical"
                        ? "text-accent-red"
                        : issue.severity === "warning"
                          ? "text-accent-amber"
                          : "text-accent-green"
                    }`}
                  >
                    {issue.severity}
                  </span>
                </div>
                <span className="font-jetbrains text-[13px] font-[500] text-text-primary">
                  {issue.title}
                </span>
                <span className="font-ibm-plex-mono text-[12px] leading-[1.5] text-text-secondary">
                  {issue.description}
                </span>
              </div>
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
            <div className="flex flex-col">
              <div className="flex px-4 py-2">
                <span className="w-5 font-jetbrains text-[12px] text-text-tertiary">
                  {"  "}
                </span>
                <span className="font-jetbrains text-[12px] text-text-primary">
                  function calculateTotal(items) {"{"}
                </span>
              </div>
              <div className="flex bg-red-500/10 px-4 py-2">
                <span className="w-5 font-jetbrains text-[12px] text-accent-red">
                  -{" "}
                </span>
                <span className="font-jetbrains text-[12px] text-accent-red">
                  var total = 0;
                </span>
              </div>
              <div className="flex bg-red-500/10 px-4 py-2">
                <span className="w-5 font-jetbrains text-[12px] text-accent-red">
                  -{" "}
                </span>
                <span className="font-jetbrains text-[12px] text-accent-red">
                  for (var i = 0; i &lt; items.length; i++) {"{"}
                </span>
              </div>
              <div className="flex bg-red-500/10 px-4 py-2">
                <span className="w-5 font-jetbrains text-[12px] text-accent-red">
                  -{" "}
                </span>
                <span className="font-jetbrains text-[12px] text-accent-red">
                  total = total + items[i].price;
                </span>
              </div>
              <div className="flex bg-red-500/10 px-4 py-2">
                <span className="w-5 font-jetbrains text-[12px] text-accent-red">
                  -{" "}
                </span>
                <span className="font-jetbrains text-[12px] text-accent-red">
                  {"}"}
                </span>
              </div>
              <div className="flex bg-red-500/10 px-4 py-2">
                <span className="w-5 font-jetbrains text-[12px] text-accent-red">
                  -{" "}
                </span>
                <span className="font-jetbrains text-[12px] text-accent-red">
                  return total;
                </span>
              </div>
              <div className="flex bg-green-500/10 px-4 py-2">
                <span className="w-5 font-jetbrains text-[12px] text-accent-green">
                  +{" "}
                </span>
                <span className="font-jetbrains text-[12px] text-accent-green">
                  return items.reduce((sum, item) =&gt; sum + item.price, 0);
                </span>
              </div>
              <div className="flex px-4 py-2">
                <span className="w-5 font-jetbrains text-[12px] text-text-tertiary">
                  {"  "}
                </span>
                <span className="font-jetbrains text-[12px] text-text-primary">
                  {"}"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
