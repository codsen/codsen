/**
 * ranges-offset
 * Increment or decrement each index in every range
 * Version: 2.0.8
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ranges-offset/
 */

!function(e,n){"object"==typeof exports&&"undefined"!=typeof module?n(exports):"function"==typeof define&&define.amd?define(["exports"],n):n((e="undefined"!=typeof globalThis?globalThis:e||self).rangesOffset={})}(this,(function(e){"use strict";e.rOffset=function(e,n){return void 0===n&&(n=0),Array.isArray(e)&&e.length?e.map((function(e){var t=e.slice(0);return"number"==typeof t[0]&&(t[0]+=n),"number"==typeof t[1]&&(t[1]+=n),[].concat(t)})):e},e.version="2.0.8",Object.defineProperty(e,"__esModule",{value:!0})}));
