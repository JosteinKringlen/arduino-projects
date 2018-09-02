#include <LiquidCrystal.h>
 
#define aref_voltage 3.3

// Analog pin
int sensorPin = 1; 

const int rs = 12, en = 11, d4 = 5, d5 = 4, d6 = 3, d7 = 2;
LiquidCrystal lcd(rs, en, d4, d5, d6, d7);

float lastRegistered = 0.0;

void setup(){
  Serial.begin(9600); 
  analogReference(EXTERNAL);
  lcd.begin(16, 2);
  lcd.write("Starting temperature sensor");
}

void loop()                  {
  //getting the voltage reading from the temperature sensor
  int reading = analogRead(sensorPin);

  // converting that reading to voltage
  float voltage = reading * aref_voltage;
  voltage /= 1024.0;

  // now print out the temperature
  float temperatureC = (voltage - 0.5) * 100 ;  //converting from 10 mv per degree wit 500 mV offset
  Serial.print(temperatureC); Serial.println(" degrees C");
  if (temperatureC != lastRegistered) {
    lcd.clear();
    lcd.print(String(temperatureC) + " C");
    lastRegistered = temperatureC;
  }
  delay(10000);                                    
}
