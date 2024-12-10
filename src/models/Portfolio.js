const mongoose = require('mongoose');

const holdingSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true
  },
  shares: {
    type: Number,
    required: true,
    min: 0
  },
  averageCost: {
    type: Number,
    required: true
  }
});

const portfolioSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  holdings: [holdingSchema],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Portfolio', portfolioSchema);
