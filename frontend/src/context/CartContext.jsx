import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as cartApi from '../api/cartApi';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshCart = useCallback(async () => {
    try {
      const data = await cartApi.getCart();
      setCart(data.cart);
    } catch (err) {
      setCart(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addItem = async (menuItemId, quantity = 1) => {
    const data = await cartApi.addToCart(menuItemId, quantity);
    setCart(data.cart);
  };

  const updateItem = async (menuItemId, quantity) => {
    const data = await cartApi.updateCartItem(menuItemId, quantity);
    setCart(data.cart);
  };

  const removeItem = async (menuItemId) => {
    const data = await cartApi.removeFromCart(menuItemId);
    setCart(data.cart);
  };

  const emptyCart = async () => {
    await cartApi.clearCart();
    setCart(null);
  };

  const itemCount = cart?.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;

  return (
    <CartContext.Provider
      value={{ cart, loading, itemCount, refreshCart, addItem, updateItem, removeItem, emptyCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);