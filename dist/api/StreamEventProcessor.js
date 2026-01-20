// Event processor (already following SRP)
export class StreamEventProcessor {
    async process(event) {
        console.log('Processing stream event:', event);
        // Add your event processing logic here
        // For example: save to database, send notifications, etc.
    }
}
