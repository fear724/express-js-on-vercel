import { StreamEvent } from './types.js'

// Event processor that processes stream events
export class StreamEventProcessor {
  constructor(private redisClient?: any, private targetStream?: string) { }

  async process(event: StreamEvent): Promise<void> {
    console.log('Processing stream event:', event)
    
    if (
      event.text &&
      event.text.toLowerCase().includes('java') &&
      this.redisClient &&
      this.targetStream
    ) {
      console.log(`Forwarding event "${event.text}" to stream: ${this.targetStream}`)

      await this.redisClient.xadd(this.targetStream, '*', {
        event: JSON.stringify(event)
      })

    }
  }
}