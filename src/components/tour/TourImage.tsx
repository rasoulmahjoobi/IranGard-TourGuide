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

  // اگه src خودش یه URL کامل یا base64 بود، مستقیم استفاده می‌شه؛
  // فقط وقتی صرفاً یه hash خام (مثلاً آپلود قدیمی از Postman) باشه، آدرس بک‌اند جلوش اضافه می‌شه
  const url = !src
    ? null
    : src.startsWith("http") || src.startsWith("data:")
      ? src
      : `${process.env.NEXT_PUBLIC_API_URL}/files/${src}`;

  if (!url || failed) {
    return <div className={cn("h-full w-full bg-linear-to-br", gradient, className)} />;
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