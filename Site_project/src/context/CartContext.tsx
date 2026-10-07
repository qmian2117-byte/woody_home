"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  fetchCart,
  apiAddToCart,
  apiUpdateCartItem,
  apiRemoveCartItem,
  apiClearCart,
  type ApiCart
} from '@/lib/api';

interface CartContextType {
  cart: ApiCart | null;
  isOpen: boolean;
  isLoading: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (variantId: string, quantity?: number, customProperties?: Record<string, string>) => Promise<void>;
  updateItem: (itemId: string, quantity: number, customProperties?: Record<string, string>) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clear: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<ApiCart | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const refreshCart = async () => {
    try {
      const data = await fetchCart();
      if (data) setCart(data);
    } catch (err) {
      console.warn('Cart refresh error:', err);
    }
  };

  useEffect(() => {
    refreshCart();
  }, []);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const addItem = async (variantId: string, quantity = 1, customProperties: Record<string, string> = {}) => {
    setIsLoading(true);
    try {
      const updatedCart = await apiAddToCart(variantId, quantity, customProperties);
      setCart(updatedCart);
      setIsOpen(true); // Auto-open cart drawer on add
    } finally {
      setIsLoading(false);
    }
  };

  const updateItem = async (itemId: string, quantity: number, customProperties?: Record<string, string>) => {
    setIsLoading(true);
    try {
      const updatedCart = await apiUpdateCartItem(itemId, quantity, customProperties);
      setCart(updatedCart);
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = async (itemId: string) => {
    setIsLoading(true);
    try {
      const updatedCart = await apiRemoveCartItem(itemId);
      setCart(updatedCart);
    } finally {
      setIsLoading(false);
    }
  };

  const clear = async () => {
    setIsLoading(true);
    try {
      const updatedCart = await apiClearCart();
      setCart(updatedCart);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isOpen,
        isLoading,
        openCart,
        closeCart,
        addItem,
        updateItem,
        removeItem,
        clear,
        refreshCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return ctx;
}
