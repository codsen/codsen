/**
 * ast-is-empty
 * Find out, is nested array/object/string/AST tree is empty
 * Version: 2.0.11
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ast-is-empty/
 */

!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e((t="undefined"!=typeof globalThis?globalThis:t||self).astIsEmpty={})}(this,(function(t){"use strict";var e,n,r=Object.prototype,o=Function.prototype.toString,f=r.hasOwnProperty,i=o.call(Object),u=r.toString,l=(e=Object.getPrototypeOf,n=Object,function(t){return e(n(t))});var c=function(t){if(!function(t){return!!t&&"object"==typeof t}(t)||"[object Object]"!=u.call(t)||function(t){var e=!1;if(null!=t&&"function"!=typeof t.toString)try{e=!!(t+"")}catch(t){}return e}(t))return!1;var e=l(t);if(null===e)return!0;var n=f.call(e,"constructor")&&e.constructor;return"function"==typeof n&&n instanceof n&&o.call(n)==i};t.isEmpty=function t(e){let n,r,o=!0;if(Array.isArray(e)){if(0===e.length)return!0;for(n=0,r=e.length;n<r;n++){if(o=t(e[n]),null===o)return null;if(!o)return!1}}else if(c(e)){if(0===Object.keys(e).length)return!0;for(n=0,r=Object.keys(e).length;n<r;n++){if(o=t(e[Object.keys(e)[n]]),null===o)return null;if(!o)return!1}}else{if("string"!=typeof e)return null;if(0!==e.length)return!1}return o},t.version="2.0.11",Object.defineProperty(t,"__esModule",{value:!0})}));
