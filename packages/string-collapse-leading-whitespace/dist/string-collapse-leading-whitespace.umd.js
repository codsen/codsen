/**
 * @name string-collapse-leading-whitespace
 * @fileoverview Collapse the leading and trailing whitespace of a string
 * @version 5.1.0
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/string-collapse-leading-whitespace/}
 */

!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t((e="undefined"!=typeof globalThis?globalThis:e||self).stringCollapseLeadingWhitespace={})}(this,(function(e){"use strict";e.collWhitespace=function(e,t=1){function i(e){return Array.from(e).reverse().join("")}function r(e,t,i){const r=i?"\n":"\r",n=i?"\r":"\n";if(!e)return e;let f=0,o="";for(let i=0,l=e.length;i<l;i++)(e[i]===r||e[i]===n&&e[i-1]!==r)&&f++,"\r\n".includes(e[i])||" "===e[i]?" "===e[i]?o+=e[i]:e[i]===r?f<=t&&(o+=e[i],e[i+1]===n&&(o+=e[i+1],i++)):e[i]===n&&(!e[i-1]||e[i-1]!==r)&&f<=t&&(o+=e[i]):e[i+1]||f||(o+=" ");return o}if("string"==typeof e&&e.length){let n=1;"number"==typeof+t&&Number.isInteger(+t)&&+t>=0&&(n=+t);let f="",o="";if(e.trim()){if(!e[0].trim())for(let t=0,i=e.length;t<i;t++)if(e[t].trim()){f=e.slice(0,t);break}}else f=e;if(e.trim()&&(""===e.slice(-1).trim()||" "===e.slice(-1)))for(let t=e.length;t--;)if(e[t].trim()){o=e.slice(t+1);break}return`${r(f,n,!1)}${e.trim()}${i(r(i(o),n,!0))}`}return e},e.version="5.1.0",Object.defineProperty(e,"__esModule",{value:!0})}));
