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
  customerPhone: string | null;
  hydrated: boolean;
}

const ITEMS_KEY = "cart_items";
const PHONE_KEY = "cart_customer_phone";

function loadItems(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(ITEMS_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function loadPhone(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(PHONE_KEY);
  } catch {
    return null;
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

function persistPhone(phone: string) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PHONE_KEY, phone);
  } catch {
    // نادیده می‌گیریم
  }
}

const initialState: CartState = { items: [], customerPhone: null, hydrated: false };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    hydrateCart: (state) => {
      state.items = loadItems();
      state.customerPhone = loadPhone();
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
    setCustomerPhone: (state, action: PayloadAction<string>) => {
      state.customerPhone = action.payload;
      persistPhone(action.payload);
    },
  },
});

export const { hydrateCart, addToCart, removeFromCart, clearCart, setCustomerPhone } = cartSlice.actions;
export default cartSlice.reducer;