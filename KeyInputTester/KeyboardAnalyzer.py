import pickle
from sklearn.ensemble import IsolationForest
import numpy as np
import csv


class KeyboardAnalyzer:

    model_filename = "keyboard_model.pkl"

    def __init__(this):
        this.model = None

    def make_model(this):
        with open('../Data/processed/result.csv', 'r') as csvfile:
            print("Creating model...")
            filedata = csv.reader(csvfile)
            # current_character_code, previous_character_code, time_held, time_since_key_press, is_overlapping, avg_time
            
            data = []
            i = 0
            for row in filedata:
                i = i + 1
                print(f"Processing line {i}")
                data.append([int(float(row[0])), int(float(row[1])), int(float(row[2])), int(float(row[3])), int(float(row[4])), int(float(row[5]))])
                
            print("Finished.")

            model = IsolationForest(contamination=0.01)

            model.fit(data)

            with open(KeyboardAnalyzer.model_filename, 'wb') as model_file:
                pickle.dump(model, model_file)


    def load_model(this):
        with open(KeyboardAnalyzer.model_filename, 'rb') as model_file:
            this.model = pickle.load(model_file)
