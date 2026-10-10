const MenuCategory = require('../models/MenuCategory');
const MenuItem = require('../models/MenuItem');

// @desc   Get full menu (categories + items) for a restaurant (public)
// @route  GET /api/menu/:restaurantId
const getMenu = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const categories = await MenuCategory.find({ restaurant: restaurantId }).sort('order');
    const items = await MenuItem.find({ restaurant: restaurantId, isAvailable: true });

    const menu = categories.map((cat) => ({
      _id: cat._id,
      name: cat.name,
      items: items.filter((item) => item.category.toString() === cat._id.toString()),
    }));

    res.status(200).json({ success: true, menu });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Create menu category (manager/admin)
// @route  POST /api/menu/category
const createCategory = async (req, res) => {
  try {
    const category = await MenuCategory.create(req.body);
    res.status(201).json({ success: true, category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Create menu item (manager/admin)
// @route  POST /api/menu/item
const createItem = async (req, res) => {
  try {
    const item = await MenuItem.create(req.body);
    res.status(201).json({ success: true, item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Update menu item (manager/admin)
// @route  PUT /api/menu/item/:id
const updateItem = async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }
    res.status(200).json({ success: true, item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Delete menu item (manager/admin)
// @route  DELETE /api/menu/item/:id
const deleteItem = async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }
    res.status(200).json({ success: true, message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getMenu, createCategory, createItem, updateItem, deleteItem };