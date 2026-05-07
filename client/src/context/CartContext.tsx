"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { api } from "@/lib/api";

interface CartProduct {
  _id: string;
  name: string;
  slug: string;
  images: string[];
  price: number;
  discountPrice?: number;
  stock: number;
}

interface CartItem {
  _id: string;
  product: CartProduct;
  quantity: number;
  price: number;
}

interface Cart {
  items: CartItem[];
  totalPrice: number;
}

interface CartCtx {
  cart: Cart;
  cartCount: number;
  fetchCart: () => Promise<void>;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateItem: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartCtx | null>(null);

const EMPTY_CART: Cart = { items: [], totalPrice: 0 };

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart>(EMPTY_CART);

  const fetchCart = useCallback(async () => {
    try {
      const res = await api.get<{ data: Cart }>("/api/cart");
      setCart(res.data || EMPTY_CART);
    } catch {
      setCart(EMPTY_CART);
    }
  }, []);

  const addToCart = async (productId: string, quantity = 1) => {
    const res = await api.post<{ data: Cart }>("/api/cart", { productId, quantity });
    setCart(res.data);
  };

  const updateItem = async (productId: string, quantity: number) => {
    const res = await api.put<{ data: Cart }>(`/api/cart/${productId}`, { quantity });
    setCart(res.data);
  };

  const removeItem = async (productId: string) => {
    const res = await api.delete<{ data: Cart }>(`/api/cart/${productId}`);
    setCart(res.data);
  };

  const clearCart = async () => {
    const res = await api.delete<{ data: Cart }>("/api/cart");
    setCart(res.data || EMPTY_CART);
  };

  const cartCount = cart.items.reduce((s, i) => s + i.quantity, 0);

  return (
    <CartContext value={{ cart, cartCount, fetchCart, addToCart, updateItem, removeItem, clearCart }}>
      {children}
    </CartContext>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
