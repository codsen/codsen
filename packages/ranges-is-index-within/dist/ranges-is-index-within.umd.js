/**
 * ranges-is-index-within
 * Efficiently checks if index is within any of the given ranges
 * Version: 1.14.34
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/ranges-is-index-within
 */

!function(e,n){"object"==typeof exports&&"undefined"!=typeof module?module.exports=n():"function"==typeof define&&define.amd?define(n):(e=e||self).rangesIsIndexWithin=n()}(this,(function(){"use strict";function e(e,n,r){return n in e?Object.defineProperty(e,n,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[n]=r,e}function n(e,n){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);n&&(t=t.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),r.push.apply(r,t)}return r}function r(r){for(var t=1;t<arguments.length;t++){var i=null!=arguments[t]?arguments[t]:{};t%2?n(Object(i),!0).forEach((function(n){e(r,n,i[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(r,Object.getOwnPropertyDescriptors(i)):n(Object(i)).forEach((function(e){Object.defineProperty(r,e,Object.getOwnPropertyDescriptor(i,e))}))}return r}var t=Array.isArray;return function(e,n,i){var o=r(r({},{inclusiveRangeEnds:!1,returnMatchedRangeInsteadOfTrue:!1}),i);return!!t(n)&&(o.returnMatchedRangeInsteadOfTrue?n.find((function(n){return o.inclusiveRangeEnds?e>=n[0]&&e<=n[1]:e>n[0]&&e<n[1]}))||!1:n.some((function(n){return o.inclusiveRangeEnds?e>=n[0]&&e<=n[1]:e>n[0]&&e<n[1]})))}}));
