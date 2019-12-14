/**
 * ranges-sort
 * Sort natural number index ranges [ [5, 6], [1, 3] ] => [ [1, 3], [5, 6] ]
 * Version: 3.10.46
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/ranges-sort
 */

!function(e,r){"object"==typeof exports&&"undefined"!=typeof module?module.exports=r():"function"==typeof define&&define.amd?define(r):(e=e||self).rangesSort=r()}(this,(function(){"use strict";function e(r){return(e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(r)}
/*!
   * is-natural-number.js | MIT (c) Shinnosuke Watanabe
   * https://github.com/shinnn/is-natural-number.js
  */var r=function(e,r){if(r){if("object"!=typeof r)throw new TypeError(String(r)+" is not an object. Expected an object that has boolean `includeZero` property.");if("includeZero"in r){if("boolean"!=typeof r.includeZero)throw new TypeError(String(r.includeZero)+" is neither true nor false. `includeZero` option must be a Boolean value.");if(r.includeZero&&0===e)return!0}}return Number.isSafeInteger(e)&&e>=1},n=Array.isArray;return function(t,o){if(!n(t))throw new TypeError("ranges-sort: [THROW_ID_01] Input must be an array, consisting of range arrays! Currently its type is: ".concat(e(t),", equal to: ").concat(JSON.stringify(t,null,4)));if(0===t.length)return t;var i,s,a=Object.assign({},{strictlyTwoElementsInRangeArrays:!1,progressFn:null},o);if(a.strictlyTwoElementsInRangeArrays&&!t.every((function(e,r){return 2===e.length||(i=r,s=e.length,!1)})))throw new TypeError("ranges-sort: [THROW_ID_03] The first argument should be an array and must consist of arrays which are natural number indexes representing TWO string index ranges. However, ".concat(i,"th range (").concat(JSON.stringify(t[i],null,4),") has not two but ").concat(s," elements!"));if(!t.every((function(e,n){return!(!r(e[0],{includeZero:!0})||!r(e[1],{includeZero:!0}))||(i=n,!1)})))throw new TypeError("ranges-sort: [THROW_ID_04] The first argument should be an array and must consist of arrays which are natural number indexes representing string index ranges. However, ".concat(i,"th range (").concat(JSON.stringify(t[i],null,4),") does not consist of only natural numbers!"));var u=t.length*t.length,c=0;return Array.from(t).sort((function(e,r){return a.progressFn&&(c++,a.progressFn(Math.floor(100*c/u))),e[0]===r[0]?e[1]<r[1]?-1:e[1]>r[1]?1:0:e[0]<r[0]?-1:1}))}}));
