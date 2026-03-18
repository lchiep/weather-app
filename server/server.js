require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const weatherRoutes = require('./routes/weather');

// Verify that the OpenWeather API key is loaded (do not log the key itself).
if (!process.env.OPENWEATHER_API_KEY) {
  console.warn('⚠️ OPENWEATHER_API_KEY is not set. Weather data requests will fail.');
}

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));
app.use('/api/weather', weatherRoutes);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});