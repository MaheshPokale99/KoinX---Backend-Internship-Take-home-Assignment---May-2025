const axios = require('axios');
const CryptoStats = require('../models/CryptoStats');

const COINS = ['bitcoin', 'ethereum', 'matic-network'];

async function storeCryptoStats() {
  try {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${COINS.join(',')}&vs_currencies=usd&include_market_cap=true&include_24hr_change=true`
    );

    const stats = COINS.map(coin => ({
      coin,
      price: response.data[coin].usd,
      marketCap: response.data[coin].usd_market_cap,
      '24hChange': response.data[coin].usd_24h_change
    }));

    await CryptoStats.insertMany(stats);
    return stats;
  } catch (error) {
    console.error('Error fetching crypto stats:', error);
    throw error;
  }
}

async function getLatestStats(coin) {
  const stats = await CryptoStats.findOne({ coin })
    .sort({ timestamp: -1 });
  return stats;
}

async function getPriceDeviation(coin) {
  const stats = await CryptoStats.find({ coin })
    .sort({ timestamp: -1 })
    .limit(100)
    .select('price');

  if (stats.length === 0) {
    return { deviation: 0 };
  }

  const prices = stats.map(stat => stat.price);
  const mean = prices.reduce((a, b) => a + b, 0) / prices.length;
  const squareDiffs = prices.map(price => Math.pow(price - mean, 2));
  const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / squareDiffs.length;
  const deviation = Math.sqrt(avgSquareDiff);

  return { deviation: parseFloat(deviation.toFixed(2)) };
}

module.exports = {
  storeCryptoStats,
  getLatestStats,
  getPriceDeviation
}; 