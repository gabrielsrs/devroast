"use client";

import { Suspense, useState } from "react";
import { Button } from "./button";
import { Toggle } from "./toggle";
import { Badge } from "./badge";
import { Card } from "./card";
import { DiffLine } from "./diff-line";
import { ScoreRing } from "./score-ring";
import { TableRow } from "./table-row";

const sampleCode = `function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total = total + items[i].price;
  }
  return total;
}`;

async function CodeBlockShowcase() {
  const { CodeBlock } = await import("./code-block");
  return <CodeBlock code={sampleCode} fileName="calculate.js" />;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-center gap-2 font-jetbrains text-[14px] font-[700]">
      <span className="text-accent-green">{"//"}</span>
      <span className="text-text-primary">{children}</span>
    </div>
  );
}

export function ButtonShowcase() {
  const variants = [
    "default",
    "secondary",
    "outline",
    "ghost",
    "destructive",
    "link",
  ] as const;
  const sizes = ["default", "sm", "lg", "icon"] as const;

  return (
    <section className="mb-12">
      <SectionTitle>buttons</SectionTitle>

      <div className="space-y-8">
        <div>
          <h3 className="mb-3 text-lg font-medium">Variants</h3>
          <div className="flex flex-wrap gap-4">
            {variants.map((variant) => (
              <Button key={variant} variant={variant}>
                {variant}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-lg font-medium">Sizes</h3>
          <div className="flex flex-wrap items-center gap-4">
            {sizes.map((size) => (
              <Button key={size} size={size}>
                {size}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-lg font-medium">With Icon</h3>
          <div className="flex flex-wrap gap-4">
            <Button>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <title>Add</title>
                <path d="M5 12h14" />
                <path d="M12 5v14" />
              </svg>
              Add Item
            </Button>
            <Button variant="secondary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <title>Download</title>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" x2="12" y1="15" y2="3" />
              </svg>
              Download
            </Button>
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-lg font-medium">Disabled</h3>
          <div className="flex flex-wrap gap-4">
            <Button disabled>Disabled</Button>
            <Button variant="secondary" disabled>
              Disabled
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ToggleShowcase() {
  const [pressed, setPressed] = useState(false);

  return (
    <section className="mb-12">
      <SectionTitle>toggle</SectionTitle>

      <div className="space-y-8">
        <div>
          <h3 className="mb-3 text-lg font-medium">States</h3>
          <div className="flex flex-wrap gap-8">
            <Toggle pressed={true}>roast mode</Toggle>
            <Toggle pressed={pressed} onPressedChange={setPressed}>
              roast mode
            </Toggle>
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-lg font-medium">Outline</h3>
          <div className="flex flex-wrap gap-8">
            <Toggle pressed={true} variant="outline">
              roast mode
            </Toggle>
            <Toggle pressed={false} variant="outline">
              roast mode
            </Toggle>
          </div>
        </div>
      </div>
    </section>
  );
}

export function BadgeShowcase() {
  return (
    <section className="mb-12">
      <SectionTitle>badge_status</SectionTitle>

      <div className="space-y-8">
        <div>
          <h3 className="mb-3 text-lg font-medium">Variants</h3>
          <div className="flex flex-wrap items-center gap-6">
            <Badge variant="critical">critical</Badge>
            <Badge variant="warning">warning</Badge>
            <Badge variant="good">good</Badge>
            <Badge variant="needs_serious_help">needs_serious_help</Badge>
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-lg font-medium">Without dot</h3>
          <div className="flex flex-wrap items-center gap-6">
            <Badge variant="critical" showDot={false}>
              critical
            </Badge>
            <Badge variant="warning" showDot={false}>
              warning
            </Badge>
          </div>
        </div>
      </div>
    </section>
  );
}

export function CardShowcase() {
  return (
    <section className="mb-12">
      <SectionTitle>cards</SectionTitle>

      <div className="space-y-8">
        <div>
          <h3 className="mb-3 text-lg font-medium">Analysis Card</h3>
          <Card status="critical" statusLabel="critical">
            <p className="font-jetbrains text-[13px] text-text-primary">
              using var instead of const/let
            </p>
            <p className="mt-2 font-ibm-plex-mono text-[12px] leading-relaxed text-text-secondary">
              the var keyword is function-scoped rather than block-scoped, which
              can lead to unexpected behavior and bugs. modern javascript uses
              const for immutable bindings and let for mutable ones.
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
}

export function CodeBlockShowcaseSection() {
  return (
    <section className="mb-12">
      <SectionTitle>code_block</SectionTitle>

      <div className="space-y-8">
        <div>
          <h3 className="mb-3 text-lg font-medium">Default</h3>
          <Suspense
            fallback={
              <div className="h-[200px] w-full animate-pulse bg-input" />
            }
          >
            <CodeBlockShowcase />
          </Suspense>
        </div>
      </div>
    </section>
  );
}

export function DiffLineShowcase() {
  return (
    <section className="mb-12">
      <SectionTitle>diff_line</SectionTitle>

      <div className="space-y-8">
        <div>
          <h3 className="mb-3 text-lg font-medium">Variants</h3>
          <div className="w-[560px] overflow-hidden rounded-none border border-border bg-input">
            <DiffLine variant="removed" prefix="-">
              var total = 0;
            </DiffLine>
            <DiffLine variant="added" prefix="+">
              const total = 0;
            </DiffLine>
            <DiffLine variant="context" prefix=" ">
              for (let i = 0; i &lt; items.length; i++) {"{"}
            </DiffLine>
          </div>
        </div>
      </div>
    </section>
  );
}

export function TableRowShowcase() {
  return (
    <section className="mb-12">
      <SectionTitle>table_row</SectionTitle>

      <div className="space-y-8">
        <div>
          <h3 className="mb-3 text-lg font-medium">Leaderboard Row</h3>
          <div className="w-full overflow-hidden rounded-none border border-border bg-card">
            <TableRow
              rank="#1"
              score="2.1"
              codePreview="function calculateTotal(items) { var total = 0; ..."
              language="javascript"
            />
            <TableRow
              rank="#2"
              score="3.5"
              codePreview="const addNumbers = (a, b) => a + b;"
              language="typescript"
            />
            <TableRow
              rank="#3"
              score="8.2"
              codePreview="def hello_world(): print('Hello')"
              language="python"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export function ScoreRingShowcase() {
  return (
    <section className="mb-12">
      <SectionTitle>score_ring</SectionTitle>

      <div className="space-y-8">
        <div>
          <h3 className="mb-3 text-lg font-medium">Sizes</h3>
          <div className="flex flex-wrap items-center gap-8">
            <ScoreRing score={3.5} size="sm" />
            <ScoreRing score={7.2} />
            <ScoreRing score={9.8} size="lg" />
          </div>
        </div>
      </div>
    </section>
  );
}
