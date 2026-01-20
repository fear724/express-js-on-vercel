import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import { createClient } from 'redis'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
})

redisClient.connect().catch(console.error)

// Home route - API endpoints documentation
app.get('/', (req, res) => {
  res.json([
    {
      endpoint: '/redis-stream',
      method: 'GET',
      description: 'Reads data from a Redis stream. Accepts query parameters \'stream\' (default: \'mystream\') and \'lastId\' (default: \'0-0\'). Returns JSON with stream name and data.',
      parameters: {
        stream: 'string (optional, default: \'mystream\')',
        lastId: 'string (optional, default: \'0-0\')'
      }
    },
    {
      endpoint: '/api/consumer',
      method: 'GET',
      description: 'Consumes messages from a Redis stream using consumer groups. Processes up to 10 pending messages, acknowledges them, and returns the processed messages.',
      parameters: {}
    },
    {
      endpoint: '/healthz',
      method: 'GET',
      description: 'Health check endpoint that returns the current status and timestamp.',
      parameters: {}
    }
  ])
})

// app.get('/about', function (req, res) {
//   res.sendFile(path.join(__dirname, '..', 'components', 'about.htm'))
// })

// Example API endpoint - JSON
app.get('/api-data', (req, res) => {
  res.json({
    message: 'Here is some sample API data',
    items: ['apple', 'banana', 'cherry'],
  })
})

// Health check
app.get('/healthz', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Redis stream reader
app.get('/redis-stream', async (req, res) => {
  console.log('Accessing Redis stream endpoint -' + process.env.REDIS_URL);
  try {
    const streamName = String(req.query.stream || 'mystream')
    const lastId = String(req.query.lastId || '0-0')
    const results = await redisClient.xRead(
      [{ key: streamName, id: lastId }],
      { COUNT: 10, BLOCK: 5000 }
    )
    res.json({ stream: streamName, data: results })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
  console.log('Finished processing Redis stream request');
})

export default app
