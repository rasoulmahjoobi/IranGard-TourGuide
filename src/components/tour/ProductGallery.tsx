"use client";

import { useState } from "react";
import { TourImage } from "./TourImage";
import { getCategoryGradient } from "@/src/lib/tourVisuals";
import { cn } from "@/src/lib/utils";

interface ProductGalleryProps {
  images: string[];
  name: string;
  categoryId: number;
}

export function ProductGallery({ images, name, categoryId }: ProductGalleryProps) {
  const list = images.length > 0 ? images : [undefined];
  const [active, setActive] = useState(0);

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-4/3 overflow-hidden rounded-3xl shadow-md">
        <TourImage src={list[active]} alt={name} gradient={getCategoryGradient(categoryId)} />
      </div>
      {list.length > 1 && (
        <div className="flex gap-2">
          {list.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={cn(
                "h-16 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition",
                active === i ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"
              )}
            >
              <TourImage src={img} alt={`${name} ${i + 1}`} gradient={getCategoryGradient(categoryId)} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}