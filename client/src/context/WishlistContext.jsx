import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useToast } from './ToastContext.jsx';

const WishlistContext = createContext(null);
const STORAGE_KEY = 'shopvista_wishlist';

const readWishlist = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((item) => item && item.id) : [];
  } catch {
    return [];
  }
};

export function WishlistProvider({ children }) {
  const [items, setItems] = useState(readWishlist);
  const { toast } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* wishlist remains in memory if storage is unavailable */
    }
  }, [items]);

  const isSaved = useCallback(
    (productId) => items.some((item) => item.id === productId),
    [items],
  );

  const toggleWishlist = useCallback(
    (product) => {
      if (!product) return;
      const exists = items.some((item) => item.id === product.id);
      toast(
        exists
          ? `${product.name} removed from your wishlist`
          : `${product.name} saved to your wishlist`,
        exists ? 'info' : 'success',
      );
      setItems((current) =>
        exists
          ? current.filter((item) => item.id !== product.id)
          : [...current, product],
      );
    },
    [items, toast],
  );

  const removeFromWishlist = useCallback((productId) => {
    setItems((current) => current.filter((item) => item.id !== productId));
  }, []);

  const value = useMemo(
    () => ({ items, isSaved, toggleWishlist, removeFromWishlist, count: items.length }),
    [items, isSaved, toggleWishlist, removeFromWishlist],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used inside a WishlistProvider');
  return context;
};
