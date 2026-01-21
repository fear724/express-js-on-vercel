// Stream consumer implementation
export class StreamConsumer {
    redisClient;
    messageProcessor;
    streamName;
    groupName;
    consumerName;
    constructor(redisClient, messageProcessor, streamName, groupName, consumerName) {
        this.redisClient = redisClient;
        this.messageProcessor = messageProcessor;
        this.streamName = streamName;
        this.groupName = groupName;
        this.consumerName = consumerName;
    }
    async consume() {
        const processedMessages = [];
        const pendingResult = await this.redisClient.readMessages(this.streamName, this.groupName, this.consumerName);
        const result = pendingResult || [];
        if (result && Array.isArray(result) && result.length > 0) {
            for (const stream of result) {
                if (stream && typeof stream === 'object' && 'messages' in stream && Array.isArray(stream.messages) && stream.messages.length > 0) {
                    for (const message of stream.messages) {
                        // Process the message
                        await this.messageProcessor.process(message.message);
                        // Acknowledge the message
                        await this.redisClient.acknowledgeMessage(this.streamName, this.groupName, message.id);
                        processedMessages.push({
                            id: message.id,
                            data: message.message
                        });
                    }
                }
            }
        }
        return {
            processed: processedMessages.length,
            messages: processedMessages
        };
    }
}
