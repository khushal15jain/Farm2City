const express = require('express');
const router = express.Router();
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', protect, authorize('farmer', 'admin'), createProduct);
router.put('/:id', protect, authorize('farmer', 'admin'), updateProduct);
router.delete('/:id', protect, authorize('farmer', 'admin'), deleteProduct);

module.exports = router;
