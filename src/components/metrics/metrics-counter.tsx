"use client";

import NumberFlow from "@number-flow/react";
import { useEffect, useState } from "react";

interface MetricsCounterProps {
  value: number;
  suffix?: string;
  decimals?: number;
}

export function MetricsCounter({
  value,
  suffix,
  decimals = 0,
}: MetricsCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    setDisplayValue(value);
  }, [value]);

  return (
    <>
      <NumberFlow
        value={displayValue}
        format={{
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
          notation: decimals === 0 ? "compact" : "standard",
        }}
        className="text-text-tertiary"
      />
      {suffix && <span>{suffix}</span>}
    </>
  );
}
