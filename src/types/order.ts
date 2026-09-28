export interface PersonInfo {
  fullName: string;
  phone: string;
  nationalId: string;
  address: string;
  bloodType: string;
  disease: string;
}

export interface OrderProduct {
  id: number;
  name: string;
  count: string;
  price: string;
  image?: string;
  origin?: "tehran" | "destination";
  originLabel?: string;
  travelTypeLabel?: string;
  companions?: PersonInfo[];
}

export interface Order {
  id: number;
  username: string;
  lastname: string;
  address: string;
  phone: string;
  startDate: string;
  endDate: string;
  expectAt?: number;
  leader?: PersonInfo;
  products: OrderProduct[];
  prices: number;
  delivered: string; // "true" یا "false"
  paid: boolean;
  createdAt: number;
}