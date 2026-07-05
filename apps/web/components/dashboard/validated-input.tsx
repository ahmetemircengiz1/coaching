"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";

interface ValidatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  /** Show error only after the field has been touched (blurred) */
  showOnBlur?: boolean;
}

export function ValidatedInput({ error, showOnBlur = true, onBlur, className, style, ...props }: ValidatedInputProps) {
  const [touched, setTouched] = useState(false);
  const showError = error && (!showOnBlur || touched);

  return (
    <div className="w-full">
      <Input
        {...props}
        className={className}
        style={{
          ...style,
          ...(showError ? { borderColor: "#ef4444" } : {}),
        }}
        onBlur={(e) => {
          setTouched(true);
          onBlur?.(e);
        }}
      />
      {showError && (
        <p className="text-xs mt-1" style={{ color: "#ef4444" }}>{error}</p>
      )}
    </div>
  );
}
