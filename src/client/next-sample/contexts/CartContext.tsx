"use client";

import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { CartItem, Cart } from '@/types/cart';
import { Product } from '@/types/product';

interface CartContextType {
  cart: Cart;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  isInCart: (productId: number) => boolean;
  getCartItemQuantity: (productId: number) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

type CartAction =
  | { type: 'ADD_TO_CART'; payload: { product: Product; quantity: number } }
  | { type: 'REMOVE_FROM_CART'; payload: { productId: number } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: number; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: { items: CartItem[] } };

function cartReducer(state: Cart, action: CartAction): Cart {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const { product, quantity } = action.payload;
      const existingItemIndex = state.items.findIndex(item => item.product.id === product.id);
      
      let newItems: CartItem[];
      if (existingItemIndex !== -1) {
        // 既存のアイテムがある場合は数量を更新
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // 新しいアイテムを追加
        newItems = [...state.items, { product, quantity, addedAt: new Date() }];
      }
      
      return calculateCartTotals({ ...state, items: newItems });
    }
    
    case 'REMOVE_FROM_CART': {
      const newItems = state.items.filter(item => item.product.id !== action.payload.productId);
      return calculateCartTotals({ ...state, items: newItems });
    }
    
    case 'UPDATE_QUANTITY': {
      const { productId, quantity } = action.payload;
      if (quantity <= 0) {
        // 数量が0以下の場合はアイテムを削除
        const newItems = state.items.filter(item => item.product.id !== productId);
        return calculateCartTotals({ ...state, items: newItems });
      }
      
      const newItems = state.items.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      );
      return calculateCartTotals({ ...state, items: newItems });
    }
    
    case 'CLEAR_CART':
      return { items: [], totalItems: 0, totalPrice: 0 };
    
    case 'LOAD_CART':
      return calculateCartTotals({ ...state, items: action.payload.items });
    
    default:
      return state;
  }
}

function calculateCartTotals(cart: Cart): Cart {
  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  
  return {
    ...cart,
    totalItems,
    totalPrice,
  };
}

const initialCart: Cart = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
};

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [cart, dispatch] = useReducer(cartReducer, initialCart);

  // ローカルストレージからカートデータを読み込み
  useEffect(() => {
    const savedCart = localStorage.getItem('mosburger-cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        // 日付を復元
        const itemsWithDates = parsedCart.items.map((item: any) => ({
          ...item,
          addedAt: new Date(item.addedAt),
        }));
        dispatch({ type: 'LOAD_CART', payload: { items: itemsWithDates } });
      } catch (error) {
        console.error('カートデータの読み込みに失敗しました:', error);
      }
    }
  }, []);

  // カートデータが変更されたらローカルストレージに保存
  useEffect(() => {
    localStorage.setItem('mosburger-cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product, quantity: number = 1) => {
    dispatch({ type: 'ADD_TO_CART', payload: { product, quantity } });
  };

  const removeFromCart = (productId: number) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: { productId } });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const isInCart = (productId: number): boolean => {
    return cart.items.some(item => item.product.id === productId);
  };

  const getCartItemQuantity = (productId: number): number => {
    const item = cart.items.find(item => item.product.id === productId);
    return item ? item.quantity : 0;
  };

  const value: CartContextType = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
    getCartItemQuantity,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
