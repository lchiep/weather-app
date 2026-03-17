from weather_api_client import get_current_weather, get_daily_forecast
import datetime

def generate_response(intent, params):
    if intent == 'current_weather':
        current = get_current_weather()
        if not current:
            return "Xin lỗi, tôi không thể lấy dữ liệu thời tiết lúc này."
        temp = current['temp']
        desc = current['weather'][0]['description']
        feels_like = current['feels_like']
        humidity = current['humidity']
        return f"Hiện tại nhiệt độ là {temp}°C, {desc}. Cảm giác như {feels_like}°C, độ ẩm {humidity}%."
    
    elif intent == 'rain_check':
        time = params.get('time', 'today')
        daily = get_daily_forecast()
        if not daily:
            return "Không thể kiểm tra dự báo mưa lúc này."
        
        if time == 'today':
            pop = daily[0].get('pop', 0)
            day_str = "hôm nay"
        elif time == 'tomorrow':
            pop = daily[1].get('pop', 0) if len(daily) > 1 else 0
            day_str = "ngày mai"
        elif time == 'evening':
            pop = daily[0].get('pop', 0)
            day_str = "tối nay"
        else:
            pop = 0
            day_str = ""
        
        if pop > 0.5:
            return f"Khả năng cao {day_str} sẽ có mưa (xác suất {int(pop*100)}%). Nhớ mang ô nhé!"
        elif pop > 0.2:
            return f"{day_str} có thể có mưa nhẹ (xác suất {int(pop*100)}%)."
        else:
            return f"{day_str} trời khô ráo, không có mưa."
    
    elif intent == 'clothing_suggestion':
        current = get_current_weather()
        if not current:
            return "Xin lỗi, không thể gợi ý trang phục ngay."
        temp = current['temp']
        if temp < 20:
            return "Trời lạnh, bạn nên mặc áo ấm, có thể thêm khăn quàng."
        elif temp < 25:
            return "Trời mát, mặc áo dài tay hoặc áo khoác mỏng là phù hợp."
        elif temp < 30:
            return "Trời ấm, áo thun ngắn tay là ok."
        else:
            return "Trời nóng, hãy mặc đồ thoáng mát và uống nhiều nước nhé!"
    
    elif intent == 'weekend_forecast':
        daily = get_daily_forecast()
        if not daily or len(daily) < 2:
            return "Không có dữ liệu cho cuối tuần."
        sat = daily[3] if len(daily) > 3 else None
        sun = daily[4] if len(daily) > 4 else None
        reply = "Dự báo cuối tuần:\n"
        if sat:
            date = datetime.datetime.fromtimestamp(sat['dt']).strftime('%A')
            temp_max = sat['temp']['max']
            temp_min = sat['temp']['min']
            pop = int(sat.get('pop', 0) * 100)
            reply += f"Thứ 7: {temp_max}°C / {temp_min}°C, mưa {pop}%\n"
        if sun:
            temp_max = sun['temp']['max']
            temp_min = sun['temp']['min']
            pop = int(sun.get('pop', 0) * 100)
            reply += f"Chủ Nhật: {temp_max}°C / {temp_min}°C, mưa {pop}%"
        return reply
    
    else:
        return "Xin lỗi, tôi chưa hiểu câu hỏi của bạn. Bạn có thể hỏi về thời tiết hiện tại, có mưa không, hoặc gợi ý trang phục."