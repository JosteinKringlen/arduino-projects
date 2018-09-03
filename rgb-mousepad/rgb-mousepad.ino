#include "FastLED.h"

#define PIN 4
#define NUM_LEDS 58
#define updateLEDS 16

CRGBArray<NUM_LEDS> leds;
uint8_t hue[NUM_LEDS];

char ch = -1;

int brightness = 255;

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

  switch (int(ch)) {
    case 0:
      lightsOff();
      break;
    case 1:
      changeBrightness(int(0.1 * 255));
      break;
    case 2:
      changeBrightness(int(0.2 * 255));
      break;
    case 3:
      changeBrightness(int(0.3 * 255));
      break;
    case 4:
      changeBrightness(int(0.4 * 255));
      break;
    case 5:
      changeBrightness(int(0.5 * 255));
      break;
    case 6:
      changeBrightness(int(0.6 * 255));
      break;
    case 7:
      changeBrightness(int(0.7 * 255));
      break;
    case 8:
      changeBrightness(int(0.8 * 255));
      break;
    case 9:
      changeBrightness(int(0.9 * 255));
      break;
    default:
      break;
  }

  switch (ch) {
    case 'a':
      rainbow();
      break;
    case 'b':
      staticColors();
      break;
    case 'c':
      reverseRainbow();
      break;
    case 'd':
      pulse();
      break;
    case 'e':
      pulseFU();
      break;
    case 's':
      startup();
      rainbow();
      break;
    case 'z':
      epilepticGlory();
      break;
    // f for full brightness
    case 'f':
      changeBrightness(255);
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

void changeBrightness(int brightnessInput) {
  brightness = brightnessInput;
}


