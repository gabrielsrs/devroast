"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LanguageSelector } from "@/components/ui/language-selector";
import { Toggle } from "@/components/ui/toggle";

interface RoastFormClientProps {
  action: string;
}

export function RoastFormClient({ action }: RoastFormClientProps) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [isSarcastic, setIsSarcastic] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!code.trim()) {
      setError("Code is required");
      return;
    }

    setIsLoading(true);
    setError("");

    const formData = new FormData();
    formData.set("code", code);
    formData.set("language", language);
    formData.set("roastMode", isSarcastic ? "sarcastic" : "helpful");

    try {
      const response = await fetch(action, {
        method: "POST",
        body: formData,
      });

      if (response.redirected) {
        router.push(response.url);
      } else {
        const data = await response.json();
        if (data.error) {
          setError(data.error);
        }
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-[600px] flex-col gap-4"
    >
      {error && (
        <div className="font-jetbrains text-[12px] text-accent-red">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label
          htmlFor="code-input"
          className="font-jetbrains text-[12px] text-text-secondary"
        >
          paste_your_code
        </label>
        <textarea
          id="code-input"
          name="code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="// paste your terrible code here..."
          className="min-h-[200px] w-full resize-none rounded-none border border-border bg-bg-surface p-4 font-jetbrains text-[13px] text-text-primary placeholder:text-text-tertiary focus:border-accent-green focus:outline-none"
          required
        />
      </div>

      <div className="flex items-center gap-4">
        <div className="flex w-[180px] flex-col gap-2">
          <span className="font-jetbrains text-[12px] text-text-secondary">
            language
          </span>
          <LanguageSelector value={language} onChange={setLanguage} />
        </div>

        <div className="flex flex-col gap-2">
          <span className="font-jetbrains text-[12px] text-text-secondary">
            roast_mode
          </span>
          <Toggle pressed={isSarcastic} onPressedChange={setIsSarcastic}>
            {isSarcastic ? "sarcastic" : "helpful"}
          </Toggle>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading} variant="default">
          <span>$</span>
          <span>{isLoading ? "roasting..." : "roast_it"}</span>
        </Button>
      </div>
    </form>
  );
}
