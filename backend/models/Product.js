const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, default: 'kg' },
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  farmerName: { type: String, required: true },
  villageName: { type: String, default: '' },
  isOrganic: { type: Boolean, default: false },
  image: { type: String, default: '' },
  deliveryTime: { type: String, default: '24 hours' },
  inStock: { type: Boolean, default: true },
  description: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
