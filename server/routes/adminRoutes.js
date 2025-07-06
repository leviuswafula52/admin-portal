const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/dashboard', authMiddleware, adminController.getAdminProfile);
router.put('/profile', authMiddleware, adminController.updateAdminProfile);
router.get('/profile', authMiddleware, authController.getProfile);

module.exports = router;