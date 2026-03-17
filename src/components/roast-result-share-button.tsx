"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface ShareButtonProps {
  initialUrl: string;
}

export function RoastResultShareButton({ initialUrl }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(initialUrl);
      setCopied(true);
      setError(false);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <Button variant="outline" size="sm" onClick={handleShare}>
      <span>$</span>
      <span>{error ? "failed!" : copied ? "copied!" : "share_roast"}</span>
    </Button>
  );
}
