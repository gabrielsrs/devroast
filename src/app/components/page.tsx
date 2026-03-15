import {
  ButtonShowcase,
  ToggleShowcase,
  BadgeShowcase,
  CardShowcase,
  CodeBlockShowcaseSection,
  DiffLineShowcase,
  TableRowShowcase,
  ScoreRingShowcase,
} from "@/components/ui/showcase";

export default function ComponentsPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="mb-8 text-3xl font-bold">UI Components</h1>

      <ButtonShowcase />
      <ToggleShowcase />
      <BadgeShowcase />
      <CardShowcase />
      <CodeBlockShowcaseSection />
      <DiffLineShowcase />
      <TableRowShowcase />
      <ScoreRingShowcase />
    </div>
  );
}
