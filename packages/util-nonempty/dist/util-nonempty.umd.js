/**
 * util-nonempty
 * Is the input (plain object, array, string or whatever) not empty?
 * Version: 2.9.59
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/util-nonempty
 */

!function(t,n){"object"==typeof exports&&"undefined"!=typeof module?module.exports=n():"function"==typeof define&&define.amd?define(n):(t="undefined"!=typeof globalThis?globalThis:t||self).utilNonempty=n()}(this,(function(){"use strict";var t,n,e=Function.prototype,o=Object.prototype,r=e.toString,c=o.hasOwnProperty,u=r.call(Object),i=o.toString,f=(t=Object.getPrototypeOf,n=Object,function(e){return t(n(e))});var l=function(t){if(!function(t){return!!t&&"object"==typeof t}(t)||"[object Object]"!=i.call(t)||function(t){var n=!1;if(null!=t&&"function"!=typeof t.toString)try{n=!!(t+"")}catch(t){}return n}(t))return!1;var n=f(t);if(null===n)return!0;var e=c.call(n,"constructor")&&n.constructor;return"function"==typeof e&&e instanceof e&&r.call(e)==u},p=Array.isArray;function y(t){return"string"==typeof t}function a(t){return"number"==typeof t}return function(t){return 0!==arguments.length&&void 0!==t&&(p(t)||y(t)?t.length>0:l(t)?Object.keys(t).length>0:!!a(t))}}));
