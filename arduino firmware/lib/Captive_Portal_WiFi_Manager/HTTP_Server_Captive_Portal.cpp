#include "HTTP_Server_Captive_Portal.h"

HttpServerCaptivePortal::HttpServerCaptivePortal(String &apName) {
    _apName = apName;
}

void HttpServerCaptivePortal::startCaptivePortal() {
    DEBUG_PRINT_TRACE("Starting Captive Portal...");

    const int serverPort = 80;
    const byte DNS_PORT = 53;
    IPAddress apIP(172, 217, 28, 1);
    IPAddress netMsk(255, 255, 255, 0);

    WiFi.mode(WIFI_AP);
    WiFi.softAPConfig(apIP, apIP, netMsk);

    WiFi.softAP(_apName);

    if (!WiFi.softAP(_apName)) {
        DEBUG_PRINT_TRACE("Failed setting the soft-AP!");
        delay(100);
        ESP.reset();
    }

    delay(500);

    _dnsServer.setErrorReplyCode(DNSReplyCode::NoError);

    // if DNSServer is started with "*" for domain name, it will reply with
    // provided IP to all DNS request
    _dnsServer.start(DNS_PORT, "*", apIP);

    DEBUG_PRINT_TRACE(WiFi.softAPIP());

    _webServer = new ESP8266WebServer(serverPort);

    _webServer->on("/", std::bind(&HttpServerCaptivePortal::_handleRoot, this));
    _webServer->on("/scannetworks", std::bind(&HttpServerCaptivePortal::_handleScanNetworks, this));
    _webServer->on("/getinfo", std::bind(&HttpServerCaptivePortal::_handleGetInfo, this));
    _webServer->on("/save", std::bind(&HttpServerCaptivePortal::_handleSave, this));

    // _webServer->on("/generate_204", std::bind(&HttpServerCaptivePortal::_handleRoot, this));         // Android captive portal
    // _webServer->on("/redirect", std::bind(&HttpServerCaptivePortal::_handleRoot, this));             // Windows 10 captive portal
    // _webServer->on("/fwlink", std::bind(&HttpServerCaptivePortal::_handleRoot, this));               // Microsoft captive portal
    // _webServer->on("/hotspot-detect.html", std::bind(&HttpServerCaptivePortal::_handleRoot, this));  // Microsoft captive portal

    _webServer->onNotFound(std::bind(&HttpServerCaptivePortal::_handleRoot, this));

    _webServer->begin();

    DEBUG_PRINT_TRACE("HTTP server started");

    _loop();
}

void HttpServerCaptivePortal::_loop() {
    while (1) {
        _dnsServer.processNextRequest();
        _webServer->handleClient();

        if (_saveNewConfig) {
            break;
        }
    }
}

void HttpServerCaptivePortal::_handleSave() {
    DEBUG_PRINT_TRACE("Save");
    // _handleNotFound();

    if (!_webServer->hasArg("ssid") || _webServer->arg("ssid") == "") {
        DEBUG_PRINT_TRACE("No SSID Invalid parameters");
        _invalidWifiConfig();
        return;
    }

    strcpy(newWiFiConfig.ssid, _webServer->arg("ssid").c_str());

    if (_webServer->hasArg("password") && _webServer->arg("password") != "") {
        strcpy(newWiFiConfig.password, _webServer->arg("password").c_str());
    }

    if (_webServer->hasArg("ipSettings") && _webServer->arg("ipSettings") == "dhcp") {
        DEBUG_PRINT_TRACE("DHCP mode");
        return;
    }

    // Static IP config

    if (!_webServer->hasArg("ip") && _webServer->arg("ip") == "") {
        DEBUG_PRINT_TRACE("Invalid config: No IP");
        _invalidWifiConfig();
        return;
    }

    IPAddress ip;
    newWiFiConfig.ip = ip.fromString(_webServer->arg("ip"));

    if (!_webServer->hasArg("subnet") && _webServer->arg("subnet") == "") {
        DEBUG_PRINT_TRACE("Invalid config: No subnet");
        _invalidWifiConfig();
        return;
    }

    IPAddress subnet;
    newWiFiConfig.subnet = ip.fromString(_webServer->arg("subnet"));

    if (!_webServer->hasArg("gateway") && _webServer->arg("gateway") == "") {
        DEBUG_PRINT_TRACE("Invalid config: No gateway");
        _invalidWifiConfig();
        return;
    }

    IPAddress gateway;
    newWiFiConfig.gateway = ip.fromString(_webServer->arg("gateway"));

    if (!_webServer->hasArg("dns1") || _webServer->arg("dns1") == "") {
        DEBUG_PRINT_TRACE("No custom DNS");
        _validWifiConfig();
        return;
    }

    IPAddress dns1;
    newWiFiConfig.dns1 = ip.fromString(_webServer->arg("dns1"));

    if (!_webServer->hasArg("dns2") || _webServer->arg("dns2") == "") {
        DEBUG_PRINT_TRACE("No custom DNS2");
        _validWifiConfig();
        return;
    }

    IPAddress dns2;
    newWiFiConfig.dns2 = ip.fromString(_webServer->arg("dns2"));

    _validWifiConfig();
}

void HttpServerCaptivePortal::_invalidWifiConfig() {
    String message = "{\"status\": false}";

    sendJSONResponse(message);
}

void HttpServerCaptivePortal::_validWifiConfig() {
    DEBUG_PRINT_TRACE("Valid config, now quitting...");

    String message = "{\"status\": true}";

    sendJSONResponse(message);

    delay(250);

    _saveNewConfig = true;
}

void HttpServerCaptivePortal::_handleRoot() {
    _webServer->sendHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    _webServer->sendHeader("Expires", "-1");
    _webServer->sendHeader("Content-Encoding", "gzip");

    _webServer->send_P(200, "text/html", index_html, sizeof(index_html));
    _webServer->client().stop();
}

void HttpServerCaptivePortal::_handleScanNetworks() {
    int8_t totalNetworks = WiFi.scanNetworks();

    String response = _generateJSONNetwork(totalNetworks);
    sendJSONResponse(response);

    WiFi.scanDelete();
}

void HttpServerCaptivePortal::_handleGetInfo() {
    String response = "{\"firmwareversion\": ";
    response += "\"" + String(FIRMWARE_VERSION) + "\", ";
    response += "\"mac\": ";
    response += "\"" + WiFi.softAPmacAddress() + "\", ";
    response += "\"chipid\": ";
    response += "\"" + String(ESP.getChipId(), HEX) + "\", ";
    response += "\"flashchipid\": ";
    response += "\"" + String(ESP.getFlashChipId(), HEX) + "\", ";
    response += "\"flashchiprealsize\": ";
    response += String(ESP.getFlashChipRealSize());
    // response += "\"sketchsize\": ";
    // response += String(ESP.getSketchSize());
    // response += "\"freeheap\": ";
    // response += String(ESP.getFreeHeap());
    response += " }";

    sendJSONResponse(response);
}

void HttpServerCaptivePortal::_handleNotFound() {
    String message = F("Debug\n\n");
    message += F("URI: ");
    message += _webServer->uri();
    message += F("\nMethod: ");
    message += (_webServer->method() == HTTP_GET) ? "GET" : "POST";
    message += F("\nArguments: ");
    message += _webServer->args();
    message += F("\n");

    for (uint8_t i = 0; i < _webServer->args(); i++) {
        message += String(F(" ")) + _webServer->argName(i) + F(": ") + _webServer->arg(i) + F("\n");
    }

    _webServer->sendHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    // _webServer->sendHeader("Content-Length", message.length()); // TODO: do I need this!?
    _webServer->send(200, "text/plain", message);
    _webServer->client().stop();
}

void HttpServerCaptivePortal::sendJSONResponse(String &json) {
    _webServer->sendHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    _webServer->sendHeader("Expires", "-1");
    _webServer->send(200, "text/json", json);
    _webServer->client().stop();
}

String HttpServerCaptivePortal::_generateJSONNetwork(int8_t totalNetworks) {
    String response = "[";

    for (uint8_t i = 0; i < totalNetworks; i++) {
        response += "{\"ssid\": ";
        response += "\"" + WiFi.SSID(i) + "\", ";
        response += "\"signal\": ";
        response += String(WiFi.RSSI(i)) + ", ";
        response += "\"encryption\": ";
        response += String(WiFi.encryptionType(i));
        response += " }";

        if (i < totalNetworks - 1) {
            response += ", ";
        }
    }

    response += "]";

    Serial.println(response);

    return response;
}