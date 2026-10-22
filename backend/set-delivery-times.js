require('dotenv').config();
if (process.env.NODE_ENV !== 'production') {
  const dns = require('dns');
  dns.setServers(['8.8.8.8', '1.1.1.1']);
}
const mongoose = require('mongoose');
const Restaurant = require('./src/models/Restaurant');

const TIMES = { 'Burger Lab': 25, 'Pizza Palace': 35, 'Desi Dastarkhwan': 40, 'Sweet and Chill': 20 };

(async () => {
  await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000 });
  for (const [name, deliveryTime] of Object.entries(TIMES)) {
    const r = await Restaurant.updateOne({ name }, { $set: { deliveryTime } });
    console.log(name, '->', deliveryTime, 'min (matched:', r.matchedCount + ')');
  }
  await mongoose.disconnect();
})().catch((e) => { console.error(e.message); process.exit(1); });
