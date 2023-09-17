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
        
        document.querySelector("#strokes-per-minute-score").innerHTML = Math.round((1 / combinedStats["key_stroke_time_avg"]) * 60000);
        document.querySelector("#avg-key-hold-time").innerHTML = Math.round(combinedStats["key_held_avg"]);
        document.querySelector("#stroke-delay-std-dev").innerHTML = Math.round(combinedStats["std_dev_stroke_delay"]);
        document.querySelector("#key-hold-time-std-dev").innerHTML = Math.round(combinedStats["std_dev_held_time"]);
        document.querySelector("#overlap-percentage-score").innerHTML = Math.round(combinedStats["overlap_percent"] * 100);
        
        let resultString = "";

        if (data["score"] > 0.05) {
            resultString = "You are very likely a human.";
        }
        else if (data["score"] > 0) {
            resultString = "You are likely a human.";
        }
        else if (data["score"] > -0.05) {
            resultString = "You are possibly human.";
        }
        else if (data["score"] > -0.15) {
            resultString = "You are most likely a bot.";
        }
        else {
            resultString = "You are almost certainly a bot";
        }

        document.querySelector("#humanity-result").innerHTML = resultString;
    });
}

document.querySelector("#submit-data").addEventListener("click", () => {
    processAndSendData();
    document.querySelector("#textbox").value = "";
});


let sampleSentences = [
"If you are distressed by anything external, the pain is not due to the thing itself, but to your estimate of it; and this you have the power to revoke at any moment.",
"The soul becomes dyed with the colour of its thoughts.",
"Never let the future disturb you. You will meet it, if you have to, with the same weapons of reason which today arm you against the present.",
"How much more grievous are the consequences of anger than the causes of it.",
"Receive without conceit, release without struggle.",
"It never ceases to amaze me: we all love ourselves more than other people, but care more about their opinion than our own.",
"Take full account of what Excellencies you possess, and in gratitude remember how you would hanker after them, if you had them not.",
"Death is a release from the impressions of the senses, and from desires that make us their puppets, and from the vagaries of the mind, and from the hard service of the flesh.",
"Adapt yourself to the life you have been given; and truly love the people with whom destiny has surrounded you.",
"Neither worse then or better is a thing made by being praised.",
"The happiness of your life depends upon the quality of your thoughts; therefore guard accordingly.",
"Nothing is more scandalous than a man that is proud of his humility.",
"Be your own master, and look at things as a man, as a human being, as a citizen, as a mortal creature.",
"Does the emerald lose its beauty for lack of admiration?",
"Give your heart to the trade you have learnt, and draw refreshment from it."
];

let newIndex = Math.floor(Math.random() * sampleSentences.length)

document.querySelector("#sample-sentence-generator").addEventListener("click", () => {
    
    newIndex++
    newIndex %= sampleSentences.length

    document.querySelector("#sample-sentence").innerHTML = sampleSentences[newIndex];
});