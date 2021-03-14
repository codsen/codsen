/**
 * string-collapse-leading-whitespace
 * Collapse the leading and trailing whitespace of a string
 * Version: 5.0.8
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/string-collapse-leading-whitespace/
 */

!function(e,r){"object"==typeof exports&&"undefined"!=typeof module?r(exports):"function"==typeof define&&define.amd?define(["exports"],r):r((e="undefined"!=typeof globalThis?globalThis:e||self).stringCollapseLeadingWhitespace={})}(this,(function(e){"use strict";e.collWhitespace=function(e,r){function i(e){return Array.from(e).reverse().join("")}function t(e,r,i){var t=i?"\n":"\r",n=i?"\r":"\n";if(!e)return e;for(var f=0,o="",s=0,l=e.length;s<l;s++)(e[s]===t||e[s]===n&&e[s-1]!==t)&&f++,"\r\n".includes(e[s])||" "===e[s]?" "===e[s]?o+=e[s]:e[s]===t?f<=r&&(o+=e[s],e[s+1]===n&&(o+=e[s+1],s++)):e[s]===n&&(!e[s-1]||e[s-1]!==t)&&f<=r&&(o+=e[s]):e[s+1]||f||(o+=" ");return o}if(void 0===r&&(r=1),"string"==typeof e&&e.length){var n=1;"number"==typeof+r&&Number.isInteger(+r)&&+r>=0&&(n=+r);var f="",o="";if(e.trim()){if(!e[0].trim())for(var s=0,l=e.length;s<l;s++)if(e[s].trim()){f=e.slice(0,s);break}}else f=e;if(e.trim()&&(""===e.slice(-1).trim()||" "===e.slice(-1)))for(var u=e.length;u--;)if(e[u].trim()){o=e.slice(u+1);break}return""+t(f,n,!1)+e.trim()+i(t(i(o),n,!0))}return e},e.version="5.0.8",Object.defineProperty(e,"__esModule",{value:!0})}));
