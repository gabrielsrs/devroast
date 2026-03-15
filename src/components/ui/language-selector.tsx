"use client";

import { useCallback, useState } from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "@/lib/utils";

const selectorVariants = tv({
  base: "relative",
  variants: {
    size: {
      sm: "text-xs",
      default: "text-sm",
      lg: "text-base",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

export interface LanguageSelectorProps
  extends VariantProps<typeof selectorVariants> {
  value?: string;
  onChange?: (value: string) => void;
  languages?: { id: string; label: string }[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const DEFAULT_LANGUAGES = [
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
  { id: "sql", label: "SQL" },
  { id: "bash", label: "Bash" },
  { id: "markdown", label: "Markdown" },
];

export function LanguageSelector({
  className,
  size,
  value,
  onChange,
  languages = DEFAULT_LANGUAGES,
  placeholder = "Select language",
  disabled,
  ...props
}: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const selectedLanguage = languages.find((l) => l.id === value);

  const filteredLanguages = languages.filter(
    (lang) =>
      lang.label.toLowerCase().includes(search.toLowerCase()) ||
      lang.id.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSelect = useCallback(
    (id: string) => {
      onChange?.(id);
      setIsOpen(false);
      setSearch("");
    },
    [onChange],
  );

  return (
    <div className={cn(selectorVariants({ size, className }))} {...props}>
      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={cn(
            "flex h-9 w-full items-center justify-between rounded-none border border-border bg-bg-surface px-3 py-1.5 text-left text-text-primary outline-none transition-colors",
            "hover:border-text-secondary focus:border-accent-green disabled:opacity-50",
            isOpen && "border-accent-green",
          )}
        >
          <span className={selectedLanguage ? "" : "text-text-tertiary"}>
            {selectedLanguage?.label || placeholder}
          </span>
          <svg
            aria-hidden="true"
            className={cn(
              "h-4 w-4 text-text-tertiary transition-transform",
              isOpen && "rotate-180",
            )}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-none border border-border bg-bg-surface shadow-lg">
            <div className="border-b border-border p-2">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="w-full bg-transparent px-2 py-1 text-sm text-text-primary outline-none placeholder:text-text-tertiary"
              />
            </div>
            <div className="py-1">
              {filteredLanguages.map((lang) => (
                <button
                  key={lang.id}
                  type="button"
                  onClick={() => handleSelect(lang.id)}
                  className={cn(
                    "w-full px-3 py-1.5 text-left transition-colors hover:bg-bg-surface",
                    value === lang.id
                      ? "bg-accent-green/10 text-accent-green"
                      : "text-text-primary hover:text-text-secondary",
                  )}
                >
                  {lang.label}
                </button>
              ))}
              {filteredLanguages.length === 0 && (
                <div className="px-3 py-2 text-sm text-text-tertiary">
                  No languages found
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
