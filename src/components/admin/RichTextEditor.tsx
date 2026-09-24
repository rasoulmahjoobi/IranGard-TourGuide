"use client";

import { useEffect, useRef } from "react";
import { Bold, Italic, Underline, Strikethrough, List, ListOrdered, Undo2, Redo2 } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  label?: string;
  error?: string;
}

const commands = [
  { cmd: "bold", icon: Bold, title: "ضخیم" },
  { cmd: "italic", icon: Italic, title: "کج" },
  { cmd: "underline", icon: Underline, title: "زیرخط" },
  { cmd: "strikeThrough", icon: Strikethrough, title: "خط‌خورده" },
  { cmd: "insertUnorderedList", icon: List, title: "لیست نقطه‌ای" },
  { cmd: "insertOrderedList", icon: ListOrdered, title: "لیست شماره‌ای" },
  { cmd: "undo", icon: Undo2, title: "واگرد" },
  { cmd: "redo", icon: Redo2, title: "ازنو" },
];

export function RichTextEditor({ value, onChange, label, error }: RichTextEditorProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) ref.current.innerHTML = value || "";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const exec = (cmd: string) => {
    ref.current?.focus();
    document.execCommand(cmd, false);
    onChange(ref.current?.innerHTML ?? "");
  };

  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-foreground">{label}</label>}
      <div
        className={cn(
          "overflow-hidden rounded-xl border border-border bg-card transition-colors focus-within:border-primary",
          error && "border-red-500"
        )}
      >
        <div className="flex flex-wrap items-center gap-1 border-b border-border bg-muted/60 px-2 py-1.5">
          {commands.map(({ cmd, icon: Icon, title }, i) => (
            <div key={cmd} className="flex items-center">
              <button
                type="button"
                title={title}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => exec(cmd)}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-card hover:text-primary"
              >
                <Icon className="h-3.5 w-3.5" />
              </button>
              {(i === 3 || i === 5) && <span className="mx-1 h-4 w-px bg-border" />}
            </div>
          ))}
        </div>
        <div
          ref={ref}
          contentEditable
          onInput={() => onChange(ref.current?.innerHTML ?? "")}
          className="min-h-32 px-3.5 py-2.5 text-sm leading-7 text-foreground outline-none [&_ol]:list-decimal [&_ol]:pr-5 [&_ul]:list-disc [&_ul]:pr-5"
        />
      </div>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}