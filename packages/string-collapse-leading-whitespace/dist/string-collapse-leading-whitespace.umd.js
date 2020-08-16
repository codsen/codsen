/**
 * string-collapse-leading-whitespace
 * Collapse the leading and trailing whitespace of a string
 * Version: 2.0.22
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/string-collapse-leading-whitespace
 */

!function(n,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):(n="undefined"!=typeof globalThis?globalThis:n||self).stringCollapseLeadingWhitespace=e()}(this,(function(){"use strict";function n(n){var e=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],t=arguments.length>2?arguments[2]:void 0;if(!(t.trim()||n.length&&"\n"!==t&&" "!==t&&" "===(e?n[n.length-1]:n[0])||n.length&&"\n"===(e?n[n.length-1]:n[0])&&"\n"!==t&&" "!==t))if(e){if(("\n"===t||" "===t)&&n.length&&" "===n[n.length-1])for(;n.length&&" "===n[n.length-1];)n.pop();n.push(" "===t||"\n"===t?t:" ")}else{if(("\n"===t||" "===t)&&n.length&&" "===n[0])for(;n.length&&" "===n[0];)n.shift();n.unshift(" "===t||"\n"===t?t:" ")}}return function(e,t){if("string"==typeof e&&e.length){var i,r,o=!1;if(e.includes("\r\n")&&(o=!0),i=t&&"number"==typeof t?t:1,""===e.trim()){var f=[];for(r=i,Array.from(e).forEach((function(e){("\n"!==e||r)&&("\n"===e&&(r-=1),n(f,!0,e))}));f.length>1&&" "===f[f.length-1];)f.pop();return f.join("")}var l=[];if(r=i,""===e[0].trim())for(var h=0,g=e.length;h<g&&!e[h].trim();h++)("\n"!==e[h]||r)&&("\n"===e[h]&&(r-=1),n(l,!0,e[h]));var a=[];if(r=i,""===e.slice(-1).trim())for(var c=e.length;c--&&!e[c].trim();)("\n"!==e[c]||r)&&("\n"===e[c]&&(r-=1),n(a,!1,e[c]));return o?"".concat(l.join("")).concat(e.trim()).concat(a.join("")).replace(/\n/g,"\r\n"):l.join("")+e.trim()+a.join("")}return e}}));
