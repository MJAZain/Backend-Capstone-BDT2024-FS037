const Order = require('../models/Order');

exports.createOrder = async (req, res) => {
    try {
        const { paket, destinasi, tanggal, userEmail } = req.body;
        console.log('Received order data:', { paket, destinasi, tanggal, userEmail }); // Debug log

        const order = new Order({ paket, destinasi, tanggal: new Date(tanggal), userEmail });
        await order.save();
        console.log('Order saved successfully'); // Debug log

        res.status(201).json({ message: 'Order created successfully' });
    } catch (error) {
        console.error('Error creating order:', error); // Debug log
        res.status(500).json({ error: 'Failed to create order' });
    }
};

exports.getUserOrders = async (req, res) => {
    try {
        const userEmail = req.user.email; // Assuming you have user authentication middleware
        console.log('Fetching orders for user:', userEmail); // Debug log

        const orders = await Order.find({ userEmail });
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error); // Debug log
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
};
