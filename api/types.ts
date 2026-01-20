// Define the structure of the stream event
export interface StreamEvent {
  id: string
  text: string
  timestamp: Date
}

// Interfaces for dependency inversion
export interface IRedisClient {
  connect(): Promise<void>
  disconnect(): Promise<void>
  createConsumerGroup(streamName: string, groupName: string): Promise<void>
  readMessages(streamName: string, groupName: string, consumerName: string): Promise<any>
  acknowledgeMessage(streamName: string, groupName: string, messageId: string): Promise<void>
}

export interface IMessageProcessor {
  process(message: any): Promise<void>
}

export interface IStreamConsumer {
  consume(): Promise<{ processed: number; messages: any[] }>
}