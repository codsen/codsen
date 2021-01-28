/**
 * line-column-mini
 * Convert string index to line-column position
 * Version: 1.1.1
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/line-column-mini/
 */

!function(e,n){"object"==typeof exports&&"undefined"!=typeof module?n(exports):"function"==typeof define&&define.amd?define(["exports"],n):n((e="undefined"!=typeof globalThis?globalThis:e||self).lineColumnMini={})}(this,(function(e){"use strict";function n(e,n){for(var r=0,t=n.length-2;r<t;){var i=r+(t-r>>1);if(e<n[i])t=i-1;else{if(!(e>=n[i+1])){r=i;break}r=i+1}}return r}function r(e){return e.split(/\n|\r(?!\n)/g).reduce((function(e,n){return e.push(e[e.length-1]+n.length+1),e}),[0])}e.getLineStartIndexes=r,e.lineCol=function(e,t,i){if(void 0===i&&(i=!1),!i&&(!Array.isArray(e)&&"string"!=typeof e||("string"==typeof e||Array.isArray(e))&&!e.length))return null;if(!i&&("number"!=typeof t||"string"==typeof e&&t>=e.length||Array.isArray(e)&&t+1>=e[e.length-1]))return null;if("string"==typeof e){var o=r(e),f=n(t,o);return{col:t-o[f]+1,line:f+1}}var l=n(t,e);return{col:t-e[l]+1,line:l+1}},e.version="1.1.1",Object.defineProperty(e,"__esModule",{value:!0})}));
