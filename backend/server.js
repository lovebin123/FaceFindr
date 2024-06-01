require('dotenv').config();
const express = require('express');
const Redis = require('ioredis');
const cors=require('cors')
const app = express();
const redisClient = new Redis({
  host: process.env.REDIS_HOST,
  port:parseInt(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,
});
app.use(cors())
app.get('/dash/keys', async (req, res) => {
  try {
    const keys = await redisClient.keys('*');
    const results = await Promise.all(keys.map(async key => {
      const values = await redisClient.hget(key,'matched_photos'); // Get all field-value pairs for the key
      return { key, values };
    }));
    res.json(results); // Send the results as JSON
  } catch (error) {
    console.error('Error getting keys and field-value mappings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on  http://localhost:${PORT}`);
});
