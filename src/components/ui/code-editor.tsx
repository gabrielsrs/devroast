"use client";

import {
  type HTMLAttributes,
  type TextareaHTMLAttributes,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createHighlighter, type Highlighter } from "shiki";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "@/lib/utils";

const editorVariants = tv({
  base: "relative flex flex-col w-full rounded-none border border-border bg-input font-jetbrains",
  variants: {
    size: {
      default: "max-h-[360px]",
      sm: "max-h-[240px]",
      lg: "max-h-[440px]",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

export interface CodeEditorProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange">,
    VariantProps<typeof editorVariants> {
  value?: string;
  onChange?: (value: string) => void;
  language?: string;
  onLanguageChange?: (language: string) => void;
  showLineNumbers?: boolean;
  placeholder?: string;
  disabled?: boolean;
  maxLines?: number;
  onLimitChange?: (isOverLimit: boolean) => void;
  textareaProps?: Omit<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    "className"
  >;
}

const MAX_LINES_DEFAULT = 100;

const SUPPORTED_LANGUAGES = [
  { id: "javascript", label: "JavaScript" },
  { id: "typescript", label: "TypeScript" },
  { id: "python", label: "Python" },
  { id: "rust", label: "Rust" },
  { id: "go", label: "Go" },
  { id: "java", label: "Java" },
  { id: "cpp", label: "C++" },
  { id: "c", label: "C" },
  { id: "csharp", label: "C#" },
  { id: "ruby", label: "Ruby" },
  { id: "php", label: "PHP" },
  { id: "swift", label: "Swift" },
  { id: "kotlin", label: "Kotlin" },
  { id: "html", label: "HTML" },
  { id: "css", label: "CSS" },
  { id: "scss", label: "SCSS" },
  { id: "json", label: "JSON" },
  { id: "yaml", label: "YAML" },
  { id: "xml", label: "XML" },
  { id: "sql", label: "SQL" },
  { id: "bash", label: "Bash" },
  { id: "shell", label: "Shell" },
  { id: "markdown", label: "Markdown" },
  { id: "dockerfile", label: "Dockerfile" },
  { id: "jsx", label: "JSX" },
  { id: "tsx", label: "TSX" },
];

let highlighterPromise: Promise<Highlighter> | null = null;

function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ["vesper"],
      langs: SUPPORTED_LANGUAGES.map((l) => l.id),
    });
  }
  return highlighterPromise;
}

function detectLanguage(code: string): string {
  if (!code.trim()) return "javascript";

  const trimmed = code.trim();

  if (
    trimmed.includes("function") ||
    trimmed.includes("const ") ||
    trimmed.includes("let ") ||
    trimmed.includes("var ") ||
    trimmed.includes("=>")
  ) {
    if (
      trimmed.includes(": string") ||
      trimmed.includes(": number") ||
      trimmed.includes("interface ")
    ) {
      return "typescript";
    }
    return "javascript";
  }

  if (
    trimmed.includes("def ") ||
    (trimmed.includes("import ") && trimmed.includes(":"))
  ) {
    return "python";
  }

  if (trimmed.includes("fn ") && trimmed.includes("->")) {
    return "rust";
  }

  if (trimmed.includes("func ") && trimmed.includes("package")) {
    return "go";
  }

  if (trimmed.includes("public class") || trimmed.includes("private void")) {
    return "java";
  }

  if (trimmed.includes("<!DOCTYPE html") || trimmed.startsWith("<html")) {
    return "html";
  }

  if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
    try {
      JSON.parse(trimmed);
      return "json";
    } catch {
      // Not JSON
    }
  }

  if (
    trimmed.includes("SELECT ") ||
    trimmed.includes("INSERT ") ||
    trimmed.includes("UPDATE ")
  ) {
    return "sql";
  }

  if (trimmed.startsWith("#!/bin/bash") || trimmed.startsWith("#!/bin/sh")) {
    return "bash";
  }

  if (trimmed.includes("import React") || trimmed.includes("from 'react'")) {
    if (trimmed.includes(": React.FC") || trimmed.includes("interface ")) {
      return "tsx";
    }
    return "jsx";
  }

  return "javascript";
}

export function CodeEditor({
  className,
  size,
  value = "",
  onChange,
  language: controlledLanguage,
  onLanguageChange,
  showLineNumbers = true,
  placeholder,
  disabled,
  maxLines = MAX_LINES_DEFAULT,
  onLimitChange,
  textareaProps,
  ...props
}: CodeEditorProps) {
  const [language, setLanguage] = useState(controlledLanguage || "javascript");
  const [highlightedHtml, setHighlightedHtml] = useState("");
  const [isHighlightReady, setIsHighlightReady] = useState(false);
  const [highlighter, setHighlighter] = useState<Highlighter | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const currentLanguage = controlledLanguage ?? language;

  const lineCount = value.split("\n").length;
  const charCount = value.length;
  const isOverLimit = lineCount > maxLines;

  const lines = useMemo(() => {
    const lineCountVal = value.split("\n").length;
    return Array.from({ length: Math.max(lineCountVal, 14) }, (_, i) => i + 1);
  }, [value]);

  useEffect(() => {
    getHighlighter().then(setHighlighter).catch(console.error);
  }, []);

  useEffect(() => {
    if (!highlighter || !value) {
      setHighlightedHtml("");
      return;
    }

    const timeoutId = setTimeout(() => {
      try {
        const detectedLang = controlledLanguage
          ? currentLanguage
          : detectLanguage(value);

        if (
          !controlledLanguage &&
          onLanguageChange &&
          detectedLang !== language
        ) {
          setLanguage(detectedLang);
          onLanguageChange(detectedLang);
        }

        const langToUse = controlledLanguage || detectedLang;

        const processedHtml = highlighter.codeToHtml(value, {
          lang: langToUse,
          theme: "vesper",
        });

        const processed = processedHtml
          .replace(/^<pre[^>]*>/, "")
          .replace(/<\/pre>$/, "")
          .replace(/^<code[^>]*>/, "")
          .replace(/<\/code>$/, "");

        setHighlightedHtml(processed);
        setIsHighlightReady(true);
      } catch {
        setHighlightedHtml("");
      }
    }, 150);

    return () => clearTimeout(timeoutId);
  }, [
    value,
    highlighter,
    controlledLanguage,
    currentLanguage,
    onLanguageChange,
    language,
  ]);

  useEffect(() => {
    onLimitChange?.(isOverLimit);
  }, [isOverLimit, onLimitChange]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange?.(e.target.value);
    },
    [onChange],
  );

  const handleLanguageChange = useCallback(
    (newLang: string) => {
      setLanguage(newLang);
      onLanguageChange?.(newLang);
    },
    [onLanguageChange],
  );

  return (
    <div className={cn(editorVariants({ size, className }))} {...props}>
      {/* Header */}
      <div className="flex h-10 flex-shrink-0 items-center gap-3 border-b border-border px-4">
        <span className="h-3 w-3 rounded-full bg-[#EF4444]" />
        <span className="h-3 w-3 rounded-full bg-[#F59E0B]" />
        <span className="h-3 w-3 rounded-full bg-[#10B981]" />
        <div className="flex-1" />
        <select
          value={currentLanguage}
          onChange={(e) => handleLanguageChange(e.target.value)}
          disabled={disabled}
          className="bg-transparent px-2 py-1 text-[12px] text-text-secondary outline-none hover:text-text-primary disabled:opacity-50"
        >
          {SUPPORTED_LANGUAGES.map((lang) => (
            <option key={lang.id} value={lang.id} className="bg-bg-surface">
              {lang.label}
            </option>
          ))}
        </select>
      </div>

      {/* Scroll Container */}
      <div ref={scrollContainerRef} className="flex-1 overflow-auto">
        <div className="flex min-h-full">
          {/* Line Numbers */}
          {showLineNumbers && (
            <div className="flex flex-shrink-0 flex-col border-r border-border py-3 pl-4 pr-3 text-right">
              {lines.map((num) => (
                <span
                  key={num}
                  className="text-[12px] leading-[1.5] text-text-tertiary"
                >
                  {num}
                </span>
              ))}
            </div>
          )}

          {/* Code Area */}
          <div className="relative min-h-full flex-1">
            {/* Highlighted Layer */}
            <div
              className={cn(
                "pointer-events-none absolute inset-0 p-3 font-jetbrains text-[12px] leading-[1.5] whitespace-pre-wrap break-all",
                isHighlightReady ? "opacity-100" : "opacity-0",
              )}
              aria-hidden="true"
            >
              {highlightedHtml && (
                <span dangerouslySetInnerHTML={{ __html: highlightedHtml }} />
              )}
            </div>

            {/* Textarea Layer */}
            <textarea
              value={value}
              onChange={handleChange}
              placeholder={placeholder}
              disabled={disabled}
              spellCheck={false}
              className={cn(
                "absolute inset-0 h-full w-full resize-none overflow-hidden bg-transparent p-3 font-jetbrains text-[12px] leading-[1.5] caret-accent-green outline-none placeholder:text-text-tertiary disabled:opacity-50",
                isHighlightReady ? "text-transparent" : "text-text-primary",
              )}
              style={{
                fontFamily: "var(--font-jetbrains), monospace",
              }}
              {...textareaProps}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex h-8 flex-shrink-0 items-center justify-end border-t border-border px-4">
        <span
          className={cn(
            "font-jetbrains text-[11px] text-text-tertiary",
            isOverLimit && "text-accent-red",
          )}
        >
          {lineCount}/{maxLines} lines · {charCount} chars
        </span>
      </div>
    </div>
  );
}
