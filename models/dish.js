const mongoose = require('mongoose');

const DishSchema = new mongoose.Schema({
    _id: String, // dishId used as _id
    dishName: { type: String, required: true },
    imageUrl: { type: String, required: true },
    isPublished: { type: Boolean, default: true }
});

module.exports = mongoose.model('Dish', DishSchema);
