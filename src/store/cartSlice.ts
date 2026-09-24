import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  id: string; // شناسه‌ی یکتای همین ردیف تو سبد (نه آیدی تور، چون یه تور می‌تونه چندبار با گزینه‌های متفاوت اضافه بشه)
  tourId: number;
  name: string;
  thumbnail: string;
  location: string;
  duration: string;
  departureDate: string;
  endDate: string; // محاسبه‌شده از departureDate + مدت تور، برای چک تداخل زمانی
  peopleCount: number;
  unitPrice: number; // قیمت نهایی هر نفر (بعد از اعمال نوع سفر)
  travelType?: "land" | "air";
  travelTypeLabel?: string;
}

interface CartState {
  items: CartItem[];
}

const STORAGE_KEY = "cart_items";

function loadFromStorage(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function persist(items: CartItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // اگه ذخیره نشد، بی‌سروصدا رد می‌شیم — سبد همچنان تو حافظه‌ی همون sessionِ Redux می‌مونه
  }
}

const initialState: CartState = { items: [] };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    hydrateCart: (state) => {
      state.items = loadFromStorage();
    },
    addToCart: (state, action: PayloadAction<CartItem>) => {
      state.items.push(action.payload);
      persist(state.items);
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      persist(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      persist(state.items);
    },
  },
});

export const { hydrateCart, addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;