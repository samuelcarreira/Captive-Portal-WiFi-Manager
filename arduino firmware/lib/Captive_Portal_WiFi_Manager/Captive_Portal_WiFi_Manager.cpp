#include "Captive_Portal_WiFi_Manager.h"

/**
 * Captive Portal WiFi Manager
 * @param apName String
 * @param int8_t configButtonPin 
 * @param bool  buttonPressedLevel (false to use the internal uC
 *              pullup resistors -> logic inverted)
 */
CaptivePortalWiFiManager::CaptivePortalWiFiManager(String apName, int8_t configButtonPin, bool buttonPressedLevel, uint16_t eepromStartAddress) {
    _apName = _createSSID(apName);
    _configButtonPin = configButtonPin;
    _buttonPressedLevel = buttonPressedLevel;

    eepromConfig = new EEPROMConfig(eepromStartAddress);

    if (buttonPressedLevel) {
        pinMode(configButtonPin, INPUT);
    } else {
        // NOTE: pull-up means the pushbutton's logic is inverted. It goes HIGH when it's open, and LOW when it's pressed
        pinMode(configButtonPin, INPUT_PULLUP);
    }
}

/**
 * Detect if Captive portal is needed
 * 
 * Conditions to trigger (one of below):
 * - Invalid EEPROM CRC (possible corrupted or never started)
 * - Long Button press (4s) on boot
 * - No SSID stored in settings
 */
void CaptivePortalWiFiManager::init() {
    const settings_t config = eepromConfig->readConfiguration();
    wifiConfig = config.wifi;

    const uint32_t pressStarted = millis();
    const uint32_t longPressDuration = 4000;  // 4 seconds long press

    while (digitalRead(_configButtonPin) == _buttonPressedLevel) {
        if (millis() - pressStarted > longPressDuration) {
            DEBUG_PRINT_TRACE("Button long press");
            _captivePortal();
            return;
            break;
        }
        delay(25);  // stabilize the read
    }

    if (!eepromConfig->checkIntegrity(config)) {
        DEBUG_PRINT_TRACE("CRC check failed");
        _captivePortal();
        return;
    }

    if (!config.wifi.ssid || strlen(config.wifi.ssid) == 0) {
        DEBUG_PRINT_TRACE("No SSID");
        _captivePortal();
        return;
    }

    DEBUG_PRINT_TRACE("No need to start Captive Portal");

    connectToWiFi();
}

void CaptivePortalWiFiManager::_captivePortal() {
    httpServerCaptivePortal = new HttpServerCaptivePortal(_apName);

    httpServerCaptivePortal->startCaptivePortal();

    eepromConfig->writeConfiguration(httpServerCaptivePortal->newWiFiConfig);

    DEBUG_PRINT_TRACE("Restarting device...");

    delay(350);

    ESP.restart();
}

void CaptivePortalWiFiManager::resetWiFiConfig() {
    DEBUG_PRINT_TRACE("Reseting EEPROM wifi config to defaults...");
    eepromConfig->writeConfiguration(eepromConfig->createDefaultWifiConfiguration());
}

void CaptivePortalWiFiManager::connectToWiFi() {
    WiFi.mode(WIFI_STA);
    WiFi.hostname(_apName);
    WiFi.begin(wifiConfig.ssid, wifiConfig.password);

    uint8_t counter = 0;
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        DEBUG_PRINT(".");

        if (++counter > 15) {
            ESP.restart();
        }
    }

    if (!MDNS.begin(_apName)) {
        DEBUG_PRINT_TRACE("Error setting up MDNS responder!");

        delay(2000);
        ESP.restart();
    } else {
        // Log.notice(F("mDNS responder started: http://%s.local/ " CR), myHOSTNAME);

        DEBUG_PRINT_TRACE("mDNS responder started");

        String ipaddress = WiFi.localIP().toString();
        // Log.notice(F("IP Address: http://%s/" CR), &ipaddress);
        DEBUG_PRINTLN(ipaddress);
    }
}


/**
 * Create custom SSID with the Provided string prefix plus
 * ESP chip ID (last MAC address characters)
 * @param apNamePrefix String
 * @return Custom SSID
 */
String CaptivePortalWiFiManager::_createSSID(String &apNamePrefix) {
    apNamePrefix.trim();
    apNamePrefix.remove(24);  // max lenght 24 + 8 characters
    return apNamePrefix + "-" + String(ESP.getChipId(), HEX);
}
