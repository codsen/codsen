/**
 * @name str-indexes-of-plus
 * @fileoverview Like indexOf but returns array and counts per-grapheme
 * @version 4.0.5
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/str-indexes-of-plus/}
 */

!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t((e="undefined"!=typeof globalThis?globalThis:e||self).strIndexesOfPlus={})}(this,(function(e){"use strict";e.strIndexesOfPlus=function(e,t,n=0){if("string"!=typeof e)throw new TypeError("str-indexes-of-plus/strIndexesOfPlus(): first input argument must be a string! Currently it's: "+typeof e);if("string"!=typeof t)throw new TypeError("str-indexes-of-plus/strIndexesOfPlus(): second input argument must be a string! Currently it's: "+typeof t);if(isNaN(+n)||"string"==typeof n&&!/^\d*$/.test(n))throw new TypeError(`str-indexes-of-plus/strIndexesOfPlus(): third input argument must be a natural number! Currently it's: ${n}`);const r=Array.from(e),s=Array.from(t);if(0===r.length||0===s.length||null!=n&&+n>=r.length)return[];n||(n=0);const o=[];let u,f=!1;for(let e=n,t=r.length;e<t;e++)f&&(r[e]===s[e-+u]?e-+u+1===s.length&&o.push(+u):(u=null,f=!1)),f||r[e]===s[0]&&(1===s.length?o.push(e):(f=!0,u=e));return o},e.version="4.0.5",Object.defineProperty(e,"__esModule",{value:!0})}));
