const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController');

// Sử dụng controller thật thay vì mock
router.get('/', weatherController.getRealWeather);

module.exports = router;