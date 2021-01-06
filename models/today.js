const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const todaySchema = new Schema({
  title: {
    type: String,
    ref: 'Product',
    required: true
  },
  price: {
    type: Number,
    ref: 'Product',
    required: true
  },
  description: {
    type: String,
    ref: 'Product',
    required: true
  },
  imageUrl: {
    type: String,
    ref: 'Product',
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('Today', productSchema);
