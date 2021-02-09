/**
 * string-split-by-whitespace
 * Split string into array by chunks of whitespace
 * Version: 2.0.3
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/string-split-by-whitespace/
 */

!function(e,n){"object"==typeof exports&&"undefined"!=typeof module?n(exports):"function"==typeof define&&define.amd?define(["exports"],n):n((e="undefined"!=typeof globalThis?globalThis:e||self).stringSplitByWhitespace={})}(this,(function(e){"use strict";function n(e,n,r){return n in e?Object.defineProperty(e,n,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[n]=r,e}function r(e,n){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);n&&(t=t.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),r.push.apply(r,t)}return r}function t(e){for(var t=1;t<arguments.length;t++){var i=null!=arguments[t]?arguments[t]:{};t%2?r(Object(i),!0).forEach((function(r){n(e,r,i[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(i)):r(Object(i)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(i,n))}))}return e}var i={inclusiveRangeEnds:!1,returnMatchedRangeInsteadOfTrue:!1};function o(e,n,r){var o=t(t({},i),r);if(!Number.isInteger(e))throw new Error("ranges-is-index-within: [THROW_ID_01] the first input argument should be string index, a natural number (or zero). It was given as "+e+" (type "+typeof e+")");return!!Array.isArray(n)&&(o.returnMatchedRangeInsteadOfTrue?n.find((function(n){return o.inclusiveRangeEnds?e>=n[0]&&e<=n[1]:e>n[0]&&e<n[1]}))||!1:n.some((function(n){return o.inclusiveRangeEnds?e>=n[0]&&e<=n[1]:e>n[0]&&e<n[1]})))}e.splitByW=function(e,n){if(void 0===e)throw new Error("string-split-by-whitespace: [THROW_ID_01] The input is missing!");if("string"!=typeof e)return e;if(""===e.trim())return[];var r=t(t({},{ignoreRanges:[]}),n);if(r.ignoreRanges.length>0&&!r.ignoreRanges.every((function(e){return Array.isArray(e)})))throw new Error("string-split-by-whitespace: [THROW_ID_03] The opts.ignoreRanges contains elements which are not arrays!");for(var i=null,s=[],u=0,a=e.length;u<a;u++)null!==i||!e[u].trim()||r&&r.ignoreRanges&&r.ignoreRanges.length&&(!r.ignoreRanges.length||o(u,r.ignoreRanges.map((function(e){return[e[0],e[1]-1]})),{inclusiveRangeEnds:!0}))||(i=u),null!==i&&(e[u].trim()?r.ignoreRanges.length&&o(u,r.ignoreRanges)?(s.push(e.slice(i,u-1)),i=null):void 0===e[u+1]&&s.push(e.slice(i,u+1)):(s.push(e.slice(i,u)),i=null));return s},e.version="2.0.3",Object.defineProperty(e,"__esModule",{value:!0})}));
