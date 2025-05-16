# API Server for Cryptocurrency Statistics

This is the API server component of the cryptocurrency statistics system. It provides endpoints to access cryptocurrency data and subscribes to NATS events for data updates.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- NATS server

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/crypto-stats
   NATS_URL=nats://localhost:4222
   ```

## Running the Server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### GET /api/stats
Get the latest statistics for a cryptocurrency.

Query Parameters:
- `coin`: One of `bitcoin`, `ethereum`, or `matic-network`

Example Response:
```json
{
  "price": 40000,
  "marketCap": 800000000,
  "24hChange": 3.4
}
```

### GET /api/deviation
Get the standard deviation of the price for the last 100 records.

Query Parameters:
- `coin`: One of `bitcoin`, `ethereum`, or `matic-network`

Example Response:
```json
{
  "deviation": 4082.48
}
```

## Architecture

The API server:
- Connects to MongoDB for data persistence
- Subscribes to NATS events for data updates
- Provides RESTful endpoints for accessing cryptocurrency data
- Implements error handling and input validation

## Dependencies

- express: Web framework
- mongoose: MongoDB ODM
- nats: Event queue client
- axios: HTTP client for CoinGecko API
- dotenv: Environment variable management
- cors: Cross-origin resource sharing 