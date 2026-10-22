const COUPONS = {
  WELCOME20: { percent: 20, label: '20% off your order' },
  FOOD10: { percent: 10, label: '10% off your order' },
};

const findCoupon = (code) => {
  const key = String(code || '').trim().toUpperCase();
  return COUPONS[key] ? { code: key, ...COUPONS[key] } : null;
};

module.exports = { findCoupon };
