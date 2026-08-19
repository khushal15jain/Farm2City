const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const db = require('../config/db');
const offlineDb = require('../config/offlineDb');

// @desc Create order
const createOrder = async (req, res) => {
  const { items, totalAmount, deliveryCharge, tax, discountAmount, couponCode, deliveryAddress, phone, paymentMethod } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ success: false, message: 'No items in the order' });
  }

  try {
    const formattedItems = [];
    
    for (let item of items) {
      let product;
      if (db.isOffline()) {
        product = offlineDb.findById('products', item.productId);
      } else {
        product = await Product.findById(item.productId);
      }

      if (!product) {
        return res.status(404).json({ success: false, message: `Product not found: ${item.productId}` });
      }

      if (product.quantity < item.quantity) {
        return res.status(400).json({ success: false, message: `Insufficient quantity for ${product.name}. Available: ${product.quantity}` });
      }

      const newQty = product.quantity - item.quantity;
      const inStock = newQty > 0;

      if (db.isOffline()) {
        offlineDb.updateById('products', product._id, { quantity: newQty, inStock });
      } else {
        product.quantity = newQty;
        product.inStock = inStock;
        await product.save();
      }

      formattedItems.push({
        productId: product._id,
        productName: product.name,
        price: product.price,
        quantity: item.quantity,
        farmerId: product.farmerId,
        farmerName: product.farmerName
      });
    }

    const deliveryAgents = [
      { name: 'Karan Singh', phone: '+91 91234 56780' },
      { name: 'Vijay Patil', phone: '+91 99887 76655' },
      { name: 'Anil Deshmukh', phone: '+91 88776 65544' }
    ];
    const mockAgent = deliveryAgents[Math.floor(Math.random() * deliveryAgents.length)];

    const orderData = {
      customerId: req.user._id,
      customerName: req.user.name,
      items: formattedItems,
      totalAmount,
      deliveryCharge,
      tax,
      discountAmount,
      couponCode: couponCode || '',
      deliveryAddress,
      phone,
      paymentMethod: paymentMethod || 'COD',
      paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Paid',
      deliveryStatus: 'Ordered',
      estimatedDelivery: '36-48 Hours',
      deliveryAgent: mockAgent
    };

    let newOrder;
    if (db.isOffline()) {
      newOrder = offlineDb.insert('orders', orderData);
      if (newOrder.paymentStatus === 'Paid') {
        for (let item of formattedItems) {
          const farmer = offlineDb.findById('users', item.farmerId.toString());
          if (farmer) {
            const currentEarnings = Number(farmer.earnings || 0);
            offlineDb.updateById('users', farmer._id, { earnings: currentEarnings + (item.price * item.quantity) });
          }
        }
      }
    } else {
      newOrder = await Order.create(orderData);
      if (newOrder.paymentStatus === 'Paid') {
        for (let item of formattedItems) {
          const farmer = await User.findById(item.farmerId);
          if (farmer) {
            farmer.earnings = (farmer.earnings || 0) + (item.price * item.quantity);
            await farmer.save();
          }
        }
      }
    }

    return res.status(201).json({ success: true, data: newOrder });
  } catch (error) {
    console.error('Create order error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get orders for user
const getOrders = async (req, res) => {
  try {
    let orders = [];
    if (db.isOffline()) {
      orders = offlineDb.getCollection('orders');
    } else {
      orders = await Order.find({});
    }

    if (req.user.role === 'customer') {
      orders = orders.filter(o => o.customerId.toString() === req.user._id.toString());
    } else if (req.user.role === 'farmer') {
      orders = orders.filter(o => 
        o.items.some(item => item.farmerId.toString() === req.user._id.toString())
      ).map(o => {
        const filteredItems = o.items.filter(item => item.farmerId.toString() === req.user._id.toString());
        const subTotal = filteredItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        return {
          ...o,
          items: filteredItems,
          totalAmount: subTotal
        };
      });
    }

    orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get order by ID
const getOrderById = async (req, res) => {
  const { id } = req.params;
  try {
    let order;
    if (db.isOffline()) {
      order = offlineDb.findById('orders', id);
    } else {
      order = await Order.findById(id);
    }

    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    return res.json({ success: true, data: order });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Update delivery status
const updateDeliveryStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) return res.status(400).json({ success: false, message: 'Please provide status' });

  try {
    let order;
    if (db.isOffline()) {
      order = offlineDb.findById('orders', id);
    } else {
      order = await Order.findById(id);
    }

    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    let updatedOrder;
    const updateData = { deliveryStatus: status };
    if (status === 'Delivered') {
      updateData.paymentStatus = 'Paid';
    }

    if (db.isOffline()) {
      updatedOrder = offlineDb.updateById('orders', id, updateData);
      if (status === 'Delivered' && order.paymentStatus !== 'Paid') {
        for (let item of order.items) {
          const farmer = offlineDb.findById('users', item.farmerId.toString());
          if (farmer) {
            const currentEarnings = Number(farmer.earnings || 0);
            offlineDb.updateById('users', farmer._id, { earnings: currentEarnings + (item.price * item.quantity) });
          }
        }
      }
    } else {
      updatedOrder = await Order.findByIdAndUpdate(id, updateData, { new: true });
      if (status === 'Delivered' && order.paymentStatus !== 'Paid') {
        for (let item of order.items) {
          const farmer = await User.findById(item.farmerId);
          if (farmer) {
            farmer.earnings = (farmer.earnings || 0) + (item.price * item.quantity);
            await farmer.save();
          }
        }
      }
    }

    return res.json({ success: true, data: updatedOrder });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateDeliveryStatus
};
