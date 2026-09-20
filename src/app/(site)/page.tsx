import { Hero } from "@/src/components/tour/Hero";
import { CategoryChips } from "@/src/components/tour/CategoryChips";
import { CategoryToursSection } from "@/src/components/tour/CategoryToursSection";
import { SiteSidebar } from "@/src/components/tour/SiteSidebar";
import { getCategories } from "@/src/lib/api/categories";
import { getSubcategories } from "@/src/lib/api/subcategories";

export default async function HomePage() {
  let categories: Awaited<ReturnType<typeof getCategories>> = [];
  let subcategories: Awaited<ReturnType<typeof getSubcategories>> = [];
  let hasError = false;

  try {
    [categories, subcategories] = await Promise.all([getCategories(), getSubcategories()]);
  } catch {
    hasError = true;
  }

  return (
    <div className="flex flex-col gap-14 pb-10">
      <Hero />

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4">
        <SiteSidebar categories={categories} subcategories={subcategories} />

        <CategoryChips categories={categories} />

        {hasError && (
          <p className="text-center text-sm text-red-600">
            خطا در دریافت دسته‌بندی‌ها. مطمئن شوید بک‌اند (پورت ۳۰۰۲) روشن است.
          </p>
        )}

        {categories.map((category) => (
          <CategoryToursSection key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
}