/**
 * ranges-is-index-within
 * Checks if index is within any of the given string index ranges
 * Version: 2.0.10
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ranges-is-index-within/
 */

!function(e,n){"object"==typeof exports&&"undefined"!=typeof module?n(exports):"function"==typeof define&&define.amd?define(["exports"],n):n((e="undefined"!=typeof globalThis?globalThis:e||self).rangesIsIndexWithin={})}(this,(function(e){"use strict";const n={inclusiveRangeEnds:!1,returnMatchedRangeInsteadOfTrue:!1};e.defaults=n,e.isIndexWithin=function(e,t,i){const s={...n,...i};if(!Number.isInteger(e))throw new Error(`ranges-is-index-within: [THROW_ID_01] the first input argument should be string index, a natural number (or zero). It was given as ${e} (type ${typeof e})`);return!!Array.isArray(t)&&(s.returnMatchedRangeInsteadOfTrue?t.find((n=>s.inclusiveRangeEnds?e>=n[0]&&e<=n[1]:e>n[0]&&e<n[1]))||!1:t.some((n=>s.inclusiveRangeEnds?e>=n[0]&&e<=n[1]:e>n[0]&&e<n[1])))},e.version="2.0.10",Object.defineProperty(e,"__esModule",{value:!0})}));
