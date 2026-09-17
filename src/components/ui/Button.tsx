import { cn } from "@/src/lib/utils";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  loading?: boolean;
}

export function Button({ variant = "primary", loading, className, children, disabled, ...props }: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        "rounded-full px-5 py-2.5 text-sm font-semibold shadow-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" && "bg-gradient-to-l from-primary to-coral text-primary-foreground hover:shadow-md",
        variant === "secondary" && "bg-muted text-foreground hover:bg-muted/70",
        variant === "ghost" && "bg-transparent text-primary hover:underline",
        className
      )}
      {...props}
    >
      {loading ? "در حال پردازش..." : children}
    </button>
  );
}