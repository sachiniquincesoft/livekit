const express = require('express');
const { AccessToken } = require('livekit-server-sdk');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('LiveKit Token Server is running.');
});

app.post('/getToken', async (req, res) => {
  const { room, identity } = req.body;
  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;

  if (!apiKey || !apiSecret || !room || !identity) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const at = new AccessToken(apiKey, apiSecret, {
      identity,
      ttl: '200m',
    });

    at.addGrant({ roomJoin: true, room });
    const token = await at.toJwt();

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate token' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

