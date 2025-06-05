const axios = require('axios');
const CryptoStats = require('../models/CryptoStats');

const COINGECKO_API_BASE = 'https://api.coingecko.com/api/v3';

async function storeCryptoStats() {
  try {
    const coins = ['bitcoin', 'ethereum', 'matic-network'];
    const response = await axios.get(`${COINGECKO_API_BASE}/simple/price`, {
      params: {
        ids: coins.join(','),
        vs_currencies: 'usd',
        include_market_cap: true,
        include_24hr_change: true
      }
    });

    const updates = coins.map(async (coin) => {
      const data = response.data[coin];
      return CryptoStats.create({
        coin,
        price: data.usd,
        marketCap: data.usd_market_cap,
        change24h: data.usd_24h_change
      });
    });

    await Promise.all(updates);
    console.log('Crypto stats updated successfully');
  } catch (error) {
    console.error('Error storing crypto stats:', error.message);
    throw error;
  }
}

async function getLatestStats(coin) {
  const stats = await CryptoStats.findOne({ coin })
    .sort({ timestamp: -1 });
  
  if (!stats) {
    throw new Error('No stats found for the specified coin');
  }

  return {
    price: stats.price,
    marketCap: stats.marketCap,
    "24hChange": stats.change24h
  };
}

async function getPriceDeviation(coin) {
  const stats = await CryptoStats.find({ coin })
    .sort({ timestamp: -1 })
    .limit(100)
    .select('price');

  if (stats.length === 0) {
    throw new Error('No stats found for the specified coin');
  }

  const prices = stats.map(stat => stat.price);
  const mean = prices.reduce((a, b) => a + b) / prices.length;
  const squaredDiffs = prices.map(price => Math.pow(price - mean, 2));
  const variance = squaredDiffs.reduce((a, b) => a + b) / prices.length;
  const deviation = Math.sqrt(variance);

  return { deviation: Number(deviation.toFixed(2)) };
}

module.exports = {
  storeCryptoStats,
  getLatestStats,
  getPriceDeviation
}; 