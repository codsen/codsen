/**
 * str-indexes-of-plus
 * Like indexOf but returns array and counts per-grapheme
 * Version: 2.11.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/str-indexes-of-plus/
 */

const t="2.11.0";function r(t,r,e=0){if("string"!=typeof t)throw new TypeError("str-indexes-of-plus/strIndexesOfPlus(): first input argument must be a string! Currently it's: "+typeof t);if("string"!=typeof r)throw new TypeError("str-indexes-of-plus/strIndexesOfPlus(): second input argument must be a string! Currently it's: "+typeof r);if(isNaN(+e)||"string"==typeof e&&!/^\d*$/.test(e))throw new TypeError(`str-indexes-of-plus/strIndexesOfPlus(): third input argument must be a natural number! Currently it's: ${e}`);const n=Array.from(t),s=Array.from(r);if(0===n.length||0===s.length||null!=e&&+e>=n.length)return[];e||(e=0);const u=[];let o,i=!1;for(let t=e,r=n.length;t<r;t++)i&&(n[t]===s[t-+o]?t-+o+1===s.length&&u.push(+o):(o=null,i=!1)),i||n[t]===s[0]&&(1===s.length?u.push(t):(i=!0,o=t));return u}export{r as strIndexesOfPlus,t as version};
