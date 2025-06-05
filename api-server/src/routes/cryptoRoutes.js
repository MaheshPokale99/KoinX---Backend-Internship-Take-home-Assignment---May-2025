const express = require('express');
const router = express.Router();
const { getLatestStats, getPriceDeviation } = require('../services/cryptoService');

// Middleware to validate coin parameter
const validateCoin = (req, res, next) => {
  const validCoins = ['bitcoin', 'ethereum', 'matic-network'];
  const coin = req.query.coin;

  if (!coin) {
    return res.status(400).json({ error: 'Coin parameter is required' });
  }

  if (!validCoins.includes(coin)) {
    return res.status(400).json({ error: 'Invalid coin. Must be one of: bitcoin, ethereum, matic-network' });
  }

  next();
};

// GET /stats endpoint
router.get('/stats', validateCoin, async (req, res) => {
  try {
    const stats = await getLatestStats(req.query.coin);
    res.json(stats);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// GET /deviation endpoint
router.get('/deviation', validateCoin, async (req, res) => {
  try {
    const deviation = await getPriceDeviation(req.query.coin);
    res.json(deviation);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

module.exports = router; 