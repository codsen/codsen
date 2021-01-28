/**
 * string-character-is-astral-surrogate
 * Tells, is given character a part of astral character, specifically, a high and low surrogate
 * Version: 1.12.1
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/string-character-is-astral-surrogate/
 */

!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e((t="undefined"!=typeof globalThis?globalThis:t||self).stringCharacterIsAstralSurrogate={})}(this,(function(t){"use strict";t.isHighSurrogate=function(t){if("string"==typeof t)return 0!==t.length&&(t.charCodeAt(0)>=55296&&t.charCodeAt(0)<=56319);if(void 0===t)return!1;throw new TypeError("string-character-is-astral-surrogate/isHighSurrogate(): the input is not string but "+typeof t)},t.isLowSurrogate=function(t){if("string"==typeof t)return 0!==t.length&&(t.charCodeAt(0)>=56320&&t.charCodeAt(0)<=57343);if(void 0===t)return!1;throw new TypeError("string-character-is-astral-surrogate/isLowSurrogate(): the input is not string but "+typeof t)},Object.defineProperty(t,"__esModule",{value:!0})}));
