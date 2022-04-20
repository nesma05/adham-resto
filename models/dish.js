const mongoose = require('mongoose');
const path = require('path');

const dishImagePath = 'uploads/dishes';

const dishSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  featured: {
    type: String,
    default: 'no',
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  dishImageName: {
    type: String,
  },
});

dishSchema.virtual('dishImagePath').get(function () {
  if (this.dishImageName) {
    return path.join('/', dishImagePath, this.dishImageName);
  }
});

module.exports = mongoose.model('Dish', dishSchema);

module.exports.dishImagePath = dishImagePath;
