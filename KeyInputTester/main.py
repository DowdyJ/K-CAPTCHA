from sklearn.ensemble import IsolationForest
import numpy as np
import csv


with open('../Data/processed/result.csv', 'r') as csvfile:

    filedata = csv.reader(csvfile)
    # current_character_code, previous_character_code, time_held, time_since_key_press, is_overlapping, avg_time
    
    data = []
    
    for row in filedata:
        data.append([int(row[0]), int(row[1]), int(row[2]), int(row[3]), int(row[4]), int(row[5])])
        
    np.array(data)

    model = IsolationForest(contamination=0.01)

    model.fit(data)

    print("RESULT")
    print(model.predict([[0,126,2,2,0,10000]]))