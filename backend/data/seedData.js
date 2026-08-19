const bcrypt = require('bcryptjs');
const db = require('../config/db');
const offlineDb = require('../config/offlineDb');
const User = require('../models/User');
const Product = require('../models/Product');
const Community = require('../models/Community');

const seedData = async () => {
  try {
    const salt = await bcrypt.genSalt(10);
    const defaultPassword = await bcrypt.hash('password123', salt);

    const users = [
      {
        name: 'Ramu Kaka',
        email: 'farmer@farm.com',
        password: defaultPassword,
        role: 'farmer',
        villageName: 'Sonapur Village',
        cityName: 'Pune',
        phone: '+91 94220 12345',
        earnings: 12450,
        isVerified: true
      },
      {
        name: 'Amit Sharma',
        email: 'customer@city.com',
        password: defaultPassword,
        role: 'customer',
        villageName: '',
        cityName: 'Pune',
        phone: '+91 98230 67890',
        earnings: 0,
        isVerified: true
      },
      {
        name: 'Chief Admin',
        email: 'admin@admin.com',
        password: defaultPassword,
        role: 'admin',
        villageName: '',
        cityName: 'Mumbai',
        phone: '+91 99999 99999',
        earnings: 0,
        isVerified: true
      }
    ];

    const products = [
      {
        name: 'Fresh Organic Spinach',
        category: 'Organic Products',
        price: 30,
        quantity: 50,
        unit: 'bundle',
        farmerName: 'Ramu Kaka',
        villageName: 'Sonapur Village',
        isOrganic: true,
        image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&q=80&w=400',
        deliveryTime: '24 hours',
        inStock: true,
        description: 'Crisp green spinach leaves grown organically without chemical pesticides.'
      },
      {
        name: 'Alfonso Mangoes',
        category: 'Fruits',
        price: 350,
        quantity: 25,
        unit: 'dozen',
        farmerName: 'Ramu Kaka',
        villageName: 'Sonapur Village',
        isOrganic: false,
        image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&q=80&w=400',
        deliveryTime: '36 hours',
        inStock: true,
        description: 'Sweet, juicy, premium Alphonso mangoes harvested directly from Ratnagiri farms.'
      },
      {
        name: 'Pure Buffalo Milk',
        category: 'Dairy',
        price: 65,
        quantity: 100,
        unit: 'liter',
        farmerName: 'Ramu Kaka',
        villageName: 'Sonapur Village',
        isOrganic: true,
        image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=400',
        deliveryTime: '12 hours',
        inStock: true,
        description: 'Fresh milk direct from the dairy farm, unadulterated and pasteurized.'
      },
      {
        name: 'Basmati Rice Premium',
        category: 'Grains',
        price: 90,
        quantity: 500,
        unit: 'kg',
        farmerName: 'Ramu Kaka',
        villageName: 'Sonapur Village',
        isOrganic: false,
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=400',
        deliveryTime: '48 hours',
        inStock: true,
        description: 'Fragrant, long-grain Basmati rice, double polished and aged for great aroma.'
      },
      {
        name: 'Red Cherry Tomatoes',
        category: 'Vegetables',
        price: 45,
        quantity: 80,
        unit: 'kg',
        farmerName: 'Ramu Kaka',
        villageName: 'Sonapur Village',
        isOrganic: true,
        image: 'https://images.unsplash.com/photo-1561136594-7f68413baa99?auto=format&fit=crop&q=80&w=400',
        deliveryTime: '24 hours',
        inStock: true,
        description: 'Juicy, bright red vine cherry tomatoes grown in net houses.'
      }
    ];

    const communityItems = [
      {
        type: 'scheme',
        title: 'PM-KISAN Samman Nidhi',
        content: 'Provides ₹6,000 per year in three equal installments to small and marginal farmer families across the country. Check details on pmkisan.gov.in and verify your Aadhaar linked bank account at your nearest Seva Kendra.',
        author: 'Govt Department',
        category: 'Subsidies'
      },
      {
        type: 'tip',
        title: 'Best Crop Rotation for Organic Soil',
        content: 'Rotate heavy feeding crops (like Tomatoes or Maize) with nitrogen-fixing legumes (like Chickpeas or Clover) to restore natural nitrogen levels in your fields. This minimizes the need for chemical fertilizers.',
        author: 'Dr. Swaminathan (Agri Scientist)',
        category: 'Soil Health'
      },
      {
        type: 'forum',
        title: 'Monsoon Alert: Managing water logging in Paddy fields',
        content: 'With predicted high rains next week, ensure drainage canals are cleared. What are other farmers in the Sonapur belt doing to prevent stem rot?',
        author: 'Ramu Kaka',
        category: 'General Discussion',
        likes: [],
        comments: [
          { authorName: 'Govind Rao', text: 'We are creating minor contours in fields. Let me know if you need help with labor.', createdAt: new Date() }
        ]
      }
    ];

    if (db.isOffline()) {
      const existingUsers = offlineDb.getCollection('users');
      if (existingUsers.length === 0) {
        users.forEach(user => offlineDb.insert('users', user));
      }

      const existingProducts = offlineDb.getCollection('products');
      if (existingProducts.length === 0) {
        const farmerAccount = offlineDb.findOne('users', { role: 'farmer' });
        products.forEach(prod => {
          prod.farmerId = farmerAccount ? farmerAccount._id : 'farmer_fallback_id';
          offlineDb.insert('products', prod);
        });
      }

      const existingComm = offlineDb.getCollection('community');
      if (existingComm.length === 0) {
        communityItems.forEach(item => offlineDb.insert('community', item));
      }
    } else {
      const userCount = await User.countDocuments();
      if (userCount === 0) {
        const seededUsers = await User.insertMany(users);
        const farmerAccount = seededUsers.find(u => u.role === 'farmer');
        const formattedProds = products.map(p => ({
          ...p,
          farmerId: farmerAccount._id
        }));
        await Product.insertMany(formattedProds);
      }

      const commCount = await Community.countDocuments();
      if (commCount === 0) {
        await Community.insertMany(communityItems);
      }
    }
  } catch (error) {
    console.error('Database seeding error:', error);
  }
};

module.exports = seedData;
