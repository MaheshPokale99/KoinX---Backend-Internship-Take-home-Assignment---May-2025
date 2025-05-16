require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { connect } = require('nats');
const cors = require('cors');
const { storeCryptoStats } = require('./services/cryptoService');
const cryptoRoutes = require('./routes/cryptoRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', cryptoRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/crypto-stats')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// NATS Connection and Subscription
async function setupNats() {
  try {
    const nats = await connect({
      servers: process.env.NATS_URL || 'nats://localhost:4222'
    });
    
    console.log('Connected to NATS');

    // Subscribe to crypto update events
    const sub = nats.subscribe('crypto.update', {
      callback: async (err, msg) => {
        if (err) {
          console.error('Error processing message:', err);
          return;
        }
        try {
          await storeCryptoStats();
          console.log('Crypto stats updated successfully');
        } catch (error) {
          console.error('Error updating crypto stats:', error);
        }
      }
    });

    console.log('Subscribed to crypto.update events');
  } catch (err) {
    console.error('NATS connection error:', err);
  }
}

// Start server
app.listen(PORT, async () => {
  console.log(`API Server running on port ${PORT}`);
  await setupNats();
}); 