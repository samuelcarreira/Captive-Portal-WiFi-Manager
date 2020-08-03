#ifndef CAPTIVE_PORTAL_WIFI_MANAGER_H
#define CAPTIVE_PORTAL_WIFI_MANAGER_H

#define DEBUG_SERIAL_ENABLED

#include <Arduino.h>
#include <stdint.h>
#include <ESP8266mDNS.h>

#include "DebugUtils.h"

// #include <stdio.h>

#include "EEPROM_config.h"
#include "HTTP_Server_Captive_Portal.h"

class CaptivePortalWiFiManager {
   public:
    CaptivePortalWiFiManager(String apName, int8_t configButtonPin, bool buttonPressedLevel = false, uint16_t eepromStartAddress = 0);
    void init();

    void resetWiFiConfig();

    void connectToWiFi();

    wificonfig_t wifiConfig;

   private:
    EEPROMConfig* eepromConfig;
    HttpServerCaptivePortal* httpServerCaptivePortal;
    
    String _createSSID(String& apNamePrefix);

    void _captivePortal();

    String _apName;
    uint8_t _configButtonPin;
    bool _buttonPressedLevel;
};

#endif  // CAPTIVE_PORTAL_WIFI_MANAGER_H