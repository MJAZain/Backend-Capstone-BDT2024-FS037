const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const verifyToken = require('./middleware/authMiddleware'); // Import your auth middleware

dotenv.config();

const authRoutes = require('./routes/auth');
const protectedRoutes = require('./routes/protected');
const forgotPasswordRoutes = require('./routes/forgot');
const orderRoutes = require('./routes/order'); // Import order routes (now named order.js)

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err); // Debug log
    process.exit(1); // Exit process with failure
  });

// Public Routes
app.use('/api/auth', authRoutes);
app.use('/api', forgotPasswordRoutes);
app.use('/api/protected', verifyToken, protectedRoutes);
app.use('/api/orders', verifyToken, orderRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack); // Debug log
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000; // Ensure this port matches your front-end expectations
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
