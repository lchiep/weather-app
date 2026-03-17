import re

def parse_intent(message):
    message = message.lower().strip()
    
    if re.search(r'(thời tiết|nhiệt độ|bao nhiêu độ) (hôm nay|hiện tại|bây giờ)', message):
        return 'current_weather', {}
    
    if re.search(r'(có mưa không|mưa không|mưa ko)', message):
        if 'tối nay' in message or 'tối' in message:
            return 'rain_check', {'time': 'evening'}
        elif 'mai' in message or 'ngày mai' in message:
            return 'rain_check', {'time': 'tomorrow'}
        else:
            return 'rain_check', {'time': 'today'}
    
    if re.search(r'(nên mặc gì|mặc gì|trang phục)', message):
        return 'clothing_suggestion', {}
    
    if re.search(r'(cuối tuần|thứ 7|chủ nhật)', message):
        return 'weekend_forecast', {}
    
    return 'unknown', {}