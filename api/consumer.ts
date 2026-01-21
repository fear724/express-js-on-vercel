import { log } from 'console'
import { RedisClient } from './RedisClient.js'
import { StreamEventProcessor } from './StreamEventProcessor.js'
import { MessageProcessor } from './MessageProcessor.js'
import { StreamConsumer } from './StreamConsumer.js'
import { ConsumerService } from './ConsumerService.js'

const url = process.env.REDIS_URL || 'redis://localhost:6379'
const streamName = process.env.REDIS_STREAM_NAME || 'rest_api_producer_stream'
const targetStream = process.env.REDIS_TARGET_STREAM || 'grpc_api_producer_stream'
const groupName = process.env.REDIS_GROUP_NAME || 'mygroup'
const consumerName = process.env.REDIS_CONSUMER_NAME || 'vercel-consumer'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  console.log('Consumer endpoint hit')
  console.log('Using Redis URL:', url) 
  console.log('Using Stream Name:', streamName) 
  console.log('Using Group Name:', groupName) 
  console.log('Using Consumer Name:', consumerName) 

  // Dependency injection setup
  const redisClient = new RedisClient(url)
  const eventProcessor = new StreamEventProcessor(redisClient, targetStream)
  const messageProcessor = new MessageProcessor(eventProcessor)
  const streamConsumer = new StreamConsumer(redisClient, messageProcessor, streamName, groupName, consumerName)
  const consumerService = new ConsumerService(redisClient, streamConsumer)

  try {
    log('Processing messages...')
    const result = await consumerService.processMessages()

    res.status(200).json({
      success: true,
      processed: result.processed,
      messages: result.messages
    })

  } catch (error) {
    console.error('Consumer error:', error)
    res.status(500).json({
      error: 'Failed to process messages',
      details: error.message
    })
  }
}

