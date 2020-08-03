#ifndef DEBUGUTILS_H
#define DEBUGUTILS_H

#ifdef DEBUG_SERIAL_ENABLED
#define DEBUG_PRINT(x) Serial.print(x)
#define DEBUG_PRINTDEC(x) Serial.print(x, DEC)
#define DEBUG_PRINTLN(x) Serial.println(x)
#define DEBUG_PRINT_TRACE(str) \
    Serial.print(millis());    \
    Serial.print(": ");        \
    Serial.print(__FILE__);    \
    Serial.print(':');         \
    Serial.print(__LINE__);    \
    Serial.print(' ');         \
    Serial.println(str);
#else
#define DEBUG_PRINT(x)
#define DEBUG_PRINTDEC(x)
#define DEBUG_PRINTLN(x)
#define DEBUG_PRINT_TRACE(str)
#endif

#endif  // DEBUGUTILS_H
