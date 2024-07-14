const OrderTour = require('../models/OrderTour');
const Tour = require('../models/Tour');

exports.placeOrder = async (req, res) => {
    try {
        const { email, tourId } = req.body;

        // Check if the user has already booked the same tour
        const existingOrder = await OrderTour.findOne({ email, tour: tourId });
        if (existingOrder) {
            return res.status(400).json({ message: 'You have already booked this tour.' });
        }

        const tour = await Tour.findById(tourId);
        if (!tour) {
            return res.status(404).json({ message: 'Tour not found' });
        }

        const newOrder = new OrderTour({
            email: email,
            tour: tourId,
            date: new Date()
        });

        await newOrder.save();
        res.status(200).json({ message: 'Order placed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error placing order: ' + error });
    }
};

exports.getOrdersByEmail = async (req, res) => {
    try {
        const { email, query } = req.query;
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
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders: ' + error });
    }
};


