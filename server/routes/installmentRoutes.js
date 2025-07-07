const express = require('express');
const router = express.Router();
const installmentController = require('../controllers/installmentController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', installmentController.getAllInstallments);
router.get('/order/:orderId', installmentController.getInstallmentsByOrder);
router.post('/', installmentController.createInstallment);
router.put('/:id', installmentController.updateInstallment);
router.patch('/:id/paid', installmentController.markAsPaid);
router.delete('/:id', installmentController.deleteInstallment);

module.exports = router; 