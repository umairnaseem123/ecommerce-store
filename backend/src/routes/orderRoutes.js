const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrder,
  getRestaurantOrders,
  updateOrderStatus,
  getAllOrders,
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.post('/', protect, createOrder);
router.get('/my', protect, getMyOrders);
router.get('/', protect, authorize('admin'), getAllOrders);
router.get('/restaurant/:restaurantId', protect, authorize('manager', 'admin'), getRestaurantOrders);
router.get('/:id', protect, getOrder);
router.put('/:id/status', protect, authorize('manager', 'admin'), updateOrderStatus);

module.exports = router;