require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const weatherRoutes = require('./routes/weather');

const app = express();
const PORT = process.env.PORT || 3000;

// Cấu hình CORS linh hoạt – chấp nhận mọi origin từ Vercel và Render
app.use(cors({
    origin: function (origin, callback) {
        // Nếu không có origin (Postman, server-to-server) thì cho phép
        if (!origin) return callback(null, true);

        // Cho phép localhost (dùng cho phát triển)
        if (origin.includes('localhost')) return callback(null, true);

        // Cho phép tất cả các subdomain của vercel.app
        if (origin.endsWith('.vercel.app')) return callback(null, true);

        // Cho phép tất cả các subdomain của onrender.com
        if (origin.includes('.onrender.com')) return callback(null, true);

        // Nếu không khớp, từ chối và báo lỗi
        const msg = `Origin ${origin} không được phép truy cập.`;
        return callback(new Error(msg), false);
    },
    credentials: true,          // Cho phép gửi cookie/authentication nếu cần
    optionsSuccessStatus: 200    // Quan trọng cho preflight request
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Route weather
app.use('/api/weather', weatherRoutes);

// Fallback SPA
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
});