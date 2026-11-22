import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useToast } from './ToastContext.jsx';

const CartContext = createContext(null);
const STORAGE_KEY = 'shopvista_cart';
const FREE_SHIPPING_THRESHOLD = 100;
const SHIPPING_FEE = 9.99;

const readCart = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item) =>
        item &&
        item.product &&
        typeof item.product.id === 'string' &&
        Number.isFinite(item.qty) &&
        item.qty > 0,
    );
  } catch {
    return [];
  }
};

export function CartProvider({ children }) {
  const [items, setItems] = useState(readCart);
  const { toast } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* cart remains in memory if storage is unavailable */
    }
  }, [items]);

  const addToCart = useCallback(
    (product, qty = 1) => {
      if (!product) return;
      const amount = Math.max(1, Number(qty) || 1);
      setItems((current) => {
        const existing = current.find((item) => item.product.id === product.id);
        if (existing) {
          const stock = Number(product.stock) || 99;
          const nextQty = Math.min(existing.qty + amount, stock);
          return current.map((item) =>
            item.product.id === product.id ? { ...item, qty: nextQty } : item,
          );
        }
        return [...current, { product, qty: Math.min(amount, Number(product.stock) || 99) }];
      });
      toast(`${product.name} added to your bag`, 'success');
    },
    [toast],
  );

  const updateQty = useCallback((productId, qty) => {
    const nextQty = Number(qty);
    if (!Number.isFinite(nextQty) || nextQty < 1) return;
    setItems((current) =>
      current.map((item) =>
        item.product.id === productId
          ? { ...item, qty: Math.min(nextQty, Number(item.product.stock) || 99) }
          : item,
      ),
    );
  }, []);

  const removeFromCart = useCallback(
    (productId) => {
      const removed = items.find((item) => item.product.id === productId);
      if (removed) toast(`${removed.product.name} removed from your bag`, 'info');
      setItems((current) => current.filter((item) => item.product.id !== productId));
    },
    [items, toast],
  );

  const clearCart = useCallback(() => setItems([]), []);

  const totals = useMemo(() => {
    const count = items.reduce((sum, item) => sum + item.qty, 0);
    const subtotal = items.reduce((sum, item) => sum + item.product.price * item.qty, 0);
    const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
    return {
      count,
      subtotal,
      shipping,
      total: subtotal + shipping,
      freeShippingRemaining: Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal),
      freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
    };
  }, [items]);

  const value = useMemo(
    () => ({ items, addToCart, updateQty, removeFromCart, clearCart, ...totals }),
    [items, addToCart, updateQty, removeFromCart, clearCart, totals],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used inside a CartProvider');
  return context;
};
