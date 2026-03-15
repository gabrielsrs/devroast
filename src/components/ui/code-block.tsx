import { createHighlighter } from "shiki";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  className?: string;
  showLineNumbers?: boolean;
  fileName?: string;
  showHeader?: boolean;
}

let highlighterInstance: ReturnType<typeof createHighlighter> | null = null;

async function getHighlighter() {
  if (!highlighterInstance) {
    highlighterInstance = createHighlighter({
      themes: ["vesper"],
      langs: [
        "javascript",
        "typescript",
        "python",
        "rust",
        "go",
        "java",
        "cpp",
        "html",
        "css",
        "json",
      ],
    });
  }
  return highlighterInstance;
}

function detectLanguage(code: string): string {
  if (
    code.includes("function") ||
    code.includes("const ") ||
    code.includes("let ") ||
    code.includes("=>")
  ) {
    return "javascript";
  }
  if (
    code.includes("def ") ||
    (code.includes("import ") && code.includes(":"))
  ) {
    return "python";
  }
  if (code.includes("fn ") && code.includes("->")) {
    return "rust";
  }
  if (code.includes("func ") && code.includes("package")) {
    return "go";
  }
  return "javascript";
}

function CodeBlockHeader({
  fileName,
  lang,
}: {
  fileName?: string;
  lang: string;
}) {
  return (
    <div className="flex items-center gap-3 border-b border-border px-4 py-2.5">
      <span className="h-[10px] w-[10px] rounded-full bg-[#EF4444]" />
      <span className="h-[10px] w-[10px] rounded-full bg-[#F59E0B]" />
      <span className="h-[10px] w-[10px] rounded-full bg-[#10B981]" />
      <div className="flex-1" />
      {fileName && (
        <span className="text-[12px] text-text-tertiary">{fileName}</span>
      )}
      {!fileName && (
        <span className="text-[12px] text-text-tertiary">{lang}</span>
      )}
    </div>
  );
}

export { CodeBlockHeader };

function processHtml(html: string): string {
  return html
    .replace(/^<pre[^>]*>/, "")
    .replace(/<\/pre>$/, "")
    .replace(/^<code[^>]*>/, "")
    .replace(/<\/code>$/, "");
}

export async function CodeBlock({
  code,
  className,
  showLineNumbers = true,
  fileName,
  showHeader = true,
}: CodeBlockProps) {
  const highlighter = await getHighlighter();
  const lang = detectLanguage(code);
  const lines = code.split("\n");

  const html = highlighter.codeToHtml(code, {
    lang,
    theme: "vesper",
  });

  const processedHtml = processHtml(html);

  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-none border border-border bg-input font-jetbrains",
        className,
      )}
    >
      {showHeader && <CodeBlockHeader fileName={fileName} lang={lang} />}
      <div className="flex">
        {showLineNumbers && (
          <div className="flex flex-col border-r border-border bg-bg-surface py-3 pl-3 pr-[10px] text-right">
            {lines.map((_, i) => {
              const lineNum = `line-${i + 1}`;
              return (
                <span
                  key={lineNum}
                  className="text-[13px] leading-[1.5] text-text-tertiary"
                >
                  {i + 1}
                </span>
              );
            })}
          </div>
        )}
        {/* eslint-disable-next-line react/no-danger */}
        <div
          className="flex-1 overflow-x-auto p-3 whitespace-pre-wrap break-all"
          dangerouslySetInnerHTML={{ __html: processedHtml }}
        />
      </div>
    </div>
  );
}
