const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Restaurant name is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    cuisine: {
      type: [String],
      default: [],
    },
    address: {
      street: String,
      city: String,
      state: String,
      zip: String,
    },
    phone: String,
    email: String,
    coverImage: {
      type: String,
      default: '',
    },
    logo: {
      type: String,
      default: '',
    },
    openingHours: {
      type: String,
      default: '9:00 AM - 11:00 PM',
    },
    rating: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Restaurant', restaurantSchema);