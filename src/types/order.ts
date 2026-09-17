export interface OrderProduct {
  id: number;
  name: string;
  count: string;
  price: string;
  image?: string;
}

export interface Order {
  id: number;
  username: string;
  lastname: string;
  address: string;
  phone: string;
  expectAt?: number;
  products: OrderProduct[];
  prices: number;
  delivered: string; // "true" یا "false"
  createdAt: number;
}