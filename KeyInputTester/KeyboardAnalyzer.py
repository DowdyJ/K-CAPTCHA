import pickle
from sklearn.ensemble import IsolationForest
from sklearn.neighbors import LocalOutlierFactor
from sklearn.model_selection import train_test_split

import numpy as np
import csv

# key_held_avg 
# std_dev_held_time 
# key_stroke_time_avg 
# std_dev_stroke_delay
# overlap_percent
# backspace_percent 


class KeyboardAnalyzer:

    model_filename = "keyboard_model.pkl"

    def __init__(this):
        this.model = None

    def make_model(this):
        with open('../Data/processed/result.csv', 'r') as csvfile:
            print("Creating model...")
            filedata = csv.reader(csvfile)
            
            data = []
            i = 0
            for row in filedata:
                i = i + 1
                print(f"Processing line {i}")
                data.append([float(row[0]), float(row[1]), float(row[2]), float(row[3]), float(row[4])])
            
            # training_data, testing_data = train_test_split(data, test_size=0.1, random_state=409)
            training_data = data

            print("Finished.")
            model = LocalOutlierFactor(n_neighbors=100, contamination=0.001, novelty=True)
            model.fit(training_data)

            # model = IsolationForest(contamination=0.01, max_samples=20000)
            # print("Evaluating settings")
            # res = np.array(model.decision_function(training_data))

            # print(f"Results: avg: {np.mean(res)}, Median: {np.median(res)}, IQR {np.percentile(res, 75) - np.percentile(res, 25)}")

            # model.fit(data)
            print("Saving to file...")
            with open(KeyboardAnalyzer.model_filename, 'wb') as model_file:
                pickle.dump(model, model_file)
 
            print("Finished.")


    def load_model(this):
        print("Model file found. Loading from disk...")
        with open(KeyboardAnalyzer.model_filename, 'rb') as model_file:
            this.model = pickle.load(model_file)
        print("Finished.")
