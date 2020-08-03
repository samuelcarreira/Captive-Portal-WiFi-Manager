#define DEBUG_SERIAL_ENABLED
#include <Arduino.h>

#include "Captive_Portal_WiFi_Manager.h"
#include "DebugUtils.h"

#define SERIAL_BAUD_RATE 115200

void initSerial();

CaptivePortalWiFiManager* captivePortalWiFiManager;
void setup() {
    initSerial();

    DEBUG_PRINT_TRACE("Starting...");

    captivePortalWiFiManager = new CaptivePortalWiFiManager("TESTE", D3, false, 0);

    captivePortalWiFiManager->init();

    DEBUG_PRINT_TRACE("Entering loop...");
}

void initSerial() {
    Serial.begin(SERIAL_BAUD_RATE);

    uint8_t counter = 0;
    while (!Serial && !Serial.available()) {
        delay(25);

        if (++counter > 128) {
            break;
        }
    }
}

void loop() {
    MDNS.update();
}