import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: { title: string; price: number }[];
}

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((p) => (
        <ProductCard key={p.title} title={p.title} price={p.price} />
      ))}
    </div>
  );
}