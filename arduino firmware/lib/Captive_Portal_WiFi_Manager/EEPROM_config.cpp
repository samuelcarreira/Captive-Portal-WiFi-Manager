#include "EEPROM_config.h"

EEPROMConfig::EEPROMConfig(uint16_t eepromStartAddress) {
    _eepromStartAddress = eepromStartAddress;
}

wificonfig_t EEPROMConfig::createDefaultWifiConfiguration() {
    wificonfig_t wificonfig = {
        "",
        "",
        0,
        0,
        0,
        0,
        0};

    return wificonfig;
}

settings_t EEPROMConfig::readConfiguration() {
    settings_t config;
    EEPROM.begin(sizeof(settings_t));  // or 512??
    delay(10);
    EEPROM.get(_eepromStartAddress, config);
    EEPROM.end();

    return config;
}

void EEPROMConfig::writeConfiguration(wificonfig_t wificonfig) {
    Serial.println("Writing to EEPROM Wifi Config");
    EEPROM.begin(sizeof(settings_t)); 
    delay(10);

    const uint32_t crc = calculateCRC32((uint8_t *)&wificonfig, sizeof(wificonfig));

    settings_t config = {crc, wificonfig};


    EEPROM.put(_eepromStartAddress, config);
    EEPROM.commit();
    EEPROM.end();
}

/**
 * Check the integrity of the settings by calculating
 * the CRC
 * @param settings_t config
 * @return false if crc doesnt check
 */
bool EEPROMConfig::checkIntegrity(settings_t config) {
    const wificonfig_t wificonfig = config.wifi;
    const uint32_t wificrc = calculateCRC32((uint8_t *)&wificonfig, sizeof(wificonfig));

    return wificrc == config.crc;
}

uint32_t EEPROMConfig::calculateCRC32(const uint8_t *data, size_t length) {
    uint32_t crc = 0xffffffff;
    while (length--) {
        uint8_t c = *data++;
        for (uint32_t i = 0x80; i > 0; i >>= 1) {
            bool bit = crc & 0x80000000;
            if (c & i) {
                bit = !bit;
            }
            crc <<= 1;
            if (bit) {
                crc ^= 0x04c11db7;
            }
        }
    }
    return crc;
}