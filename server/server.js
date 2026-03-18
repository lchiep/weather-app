require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const weatherRoutes = require('./routes/weather');

const app = express(); // Khai báo app trước khi sử dụng
const PORT = process.env.PORT || 3000;

// Cấu hình CORS – cho phép frontend và Python chatbot
const allowedOrigins = [
    'https://weather-app.vercel.app',
    'https://weather-chatbot.onrender.com',
    'http://localhost:3000'
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    }
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Sử dụng route weather
app.use('/api/weather', weatherRoutes);

// Fallback cho SPA
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
});