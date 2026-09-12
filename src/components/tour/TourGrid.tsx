import { TourCard } from "./TourCard";

interface Tour {
  title: string;
  location: string;
  duration: string;
  price: string;
  rating: number;
  category: string;
  gradient: string;
  discount?: string;
}

export function TourGrid({ tours }: { tours: Tour[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {tours.map((tour, i) => (
        <TourCard key={tour.title} {...tour} delay={i * 100} />
      ))}
    </div>
  );
}