// main.js

// Các hằng số API URL (thay bằng URL thật sau khi deploy)
const CHAT_API_URL = 'https://weather-chatbot.onrender.com/chat';
const WEATHER_API_URL = 'https://weather-node-api.onrender.com/api/weather';

// DOM elements
const chatIcon = document.getElementById('chatIcon');
const chatBox = document.getElementById('chatBox');
const closeChat = document.getElementById('closeChat');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendButton = document.getElementById('sendMessage');
const citySelect = document.getElementById('city');
const refreshBtn = document.getElementById('refreshWeather');

let isWaitingForResponse = false;

// Mở/đóng chatbox
chatIcon.addEventListener('click', () => {
    chatBox.classList.toggle('hidden');
});

closeChat.addEventListener('click', () => {
    chatBox.classList.add('hidden');
});

// Hàm thêm tin nhắn
function addUserMessage(text) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', 'user-message');
    messageDiv.textContent = text;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addBotMessage(text) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', 'bot-message');
    messageDiv.textContent = text;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Typing indicator
function showTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.classList.add('typing-indicator');
    indicator.id = 'typing-indicator';
    indicator.innerHTML = '<span></span><span></span><span></span>';
    chatMessages.appendChild(indicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) indicator.remove();
}

// Gửi tin nhắn chat
sendButton.addEventListener('click', async () => {
    if (isWaitingForResponse) return;

    const text = chatInput.value.trim();
    if (text === '') return;

    addUserMessage(text);
    chatInput.value = '';
    isWaitingForResponse = true;
    showTypingIndicator();

    try {
        const response = await fetch(CHAT_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        removeTypingIndicator();
        addBotMessage(data.reply);
    } catch (error) {
        console.error('Lỗi khi gọi chat API:', error);
        removeTypingIndicator();
        addBotMessage('Xin lỗi, tôi đang gặp sự cố kết nối. Vui lòng thử lại sau.');
    } finally {
        isWaitingForResponse = false;
    }
});

chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendButton.click();
    }
});

// --- PHẦN THỜI TIẾT ---
// Hàm chuyển đổi tên thành phố sang tọa độ (dùng OpenWeather Geocoding API)
async function getCityCoordinates(cityName) {
    const apiKey = 'f990f55f7cf87a53d07a5715ab039174'; // Bạn có thể chuyển vào env nếu muốn
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cityName)}&limit=1&appid=${apiKey}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data && data.length > 0) {
            return { lat: data[0].lat, lon: data[0].lon };
        }
        throw new Error('Không tìm thấy thành phố');
    } catch (error) {
        console.error('Lỗi geocoding:', error);
        return null;
    }
}

// Gọi API thời tiết với tọa độ
async function fetchWeatherByCoords(lat, lon) {
    const response = await fetch(`${WEATHER_API_URL}?lat=${lat}&lon=${lon}`);
    if (!response.ok) throw new Error('Lỗi khi lấy dữ liệu thời tiết');
    return await response.json();
}

// Thay đổi ảnh nền dựa vào giờ và thời tiết
function setWeatherBackground(iconCode, description) {
    const body = document.body;
    body.className = ''; // xóa tất cả class cũ

    const hour = new Date().getHours();
    const isNight = hour >= 18 || hour < 6; // sau 18h hoặc trước 6h là ban đêm

    console.log('🕒 Giờ hiện tại:', hour, 'isNight?', isNight);
    console.log('☁️ Icon code:', iconCode, 'Mô tả:', description);

    // Kiểm tra nếu là mưa (bất kể ngày hay đêm) thì dùng ảnh mưa
    const isRainy = iconCode.includes('09') || iconCode.includes('10') || iconCode.includes('11') || description.includes('mưa');
    
    if (isRainy) {
        console.log('🌧 Trời mưa -> dùng ảnh mưa');
        body.classList.add('weather-rainy');
        return;
    }

    // Nếu là ban đêm và không mưa => dùng ảnh trăng
    if (isNight) {
        console.log('🌙 Ban đêm không mưa -> dùng ảnh trăng');
        body.classList.add('weather-night');
        return;
    }

    // Ban ngày: phân loại theo thời tiết
    if (iconCode.includes('01') || description.includes('nắng') || description.includes('quang đãng')) {
        console.log('☀️ Trời nắng');
        body.classList.add('weather-sunny');
    } else if (iconCode.includes('02') || iconCode.includes('03') || iconCode.includes('04') || description.includes('mây')) {
        console.log('☁️ Trời nhiều mây');
        body.classList.add('weather-cloudy');
    } else {
        console.log('⛅ Mặc định: mây');
        body.classList.add('weather-cloudy');
    }
}

// Cập nhật giao diện
function updateCurrentWeather(current) {
    document.getElementById('current-temp').textContent = `${Math.round(current.temp)}°C`;
    document.getElementById('current-desc').textContent = current.weather[0].description;
    const highlow = `H:${Math.round(current.temp_max || current.temp)}° L:${Math.round(current.temp_min || current.temp)}°`;
    document.getElementById('current-highlow').textContent = highlow;
    console.log('updateCurrentWeather:', current);
    const iconCode = current.weather[0].icon;
    document.getElementById('current-icon').src = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

    // Đổi background
    setWeatherBackground(iconCode, current.weather[0].description);
}

function updateMetrics(current) {
    document.getElementById('feels-like').textContent = `${Math.round(current.feels_like)}°C`;
    document.getElementById('humidity').textContent = `${current.humidity}%`;
    document.getElementById('wind-speed').textContent = `${current.wind_speed} km/h`;
    document.getElementById('uvi').textContent = current.uvi;
    document.getElementById('visibility').textContent = `${current.visibility} km`;
    document.getElementById('pressure').textContent = `${current.pressure} hPa`;
}

function updateHourly(hourly) {
    const container = document.getElementById('hourly-container');
    container.innerHTML = '';
    hourly.slice(0, 8).forEach(item => {
        const date = new Date(item.dt * 1000);
        const hours = date.getHours().toString().padStart(2, '0') + ':00';
        const iconCode = item.weather[0].icon;
        const temp = Math.round(item.temp);
        const hourlyItem = document.createElement('div');
        hourlyItem.classList.add('hourly-item');
        hourlyItem.innerHTML = `
            <span class="hour">${hours}</span>
            <img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="icon" class="hourly-icon">
            <span class="hour-temp">${temp}°</span>
        `;
        container.appendChild(hourlyItem);
    });
}

function updateForecast(daily) {
    const container = document.getElementById('forecast-container');
    container.innerHTML = '';
    const daysOfWeek = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    daily.slice(0, 5).forEach(day => {
        const date = new Date(day.dt * 1000);
        const dayName = daysOfWeek[date.getDay()];
        const iconCode = day.weather[0].icon;
        const pop = day.pop ? Math.round(day.pop * 100) : 0;
        const tempMax = Math.round(day.temp.max);
        const tempMin = Math.round(day.temp.min);
        const popHtml = pop > 0 ? `${pop}% <span class="pop-icon">☔</span>` : '0%';
        const forecastItem = document.createElement('div');
        forecastItem.classList.add('forecast-item');
        forecastItem.innerHTML = `
            <span class="forecast-day">${dayName}</span>
            <img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="icon" class="forecast-icon">
            <span class="forecast-pop">${popHtml}</span>
            <span class="forecast-temp">${tempMax}°/${tempMin}°</span>
        `;
        container.appendChild(forecastItem);
    });
}

// Hàm tải dữ liệu cho thành phố được chọn
async function loadWeatherForCity(cityName) {
    try {
        const coords = await getCityCoordinates(cityName);
        if (!coords) {
            throw new Error('Không thể lấy tọa độ');
        }
        const data = await fetchWeatherByCoords(coords.lat, coords.lon);
        updateCurrentWeather(data.current);
        updateMetrics(data.current);
        updateHourly(data.hourly);
        updateForecast(data.daily);
    } catch (error) {
        console.error(error);
        const container = document.querySelector('.container');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = 'Không thể tải dữ liệu thời tiết. Vui lòng thử lại.';
        container.prepend(errorDiv);
        setTimeout(() => errorDiv.remove(), 5000);
    }
}

// Sự kiện khi chọn thành phố hoặc nhấn refresh
citySelect.addEventListener('change', () => {
    loadWeatherForCity(citySelect.value);
});

refreshBtn.addEventListener('click', () => {
    loadWeatherForCity(citySelect.value);
});

// Tải dữ liệu mặc định khi trang load
document.addEventListener('DOMContentLoaded', () => {
    loadWeatherForCity(citySelect.value);
});  

