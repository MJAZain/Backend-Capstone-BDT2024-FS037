const Tour = require('../models/Tour');

exports.getAllTours = async (req, res) => {
    try {
        const tours = await Tour.find({});
        res.status(200).json(tours);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving tours: ' + error });
    }
};

exports.getTourImage = async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id);
        if (!tour) {
            return res.status(404).send('Tour not found');
        }
        res.set('Content-Type', 'image/jpeg');
        res.send(tour.image);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving tour image: ' + error });
    }
};
