/*
Brian Gates
Final Assignment
4/5/2019

*/

var serial;
var portName = "COM3";

var stdKora1;
var stdKora2;
var dist;

var strum1state = false;
var strum2state = false;

var prevfret1 = 0; //Initialize
var prevfret2 = 0; //Initialize

var trig1;
var trig2;

var string1 = ["C4", "C#4", "D4", "D#4", "E4", "F4", "F#4"];
var string2 = ["G4", "G#4", "A4", "A#4", "B4", "C5", "C#5"];

function preload() {
	
}

function setup() {
  //Serial Setup
  serial = new p5.SerialPort(); // make a new instance of the serialport library
  serial.on('list', printList); // set a callback function for the serialport list event
  serial.on('connected', serverConnected); // callback for connecting to the server
  serial.on('open', portOpen); // callback for the port opening
  serial.on('data', serialEvent); // callback for when new data arrives
  serial.on('error', serialError); // callback for errors
  serial.on('close', portClose); // callback for the port closing

  serial.list(); // list the serial ports
  serial.open(portName); // open a serial port
  
  createCanvas(1920, 1080);

  dist1 = new Tone.Distortion({
	"distortion" : 0.48,
    "wet": 0.7
  }).toMaster();
  
  dist2 = new Tone.Distortion({
	"distortion" : 0.48,
    "wet": 0.7
  }).toMaster();
  
  stdKora1 = new Tone.MonoSynth({
    "oscillator": {
	  "type": "fmsquare5",
	  "modulationType" : "sine",
	  "modulationIndex" : 1,
	  "harmonicity" : 0.501
    },
    "filter": {
        "Q": 1,
        "type": "lowpass",
        "rolloff": -24
    },
    "envelope": {
        "attack": 0.01,
        "decay": 0.1,
        "sustain": 0.4,
        "release": 2
    },
    "filterEnvelope": {
        "attack": 0.01,
        "decay": 0.1,
        "sustain": 1.3,
        "release": 0.7,
        "baseFrequency": 80,
        "octaves": 4.4
    }
  }).connect(dist1);
  
  stdKora2 = new Tone.MonoSynth({
    "oscillator": {
	  "type": "fmsquare5",
	  "modulationType" : "sine",
	  "modulationIndex" : 1,
	  "harmonicity" : 0.501
    },
    "filter": {
        "Q": 1,
        "type": "highpass",
        "rolloff": -24
    },
    "envelope": {
        "attack": 0.01,
        "decay": 0.1,
        "sustain": 0.4,
        "release": 2
    },
    "filterEnvelope": {
        "attack": 0.01,
        "decay": 0.1,
        "sustain": 1.3,
        "release": 0.7,
        "baseFrequency": 80,
        "octaves": 4.4
    }
  }).connect(dist1);
  
}

// get the list of ports:
function printList(portList) {
// portList is an array of serial port names
for (var i = 0; i < portList.length; i++) {
  // Display the list the console:
  console.log(i + " " + portList[i]);
}
}

function serverConnected() {
console.log('connected to server.');
}

function portOpen() {
console.log('the serial port opened.')
}

function serialEvent() {
  var currentString = trim(serial.readStringUntil("\r\n"));
  if (!currentString)
	return;
  var data = split(trim(currentString), ',');
  if (data.length < 6)
	return;
  fret1 = parseInt(data[0]);
  strum1 = parseInt(data[1]);
  trig1 = parseInt(data[2]);
  fret2 = parseInt(data[3]);
  strum2 = parseInt(data[4]);
  trig2 = parseInt(data[5]);
  if (strum1 <= trig1 || strum1 > 1000){
	//Play string1
	console.log("Strum 1" + " " + data[1] + "," + trig1);
	if (strum1state != true) {
	  stdKora1.triggerAttack(string1[fret1]);
	  strum1state = true;
	}
	if (fret1 != prevfret1) {
	  stdKora1.triggerRelease();
	  stdKora1.triggerAttack(string1[fret1]);
	  prevfret1 = fret1;
	}
  }
  else {
	strum1state = false;
	stdKora1.triggerRelease();
  }
  
  if (strum2 <= trig2){
	//Play string2
	console.log("Strum 2");
	if (strum2state != true){
	  stdKora2.triggerAttack(string2[fret2]);
//	  serial.write(1);
	  strum2state = true;
	}
	if (fret2 != prevfret2) {
	  stdKora2.triggerRelease();
	  stdKora2.triggerAttack(string2[fret2]);
	  prevfret2 = fret2;
	}
  }
  else {
	strum2state = false;
	stdKora2.triggerRelease();
  }
  
  if (!strum2state && !strum1state){
	serial.write(0);
  }
  else if(strum2state && strum1state){
	serial.write(2);
  }
  else{
	serial.write(1);
  }
  
}

function serialError(err) {
console.log('Something went wrong with the serial port. ' + err);
}

function portClose() {
console.log('The serial port closed.');
}

function draw() { 
  background(255);
  textSize(50);
  fill(155);
  text("String 1",100,100);
  text("String 2",600,100);
  if (strum1state) {
	fill(0);
	text("Strum 1 " + string1[fret1], 100, 500);
  }
  
  if (strum2state) {
	fill(0);
	text("Strum 2 " + string2[fret2], 600, 500);
  }
}