const express = require('express');
const orderController = require('../controllers/orderController');
const verifyToken = require('../middleware/authMiddleware'); // Ensure the user is authenticated
const router = express.Router();

router.post('/', verifyToken, orderController.createOrder);
router.get('/', verifyToken, orderController.getUserOrders);

module.exports = router;
