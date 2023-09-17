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

    # key_held_avg 
    # std_dev_held_time 
    # key_stroke_time_avg 
    # std_dev_stroke_delay
    # overlap_percent
    # backspace_percent 
    entry = parsed_data
    
    query.append([entry["key_held_avg"], entry["std_dev_held_time"], entry["key_stroke_time_avg"], entry["std_dev_stroke_delay"], entry["overlap_percent"]])

    result = analyzer.model.decision_function(query)
    print(result)

    score = result[0]
    return jsonify({'result':score}), 200

print("Starting Flask server.")
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)