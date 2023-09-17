// The goal of this script to to capture the following data:
// 
// current_character_code, - direct
// previous_character_code,  - direct
// time_held, - derived
// time_since_key_press, - direct 
// is_overlapping - derived
// average_time_between_strokes - post-process derived
//
// Then, package it up and send it back to the backend.


let timeOfLastKeypress;

let results = [];

const keyStrokeMap = new Map();


document.querySelector('#textbox').addEventListener('keydown', function(event) {

    let keyCode = event.keyCode ? event.keyCode : event.charCode;
    let startTime = Date.now()
    let timeSinceLastKeypress = timeOfLastKeypress ? startTime - timeOfLastKeypress : -1;
    timeOfLastKeypress = Date.now();
    

    if (keyStrokeMap.has(keyCode)) {
        keyStrokeMap.delete(keyCode);
        console.error("Tried to input duplicate key into register.")
    }
    
    let keydata = {}
    keydata["current_character_code"] = keyCode;
    keydata["time_since_last_keypress"] = timeSinceLastKeypress;
    keydata["startTime"] = startTime;


    keyStrokeMap.set(keyCode, keydata)


    console.log(`Key Pressed: ${keyCode}`);
});

document.querySelector('#textbox').addEventListener('keyup', function(event) {

    let keyCode = event.keyCode ? event.keyCode : event.charCode;
    let endTime = Date.now();


    if (!keyStrokeMap.has(keyCode)) {
        console.error("Attempted to release a key that was not recorded as held!");
        return;
    }

    let resultsData = keyStrokeMap.get(keyCode);
    keyStrokeMap.delete(keyCode);
    
    resultsData["time_held"] = endTime - resultsData["startTime"];
    resultsData["endTime"] = endTime;

    let is_overlapping = results.length > 0 && results[results.length - 1]["endTime"] > resultsData["startTime"];

    resultsData["is_overlapping"] = is_overlapping ? 1 : 0

    results.push(resultsData);

    console.log(`Key Released: ${keyCode}`);
});


function processAndSendData() {
    timeOfLastKeypress = undefined

    if (results.length < 1) {
        return;
    }


    let backspaceCount = 0
    let overlapCount = 0
    let totalTimeBetweenStrokes = 0
    let totalTimeHeld = 0

    let exclusionsTimeHeld = 0
    let exclusionsTimeBetweenStrokes = 0

    for (const entry of results) {
        if (entry["is_overlapping"] == 1) {
            overlapCount += 1;
        }
        if (entry["current_character_code"] == 8) {
            backspaceCount += 1;
        }

        if (entry["time_held"] < 1000) {
            totalTimeHeld += entry["time_held"]
        }
        else {
            exclusionsTimeHeld += 1;
        }

        if (entry["time_since_last_keypress"] < 500) {
            totalTimeBetweenStrokes += entry["time_since_last_keypress"]
        }
        else {
            exclusionsTimeBetweenStrokes += 1
        }
    }

    let key_held_avg = totalTimeHeld / (results.length - exclusionsTimeHeld)
    let key_stroke_time_avg = totalTimeBetweenStrokes / (results.length - exclusionsTimeBetweenStrokes)

    let square_variance_held_time_total = 0
    let square_variance_time_between_total = 0

    for (const entry of results) {
        if (entry["time_held"] < 1000) {
            square_variance_held_time_total += (key_held_avg - entry["time_held"])**2
        }
        if (entry["time_since_last_keypress"] < 500) {
            square_variance_time_between_total += (key_stroke_time_avg - entry["time_since_last_keypress"])**2
        }
    }

    let std_dev_held_time = (square_variance_held_time_total / (results.length - exclusionsTimeHeld - 1))**(1/2)
    let std_dev_stroke_delay = (square_variance_time_between_total / (results.length - exclusionsTimeBetweenStrokes - 1))**(1/2)
    let overlap_percent = overlapCount / results.length
    let backspace_percent = backspaceCount / results.length


//     # key_held_avg 
//     # std_dev_held_time 
//     # key_stroke_time_avg 
//     # std_dev_stroke_delay
//     # overlap_percent
//     # backspace_percent 

    let combinedStats = {}
    combinedStats["key_held_avg"] = key_held_avg
    combinedStats["std_dev_held_time"] = std_dev_held_time
    combinedStats["key_stroke_time_avg"] = key_stroke_time_avg
    combinedStats["std_dev_stroke_delay"] = std_dev_stroke_delay
    combinedStats["overlap_percent"] = overlap_percent
    combinedStats["backspace_percent"] = backspace_percent

    console.log(combinedStats)

    fetch("http://localhost:8080/results", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(combinedStats)
    })
    .then((response) => response.json())
    .then((data) => {
        results = [];
        console.log(data);
        document.querySelector("#score-field").innerHTML = data["score"];
    });
}

document.querySelector("#submit-data").addEventListener("click", () => {
    processAndSendData();
    document.querySelector("#textbox").value = "";
});