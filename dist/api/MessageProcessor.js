// Message processor
export class MessageProcessor {
    eventProcessor;
    constructor(eventProcessor) {
        this.eventProcessor = eventProcessor;
    }
    async process(message) {
        // Extract and parse the event from the message
        if (message && message.event) {
            try {
                const rawEvent = JSON.parse(message.event);
                const eventData = {
                    id: rawEvent.id,
                    text: rawEvent.text,
                    timestamp: new Date(rawEvent.timestamp)
                };
                await this.eventProcessor.process(eventData);
            }
            catch (error) {
                console.error('Failed to parse or process event:', error);
            }
        }
        else {
            console.log('No event data in message');
        }
    }
}
