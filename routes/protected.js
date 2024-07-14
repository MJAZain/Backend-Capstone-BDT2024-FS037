const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware'); // Import the middleware
const User = require('../models/User');

router.get('/profile', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
