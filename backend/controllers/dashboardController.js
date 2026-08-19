const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const db = require('../config/db');
const offlineDb = require('../config/offlineDb');

const getFarmerDashboard = async (req, res) => {
  try {
    let orders = [];
    let products = [];

    if (db.isOffline()) {
      orders = offlineDb.getCollection('orders');
      products = offlineDb.getCollection('products').filter(p => p.farmerId.toString() === req.user._id.toString());
    } else {
      orders = await Order.find({});
      products = await Product.find({ farmerId: req.user._id });
    }

    const farmerOrders = orders.filter(o => 
      o.items.some(item => item.farmerId.toString() === req.user._id.toString())
    );

    let totalRevenue = 0;
    let pendingOrdersCount = 0;
    let completedOrdersCount = 0;

    farmerOrders.forEach(o => {
      const farmerItems = o.items.filter(item => item.farmerId.toString() === req.user._id.toString());
      const itemSum = farmerItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      if (o.deliveryStatus === 'Delivered') {
        totalRevenue += itemSum;
        completedOrdersCount++;
      } else {
        pendingOrdersCount++;
      }
    });

    const monthlySales = [
      { name: 'Jan', revenue: Math.round(totalRevenue * 0.08) },
      { name: 'Feb', revenue: Math.round(totalRevenue * 0.12) },
      { name: 'Mar', revenue: Math.round(totalRevenue * 0.15) },
      { name: 'Apr', revenue: Math.round(totalRevenue * 0.22) },
      { name: 'May', revenue: Math.round(totalRevenue * 0.43) }
    ];

    const productSales = products.map(p => {
      const quantitySold = farmerOrders
        .filter(o => o.deliveryStatus === 'Delivered')
        .reduce((sum, o) => {
          const item = o.items.find(i => i.productId.toString() === p._id.toString());
          return sum + (item ? item.quantity : 0);
        }, 0);
      return {
        name: p.name,
        stock: p.quantity,
        sold: quantitySold,
        earnings: quantitySold * p.price
      };
    });

    return res.json({
      success: true,
      data: {
        stats: {
          totalRevenue,
          pendingOrders: pendingOrdersCount,
          completedOrders: completedOrdersCount,
          totalProducts: products.length
        },
        monthlySales,
        productSales
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getCustomerDashboard = async (req, res) => {
  try {
    let orders = [];
    if (db.isOffline()) {
      orders = offlineDb.getCollection('orders').filter(o => o.customerId.toString() === req.user._id.toString());
    } else {
      orders = await Order.find({ customerId: req.user._id });
    }

    const totalOrders = orders.length;
    const activeOrders = orders.filter(o => o.deliveryStatus !== 'Delivered').length;
    const completedOrders = orders.filter(o => o.deliveryStatus === 'Delivered').length;
    const totalSpent = orders
      .filter(o => o.paymentStatus === 'Paid')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    return res.json({
      success: true,
      data: {
        stats: {
          totalOrders,
          activeOrders,
          completedOrders,
          totalSpent
        },
        purchaseHistory: orders.slice(0, 5)
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getAdminDashboard = async (req, res) => {
  try {
    let users = [];
    let products = [];
    let orders = [];

    if (db.isOffline()) {
      users = offlineDb.getCollection('users');
      products = offlineDb.getCollection('products');
      orders = offlineDb.getCollection('orders');
    } else {
      users = await User.find({});
      products = await Product.find({});
      orders = await Order.find({});
    }

    const farmerCount = users.filter(u => u.role === 'farmer').length;
    const customerCount = users.filter(u => u.role === 'customer').length;
    
    const totalSalesVolume = orders
      .filter(o => o.paymentStatus === 'Paid')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    const platformRevenue = Math.round(totalSalesVolume * 0.10);

    const platformGrowth = [
      { month: 'Jan', farmers: Math.round(farmerCount * 0.4), customers: Math.round(customerCount * 0.3), sales: Math.round(totalSalesVolume * 0.08) },
      { month: 'Feb', farmers: Math.round(farmerCount * 0.6), customers: Math.round(customerCount * 0.5), sales: Math.round(totalSalesVolume * 0.14) },
      { month: 'Mar', farmers: Math.round(farmerCount * 0.7), customers: Math.round(customerCount * 0.7), sales: Math.round(totalSalesVolume * 0.28) },
      { month: 'Apr', farmers: Math.round(farmerCount * 0.9), customers: Math.round(customerCount * 0.9), sales: Math.round(totalSalesVolume * 0.55) },
      { month: 'May', farmers: farmerCount, customers: customerCount, sales: totalSalesVolume }
    ];

    const complaints = [
      { _id: '1', name: 'Freshness dispute', reporter: 'Anita Sen', target: 'Farmer Ramlal', status: 'Resolved' },
      { _id: '2', name: 'Delayed delivery charge refund', reporter: 'Vijay Gupta', target: 'Courier services', status: 'Pending' }
    ];

    return res.json({
      success: true,
      data: {
        stats: {
          totalUsers: users.length,
          totalFarmers: farmerCount,
          totalCustomers: customerCount,
          totalProducts: products.length,
          totalSales: totalSalesVolume,
          platformRevenue
        },
        users,
        platformGrowth,
        complaints
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getFarmerDashboard,
  getCustomerDashboard,
  getAdminDashboard
};
