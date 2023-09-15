import os
from KeyboardAnalyzer import KeyboardAnalyzer
from flask import Flask, jsonify, request
import json

analyzer = KeyboardAnalyzer()

if not os.path.exists(KeyboardAnalyzer.model_filename):
    analyzer.make_model()

analyzer.load_model()



app = Flask(__name__)

@app.route('/', methods=['POST'])
def process_data():
    data = request.data.decode("utf-8")

    parsed_data = json.loads(data)
    print(type(parsed_data))
    
    query = []
    
    for entry in parsed_data:
        query.append([entry["current_character_code"], entry["previous_character_code"], entry["time_held"], entry["time_since_last_keypress"], entry["is_overlapping"], entry["average_time_between_strokes"]])

    print("It thinking")
    result = analyzer.model.predict(query)

    
    total = 0
    for num in result:
        if num == 1:
            total += 1


    score = total / len(result)
    return jsonify({'result':score}), 200

print("Starting Flask server.")
if __name__ == '__main__':
    app.run(debug=True)