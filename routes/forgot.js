const express = require('express');
const router = express.Router();
const { forgotPassword, verifyToken, resetPassword } = require('../controllers/forgotController');

router.post('/forgot-password', forgotPassword);
router.post('/verify-token', verifyToken);
router.post('/reset-password', resetPassword);

module.exports = router;
