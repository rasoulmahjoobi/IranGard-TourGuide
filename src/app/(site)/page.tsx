"use client";

import { CategoryToursSection } from "@/src/components/tour/CategorToursSection";
import { CategoryChips } from "@/src/components/tour/CategoryChips";
import { Hero } from "@/src/components/tour/Hero";
import { useCategories } from "@/src/hooks/useCategories";

export default function HomePage() {
  const { data: categories, isLoading, isError } = useCategories();

  return (
    <div className="flex flex-col gap-14 pb-10">
      <Hero />

      <div className="mx-auto w-full max-w-6xl px-4">
        <CategoryChips />
      </div>

      {isError && (
        <p className="mx-auto w-full max-w-6xl px-4 text-center text-sm text-red-600">
          خطا در دریافت دسته‌بندی‌ها. مطمئن شوید بک‌اند (پورت ۳۰۰۲) روشن است.
        </p>
      )}

      {isLoading && (
        <div className="mx-auto w-full max-w-6xl px-4">
          <div className="h-6 w-40 animate-pulse rounded-full bg-muted" />
        </div>
      )}

      {categories?.map((category) => (
        <div key={category.id} className="mx-auto w-full max-w-6xl px-4">
          <CategoryToursSection category={category} />
        </div>
      ))}
    </div>
  );
}