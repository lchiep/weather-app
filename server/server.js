require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const weatherRoutes = require('./routes/weather');

const app = express();
const PORT = process.env.PORT || 3000;

// Cấu hình CORS linh hoạt - chấp nhận tất cả các origin phù hợp
app.use(cors({
    origin: function (origin, callback) {
        // Cho phép request không có origin (Postman, curl)
        if (!origin) return callback(null, true);
        
        // Cho phép localhost
        if (origin.includes('localhost')) return callback(null, true);
        
        // Cho phép tất cả các subdomain của vercel.app
        if (origin.endsWith('.vercel.app')) return callback(null, true);
        
        // Cho phép tất cả các subdomain của onrender.com
        if (origin.includes('.onrender.com')) return callback(null, true);
        
        // Nếu không khớp, từ chối
        const msg = `Origin ${origin} không được phép truy cập.`;
        return callback(new Error(msg), false);
    },
    credentials: true,
    optionsSuccessStatus: 200
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));
app.use('/api/weather', weatherRoutes);

// Fallback SPA
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Lắng nghe trên tất cả các interface (0.0.0.0) để Render có thể kết nối
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server running on port ${PORT}`);
});