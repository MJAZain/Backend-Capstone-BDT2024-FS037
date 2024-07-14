const mongoose = require('mongoose');

const orderTourSchema = new mongoose.Schema({
    email: { type: String, required: true },
    tour: { type: mongoose.Schema.Types.ObjectId, ref: 'Tour', required: true },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('OrderTour', orderTourSchema);
