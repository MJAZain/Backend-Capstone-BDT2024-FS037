const express = require('express');
const router = express.Router();
const tourController = require('../controllers/tourController');

router.get('/', tourController.getAllTours);
router.get('/:id/image', tourController.getTourImage);

module.exports = router;
