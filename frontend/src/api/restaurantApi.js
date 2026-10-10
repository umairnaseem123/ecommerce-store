import api from '../services/api';

export const getRestaurants = async () => {
  const res = await api.get('/restaurants');
  return res.data;
};

export const getRestaurantById = async (id) => {
  const res = await api.get(`/restaurants/${id}`);
  return res.data;
};

export const getMyRestaurants = async () => {
  const res = await api.get('/restaurants/my');
  return res.data;
};