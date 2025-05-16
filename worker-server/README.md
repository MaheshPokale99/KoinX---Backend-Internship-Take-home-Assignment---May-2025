# Worker Server for Cryptocurrency Statistics

This is the worker server component of the cryptocurrency statistics system. It publishes events to NATS every 15 minutes to trigger data updates in the API server.

## Prerequisites

- Node.js (v14 or higher)
- NATS server

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the root directory with the following variables:
   ```
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

## Architecture

The worker server:
- Connects to NATS server
- Publishes an update event every 15 minutes
- Implements error handling and logging
- Runs as a background process

## Event Format

The worker publishes events in the following format:
```json
{
  "trigger": "update"
}
```

## Dependencies

- nats: Event queue client
- dotenv: Environment variable management 