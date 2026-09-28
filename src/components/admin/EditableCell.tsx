"use client";

import { useEffect, useRef, type KeyboardEvent } from "react";

interface EditableCellProps {
  value: number;
  isActive: boolean;
  onActivate: () => void;
  onChange: (value: number) => void;
  onCancel: () => void;
  formatDisplay?: (value: number) => string;
}

/** با کلیک، تبدیل به textbox می‌شه و همون‌جا می‌مونه (حتی بعد از تایپ) — فقط Esc یا ذخیره‌ی کل صفحه از حالت ویرایش خارجش می‌کنه */
export function EditableCell({ value, isActive, onActivate, onChange, onCancel, formatDisplay }: EditableCellProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isActive) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isActive]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") onCancel();
  };

  if (isActive) {
    return (
      <input
        ref={inputRef}
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        onKeyDown={handleKeyDown}
        className="w-28 rounded-lg border border-primary bg-background px-2 py-1.5 text-foreground outline-none ring-2 ring-primary/20"
      />
    );
  }

  return (
    <button type="button" onClick={onActivate} className="rounded-lg px-2 py-1.5 text-foreground transition hover:bg-muted">
      {formatDisplay ? formatDisplay(value) : value}
    </button>
  );
}