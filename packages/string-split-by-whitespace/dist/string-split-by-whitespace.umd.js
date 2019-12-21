/**
 * string-split-by-whitespace
 * Split string into array by chunks of whitespace
 * Version: 1.6.54
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/string-split-by-whitespace
 */

!function(e,n){"object"==typeof exports&&"undefined"!=typeof module?module.exports=n():"function"==typeof define&&define.amd?define(n):(e=e||self).stringSplitByWhitespace=n()}(this,(function(){"use strict";const e=Array.isArray;function n(n,i,r){const t=Object.assign(Object.assign({},{inclusiveRangeEnds:!1,returnMatchedRangeInsteadOfTrue:!1}),r);return!!e(i)&&(t.returnMatchedRangeInsteadOfTrue?i.find(e=>t.inclusiveRangeEnds?n>=e[0]&&n<=e[1]:n>e[0]&&n<e[1])||!1:i.some(e=>t.inclusiveRangeEnds?n>=e[0]&&n<=e[1]:n>e[0]&&n<e[1]))}return function(e,i){if(void 0===e)throw new Error("string-split-by-whitespace: [THROW_ID_01] The input is missing!");if("string"!=typeof e)return e;if(""===e.trim())return[];var r=Object.assign({},{ignoreRanges:[]},i);if(r.ignoreRanges.length>0&&!r.ignoreRanges.every((function(e){return Array.isArray(e)})))throw new Error("string-split-by-whitespace: [THROW_ID_03] The opts.ignoreRanges contains elements which are not arrays!");for(var t=null,s=[],o=0,a=e.length;o<a;o++)null!==t||""===e[o].trim()||0!==r.ignoreRanges.length&&(0===r.ignoreRanges.length||n(o,r.ignoreRanges.map((function(e){return[e[0],e[1]-1]})),{inclusiveRangeEnds:!0}))||(t=o),null!==t&&(""===e[o].trim()?(s.push(e.slice(t,o)),t=null):r.ignoreRanges.length&&n(o,r.ignoreRanges)?(s.push(e.slice(t,o-1)),t=null):void 0===e[o+1]&&s.push(e.slice(t,o+1)));return s}}));
