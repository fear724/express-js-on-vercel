import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from 'redis';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});
redisClient.connect().catch(console.error);
// Home route - HTML
app.get('/', (req, res) => {
    res.type('html').send(`
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8"/>
        <title>Express on Vercel</title>
        <link rel="stylesheet" href="/style.css" />
      </head>
      <body>
        <nav>
          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/api-data">API Data</a>
          <a href="/healthz">Health</a>
          <a href="/redis-stream">Redis Stream</a>
          <a href="/api/consumer">Consumer</a>
        </nav>
        <h1>Welcome to Express on Vercel 🚀</h1>
        <p>This is a minimal example without a database or forms.</p>
        <img src="/logo.png" alt="Logo" width="120" />
      </body>
    </html>
  `);
});
app.get('/about', function (req, res) {
    res.sendFile(path.join(__dirname, '..', 'components', 'about.htm'));
});
// Example API endpoint - JSON
app.get('/api-data', (req, res) => {
    res.json({
        message: 'Here is some sample API data',
        items: ['apple', 'banana', 'cherry'],
    });
});
// Health check
app.get('/healthz', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});
// Redis stream reader
app.get('/redis-stream', async (req, res) => {
    console.log('Accessing Redis stream endpoint -' + process.env.REDIS_URL);
    try {
        const streamName = String(req.query.stream || 'mystream');
        const lastId = String(req.query.lastId || '0-0');
        const results = await redisClient.xRead([{ key: streamName, id: lastId }], { COUNT: 10, BLOCK: 5000 });
        console.log('Redis stream accessed:', streamName);
        res.json({ stream: streamName, data: results });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
    console.log('Finished processing Redis stream request');
});
export default app;
