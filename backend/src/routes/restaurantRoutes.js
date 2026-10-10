const express = require('express');
const router = express.Router();
const {
  getRestaurants,
  getRestaurant,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getMyRestaurants,
  getAllRestaurantsAdmin,
  updateRestaurantStatus,
} = require('../controllers/restaurantController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/my', protect, authorize('manager', 'admin'), getMyRestaurants);
router.get('/admin/all', protect, authorize('admin'), getAllRestaurantsAdmin);
router.put('/:id/status', protect, authorize('admin'), updateRestaurantStatus);
router.get('/', getRestaurants);
router.get('/:id', getRestaurant);
router.post('/', protect, authorize('manager', 'admin'), createRestaurant);
router.put('/:id', protect, authorize('manager', 'admin'), updateRestaurant);
router.delete('/:id', protect, authorize('admin'), deleteRestaurant);

module.exports = router;