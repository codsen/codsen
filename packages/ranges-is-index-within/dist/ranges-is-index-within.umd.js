/**
 * ranges-is-index-within
 * Efficiently checks if index is within any of the given ranges
 * Version: 1.14.37
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ranges-is-index-within/
 */

!function(e,n){"object"==typeof exports&&"undefined"!=typeof module?module.exports=n():"function"==typeof define&&define.amd?define(n):(e="undefined"!=typeof globalThis?globalThis:e||self).rangesIsIndexWithin=n()}(this,(function(){"use strict";function e(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function n(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function t(t){for(var r=1;r<arguments.length;r++){var i=null!=arguments[r]?arguments[r]:{};r%2?n(Object(i),!0).forEach((function(n){e(t,n,i[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(i)):n(Object(i)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(i,e))}))}return t}var r=Array.isArray;return function(e,n,i){var o=t(t({},{inclusiveRangeEnds:!1,returnMatchedRangeInsteadOfTrue:!1}),i);return!!r(n)&&(o.returnMatchedRangeInsteadOfTrue?n.find((function(n){return o.inclusiveRangeEnds?e>=n[0]&&e<=n[1]:e>n[0]&&e<n[1]}))||!1:n.some((function(n){return o.inclusiveRangeEnds?e>=n[0]&&e<=n[1]:e>n[0]&&e<n[1]})))}}));
