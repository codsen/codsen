/**
 * util-nonempty
 * Is the input (plain object, array, string or whatever) not empty?
 * Version: 3.0.7
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/util-nonempty/
 */

!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e((t="undefined"!=typeof globalThis?globalThis:t||self).utilNonempty={})}(this,(function(t){"use strict";var e,n,o=Object.prototype,r=Function.prototype.toString,c=o.hasOwnProperty,i=r.call(Object),f=o.toString,u=(e=Object.getPrototypeOf,n=Object,function(t){return e(n(t))});var l=function(t){if(!function(t){return!!t&&"object"==typeof t}(t)||"[object Object]"!=f.call(t)||function(t){var e=!1;if(null!=t&&"function"!=typeof t.toString)try{e=!!(t+"")}catch(t){}return e}(t))return!1;var e=u(t);if(null===e)return!0;var n=c.call(e,"constructor")&&e.constructor;return"function"==typeof n&&n instanceof n&&r.call(n)==i};t.nonEmpty=function(t){return null!=t&&(Array.isArray(t)||"string"==typeof t?!!t.length:l(t)?!!Object.keys(t).length:"number"==typeof t)},t.version="3.0.7",Object.defineProperty(t,"__esModule",{value:!0})}));
