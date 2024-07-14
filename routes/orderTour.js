const express = require('express');
const router = express.Router();
const orderTourController = require('../controllers/orderTourController');

router.post('/order-tours', orderTourController.placeOrder);
router.get('/orders', orderTourController.getOrdersByEmail); // Add this line

module.exports = router;
