import os
from KeyboardAnalyzer import KeyboardAnalyzer
from flask import Flask, jsonify, request

analyzer = KeyboardAnalyzer()

if not os.path.exists(KeyboardAnalyzer.model_filename):
    analyzer.make_model()

analyzer.load_model()




app = Flask(__name__)

@app.route('/', methods=['POST'])
def process_data():
    data = request.json

    print(data.get("pea"))


if __name__ == '__main__':
    app.run(debug=True)