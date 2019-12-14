/**
 * string-collapse-leading-whitespace
 * Collapse the leading and trailing whitespace of a string
 * Version: 2.0.10
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/string-collapse-leading-whitespace
 */

!function(n,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(n=n||self).stringCollapseLeadingWhitespace=t()}(this,(function(){"use strict";var n=" ";function t(t){var e=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],i=arguments.length>2?arguments[2]:void 0;if(!(i.trim().length||t.length&&"\n"!==i&&i!==n&&" "===(e?t[t.length-1]:t[0])||t.length&&"\n"===(e?t[t.length-1]:t[0])&&"\n"!==i&&i!==n))if(e){if(("\n"===i||i===n)&&t.length&&" "===t[t.length-1])for(;t.length&&" "===t[t.length-1];)t.pop();t.push(i===n||"\n"===i?i:" ")}else{if(("\n"===i||i===n)&&t.length&&" "===t[0])for(;t.length&&" "===t[0];)t.shift();t.unshift(i===n||"\n"===i?i:" ")}}return function(n,e){if("string"==typeof n&&n.length){var i,r,o=!1;if(n.includes("\r\n")&&(o=!0),i=e&&"number"==typeof e?e:1,""===n.trim()){var f=[];for(r=i,Array.from(n).forEach((function(n){("\n"!==n||r)&&("\n"===n&&r--,t(f,!0,n))}));f.length>1&&" "===f[f.length-1];)f.pop();return f.join("")}var l=[];if(r=i,""===n[0].trim())for(var h=0,g=n.length;h<g&&0===n[h].trim().length;h++)("\n"!==n[h]||r)&&("\n"===n[h]&&r--,t(l,!0,n[h]));var c=[];if(r=i,""===n.slice(-1).trim())for(var a=n.length;a--&&0===n[a].trim().length;)("\n"!==n[a]||r)&&("\n"===n[a]&&r--,t(c,!1,n[a]));return o?"".concat(l.join("")).concat(n.trim()).concat(c.join("")).replace(/\n/g,"\r\n"):l.join("")+n.trim()+c.join("")}return n}}));
