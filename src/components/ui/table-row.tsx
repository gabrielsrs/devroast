import { type HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface TableRowProps extends HTMLAttributes<HTMLDivElement> {
  rank?: string | number;
  score?: string | number;
  codePreview?: string;
  language?: string;
}

const TableRow = forwardRef<HTMLDivElement, TableRowProps>(
  ({ className, rank, score, codePreview, language, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center gap-6 border-b border-border px-5 py-4 font-jetbrains",
          className,
        )}
        {...props}
      >
        {rank !== undefined && (
          <div className="w-10 text-[13px] text-text-tertiary">{rank}</div>
        )}
        {score !== undefined && (
          <div className="w-[60px] text-[13px] font-[700] text-accent-red">
            {score}
          </div>
        )}
        {codePreview !== undefined && (
          <div className="flex-1 truncate text-[12px] text-text-secondary">
            {codePreview}
          </div>
        )}
        {language !== undefined && (
          <div className="w-[100px] text-[12px] text-text-tertiary">
            {language}
          </div>
        )}
      </div>
    );
  },
);

TableRow.displayName = "TableRow";

export { TableRow };
