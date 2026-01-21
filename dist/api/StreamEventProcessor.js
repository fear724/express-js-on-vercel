// Event processor that processes stream events
export class StreamEventProcessor {
    redisClient;
    targetStream;
    constructor(redisClient, targetStream) {
        this.redisClient = redisClient;
        this.targetStream = targetStream;
    }
    async process(event) {
        console.log('Processing stream event:', event);
        if (event.text &&
            event.text.toLowerCase().includes('java') &&
            this.redisClient &&
            this.targetStream) {
            console.log(`Forwarding event "${event.text}" to stream: ${this.targetStream}`);
            await this.redisClient.xadd(this.targetStream, '*', {
                event: JSON.stringify(event)
            });
        }
    }
}
