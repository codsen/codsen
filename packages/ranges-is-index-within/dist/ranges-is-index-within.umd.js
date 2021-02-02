/**
 * ranges-is-index-within
 * Checks if index is within any of the given string index ranges
 * Version: 2.0.2
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ranges-is-index-within/
 */

!function(e,n){"object"==typeof exports&&"undefined"!=typeof module?n(exports):"function"==typeof define&&define.amd?define(["exports"],n):n((e="undefined"!=typeof globalThis?globalThis:e||self).rangesIsIndexWithin={})}(this,(function(e){"use strict";function n(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function t(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function r(e){for(var r=1;r<arguments.length;r++){var i=null!=arguments[r]?arguments[r]:{};r%2?t(Object(i),!0).forEach((function(t){n(e,t,i[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(i)):t(Object(i)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(i,n))}))}return e}var i={inclusiveRangeEnds:!1,returnMatchedRangeInsteadOfTrue:!1};e.defaults=i,e.isIndexWithin=function(e,n,t){var o=r(r({},i),t);if(!Number.isInteger(e))throw new Error("ranges-is-index-within: [THROW_ID_01] the first input argument should be string index, a natural number (or zero). It was given as "+e+" (type "+typeof e+")");return!!Array.isArray(n)&&(o.returnMatchedRangeInsteadOfTrue?n.find((function(n){return o.inclusiveRangeEnds?e>=n[0]&&e<=n[1]:e>n[0]&&e<n[1]}))||!1:n.some((function(n){return o.inclusiveRangeEnds?e>=n[0]&&e<=n[1]:e>n[0]&&e<n[1]})))},e.version="2.0.2",Object.defineProperty(e,"__esModule",{value:!0})}));
