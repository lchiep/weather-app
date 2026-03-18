require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const weatherRoutes = require('./routes/weather');

const app = express();
const PORT = process.env.PORT || 3000;

// Danh sách các origin được phép truy cập
const allowedOrigins = [
    'https://weather-app.vercel.app',                                   // Frontend chính (nếu có)
    'https://weather-api-test-main-iqilesi-projects.vercel.app',       // Origin frontend thật từ log
    'https://weather-chatbot-52vr.onrender.com',                       // Python chatbot
    'http://localhost:3000'                                             // Local dev
];

// Middleware CORS
app.use(cors({
    origin: function (origin, callback) {
        // Nếu không có origin (ví dụ gọi từ server, Postman) thì cho phép
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            const msg = `Origin ${origin} không được phép truy cập.`;
            callback(new Error(msg), false);
        }
    },
    credentials: true,          // Cho phép gửi cookie/authentication
    optionsSuccessStatus: 200    // Quan trọng cho preflight request
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));
app.use('/api/weather', weatherRoutes);

// Fallback cho SPA (trả về index.html nếu không match route nào)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
});