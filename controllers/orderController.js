const Order = require('../models/Order');

// Create a new order
exports.createOrder = async (req, res) => {
    try {
        const { paket, destinasi, tanggal } = req.body;
        const userEmail = req.user.email; // Use email from token payload

        console.log('Received order data:', { paket, destinasi, tanggal, userEmail });

        const order = new Order({ paket, destinasi, tanggal: new Date(tanggal), userEmail });
        await order.save();
        console.log('Order saved successfully');

        res.status(201).json({ message: 'Order created successfully' });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Failed to create order' });
    }
};

// Get orders for the authenticated user
exports.getUserOrders = async (req, res) => {
    try {
        const userEmail = req.user.email; // Use email from token payload
        console.log('Fetching orders for user:', userEmail);

        const orders = await Order.find({ userEmail });
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
};
