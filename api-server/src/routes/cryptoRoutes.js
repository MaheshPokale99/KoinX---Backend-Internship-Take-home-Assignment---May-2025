const express = require('express');
const router = express.Router();
const { getLatestStats, getPriceDeviation } = require('../services/cryptoService');

// GET /api/stats
router.get('/stats', async (req, res) => {
  try {
    const { coin } = req.query;
    
    if (!coin || !['bitcoin', 'ethereum', 'matic-network'].includes(coin)) {
      return res.status(400).json({ error: 'Invalid coin parameter' });
    }

    const stats = await getLatestStats(coin);
    if (!stats) {
      return res.status(404).json({ error: 'No data found for the specified coin' });
    }

    res.json({
      price: stats.price,
      marketCap: stats.marketCap,
      '24hChange': stats['24hChange']
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/deviation
router.get('/deviation', async (req, res) => {
  try {
    const { coin } = req.query;
    
    if (!coin || !['bitcoin', 'ethereum', 'matic-network'].includes(coin)) {
      return res.status(400).json({ error: 'Invalid coin parameter' });
    }

    const deviation = await getPriceDeviation(coin);
    res.json(deviation);
  } catch (error) {
    console.error('Error calculating deviation:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 