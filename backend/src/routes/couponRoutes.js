const express = require('express');
const { findCoupon } = require('../utils/coupons');

const router = express.Router();

// POST /api/coupons/validate   body: { code }
router.post('/validate', (req, res) => {
  const coupon = findCoupon(req.body.code);
  if (!coupon) {
    return res.status(404).json({ success: false, message: 'Invalid coupon code' });
  }
  res.status(200).json({ success: true, coupon });
});

module.exports = router;
