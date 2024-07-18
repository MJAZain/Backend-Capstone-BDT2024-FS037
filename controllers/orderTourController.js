const OrderTour = require('../models/OrderTour');
const Tour = require('../models/Tour');

exports.placeOrder = async (req, res) => {
    try {
        console.log('Place order request received'); // Debug log
        const { email, tourId } = req.body;
        console.log('Email:', email, 'Tour ID:', tourId); // Debug log

        // Check if the user has already booked the same tour
        const existingOrder = await OrderTour.findOne({ email, tour: tourId });
        if (existingOrder) {
            console.log('User has already booked this tour'); // Debug log
            return res.status(400).json({ message: 'You have already booked this tour.' });
        }

        const tour = await Tour.findById(tourId);
        if (!tour) {
            console.log('Tour not found'); // Debug log
            return res.status(404).json({ message: 'Tour not found' });
        }

        const newOrder = new OrderTour({
            email: email,
            tour: tourId,
            date: new Date()
        });

        await newOrder.save();
        console.log('Order placed successfully'); // Debug log
        res.status(200).json({ message: 'Order placed successfully' });
    } catch (error) {
        console.error('Error placing order:', error); // Debug log
        res.status(500).json({ message: 'Error placing order: ' + error });
    }
};

exports.getOrdersByEmail = async (req, res) => {
    try {
        console.log('Get orders by email request received'); // Debug log
        const { email, query } = req.query;
        console.log('Email:', email, 'Query:', query); // Debug log
        let orders;
        if (query) {
            orders = await OrderTour.find({ email }).populate({
                path: 'tour',
                match: { title: { $regex: query, $options: 'i' } }
            });
        } else {
            orders = await OrderTour.find({ email }).populate('tour');
        }
        orders = orders.filter(order => order.tour);
        console.log('Orders fetched successfully'); // Debug log
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error); // Debug log
        res.status(500).json({ message: 'Error fetching orders: ' + error });
    }
};
