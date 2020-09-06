/**
 * arrayiffy-if-string
 * Put non-empty strings into arrays, turn empty-ones into empty arrays. Bypass everything else.
 * Version: 3.11.34
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/arrayiffy-if-string/
 */

!function(e,n){"object"==typeof exports&&"undefined"!=typeof module?module.exports=n():"function"==typeof define&&define.amd?define(n):(e="undefined"!=typeof globalThis?globalThis:e||self).arrayiffyIfString=n()}(this,(function(){"use strict";return function(e){return"string"==typeof e?e.length>0?[e]:[]:e}}));
