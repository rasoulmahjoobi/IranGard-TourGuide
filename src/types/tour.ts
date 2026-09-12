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
  description: string;
  categoryName?: string;    // فقط تو route جزئیات یک تور برمی‌گرده (server.js)
  subcategoryName?: string; // همون‌طور
}