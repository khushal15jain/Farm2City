const Product = require('../models/Product');
const db = require('../config/db');
const offlineDb = require('../config/offlineDb');

// @desc Get all products
const getProducts = async (req, res) => {
  const { search, category, farmerId } = req.query;

  try {
    let products = [];
    if (db.isOffline()) {
      products = offlineDb.getCollection('products');
    } else {
      products = await Product.find({});
    }

    if (search) {
      products = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()));
    }

    if (category) {
      products = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    if (farmerId) {
      products = products.filter(p => p.farmerId && p.farmerId.toString() === farmerId.toString());
    }

    return res.json({ success: true, count: products.length, data: products });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get product by ID
const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    let product;
    if (db.isOffline()) {
      product = offlineDb.findById('products', id);
    } else {
      product = await Product.findById(id);
    }

    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    return res.json({ success: true, data: product });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Create Product (Farmer only)
const createProduct = async (req, res) => {
  const { name, category, price, quantity, unit, isOrganic, image, deliveryTime, description } = req.body;

  if (!name || !category || !price || !quantity) {
    return res.status(400).json({ success: false, message: 'Please provide name, category, price, and quantity' });
  }

  try {
    const productData = {
      name,
      category,
      price: Number(price),
      quantity: Number(quantity),
      unit: unit || 'kg',
      farmerId: req.user._id,
      farmerName: req.user.name,
      villageName: req.user.villageName || 'Sonapur Village',
      isOrganic: Boolean(isOrganic),
      image: image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=400',
      deliveryTime: deliveryTime || '24 hours',
      inStock: Number(quantity) > 0,
      description: description || ''
    };

    let newProduct;
    if (db.isOffline()) {
      newProduct = offlineDb.insert('products', productData);
    } else {
      newProduct = await Product.create(productData);
    }

    return res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Update Product
const updateProduct = async (req, res) => {
  const { id } = req.params;
  try {
    let product;
    if (db.isOffline()) {
      product = offlineDb.findById('products', id);
    } else {
      product = await Product.findById(id);
    }

    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    if (product.farmerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this product' });
    }

    const updateData = { ...req.body };
    if (updateData.quantity !== undefined) {
      updateData.inStock = Number(updateData.quantity) > 0;
    }

    let updatedProduct;
    if (db.isOffline()) {
      updatedProduct = offlineDb.updateById('products', id, updateData);
    } else {
      updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });
    }

    return res.json({ success: true, data: updatedProduct });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Delete Product
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    let product;
    if (db.isOffline()) {
      product = offlineDb.findById('products', id);
    } else {
      product = await Product.findById(id);
    }

    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    if (product.farmerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this product' });
    }

    if (db.isOffline()) {
      offlineDb.deleteById('products', id);
    } else {
      await Product.findByIdAndDelete(id);
    }

    return res.json({ success: true, message: 'Product removed successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
