import api from '../services/api';

export const getMenuByRestaurant = async (restaurantId) => {
  const res = await api.get(`/menu/${restaurantId}`);
  return res.data;
};

export const createCategory = async (restaurantId, name, order = 0) => {
  const res = await api.post('/menu/category', { restaurant: restaurantId, name, order });
  return res.data;
};

export const createMenuItem = async (data) => {
  const res = await api.post('/menu/item', data);
  return res.data;
};

export const updateMenuItem = async (itemId, data) => {
  const res = await api.put(`/menu/item/${itemId}`, data);
  return res.data;
};

export const deleteMenuItem = async (itemId) => {
  const res = await api.delete(`/menu/item/${itemId}`);
  return res.data;
};