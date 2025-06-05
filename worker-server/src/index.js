require('dotenv').config();
const { connect: natsConnect, StringCodec } = require('nats');

const INTERVAL = 15 * 60 * 1000; // 15 minutes in milliseconds
const sc = StringCodec();

async function setupNats() {
  try {
    const nc = await natsConnect({
      servers: process.env.NATS_URL || 'nats://localhost:4222'
    });
    console.log('Connected to NATS');

    // Function to publish update event
    const publishUpdate = () => {
      const message = { trigger: 'update', timestamp: new Date().toISOString() };
      nc.publish('crypto.update', sc.encode(JSON.stringify(message)));
      console.log('Published update event:', message);
    };

    // Publish immediately on startup
    publishUpdate();

    // Schedule regular updates
    setInterval(publishUpdate, INTERVAL);

    // Handle connection close
    nc.closed().then(() => {
      console.log('NATS connection closed');
      process.exit();
    });

    // Handle process termination
    const cleanup = async () => {
      await nc.drain();
      process.exit(0);
    };

    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);

  } catch (error) {
    console.error('NATS connection error:', error);
    process.exit(1);
  }
}

// Start the worker
console.log('Starting worker server...');
setupNats().catch(console.error); 