/**
 * Demo data seeder for the food e-commerce store.
 *
 * Usage (from the backend folder):   node seed.js
 *
 * - Safe to run many times: it only removes stores owned by the demo
 *   manager accounts below and recreates them. Other data is untouched.
 * - Images are served by the frontend from frontend/public/images/
 */
require('dotenv').config();

if (process.env.NODE_ENV !== 'production') {
  const dns = require('dns');
  dns.setServers(['8.8.8.8', '1.1.1.1']);
}

const mongoose = require('mongoose');
const User = require('./src/models/User');
const Restaurant = require('./src/models/Restaurant');
const MenuCategory = require('./src/models/MenuCategory');
const MenuItem = require('./src/models/MenuItem');

const img = (name) => `/images/${name}`;

const USERS = [
  { name: 'Store Admin', email: 'admin@foodstore.com', password: 'Admin@123', role: 'admin' },
  { name: 'Demo Customer', email: 'customer@foodstore.com', password: 'Customer@123', role: 'customer' },
];

const STORES = [
  {
    manager: { name: 'Burger Lab Manager', email: 'manager1@foodstore.com', password: 'Manager@123' },
    name: 'Burger Lab',
    description: 'Juicy smash burgers, crispy chicken and loaded fries.',
    cuisine: ['American', 'Fast Food'],
    city: 'Karachi',
    openingHours: '12:00 PM - 1:00 AM',
    rating: 4.6,
    coverImage: img('burger.jpg'),
    categories: [
      {
        name: 'Burgers',
        items: [
          { name: 'Classic Beef Burger', description: 'Double beef patty, cheddar, pickles and house sauce.', price: 650, image: 'burger.jpg', tags: ['Bestseller'] },
          { name: 'Crispy Zinger Burger', description: 'Spicy crispy chicken fillet with lettuce and mayo.', price: 590, image: 'zinger.avif' },
        ],
      },
      {
        name: 'Sides',
        items: [
          { name: 'Loaded Fries', description: 'Fries topped with cheese sauce and jalapenos.', price: 350, image: 'fries.avif', isVeg: true },
          { name: 'Hot Wings (6 pcs)', description: 'Crispy wings tossed in spicy buffalo sauce.', price: 480, image: 'wings.jpg', tags: ['Spicy'] },
        ],
      },
      {
        name: 'Drinks',
        items: [
          { name: 'Chocolate Shake', description: 'Thick chocolate milkshake with whipped cream.', price: 420, image: 'shake.avif', isVeg: true },
        ],
      },
    ],
  },
  {
    manager: { name: 'Pizza Palace Manager', email: 'manager2@foodstore.com', password: 'Manager@123' },
    name: 'Pizza Palace',
    description: 'Stone-baked pizza, creamy pasta and fresh salads.',
    cuisine: ['Italian', 'Pizza'],
    city: 'Karachi',
    openingHours: '11:00 AM - 12:00 AM',
    rating: 4.4,
    coverImage: img('pizza.avif'),
    categories: [
      {
        name: 'Pizza',
        items: [
          { name: 'Chicken Tikka Pizza', description: 'Tikka chicken, onions, peppers and mozzarella.', price: 1200, image: 'pizza.avif', tags: ['Bestseller'] },
          { name: 'Veggie Supreme Pizza', description: 'Mushrooms, olives, corn and bell peppers.', price: 1100, image: 'pizza.avif', isVeg: true },
        ],
      },
      {
        name: 'Pasta and Salads',
        items: [
          { name: 'Creamy Alfredo Pasta', description: 'Fettuccine in garlic parmesan cream sauce.', price: 780, image: 'pasta.avif' },
          { name: 'Caesar Salad', description: 'Romaine, croutons, parmesan and Caesar dressing.', price: 450, image: 'salad.avif', isVeg: true },
        ],
      },
      {
        name: 'Desserts',
        items: [
          { name: 'Chocolate Lava Cake', description: 'Warm cake with a molten chocolate center.', price: 380, image: 'lava-cake.jpg', isVeg: true },
        ],
      },
    ],
  },
  {
    manager: { name: 'Desi Dastarkhwan Manager', email: 'manager3@foodstore.com', password: 'Manager@123' },
    name: 'Desi Dastarkhwan',
    description: 'Biryani, karahi and charcoal BBQ, the way home tastes.',
    cuisine: ['Pakistani', 'BBQ'],
    city: 'Karachi',
    openingHours: '12:00 PM - 11:30 PM',
    rating: 4.8,
    coverImage: img('biryani.jpg'),
    categories: [
      {
        name: 'Rice',
        items: [
          { name: 'Chicken Biryani', description: 'Aromatic basmati rice layered with spiced chicken.', price: 450, image: 'biryani.jpg', tags: ['Bestseller'] },
        ],
      },
      {
        name: 'BBQ and Karahi',
        items: [
          { name: 'Seekh Kebab (4 pcs)', description: 'Charcoal grilled minced beef kebabs.', price: 600, image: 'kebab.avif' },
          { name: 'Chicken Karahi (Half)', description: 'Tomato and ginger karahi cooked in desi ghee.', price: 1450, image: 'karahi.avif', tags: ['Spicy'] },
        ],
      },
      {
        name: 'Bread and Soup',
        items: [
          { name: 'Garlic Naan', description: 'Tandoor baked naan brushed with garlic butter.', price: 80, image: 'naan.avif', isVeg: true },
          { name: 'Chicken Corn Soup', description: 'Classic comforting chicken and sweet corn soup.', price: 250, image: 'soup.avif' },
        ],
      },
    ],
  },
  {
    manager: { name: 'Sweet and Chill Manager', email: 'manager4@foodstore.com', password: 'Manager@123' },
    name: 'Sweet and Chill',
    description: 'Desserts, shakes and fresh juices to cool you down.',
    cuisine: ['Desserts', 'Beverages'],
    city: 'Karachi',
    openingHours: '2:00 PM - 1:00 AM',
    rating: 4.5,
    coverImage: img('icecream.avif'),
    categories: [
      {
        name: 'Desserts',
        items: [
          { name: 'Chocolate Fudge Cake', description: 'Rich layered chocolate cake slice.', price: 320, image: 'cake.avif', isVeg: true },
          { name: 'Ice Cream Sundae', description: 'Vanilla ice cream, chocolate sauce and nuts.', price: 350, image: 'icecream.avif', isVeg: true, tags: ['Bestseller'] },
        ],
      },
      {
        name: 'Drinks',
        items: [
          { name: 'Fresh Orange Juice', description: 'Freshly squeezed, no added sugar.', price: 280, image: 'juice.avif', isVeg: true },
          { name: 'Oreo Shake', description: 'Creamy vanilla shake blended with Oreo cookies.', price: 450, image: 'oreo-shake.jpg', isVeg: true },
        ],
      },
    ],
  },
];

async function upsertUser(data) {
  let user = await User.findOne({ email: data.email });
  if (!user) user = await User.create(data);
  return user;
}

async function run() {
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI is not set in backend/.env');
  await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000 });
  console.log('Connected to MongoDB');

  for (const u of USERS) await upsertUser(u);

  let itemCount = 0;
  for (const s of STORES) {
    const manager = await upsertUser({ ...s.manager, role: 'manager' });

    // remove this manager's previous demo stores and their menus
    const old = await Restaurant.find({ owner: manager._id }).select('_id');
    const oldIds = old.map((r) => r._id);
    if (oldIds.length) {
      await MenuItem.deleteMany({ restaurant: { $in: oldIds } });
      await MenuCategory.deleteMany({ restaurant: { $in: oldIds } });
      await Restaurant.deleteMany({ _id: { $in: oldIds } });
    }

    const store = await Restaurant.create({
      name: s.name,
      description: s.description,
      owner: manager._id,
      cuisine: s.cuisine,
      address: { street: 'Main Boulevard', city: s.city, state: 'Sindh', zip: '75500' },
      phone: '0300-0000000',
      email: s.manager.email,
      coverImage: s.coverImage,
      openingHours: s.openingHours,
      rating: s.rating,
    });

    let order = 0;
    for (const c of s.categories) {
      const cat = await MenuCategory.create({ restaurant: store._id, name: c.name, order: order++ });
      for (const it of c.items) {
        await MenuItem.create({
          restaurant: store._id,
          category: cat._id,
          name: it.name,
          description: it.description,
          price: it.price,
          image: img(it.image),
          isVeg: !!it.isVeg,
          isAvailable: true,
          tags: it.tags || [],
        });
        itemCount++;
      }
    }
    console.log(`Created store: ${s.name}`);
  }

  console.log(`Done. ${STORES.length} stores and ${itemCount} products created.`);
  console.log('\nDemo logins:');
  console.log('  Admin    admin@foodstore.com     Admin@123');
  console.log('  Manager  manager1@foodstore.com  Manager@123   (Burger Lab; manager2-4 for the other stores)');
  console.log('  Customer customer@foodstore.com  Customer@123');
  await mongoose.disconnect();
}

run().catch(async (err) => {
  console.error('Seed failed:', err.message);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
