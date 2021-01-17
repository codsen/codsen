/**
 * line-column-mini
 * Convert string index to line-column position
 * Version: 1.0.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/line-column-mini/
 */

!function(e,n){"object"==typeof exports&&"undefined"!=typeof module?n(exports):"function"==typeof define&&define.amd?define(["exports"],n):n((e="undefined"!=typeof globalThis?globalThis:e||self).lineColumnMini={})}(this,(function(e){"use strict";function n(e,n){for(var r=0,t=n.length-2;r<t;){var i=r+(t-r>>1);if(e<n[i])t=i-1;else{if(!(e>=n[i+1])){r=i;break}r=i+1}}return r}function r(e){return e.split(/\n|\r(?!\n)/g).reduce((function(e,n){return e.push(e[e.length-1]+n.length+1),e}),[0])}e.getLineStartIndexes=r,e.lineCol=function(e,t){if(!Array.isArray(e)&&"string"!=typeof e||("string"==typeof e||Array.isArray(e))&&!e.length)return null;if("number"!=typeof t||"string"==typeof e&&t>=e.length||Array.isArray(e)&&t+1>=e[e.length-1])return null;if("string"==typeof e){var i=r(e),o=n(t,i);return{col:t-i[o]+1,line:o+1}}var f=n(t,e);return{col:t-e[f]+1,line:f+1}},e.version="1.0.0",Object.defineProperty(e,"__esModule",{value:!0})}));
