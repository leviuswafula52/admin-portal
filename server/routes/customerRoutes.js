const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, customerController.getAllCustomers);
router.post('/', authMiddleware, customerController.createCustomer);
router.get('/:id', authMiddleware, customerController.getCustomerById);
router.put('/:id', authMiddleware, customerController.updateCustomer);
router.delete('/:id', authMiddleware, customerController.deleteCustomer);

module.exports = router;