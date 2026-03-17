const axios = require('axios');

const API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/3.0/onecall';

async function fetchWeatherData(lat, lon) {
    try {
        console.log(`🌤️ Gọi OpenWeather với lat=${lat}, lon=${lon}`);
        const response = await axios.get(BASE_URL, {
            params: {
                lat,
                lon,
                appid: API_KEY,
                units: 'metric',
                lang: 'vi'
            }
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            console.error('❌ OpenWeather response error:', error.response.status, error.response.data);
        } else if (error.request) {
            console.error('❌ No response from OpenWeather:', error.request);
        } else {
            console.error('❌ Request error:', error.message);
        }
        throw new Error('Không thể lấy dữ liệu thời tiết');
    }
}

module.exports = { fetchWeatherData };