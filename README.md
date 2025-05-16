# Cryptocurrency Statistics System

This project consists of two Node.js servers that work together to collect and expose cryptocurrency statistics using MongoDB and NATS for event queuing.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- NATS server

## Project Structure

```
.
├── api-server/           # API server for exposing crypto statistics
│   ├── src/
│   │   ├── models/      # MongoDB models
│   │   ├── routes/      # API routes
│   │   ├── services/    # Business logic
│   │   └── index.js     # Main server file
│   └── package.json
│
└── worker-server/        # Background job server
    ├── src/
    │   └── index.js     # Worker server file
    └── package.json
```

## Setup

1. Clone the repository
2. Install dependencies for both servers:
   ```bash
   cd api-server && npm install
   cd ../worker-server && npm install
   ```

3. Create a `.env` file in both server directories with the following variables:
   ```
   # api-server/.env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/crypto-stats
   NATS_URL=nats://localhost:4222

   # worker-server/.env
   NATS_URL=nats://localhost:4222
   ```

## Running the Servers

1. Start the API server:
   ```bash
   cd api-server
   npm run dev
   ```

2. Start the worker server:
   ```bash
   cd worker-server
   npm run dev
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

## Background Job

The worker server publishes an update event every 15 minutes to the NATS queue. The API server subscribes to these events and updates the cryptocurrency statistics in the database.

## Optional Deployment

For production deployment:

1. Set up a MongoDB Atlas cluster and update the `MONGODB_URI`
2. Deploy the API server to a cloud platform (Heroku, AWS, GCP, or Azure)
3. Deploy the worker server to a cloud platform
4. Set up a NATS server in the cloud or use a managed NATS service 