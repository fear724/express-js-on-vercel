import { IMessageProcessor, StreamEvent } from './types.js'
import { StreamEventProcessor } from './StreamEventProcessor.js'

// Message processor implementation
export class MessageProcessor implements IMessageProcessor {
  private eventProcessor: StreamEventProcessor

  constructor(eventProcessor: StreamEventProcessor) {
    this.eventProcessor = eventProcessor
  }

  async process(message: any): Promise<void> {

    // Extract and parse the event from the message
    if (message && message.event) {
      try {
        const rawEvent = JSON.parse(message.event)
        const eventData: StreamEvent = {
          id: rawEvent.id,
          text: rawEvent.text,
          timestamp: new Date(rawEvent.timestamp)
        }
        await this.eventProcessor.process(eventData)
      } catch (error) {
        console.error('Failed to parse or process event:', error)
      }
    } else {
      console.log('No event data in message')
    }
  }
}