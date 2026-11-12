const redis = require('redis');
require('dotenv').config();

const redisClient = redis.createClient({
    url: process.env.REDIS_URL,
    socket: {
        reconnectStrategy: (retries) => {
            if (retries > 10) return new Error('Redis Cloud connection lost permanently');
            return Math.min(retries * 100, 3000);
        }
    }
});

redisClient.on('error', (err) => console.error('Error on Redis Cloud:', err));
redisClient.on('connect', () => console.log('Connect successfully to Redis Cloud!'));

(async () => {
    try {
        await redisClient.connect();
    } catch (err) {
        console.error("Cannot connect to Redis Cloud:", err);
    }
})();

module.exports = redisClient;