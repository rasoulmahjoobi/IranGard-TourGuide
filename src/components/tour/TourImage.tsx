"use client";

import { useState } from "react";
import { cn } from "@/src/lib/utils";

interface TourImageProps {
  src?: string;
  alt: string;
  gradient: string;
  className?: string;
}

export function TourImage({ src, alt, gradient, className }: TourImageProps) {
  const [failed, setFailed] = useState(false);
  const url = src ? `${process.env.NEXT_PUBLIC_API_URL}/files/${src}` : null;

  // یا عکس نداریم، یا لود شدنش شکست خورد → گرادیان رنگی جایگزین
  if (!url || failed) {
    return <div className={cn("h-full w-full bg-gradient-to-br", gradient, className)} />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt={alt}
      onError={() => setFailed(true)}
      className={cn("h-full w-full object-cover", className)}
    />
  );
}