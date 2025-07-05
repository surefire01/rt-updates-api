const express = require('express');
const router = express.Router();
const Dish = require('../models/dish');

// GET all dishes
router.get('/', async (req, res) => {
    try {
        const dishes = await Dish.find();
        res.json(dishes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Toggle isPublished
router.patch('/:id/toggle', async (req, res) => {
    try {
        const dish = await Dish.findById(req.params.id);
        if (!dish) return res.status(404).json({ message: 'Dish not found' });

        dish.isPublished = !dish.isPublished;
        await dish.save();

        res.json(dish);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
