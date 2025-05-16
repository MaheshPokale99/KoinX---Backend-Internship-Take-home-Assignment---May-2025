require('dotenv').config();
const { connect } = require('nats');

async function startWorker() {
  try {
    const nats = await connect({
      servers: process.env.NATS_URL || 'nats://localhost:4222'
    });
    
    console.log('Worker connected to NATS');

    setInterval(async () => {
      try {
        await nats.publish('crypto.update', JSON.stringify({ trigger: 'update' }));
        console.log('Published update event:', new Date().toISOString());
      } catch (error) {
        console.error('Error publishing event:', error);
      }
    }, 15 * 60 * 1000); 

    console.log('Worker started - publishing events every 15 minutes');
  } catch (err) {
    console.error('Worker error:', err);
    process.exit(1);
  }
}

startWorker(); 