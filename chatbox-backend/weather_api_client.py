import requests

NODE_API_URL = "http://localhost:3000/api/weather"

def fetch_weather_data():
    try:
        response = requests.get(NODE_API_URL, timeout=5)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Lỗi khi gọi NodeJS API: {e}")
        return None

def get_current_weather():
    data = fetch_weather_data()
    if data and 'current' in data:
        return data['current']
    return None

def get_daily_forecast():
    data = fetch_weather_data()
    if data and 'daily' in data:
        return data['daily']
    return None