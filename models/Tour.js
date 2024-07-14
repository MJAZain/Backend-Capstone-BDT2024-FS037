const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
    image: Buffer,
    title: String,
    locations: String,
    date: Date,
    description: String,
    price: Number // Adding price field for Indonesian Rupiah (IDR)
});

module.exports = mongoose.model('Tour', tourSchema);
