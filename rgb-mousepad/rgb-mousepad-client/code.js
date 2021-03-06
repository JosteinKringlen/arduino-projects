const $ = require('jquery');
const SerialPort = require('serialport');
const Readline = SerialPort.parsers.Readline;


// Ports for when testing on my mac and for Raspberry Pi
const inputPortMac = '/dev/cu.usbmodem1411';
const inputPortRaspberry = '/dev/ttyACM0';

const port = new SerialPort(inputPortMac, {autoOpen: true, baudRate: 9600});
const qs = require('qs');
const tweets = require('./tweets');

const delay = require('delay');

// Update time in seconds
const updateTime = 30;
// Standard cup of coffee is apparently 150 ml = 150 g
const cupOfCoffee = 0.150; //in kg
const fullCanOfCoffee = 1.800; //in kg
const numOfCupsPerCan = 12.0;

let last = 0;
let topLevelData = "";

$(document).ready(function () {
    runCodeContinuously();
});

function runCodeContinuously() {
    // Off
    $("#buttonOff").click(() => {
        port.write("0", function (err) {
            if (err) {
                return console.log(err)
            }
        });
        console.log("Turning off");
    });

    // Rainbow
    $("#buttonRainbow").click(() => {
        port.write("1", function (err) {
            if (err) {
                return console.log(err)
            }
        });
        console.log("Setting rainbow");
    });

    // Static
    $("#buttonStatic").click(() => {
        port.write("2", function (err) {
            if (err) {
                return console.log(err)
            }
        });
        console.log("Setting static");
    });

    // Reverse rainbow
    $("#buttonReverse").click(() => {
        port.write("3", function (err) {
            if (err) {
                return console.log(err)
            }
        });
        console.log("Setting reverse rainbow");
    });

    // Pulse
    $("#buttonPulse").click(() => {
        port.write("4", function (err) {
            if (err) {
                return console.log(err)
            }
        });
        console.log("Setting pulse");
    });

    // Pulse FU
    $("#buttonPulseFU").click(() => {
        port.write("y", function (err) {
            if (err) {
                return console.log(err)
            }
        });
        console.log("Setting pulse FU");
    });

    // Epileptic Glory
    $("#buttonEpi").click(() => {
        port.write("z", function (err) {
            if (err) {
                return console.log(err)
            }
        });
        console.log("Setting parrot");
    });
    // Removes the "flow" mode of the serial input,
    // and gives each number on a single line
    /* let parser = new Readline();
    let counter = 0;
    let counter2 = 0;
    port.pipe(parser);
    parser.on('data', function (data) {

        let weightDouble = parseFloat(data.toString());
        let cups = parseInt(Math.floor(weightDouble / cupOfCoffee).toString());

        $("#kg").text(data.toString());
        counter++;
        if (counter === updateTime) {
            updateWeightText(data);
            counter = 0;
        }
        topLevelData = data.toString();
        if (parseFloat(data.toString()) >= 0.000) {
            if (parseInt(last) !== cups) {
                counter2++;
                if (counter2 === updateTime) {
                    setNumberOfCoffeeCupsLeft(topLevelData);
                    counter2 = 0;
                }
            }

        }

    });*/
}

function updateWeightText(weight) {
    console.log(weight.toString());
    //$("#kg").text(weight.toString());
    /*fetch('https://api.thingspeak.com/update.json',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: qs.stringify({
            api_key: credentials.write_key,
            field1: weight.toString()
        })
    })
        .catch(err => console.log(err))*/
}

function setNumberOfCoffeeCupsLeft(weight) {
    let weightDouble = parseFloat(weight.toString());

    let cups = parseInt(Math.floor(weightDouble / cupOfCoffee).toString());

    if (last !== undefined) {
        if (parseInt(last) !== cups) {
            console.log("Pushing to ThingSpeak");
            fetch('https://api.thingspeak.com/update.json', {
                method: 'POST',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                body: qs.stringify({
                    api_key: credentials.write_key,
                    field2: cups.toString()
                })
            })
                .then(res => {
                    let randomInt = Math.floor((Math.random()*3)+1);
                    let tweet = "";
                    switch (cups) {
                        case 0:
                            createTwitterStatus(tweets.empty);
                            console.log(tweets.empty);
                            break;
                        case 1:
                            //if(last === 0) {
                            //  createTwitterStatus(tweets.filling);
                            //  break;
                            //}
                            tweet = tweets.oneCup[randomInt-1];
                            console.log(tweet);
                            createTwitterStatus(tweet);
                            break;
                        case 2:
                            //if(last === 0){
                            //  createTwitterStatus(tweets.filling);
                            //break;
                            //}
                            tweet = tweets.twoCup[randomInt-1];
                            console.log(tweet);
                            createTwitterStatus(tweet);
                    }

                    if(last === 0 && cups >= 6){
                        createTwitterStatus(tweets.filling)
                    }
                })
                .then(res => last = cups)
                .catch(err => console.log(err));
        }
    }
}


function createTwitterStatus(tweet){
    fetch('https://api.thingspeak.com/apps/thingtweet/1/statuses/update', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: qs.stringify({
            api_key: credentials.thing_tweet,
            status: tweet
        })
    })
        .then(res => res.json())
        .then(res => console.log('Response from ThingTweet: ' + res))
        .catch(err => console.log(err))
}
