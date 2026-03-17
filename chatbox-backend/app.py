from flask import Flask, request, jsonify
from flask_cors import CORS
from chat.intent_parser import parse_intent
from chat.response_generator import generate_response

app = Flask(__name__)
CORS(app)

@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    if not data or 'message' not in data:
        return jsonify({'reply': 'Vui lòng gửi tin nhắn.'}), 400

    user_message = data['message']
    intent, params = parse_intent(user_message)
    reply = generate_response(intent, params)

    return jsonify({'reply': reply})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)