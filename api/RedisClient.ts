import { createClient, RedisClientType } from 'redis'
import { IRedisClient } from './types.js'

// Redis client implementation
export class RedisClient implements IRedisClient {
  private client: RedisClientType

  constructor(url: string) {
    this.client = createClient({ url })
  }

  async connect(): Promise<void> {
    await this.client.connect()
  }

  async disconnect(): Promise<void> {
    await this.client.quit()
  }

  async createConsumerGroup(streamName: string, groupName: string): Promise<void> {
    try {
      await this.client.xGroupCreate(streamName, groupName, '0', { MKSTREAM: true })
    } catch (error) {
      if (!error.message.includes('BUSYGROUP')) {
        throw error
      }
    }
  }

  async readMessages(streamName: string, groupName: string, consumerName: string): Promise<any> {
    const result = await this.client.xReadGroup(
      groupName,
      consumerName,
      [{ key: streamName, id: '>' }],
      { COUNT: 10, BLOCK: 1000 }
    )
    return result
  }

  async acknowledgeMessage(streamName: string, groupName: string, messageId: string): Promise<void> {
    await this.client.xAck(streamName, groupName, messageId)
  }
}