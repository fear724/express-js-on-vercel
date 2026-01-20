// Consumer service to orchestrate the consumption
export class ConsumerService {
    redisClient;
    streamConsumer;
    constructor(redisClient, streamConsumer) {
        this.redisClient = redisClient;
        this.streamConsumer = streamConsumer;
    }
    async processMessages() {
        await this.redisClient.connect();
        try {
            const streamName = process.env.REDIS_STREAM_NAME || 'rest_api_producer_stream';
            const groupName = process.env.REDIS_GROUP_NAME || 'mygroup';
            await this.redisClient.createConsumerGroup(streamName, groupName);
            return await this.streamConsumer.consume();
        }
        finally {
            await this.redisClient.disconnect();
        }
    }
}
