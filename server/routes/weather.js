const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController');

router.get('/', weatherController.getRealWeather); // 👈 QUAN TRỌNG: route gốc

module.exports = router;