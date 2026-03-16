"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { submitRoastAction } from "@/components/roast-form-server";
import { Button } from "@/components/ui/button";
import { CodeEditor } from "@/components/ui/code-editor";
import { Toggle } from "@/components/ui/toggle";

const SAMPLE_CODE = `function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total = total + items[i].price;
  }
  return total;
}`;

export function HomeClient() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [roastMode, setRoastMode] = useState(false);
  const [isOverLimit, setIsOverLimit] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = () => {
    const formData = new FormData();
    formData.set("code", code);
    formData.set("language", language);
    formData.set("roastMode", roastMode ? "helpful" : "sarcastic");

    startTransition(async () => {
      await submitRoastAction(formData);
      router.refresh();
    });
  };

  return (
    <div className="flex w-full max-w-[960px] flex-col items-center gap-8 py-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <h1 className="flex items-center gap-3 font-jetbrains text-[36px] font-[700]">
          <span className="text-accent-green">{"//"}</span>
          <span className="text-text-primary">
            paste your code. get roasted.
          </span>
        </h1>
        <p className="font-ibm-plex-mono text-[14px] text-text-secondary">
          {"//"} drop your code below and we&apos;ll rate it — brutally honest
          or full roast mode
        </p>
      </div>

      <CodeEditor
        value={code}
        onChange={setCode}
        onLanguageChange={setLanguage}
        onLimitChange={setIsOverLimit}
        placeholder={SAMPLE_CODE}
        className="w-[780px] max-w-full"
      />

      <div className="flex w-[780px] max-w-full items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Toggle pressed={roastMode} onPressedChange={setRoastMode}>
            roast mode
          </Toggle>
          <span className="font-ibm-plex-mono text-[12px] text-text-tertiary">
            {"//"} {roastMode ? "maximum sarcasm enabled" : "helpful feedback"}
          </span>
        </div>
        <Button
          disabled={!code.trim() || isOverLimit || isPending}
          onClick={handleSubmit}
        >
          {isPending ? "$ roasting..." : "$ roast_my_code"}
        </Button>
      </div>
    </div>
  );
}
