import api from '../services/api';

// Users
export const getAllUsers = async () => {
  const res = await api.get('/users');
  return res.data;
};

export const updateUserRole = async (userId, role) => {
  const res = await api.put(`/users/${userId}/role`, { role });
  return res.data;
};

export const updateUserStatus = async (userId, isActive) => {
  const res = await api.put(`/users/${userId}/status`, { isActive });
  return res.data;
};

// Restaurants
export const getAllRestaurantsAdmin = async () => {
  const res = await api.get('/restaurants/admin/all');
  return res.data;
};

export const updateRestaurantStatus = async (restaurantId, isActive) => {
  const res = await api.put(`/restaurants/${restaurantId}/status`, { isActive });
  return res.data;
};

// Orders
export const getAllOrdersAdmin = async () => {
  const res = await api.get('/orders');
  return res.data;
};