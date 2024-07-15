const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { name, email, phone, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).json({ error: 'Passwords do not match' });
    }

    try {
        // Check if the email already exists
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
        res.status(201).json({ message: 'User registered successfully' });
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
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token, name: user.name, email: user.email }); // Return email along with token and name
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

