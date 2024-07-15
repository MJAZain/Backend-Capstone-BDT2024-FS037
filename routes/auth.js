const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.post('/register', async (req, res) => {
    const { name, email, phone, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).json({ error: 'Passwords do not match' });
    }

    try {
        const user = new User({
            name,
            email,
            phone,
            password
        });
        await user.save();
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        
        if (!user || !(await user.matchPassword(password))) {
            console.error('Invalid credentials'); 
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        console.log('User found:', user); 
        
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ token, name: user.name, email: user.email });
    } catch (error) {
        console.error('Login error:', error.message); 
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
