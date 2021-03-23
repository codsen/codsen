/**
 * str-indexes-of-plus
 * Like indexOf but returns array and counts per-grapheme
 * Version: 3.0.9
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/str-indexes-of-plus/
 */

!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t((e="undefined"!=typeof globalThis?globalThis:e||self).strIndexesOfPlus={})}(this,(function(e){"use strict";e.strIndexesOfPlus=function(e,t,r){if(void 0===r&&(r=0),"string"!=typeof e)throw new TypeError("str-indexes-of-plus/strIndexesOfPlus(): first input argument must be a string! Currently it's: "+typeof e);if("string"!=typeof t)throw new TypeError("str-indexes-of-plus/strIndexesOfPlus(): second input argument must be a string! Currently it's: "+typeof t);if(isNaN(+r)||"string"==typeof r&&!/^\d*$/.test(r))throw new TypeError("str-indexes-of-plus/strIndexesOfPlus(): third input argument must be a natural number! Currently it's: "+r);var n=Array.from(e),s=Array.from(t);if(0===n.length||0===s.length||null!=r&&+r>=n.length)return[];r||(r=0);for(var u,i=[],o=!1,f=r,l=n.length;f<l;f++)o&&(n[f]===s[f-+u]?f-+u+1===s.length&&i.push(+u):(u=null,o=!1)),o||n[f]===s[0]&&(1===s.length?i.push(f):(o=!0,u=f));return i},e.version="3.0.9",Object.defineProperty(e,"__esModule",{value:!0})}));
