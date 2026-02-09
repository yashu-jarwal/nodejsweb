const redis = require('redis');
const express = require('express');
const router = express.Router();

const client = redis.createClient({
  url: 'redis://localhost:6379'
});

client.on('error', (err) => console.error('❌ Redis Client Error:', err));

(async () => {
  try {
    await client.connect();
    console.log('✅ Redis Connected Successfully');
  } catch (err) {
    console.error('❌ Redis connection failed:', err);
  }
})();

const RATE_LIMIT = 5; // प्रति मिनट अधिकतम रिक्वेस्ट
const WINDOW_SIZE_IN_SECONDS = 60; // 1 मिनट

/**
 * @swagger
 * /SetApiCallLimit:
 *   get:
 *     summary: Set API Call Limit
 *     responses:
 *       200:
 *         description: API response successful
 *       429:
 *         description: Too Many Requests
 *       500:
 *         description: Error while fetching data
 */
router.get('/SetApiCallLimit', async (req, res) => {
  const userId = req.ip;
  const cacheKey = `rate_limit:${userId}`;

  try {
    const currentCount = await client.get(cacheKey);

    if (currentCount) {
      const count = parseInt(currentCount, 10);

      if (count >= RATE_LIMIT) {
        return res.status(429).json({
          error: 'Too Many Requests',
          message: `You cannot hit the request more than ${RATE_LIMIT} per minute`
        });
      }

      await client.incr(cacheKey);
    } else {
      await client.setEx(cacheKey, WINDOW_SIZE_IN_SECONDS, '1');
    }

    return res.json({
      message: 'API response successful',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('रेट लिमिट त्रुटि:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
