// 1️⃣ FORCE Node to accept self-signed Aiven certificate (LOCAL DEV ONLY)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import eventRoutes from './routes/event.routes.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

//Parse JSON bodies
app.use(express.json())

app.use('/api/events', eventRoutes)

// Home route - API endpoints documentation
app.get('/', (req, res) => {
  res.json([
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


// Health check
app.get('/healthz', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() })
})

export default app
