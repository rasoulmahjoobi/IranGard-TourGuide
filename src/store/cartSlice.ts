import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  id: string;
  tourId: number;
  category: number;
  name: string;
  thumbnail: string;
  location: string;
  duration: string;
  departureDate: string;
  endDate: string;
  peopleCount: number;
  unitPrice: number;
  travelType?: "land" | "air";
  travelTypeLabel?: string;
}

interface CartState {
  items: CartItem[];
  hydrated: boolean;
}

const ITEMS_KEY = "cart_items";

function loadItems(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(ITEMS_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function persistItems(items: CartItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ITEMS_KEY, JSON.stringify(items));
  } catch {
    // نادیده می‌گیریم
  }
}

const initialState: CartState = { items: [], hydrated: false };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    hydrateCart: (state) => {
      state.items = loadItems();
      state.hydrated = true;
    },
    addToCart: (state, action: PayloadAction<CartItem>) => {
      state.items.push(action.payload);
      persistItems(state.items);
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      persistItems(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      persistItems(state.items);
    },
  },
});

export const { hydrateCart, addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;