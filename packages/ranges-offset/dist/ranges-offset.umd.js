/**
 * ranges-offset
 * Increment or decrement each index in every range
 * Version: 1.0.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ranges-offset/
 */

!function(t,r){"object"==typeof exports&&"undefined"!=typeof module?module.exports=r():"function"==typeof define&&define.amd?define(r):(t="undefined"!=typeof globalThis?globalThis:t||self).rangesOffset=r()}(this,(function(){"use strict";function t(t){return function(t){if(Array.isArray(t))return t}(t)||e(t)||n(t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function r(t){return function(t){if(Array.isArray(t))return o(t)}(t)||e(t)||n(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function e(t){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(t))return Array.from(t)}function n(t,r){if(t){if("string"==typeof t)return o(t,r);var e=Object.prototype.toString.call(t).slice(8,-1);return"Object"===e&&t.constructor&&(e=t.constructor.name),"Map"===e||"Set"===e?Array.from(t):"Arguments"===e||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e)?o(t,r):void 0}}function o(t,r){(null==r||r>t.length)&&(r=t.length);for(var e=0,n=new Array(r);e<r;e++)n[e]=t[e];return n}return function(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;return Array.isArray(e)&&e.length?e.map((function(e){var o=t(e).slice(0);return"number"==typeof o[0]&&(o[0]+=n),"number"==typeof o[1]&&(o[1]+=n),r(o)})):e}}));
