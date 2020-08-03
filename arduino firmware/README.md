# Captive Portal WiFi Manager - Firmware

## Instructions

### Add to my arduino project
- Clone or download this repository
- Install VSCode and PlatformIO
- Create a new PlatformIO Project
- Copy the `lib` content to your `lib` folder (you may need to rebuild PlatformIO index)
- Initialize the class
```
#include "Captive_Portal_WiFi_Manager.h"

CaptivePortalWiFiManager* captivePortalWiFiManager;

void setup() {
    captivePortalWiFiManager = new CaptivePortalWiFiManager("TESTE", D3, false, 0);

    captivePortalWiFiManager->init();

    (...)

```
(TODO)