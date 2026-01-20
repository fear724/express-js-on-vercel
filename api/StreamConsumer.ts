import { IStreamConsumer, IRedisClient, IMessageProcessor } from './types.js'

// Stream consumer
export class StreamConsumer implements IStreamConsumer {
  private redisClient: IRedisClient
  private messageProcessor: IMessageProcessor
  private streamName: string
  private groupName: string
  private consumerName: string

  constructor(redisClient: IRedisClient, messageProcessor: IMessageProcessor, streamName: string, groupName: string, consumerName: string) {
    this.redisClient = redisClient
    this.messageProcessor = messageProcessor
    this.streamName = streamName
    this.groupName = groupName
    this.consumerName = consumerName
  }

  async consume(): Promise<{ processed: number; messages: any[] }> {
    const processedMessages = []

    const pendingResult = await this.redisClient.readMessages(this.streamName, this.groupName, this.consumerName)

    const result = pendingResult || []

    if (result && Array.isArray(result) && result.length > 0) {
      for (const stream of result) {
        if (stream && typeof stream === 'object' && 'messages' in stream && Array.isArray(stream.messages) && stream.messages.length > 0) {
          for (const message of stream.messages) {
            // Process the message
            await this.messageProcessor.process(message.message)

            // Acknowledge the message
            await this.redisClient.acknowledgeMessage(this.streamName, this.groupName, message.id)

            processedMessages.push({
              id: message.id,
              data: message.message
            })
          }
        }
      }
    }

    return {
      processed: processedMessages.length,
      messages: processedMessages
    }
  }
}