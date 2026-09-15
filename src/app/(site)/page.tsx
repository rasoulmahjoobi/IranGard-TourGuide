"use client";

import { Hero } from "@/src/components/tour/Hero";
import { CategoryChips } from "@/src/components/tour/CategoryChips";
import { CategoryToursSection } from "@/src/components/tour/CategoryToursSection";
import { SiteSidebar } from "@/src/components/tour/SiteSidebar";
import { useCategories } from "@/src/hooks/useCategories";

export default function HomePage() {
  const { data: categories, isLoading, isError } = useCategories();

  return (
    <div className="flex flex-col gap-14 pb-10">
      <Hero />

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4">
        <SiteSidebar />

        <CategoryChips />

        {isError && (
          <p className="text-center text-sm text-red-600">
            خطا در دریافت دسته‌بندی‌ها. مطمئن شوید بک‌اند (پورت ۳۰۰۲) روشن است.
          </p>
        )}

        {isLoading && <div className="h-6 w-40 animate-pulse rounded-full bg-muted" />}

        {categories?.map((category) => (
          <CategoryToursSection key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
}