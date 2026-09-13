export interface Category {
  id: number;
  name: string;
  icon: string;
}

export interface Subcategory {
  id: number;
  name: string;
  category: number;
}

export interface Tour {
  id: number;
  name: string;
  brand: string;
  image: string[];
  thumbnail: string;
  price: number;
  quantity: number;
  createdAt: number;
  category: number;
  subcategory: number;
  location: string;
  duration: string;
  rating: number;
  departureDate: string; // فرمت ISO مثل "2026-10-05"
  description: string;
  categoryName?: string;
  subcategoryName?: string;
}