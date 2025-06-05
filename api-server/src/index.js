require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { connect: natsConnect, StringCodec } = require('nats');
const cors = require('cors');
const cryptoRoutes = require('./routes/cryptoRoutes');
const { storeCryptoStats } = require('./services/cryptoService');

const app = express();
const port = process.env.PORT || 3000;
const sc = StringCodec();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', cryptoRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/crypto-stats', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('MongoDB connection error:', error);
  process.exit(1);
});

// Connect to NATS and subscribe to updates
async function setupNats() {
  try {
    const nc = await natsConnect({
      servers: process.env.NATS_URL || 'nats://localhost:4222'
    });
    console.log('Connected to NATS');

    // Subscribe to the update event
    const sub = nc.subscribe('crypto.update');
    console.log('Subscribed to crypto.update');

    // Handle incoming messages
    for await (const msg of sub) {
      const data = sc.decode(msg.data);
      console.log('Received update event:', data);
      
      try {
        await storeCryptoStats();
      } catch (error) {
        console.error('Error handling update event:', error);
      }
    }
  } catch (error) {
    console.error('NATS connection error:', error);
    process.exit(1);
  }
}

// Start the server
app.listen(port, () => {
  console.log(`API server listening on port ${port}`);
  setupNats().catch(console.error);
}); 