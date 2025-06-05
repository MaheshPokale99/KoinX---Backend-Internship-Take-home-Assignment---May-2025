const mongoose = require('mongoose');

const cryptoStatsSchema = new mongoose.Schema({
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
  change24h: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Create an index on coin and timestamp for efficient querying
cryptoStatsSchema.index({ coin: 1, timestamp: -1 });

module.exports = mongoose.model('CryptoStats', cryptoStatsSchema); 