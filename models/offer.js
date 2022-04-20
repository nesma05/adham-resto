const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  article1: {
    type: String,
    required: true,
  },
  article2: {
    type: String,
    required: true,
  },
  article3: {
    type: String,
  },
  article4: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('Offer', offerSchema);
