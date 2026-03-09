import { create } from "zustand";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image_url?: string;
  description?: string;
  category?: string;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  addToCart: (product: Omit<CartItem, "quantity">) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  totalPrice: () => number;
};

const STORAGE_KEY = "bundlyplus-cart";

function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // storage unavailable
  }
}

export const useCartStore = create<CartState>((set, get) => ({
  items: loadCart(),

  addToCart: (product) =>
    set((state) => {
      const existing = state.items.find((item) => item.id === product.id);
      let next: CartItem[];

      if (existing) {
        next = state.items.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        next = [
          ...state.items,
          { ...product, price: Number(product.price), quantity: 1 },
        ];
      }

      saveCart(next);
      return { items: next };
    }),

  removeFromCart: (productId) =>
    set((state) => {
      const next = state.items
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0);

      saveCart(next);
      return { items: next };
    }),

  clearCart: () => {
    saveCart([]);
    set({ items: [] });
  },

  totalPrice: () =>
    get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
}));
