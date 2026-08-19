const express = require('express');
const router = express.Router();
const { getFarmerDashboard, getCustomerDashboard, getAdminDashboard } = require('../controllers/dashboardController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/farmer', protect, authorize('farmer'), getFarmerDashboard);
router.get('/customer', protect, authorize('customer'), getCustomerDashboard);
router.get('/admin', protect, authorize('admin'), getAdminDashboard);

module.exports = router;
