/**
 * util-nonempty
 * Is the input (plain object, array, string or whatever) not empty?
 * Version: 2.10.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/util-nonempty/
 */

!function(t,n){"object"==typeof exports&&"undefined"!=typeof module?module.exports=n():"function"==typeof define&&define.amd?define(n):(t="undefined"!=typeof globalThis?globalThis:t||self).utilNonempty=n()}(this,(function(){"use strict";function t(n){return(t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(n)}var n,o,e=Function.prototype,r=Object.prototype,u=e.toString,c=r.hasOwnProperty,f=u.call(Object),i=r.toString,l=(n=Object.getPrototypeOf,o=Object,function(t){return n(o(t))});var y=function(n){if(!function(n){return!!n&&"object"==t(n)}(n)||"[object Object]"!=i.call(n)||function(t){var n=!1;if(null!=t&&"function"!=typeof t.toString)try{n=!!(t+"")}catch(t){}return n}(n))return!1;var o=l(n);if(null===o)return!0;var e=c.call(o,"constructor")&&o.constructor;return"function"==typeof e&&e instanceof e&&u.call(e)==f},p=Array.isArray;function b(t){return"string"==typeof t}function a(t){return"number"==typeof t}return function(t){return 0!==arguments.length&&void 0!==t&&(p(t)||b(t)?t.length>0:y(t)?Object.keys(t).length>0:!!a(t))}}));
