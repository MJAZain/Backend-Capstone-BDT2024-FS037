const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const verifyToken = require('./middleware/authMiddleware');

dotenv.config();

const authRoutes = require('./routes/auth');
const protectedRoutes = require('./routes/protected');
const forgotPasswordRoutes = require('./routes/forgot');
const orderRoutes = require('./routes/order');
const tourRoutes = require('./routes/tour');
const orderTourRoutes = require('./routes/orderTour');
const getTourRoutes = require('./routes/getTour');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Public Routes
app.use('/api/auth', authRoutes);
app.use('/api', forgotPasswordRoutes);
app.use('/api/tours', tourRoutes);

// Protected Routes
app.use('/api/order-tours', verifyToken, (req, res, next) => {
  console.log('Reached /api/order-tours route in server.js');
  next();
}, orderTourRoutes);
app.use('/api/protected', verifyToken, protectedRoutes);
app.use('/api/orders', verifyToken, orderRoutes);
app.use('/api/get-tour-orders', verifyToken, getTourRoutes); // Add this line for displaying tour orders

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
