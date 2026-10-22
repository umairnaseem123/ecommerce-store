import api from '../services/api';

export const validateCoupon = async (code) => {
  const res = await api.post('/coupons/validate', { code });
  return res.data;
};
