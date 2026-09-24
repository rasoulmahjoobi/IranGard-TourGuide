"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";

interface EditableCellProps {
  value: number;
  onCommit: (newValue: number) => void;
  onCancel: () => void;
  formatDisplay?: (value: number) => string;
}

/** نمایش عدد به‌صورت متن ساده؛ با کلیک تبدیل به textbox می‌شه، Enter/blur ثبت می‌کنه، Esc لغو می‌کنه */
export function EditableCell({ value, onCommit, onCancel, formatDisplay }: EditableCellProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(value));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) {
      setDraft(String(value));
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing, value]);

  const commit = () => {
    const num = Number(draft);
    setEditing(false);
    if (!Number.isNaN(num) && num !== value) {
      onCommit(num);
    }
  };

  const cancel = () => {
    setEditing(false);
    setDraft(String(value));
    onCancel();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") commit();
    if (e.key === "Escape") cancel();
  };

  if (editing) {
    return (
      <input
        ref={inputRef}
        type="number"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={handleKeyDown}
        className="w-28 rounded-lg border border-primary bg-background px-2 py-1.5 text-foreground outline-none ring-2 ring-primary/20"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setEditing(true)}
      className="rounded-lg px-2 py-1.5 text-foreground transition hover:bg-muted"
    >
      {formatDisplay ? formatDisplay(value) : value}
    </button>
  );
}