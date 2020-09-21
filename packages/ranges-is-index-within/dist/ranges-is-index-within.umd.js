/**
 * ranges-is-index-within
 * Checks if index is within any of the given string index ranges
 * Version: 1.14.38
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ranges-is-index-within/
 */

!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e="undefined"!=typeof globalThis?globalThis:e||self).rangesIsIndexWithin=t()}(this,(function(){"use strict";function e(t){return(e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(t)}function t(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function n(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function r(e){for(var r=1;r<arguments.length;r++){var o=null!=arguments[r]?arguments[r]:{};r%2?n(Object(o),!0).forEach((function(n){t(e,n,o[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(o)):n(Object(o)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(o,t))}))}return e}return function(t,n,o){var i=r(r({},{inclusiveRangeEnds:!1,returnMatchedRangeInsteadOfTrue:!1}),o);if(!Number.isInteger(t))throw new Error("ranges-is-index-within: [THROW_ID_01] the first input argument should be string index, a natural number (or zero). It was given as ".concat(t," (type ").concat(e(t),")"));return!!Array.isArray(n)&&(i.returnMatchedRangeInsteadOfTrue?n.find((function(e){return i.inclusiveRangeEnds?t>=e[0]&&t<=e[1]:t>e[0]&&t<e[1]}))||!1:n.some((function(e){return i.inclusiveRangeEnds?t>=e[0]&&t<=e[1]:t>e[0]&&t<e[1]})))}}));
