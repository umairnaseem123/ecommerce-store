const express = require('express');
const router = express.Router();
const {
  getMenu,
  createCategory,
  createItem,
  updateItem,
  deleteItem,
} = require('../controllers/menuController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/:restaurantId', getMenu);
router.post('/category', protect, authorize('manager', 'admin'), createCategory);
router.post('/item', protect, authorize('manager', 'admin'), createItem);
router.put('/item/:id', protect, authorize('manager', 'admin'), updateItem);
router.delete('/item/:id', protect, authorize('manager', 'admin'), deleteItem);

module.exports = router;