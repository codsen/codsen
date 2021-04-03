/**
 * string-split-by-whitespace
 * Split string into array by chunks of whitespace
 * Version: 2.0.13
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/string-split-by-whitespace/
 */

!function(e,n){"object"==typeof exports&&"undefined"!=typeof module?n(exports):"function"==typeof define&&define.amd?define(["exports"],n):n((e="undefined"!=typeof globalThis?globalThis:e||self).stringSplitByWhitespace={})}(this,(function(e){"use strict";const n={inclusiveRangeEnds:!1,returnMatchedRangeInsteadOfTrue:!1};function i(e,i,r){const t={...n,...r};if(!Number.isInteger(e))throw new Error(`ranges-is-index-within: [THROW_ID_01] the first input argument should be string index, a natural number (or zero). It was given as ${e} (type ${typeof e})`);return!!Array.isArray(i)&&(t.returnMatchedRangeInsteadOfTrue?i.find((n=>t.inclusiveRangeEnds?e>=n[0]&&e<=n[1]:e>n[0]&&e<n[1]))||!1:i.some((n=>t.inclusiveRangeEnds?e>=n[0]&&e<=n[1]:e>n[0]&&e<n[1])))}e.splitByW=function(e,n){if(void 0===e)throw new Error("string-split-by-whitespace: [THROW_ID_01] The input is missing!");if("string"!=typeof e)return e;if(""===e.trim())return[];const r={ignoreRanges:[],...n};if(r.ignoreRanges.length>0&&!r.ignoreRanges.every((e=>Array.isArray(e))))throw new Error("string-split-by-whitespace: [THROW_ID_03] The opts.ignoreRanges contains elements which are not arrays!");let t=null;const s=[];for(let n=0,o=e.length;n<o;n++)null!==t||!e[n].trim()||r&&r.ignoreRanges&&r.ignoreRanges.length&&(!r.ignoreRanges.length||i(n,r.ignoreRanges.map((e=>[e[0],e[1]-1])),{inclusiveRangeEnds:!0}))||(t=n),null!==t&&(e[n].trim()?r.ignoreRanges.length&&i(n,r.ignoreRanges)?(s.push(e.slice(t,n-1)),t=null):void 0===e[n+1]&&s.push(e.slice(t,n+1)):(s.push(e.slice(t,n)),t=null));return s},e.version="2.0.13",Object.defineProperty(e,"__esModule",{value:!0})}));
