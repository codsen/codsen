/**
 * string-character-is-astral-surrogate
 * Tells, is given character a part of astral character, specifically, a high and low surrogate
 * Version: 1.10.54
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/string-character-is-astral-surrogate
 */

!function(t,r){"object"==typeof exports&&"undefined"!=typeof module?r(exports):"function"==typeof define&&define.amd?define(["exports"],r):r((t=t||self).stringCharacterIsAstralSurrogate={})}(this,(function(t){"use strict";function r(t){return(r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}t.isHighSurrogate=function(t){if("string"==typeof t)return 0!==t.length&&(t.charCodeAt(0)>=55296&&t.charCodeAt(0)<=56319);if(void 0===t)return!1;throw new TypeError("string-character-is-astral-surrogate/isHighSurrogate(): the input is not string but ".concat(r(t)))},t.isLowSurrogate=function(t){if("string"==typeof t)return 0!==t.length&&(t.charCodeAt(0)>=56320&&t.charCodeAt(0)<=57343);if(void 0===t)return!1;throw new TypeError("string-character-is-astral-surrogate/isLowSurrogate(): the input is not string but ".concat(r(t)))},Object.defineProperty(t,"__esModule",{value:!0})}));
