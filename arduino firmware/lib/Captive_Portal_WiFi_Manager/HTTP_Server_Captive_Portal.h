#ifndef HTTP_SERVER_CAPTIVE_PORTAL_H
#define HTTP_SERVER_CAPTIVE_PORTAL_H

#define DEBUG_SERIAL_ENABLED

#include <Arduino.h>
#include <DNSServer.h>
#include <ESP8266WebServer.h>
#include <stdint.h>

#include "DebugUtils.h"
#include "EEPROM_config.h"
#include "compilation_auto_version.h"
#include "index_html.h"
// #include <stdio.h>

class HttpServerCaptivePortal {
   public:
    HttpServerCaptivePortal(String& apName);
    void startCaptivePortal();

    void sendJSONResponse(String& json);

    wificonfig_t newWiFiConfig = {
        "",
        "",
        0,
        0,
        0,
        0,
        0};

   private:
    ESP8266WebServer* _webServer;
    DNSServer _dnsServer;  // ESP Crash if I use a pointer

    String _apName;

    bool _saveNewConfig = false;  // true if there is a need to save a new config (breaks the loop)

    void _handleRoot();
    void _loop();
    void _handleScanNetworks();
    void _handleGetInfo();
    void _handleNotFound();
    void _handleSave();
    String _generateJSONNetwork(int8_t totalNetworks);

    void _validWifiConfig();
    void _invalidWifiConfig();
};

#endif  // HTTP_SERVER_CAPTIVE_PORTAL_H
