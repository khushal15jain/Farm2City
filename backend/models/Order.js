const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  productName: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  farmerName: { type: String, required: true }
});

const orderSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  customerName: { type: String, required: true },
  items: [orderItemSchema],
  totalAmount: { type: Number, required: true },
  deliveryCharge: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  discountAmount: { type: Number, default: 0 },
  couponCode: { type: String, default: '' },
  deliveryAddress: { type: String, required: true },
  phone: { type: String, required: true },
  paymentMethod: { type: String, enum: ['COD', 'Stripe', 'Razorpay'], default: 'COD' },
  paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Failed'], default: 'Pending' },
  deliveryStatus: { type: String, enum: ['Ordered', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'], default: 'Ordered' },
  estimatedDelivery: { type: String, default: '36-48 Hours' },
  deliveryAgent: {
    name: { type: String, default: 'Karan Singh' },
    phone: { type: String, default: '+91 91234 56780' }
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
