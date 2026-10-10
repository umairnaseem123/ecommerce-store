const Cart = require('../models/Cart');
const MenuItem = require('../models/MenuItem');

// @desc   Get logged-in user's cart
// @route  GET /api/cart
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate('restaurant', 'name');
    if (!cart) {
      return res.status(200).json({ success: true, cart: null });
    }
    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Add item to cart
// @route  POST /api/cart/add
const addToCart = async (req, res) => {
  try {
    const { menuItemId, quantity } = req.body;

    const menuItem = await MenuItem.findById(menuItemId);
    if (!menuItem) {
      return res.status(404).json({ success: false, message: 'Menu item not found' });
    }
    if (!menuItem.isAvailable) {
      return res.status(400).json({ success: false, message: 'This item is currently unavailable' });
    }

    let cart = await Cart.findOne({ user: req.user.id });

    // Agar cart kisi doosre restaurant ka hai, to reset kar do
    if (cart && cart.restaurant.toString() !== menuItem.restaurant.toString()) {
      cart.restaurant = menuItem.restaurant;
      cart.items = [];
    }

    if (!cart) {
      cart = new Cart({
        user: req.user.id,
        restaurant: menuItem.restaurant,
        items: [],
      });
    }

    const existingItem = cart.items.find(
      (i) => i.menuItem.toString() === menuItemId
    );

    if (existingItem) {
      existingItem.quantity += quantity || 1;
    } else {
      cart.items.push({
        menuItem: menuItem._id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: quantity || 1,
      });
    }

    await cart.save();
    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Update quantity of an item in cart
// @route  PUT /api/cart/update
const updateCartItem = async (req, res) => {
  try {
    const { menuItemId, quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ success: false, message: 'Quantity must be at least 1' });
    }

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const item = cart.items.find((i) => i.menuItem.toString() === menuItemId);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not in cart' });
    }

    item.quantity = quantity;
    await cart.save();
    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Remove item from cart
// @route  DELETE /api/cart/remove/:menuItemId
const removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    cart.items = cart.items.filter(
      (i) => i.menuItem.toString() !== req.params.menuItemId
    );

    await cart.save();
    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Clear entire cart
// @route  DELETE /api/cart/clear
const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndDelete({ user: req.user.id });
    res.status(200).json({ success: true, message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };