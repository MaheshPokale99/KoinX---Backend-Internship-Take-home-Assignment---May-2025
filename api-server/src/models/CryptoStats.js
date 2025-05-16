const mongoose = require('mongoose');

const cryptoSchema = new mongoose.Schema({
  coin: {
    type: String,
    required: true,
    enum: ['bitcoin', 'ethereum', 'matic-network']
  },
  price: {
    type: Number,
    required: true
  },
  marketCap: {
    type: Number,
    required: true
  },
  '24hChange': {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

cryptoSchema.index({ coin: 1, timestamp: -1 });

module.exports = mongoose.model('CryptoStats', cryptoSchema); 