import api from '../services/api';

export const getCart = async () => {
  const res = await api.get('/cart');
  return res.data;
};

export const addToCart = async (menuItemId, quantity = 1) => {
  const res = await api.post('/cart/add', { menuItemId, quantity });
  return res.data;
};

export const updateCartItem = async (menuItemId, quantity) => {
  const res = await api.put('/cart/update', { menuItemId, quantity });
  return res.data;
};

export const removeFromCart = async (menuItemId) => {
  const res = await api.delete(`/cart/remove/${menuItemId}`);
  return res.data;
};

export const clearCart = async () => {
  const res = await api.delete('/cart/clear');
  return res.data;
};