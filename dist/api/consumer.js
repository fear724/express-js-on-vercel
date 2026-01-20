import { log } from 'console';
import { createClient } from 'redis';
const url = process.env.REDIS_URL;
const streamName = process.env.REDIS_STREAM_NAME || 'mystream';
const groupName = process.env.REDIS_GROUP_NAME || 'mygroup';
const consumerName = process.env.REDIS_CONSUMER_NAME || 'vercel-consumer';
export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    console.log('Consumer endpoint hit');
    console.log('Using Redis URL:', url);
    console.log('Using Stream Name:', streamName);
    console.log('Using Group Name:', groupName);
    console.log('Using Consumer Name:', consumerName);
    const client = createClient({
        url: process.env.REDIS_URL || 'redis://localhost:6379'
    });
    try {
        await client.connect();
        // Create consumer group if it doesn't exist
        try {
            log('Creating consumer group if not exists...');
            await client.xGroupCreate(streamName, groupName, '0', { MKSTREAM: true });
        }
        catch (error) {
            if (!error.message.includes('BUSYGROUP')) {
                throw error;
            }
        }
        // Read and process up to 10 pending messages
        log('Reading pending messages...');
        const pendingResult = await client.xReadGroup(groupName, consumerName, [{ key: streamName, id: '>' }], { COUNT: 10, BLOCK: 1000 });
        const processedMessages = [];
        log('Processing messages...');
        if (pendingResult && Array.isArray(pendingResult) && pendingResult.length > 0) {
            for (const stream of pendingResult) {
                if (stream && typeof stream === 'object' && 'messages' in stream && Array.isArray(stream.messages) && stream.messages.length > 0) {
                    for (const message of stream.messages) {
                        // Process the message
                        await processMessage(message.message);
                        // Acknowledge the message
                        await client.xAck(streamName, groupName, message.id);
                        processedMessages.push({
                            id: message.id,
                            data: message.message
                        });
                    }
                }
            }
        }
        log;
        res.status(200).json({
            success: true,
            processed: processedMessages.length,
            messages: processedMessages
        });
    }
    catch (error) {
        console.error('Consumer error:', error);
        res.status(500).json({
            error: 'Failed to process messages',
            details: error.message
        });
    }
    finally {
        await client.quit();
    }
}
async function processMessage(message) {
    console.log('Processing message:', message);
    // Add your message processing logic here
}
