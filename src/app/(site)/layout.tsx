import { SiteHeader } from "@/src/components/layout/SiteHeader";
import { SiteFooter } from "@/src/components/layout/SiteFooter";
import { getCategories } from "@/src/lib/api/categories";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const categories = await getCategories();

  return (
    <>
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter categories={categories} />
    </>
  );
}