const express = require('express');
const router = express.Router();
const { createOrder, getOrders, getOrderById, updateDeliveryStatus } = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('customer'), createOrder);
router.get('/', protect, getOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/status', protect, authorize('farmer', 'admin'), updateDeliveryStatus);

module.exports = router;
