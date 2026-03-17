const { fetchWeatherData } = require('../utils/fetchWeather');

const transformWeatherData = (apiData) => {
    const current = apiData.current;
    const daily = apiData.daily.slice(0, 5);
    const hourly = apiData.hourly.slice(0, 8);

    return {
        current: {
            temp: current.temp,
            feels_like: current.feels_like,
            humidity: current.humidity,
            wind_speed: current.wind_speed,
            uvi: current.uvi,
            visibility: current.visibility / 1000,
            pressure: current.pressure,
            weather: current.weather,
            temp_max: apiData.daily[0]?.temp.max,
            temp_min: apiData.daily[0]?.temp.min,
        },
        daily: daily.map(day => ({
            dt: day.dt,
            temp: { max: day.temp.max, min: day.temp.min },
            weather: day.weather,
            pop: day.pop
        })),
        hourly: hourly.map(hour => ({
            dt: hour.dt,
            temp: hour.temp,
            weather: hour.weather
        }))
    };
};

const getRealWeather = async (req, res) => {
    try {
        // Lấy lat, lon từ query, nếu không có thì dùng mặc định TP.HCM
        const lat = req.query.lat || 10.8231;
        const lon = req.query.lon || 106.6297;

        const data = await fetchWeatherData(lat, lon);
        const transformedData = transformWeatherData(data);
        res.json(transformedData);
    } catch (error) {
        console.error('🔥 Controller error:', error);
        res.status(500).json({ error: 'Lỗi khi lấy dữ liệu thời tiết' });
    }
};

module.exports = { getRealWeather };