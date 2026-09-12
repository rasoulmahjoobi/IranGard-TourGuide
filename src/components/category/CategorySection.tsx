import { ProductGrid } from "../product/ProductGrid";

interface CategorySectionProps {
  title: string;
  products: { title: string; price: number }[];
}

export function CategorySection({ title, products }: CategorySectionProps) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <span className="h-6 w-1.5 rounded-full bg-primary" />
        <h2 className="text-lg font-extrabold text-foreground">گروه 
            {title}</h2>
      </div>
      <ProductGrid products={products} />
    </section>
  );
}