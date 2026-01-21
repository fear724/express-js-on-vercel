import { createClient } from 'redis';
// Redis client implementation
export class RedisClient {
    client;
    constructor(url) {
        this.client = createClient({ url });
    }
    async connect() {
        await this.client.connect();
    }
    async disconnect() {
        await this.client.quit();
    }
    async createConsumerGroup(streamName, groupName) {
        try {
            await this.client.xGroupCreate(streamName, groupName, '0', { MKSTREAM: true });
        }
        catch (error) {
            if (!error.message.includes('BUSYGROUP')) {
                throw error;
            }
        }
    }
    async readMessages(streamName, groupName, consumerName) {
        const result = await this.client.xReadGroup(groupName, consumerName, [{ key: streamName, id: '>' }], { COUNT: 10, BLOCK: 1000 });
        return result;
    }
    async acknowledgeMessage(streamName, groupName, messageId) {
        await this.client.xAck(streamName, groupName, messageId);
    }
    // Added method to support xadd command
    async xadd(streamName, id, fields) {
        return this.client.xAdd(streamName, id, fields);
    }
}
