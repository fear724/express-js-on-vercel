# Express.js on Vercel

Basic Express.js + Vercel example that serves html content, JSON data and simulates an api route. Includes Redis stream reading and a serverless consumer that runs on Vercel cron.

## Features

- Express.js web server
- Redis stream reading API endpoint
- Serverless Redis stream consumer (runs every 5 minutes via Vercel cron)
- TypeScript support

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/vercel/examples/tree/main/solutions/express&project-name=express&repository-name=express)

### Clone and Deploy

```bash
git clone https://github.com/vercel/examples/tree/main/solutions/express
```

Install the dependencies:

```bash
pnpm install
```

Install the Vercel CLI:

```bash
npm i -g vercel
```

Then run the app at the root of the repository:

```bash
vercel dev
```

## Redis Setup

The app includes Redis stream functionality. Set the following environment variables:

- `REDIS_URL`: Redis connection URL (default: `redis://localhost:6379`)
- `REDIS_STREAM_NAME`: Name of the Redis stream (default: `mystream`)
- `REDIS_GROUP_NAME`: Consumer group name (default: `mygroup`)
- `REDIS_CONSUMER_NAME`: Consumer name (default: `vercel-consumer`)

## API Endpoints

- `/`: Home page
- `/about`: About page
- `/api-data`: Sample JSON API
- `/healthz`: Health check
- `/redis-stream`: Read from Redis stream (GET, query params: `stream`, `lastId`)
- `/api/consumer`: Manual trigger for the consumer (GET)

## Consumer

The Redis stream consumer runs automatically every 5 minutes via Vercel cron. It processes pending messages in the consumer group and acknowledges them.

You can also manually trigger the consumer by visiting `/api/consumer`.
