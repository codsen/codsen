/**
 * ranges-is-index-within
 * Efficiently checks if index is within any of the given ranges
 * Version: 1.14.28
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/ranges-is-index-within
 */

!function(e,n){"object"==typeof exports&&"undefined"!=typeof module?module.exports=n():"function"==typeof define&&define.amd?define(n):(e=e||self).rangesIsIndexWithin=n()}(this,(function(){"use strict";var e=Array.isArray;return function(n,t,i){var r=Object.assign(Object.assign({},{inclusiveRangeEnds:!1,returnMatchedRangeInsteadOfTrue:!1}),i);return!!e(t)&&(r.returnMatchedRangeInsteadOfTrue?t.find((function(e){return r.inclusiveRangeEnds?n>=e[0]&&n<=e[1]:n>e[0]&&n<e[1]}))||!1:t.some((function(e){return r.inclusiveRangeEnds?n>=e[0]&&n<=e[1]:n>e[0]&&n<e[1]})))}}));
