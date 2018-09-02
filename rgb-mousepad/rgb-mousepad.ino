#include "FastLED.h"

#define PIN 4
#define NUM_LEDS 58
#define updateLEDS 16

CRGBArray<NUM_LEDS> leds;
uint8_t hue[NUM_LEDS];

char ch = -1;

int stuff = 255;

void setup() {
  Serial.begin(9600);
  FastLED.addLeds<NEOPIXEL, PIN>(leds, NUM_LEDS);
  for (int i = 0; i < NUM_LEDS; i++) {
    hue[i] = 255 / NUM_LEDS * i;
  }
  startup();
}

void loop() {
  if (Serial.available()) {
    ch = Serial.read();
  }
  switch (ch) {
    case '0':
      lightsOff();
      break;
    case '1':
      rainbow();
      break;
    case '2':
      staticColors();
      break;
    case '3':
      reverseRainbow();
      break;
    case '4':
      pulse();
      break;
    case 'y':
      pulseFU();
      break;
    case 's':
      startup();
      rainbow();
      break;
    case 'z':
      epilepticGlory();
      break;
    default:
      rainbow();
      break;
  }

  delay(15);
}

void startup() {
  for (int i = 0; i < NUM_LEDS; i++) {
    leds[i] = CHSV(hue[i]++, 255, 255);
    FastLED.show();
    delay(10);
  }
}

void rainbow() {
  for (int i = 0; i < NUM_LEDS; i++) {
    leds[i] = CHSV(hue[i]++, 255, 255);
  }
  FastLED.show();
}

void staticColors() {
  for (int i = 0; i < NUM_LEDS; i++) {
    leds[i] = CHSV(hue[i], 255, 255);
  }
  FastLED.show();
}

void reverseRainbow() {
  for (int i = NUM_LEDS - 1; i >= 0; i--) {
    leds[i] = CHSV(hue[i]--, 255, 255);
  }
  FastLED.show();
}

void epilepticGlory() {
  for (int i = 0; i < NUM_LEDS; i++) {
    leds[random(0, NUM_LEDS)] = CHSV(hue[i]++, 255, 255);
  }
  FastLED.show();
}

void lightsOff() {
  for (int i = 0; i < NUM_LEDS; i++) {
    leds[i] = CHSV(0, 0, 0);
    FastLED.show();
    delay(10);
  }
}

void pulse() {
  for ( int colorStep = 0; colorStep < 256; colorStep++ ) {
    int r = colorStep;  // Redness starts at zero and goes up to full
    int b = 255 - colorStep; // Blue starts at full and goes down to zero
    int g = 0;              // No green needed to go from blue to red
    for (int x = 0; x < NUM_LEDS; x++) {
      leds[x] = CRGB(r, g, b);
    }
    FastLED.show();
    delay(10);
  }
  for ( int colorStep = 255; colorStep > 0; colorStep-- ) {
    int r = colorStep;  // Redness starts at zero and goes up to full
    int b = 255 - colorStep; // Blue starts at full and goes down to zero
    int g = 0;              // No green needed to go from blue to red
    for (int x = 0; x < NUM_LEDS; x++) {
      leds[x] = CRGB(r, g, b);
    }
    FastLED.show();
    delay(10);
  }
}

void pulseFU() {
  for ( int colorStep = 120; colorStep < 256; colorStep++ ) {
    int r = 46;  // Redness starts at zero and goes up to full
    int b = 255; // Blue starts at full and goes down to zero
    int g = colorStep;              // No green needed to go from blue to red
    for (int x = 0; x < NUM_LEDS; x++) {
      leds[x] = CHSV(r, g, b);
    }
    FastLED.show();
    delay(10);
  }
  for ( int colorStep = 255; colorStep > 119; colorStep-- ) {
    int r = 46;  // Redness starts at zero and goes up to full
    int b = 255; // Blue starts at full and goes down to zero
    int g = colorStep;              // No green needed to go from blue to red
    for (int x = 0; x < NUM_LEDS; x++) {
      leds[x] = CHSV(r, g, b);
    }
    FastLED.show();
    delay(10);
  }
}


