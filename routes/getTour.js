const express = require('express');
const router = express.Router();
const orderTourController = require('../controllers/orderTourController');

router.get('/', orderTourController.getOrdersByEmail);

module.exports = router;
