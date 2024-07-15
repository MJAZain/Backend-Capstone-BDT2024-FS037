const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    paket: String,
    destinasi: String,
    tanggal: Date,
    userId: mongoose.Schema.Types.ObjectId // Assuming you have a user system in place
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
