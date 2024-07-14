const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
        console.error('No authorization header provided');
        return res.status(401).json({ error: 'Access denied, no token provided' });
    }

    const token = authHeader.replace('Bearer ', '');
    if (!token) {
        console.error('No token provided after Bearer');
        return res.status(401).json({ error: 'Access denied, no token provided' });
    }

    console.log('Verifying token:', token);

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Token decoded:', decoded);
        req.user = decoded; // Attach the decoded token payload to req.user
        next();
    } catch (err) {
        console.error('Invalid token:', err);
        res.status(400).json({ error: 'Invalid token' });
    }
};

module.exports = verifyToken;
