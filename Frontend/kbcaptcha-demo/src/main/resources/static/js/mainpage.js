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


let lastKeyDown;
let timeOfLastKeypress;

let results = [];

const keyStrokeMap = new Map();



document.querySelector('#textbox').addEventListener('keydown', function(event) {

    let keyCode = event.keyCode ? event.keyCode : event.charCode;
    let startTime = Date.now()
    let timeSinceLastKeypress = timeOfLastKeypress ? startTime - timeOfLastKeypress : -1;
    timeOfLastKeypress = Date.now();
    
    let previousCharacterCode = lastKeyDown ? lastKeyDown : 0

    if (keyStrokeMap.has(keyCode)) {
        keyStrokeMap.delete(keyCode);
        console.error("Tried to input duplicate key into register.")
    }
    
    let keydata = {}
    keydata["current_character_code"] = keyCode;
    keydata["previous_character_code"] = previousCharacterCode;
    keydata["time_since_last_keypress"] = timeSinceLastKeypress;
    
    keydata["startTime"] = startTime;


    keyStrokeMap.set(keyCode, keydata)

    lastKeyDown = keyCode;

    
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
    if (results.length < 1) {
        return;
    }

    let totalTimeTaken = results[results.length - 1]["endTime"] - results[0]["startTime"];
    let averageTime = Math.floor(totalTimeTaken / results.length);

    for (const entry of results) {
        entry["average_time_between_strokes"] = averageTime;
    }

    fetch("http://localhost:8080/results", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(results)
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