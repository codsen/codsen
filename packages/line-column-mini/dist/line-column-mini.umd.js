/**
 * @name line-column-mini
 * @fileoverview Convert string index to line-column position
 * @version 1.1.16
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/line-column-mini/}
 */

!function(e,n){"object"==typeof exports&&"undefined"!=typeof module?n(exports):"function"==typeof define&&define.amd?define(["exports"],n):n((e="undefined"!=typeof globalThis?globalThis:e||self).lineColumnMini={})}(this,(function(e){"use strict";function n(e,n){let t=0,r=n.length-2;for(;t<r;){const i=t+(r-t>>1);if(e<n[i])r=i-1;else{if(!(e>=n[i+1])){t=i;break}t=i+1}}return t}function t(e){return e.split(/\n|\r(?!\n)/g).reduce(((e,n)=>(e.push(e[e.length-1]+n.length+1),e)),[0])}e.getLineStartIndexes=t,e.lineCol=function(e,r,i=!1){if(!i&&(!Array.isArray(e)&&"string"!=typeof e||("string"==typeof e||Array.isArray(e))&&!e.length))return null;if(!i&&("number"!=typeof r||"string"==typeof e&&r>=e.length||Array.isArray(e)&&r+1>=e[e.length-1]))return null;if("string"==typeof e){const i=t(e),o=n(r,i);return{col:r-i[o]+1,line:o+1}}const o=n(r,e);return{col:r-e[o]+1,line:o+1}},e.version="1.1.16",Object.defineProperty(e,"__esModule",{value:!0})}));
