const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    paket: String,
    destinasi: String,
    tanggal: Date,
    userEmail: {
        type: String,
        required: true
    }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
