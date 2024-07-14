const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { name, email, phone, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).json({ error: 'Passwords do not match' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already in use' });
        }

        console.log('Registering user:', name, email, phone); // Debug log
        const user = new User({
            name,
            email,
            phone,
            password
        });
        await user.save();
        console.log('User registered successfully'); // Debug log
        
        // Include email in the token payload
        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ token, message: 'User registered successfully', name: user.name, email: user.email, phone: user.phone });
    } catch (error) {
        console.log('Error registering user:', error.message); // Debug log
        res.status(400).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        // Include email in the token payload
        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token, name: user.name, email: user.email, phone: user.phone }); // Return phone along with token, name, and email
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
