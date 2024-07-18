const express = require('express');
const router = express.Router();
const orderTourController = require('../controllers/orderTourController');
const verifyToken = require('../middleware/authMiddleware');

router.post('/place-order', verifyToken, (req, res, next) => {
    console.log('POST /place-order route hit'); // Debug log
    next();
}, orderTourController.placeOrder);

router.get('/orders', verifyToken, (req, res, next) => {
    console.log('GET /orders route hit'); // Debug log
    next();
}, orderTourController.getOrdersByEmail);

module.exports = router;
