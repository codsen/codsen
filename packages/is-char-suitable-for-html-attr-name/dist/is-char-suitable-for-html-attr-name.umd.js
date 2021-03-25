/**
 * is-char-suitable-for-html-attr-name
 * Is given character suitable to be in an HTML attribute's name?
 * Version: 2.0.10
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/is-char-suitable-for-html-attr-name/
 */

!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t((e="undefined"!=typeof globalThis?globalThis:e||self).isCharSuitableForHtmlAttrName={})}(this,(function(e){"use strict";e.isAttrNameChar=function(e){return"string"==typeof e&&(e.charCodeAt(0)>96&&e.charCodeAt(0)<123||e.charCodeAt(0)>64&&e.charCodeAt(0)<91||e.charCodeAt(0)>47&&e.charCodeAt(0)<58||":"===e||"-"===e)},Object.defineProperty(e,"__esModule",{value:!0})}));
