/**
 * @name arrayiffy-if-string
 * @fileoverview Put non-empty strings into arrays, turn empty-ones into empty arrays. Bypass everything else.
 * @version 4.0.1
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/arrayiffy-if-string/}
 */

!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t((e="undefined"!=typeof globalThis?globalThis:e||self).arrayiffyIfString={})}(this,(function(e){"use strict";e.arrayiffy=function(e){return"string"==typeof e?e.length?[e]:[]:e},Object.defineProperty(e,"__esModule",{value:!0})}));
