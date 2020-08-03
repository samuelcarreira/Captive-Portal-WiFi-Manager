#ifndef EEPROM_CONFIG_H
#define EEPROM_CONFIG_H

#include <Arduino.h>
#include <EEPROM.h>
#include <ESP8266WiFi.h> // IPAddress Class
#include <stdint.h>  // because uint16_t type declarations on platform.io

struct wificonfig_t {
    char ssid[33];      // Wifi SSID
    char password[33];  // Wifi password
    IPAddress ip;       // static IP
    IPAddress subnet;   // subnet
    IPAddress gateway;  // gateway
    IPAddress dns1;     // DNS
    IPAddress dns2;     // DNS alternative
};

struct settings_t {
    uint32_t crc;  // CRC to control settings changes
    struct wificonfig_t wifi;
};

class EEPROMConfig {
   public:
    EEPROMConfig(uint16_t eepromStartAddress = 0);

    wificonfig_t createDefaultWifiConfiguration();
    settings_t readConfiguration();
    void writeConfiguration(wificonfig_t config);

    uint32_t calculateCRC32(const uint8_t *data, size_t length);

    bool checkIntegrity(settings_t config);

   private:
    uint16_t _eepromStartAddress;
};

#endif  // EEPROM_CONFIG_H