/**
 * string-collapse-leading-whitespace
 * Collapse the leading and trailing whitespace of a string
 * Version: 2.0.24
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/string-collapse-leading-whitespace/
 */

!function(n,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):(n="undefined"!=typeof globalThis?globalThis:n||self).stringCollapseLeadingWhitespace=e()}(this,(function(){"use strict";var n=" ";function e(e){var t=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],i=arguments.length>2?arguments[2]:void 0;if(!(i.trim()||e.length&&"\n"!==i&&i!==n&&" "===(t?e[e.length-1]:e[0])||e.length&&"\n"===(t?e[e.length-1]:e[0])&&"\n"!==i&&i!==n))if(t){if(("\n"===i||i===n)&&e.length&&" "===e[e.length-1])for(;e.length&&" "===e[e.length-1];)e.pop();e.push(i===n||"\n"===i?i:" ")}else{if(("\n"===i||i===n)&&e.length&&" "===e[0])for(;e.length&&" "===e[0];)e.shift();e.unshift(i===n||"\n"===i?i:" ")}}return function(n,t){if("string"==typeof n&&n.length){var i,r,o=!1;if(n.includes("\r\n")&&(o=!0),i=t&&"number"==typeof t?t:1,""===n.trim()){var f=[];for(r=i,Array.from(n).forEach((function(n){("\n"!==n||r)&&("\n"===n&&(r-=1),e(f,!0,n))}));f.length>1&&" "===f[f.length-1];)f.pop();return f.join("")}var l=[];if(r=i,""===n[0].trim())for(var h=0,g=n.length;h<g&&!n[h].trim();h++)("\n"!==n[h]||r)&&("\n"===n[h]&&(r-=1),e(l,!0,n[h]));var a=[];if(r=i,""===n.slice(-1).trim())for(var c=n.length;c--&&!n[c].trim();)("\n"!==n[c]||r)&&("\n"===n[c]&&(r-=1),e(a,!1,n[c]));return o?"".concat(l.join("")).concat(n.trim()).concat(a.join("")).replace(/\n/g,"\r\n"):l.join("")+n.trim()+a.join("")}return n}}));
