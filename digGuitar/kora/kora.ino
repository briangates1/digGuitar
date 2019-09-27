/*
 * Brian Gates
 * Final Proj
 * 4/28/2019
 * https://youtu.be/sGWKaB_44KM
 * 
 */

int incomingData = 1;

int photoHigh = 1023;
int photoLow = 0;

int brightness = 0;
int fading = 20;

int trig1;
int trig2;

float trigscale = 0.35; //Light sensitivity of string

//Debouncing vars (as necessary)
int Sfret1 = 0;
int Sfret2 = 0;
int button1State;
int button2State;
int lastButton1State = LOW;
int lastButton2State = LOW;
unsigned long lastDebounceTime = 0;
unsigned long debounceDelay = 50;

void setup() {
  //String 1
  pinMode(2, INPUT); //Fret 1
  pinMode(A5, INPUT); //F2
  pinMode(4, INPUT); //F3
  pinMode(5, INPUT); //F4
  pinMode(6, INPUT); //F5
  pinMode(7, INPUT); //F6

  //String 2
  pinMode(8, INPUT); //Fret 1
  pinMode(9, INPUT); //F2
  pinMode(10, INPUT); //F3
  pinMode(11, INPUT); //F4
  pinMode(12, INPUT); //F5
  pinMode(13, INPUT); //F6

  //Strings & Other
  pinMode(A0, INPUT); //String 1
  pinMode(A2, INPUT); //String 2
  pinMode(A4, OUTPUT); //For digital LED
  pinMode(A5, OUTPUT); //For analog LED

  trig1 = analogRead(A0) * trigscale; //Trigger point based on initial ambient light conditions (DO NOT HAVE FINGER/HAND COVERING THE STRINGS WHEN YOU TURN IT ON)
  trig2 = analogRead(A2) * trigscale; //Trigger point based on initial ambient light conditions
  
  Serial.begin(9600);
}

void loop() {
  //Read fretboard on String1, write to serial
  if (digitalRead(7) == HIGH)
    Sfret1 = 6;
  else if (digitalRead(6) == HIGH)
    Sfret1 = 5;
  else if (digitalRead(5) == HIGH)
    Sfret1 = 4;
  else if (digitalRead(4) == HIGH)
    Sfret1 = 3;
  else if (digitalRead(A5) == HIGH)
    Sfret1 = 2;
  else if (digitalRead(2) == HIGH)
    Sfret1 = 1;
  else
    Sfret1 = 0;

  int readStrum1 = analogRead(A0);

  if (digitalRead(13) == HIGH)
    Sfret2 = 6;
  else if (digitalRead(12) == HIGH)
    Sfret2 = 5;
  else if (digitalRead(11) == HIGH)
    Sfret2 = 4;
  else if (digitalRead(10) == HIGH)
    Sfret2 = 3;
  else if (digitalRead(9) == HIGH)
    Sfret2 = 2;
  else if (digitalRead(8) == HIGH)
    Sfret2 = 1;
  else
    Sfret2 = 0;

  int readStrum2 = analogRead(A2);

  Serial.print(Sfret1); Serial.print(",");
  Serial.print(readStrum1); Serial.print(",");
  Serial.print(trig1); Serial.print(",");
  Serial.print(Sfret2); Serial.print(",");
  Serial.print(readStrum2); Serial.print(",");
  Serial.println(trig2);
  
  if(Serial.available()>0){
    incomingData = Serial.read();
    if(incomingData == 0){
      digitalWrite(A4, LOW);
      analogWrite(3, 0);
    }
    else if(incomingData == 1){
      digitalWrite(A4, HIGH);
    }
    else{
      digitalWrite(A4, HIGH);
      analogWrite(3, brightness);
      brightness = brightness + fading;
      if (brightness <= 0 || brightness >= 255){
        fading = -fading;
      }      
    }
    /*if(incomingData == 1){
      digitalWrite(A4, HIGH);
      delay(50);
    }
    else {
      digitalWrite(A4, LOW);
    }*/
  }

  delay(35);
}
