/**
 * string-collapse-leading-whitespace
 * Collapse the leading and trailing whitespace of a string
 * Version: 2.0.12
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/string-collapse-leading-whitespace
 */

!function(n,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(n=n||self).stringCollapseLeadingWhitespace=t()}(this,(function(){"use strict";function n(n){var t=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],e=arguments.length>2?arguments[2]:void 0;if(!(e.trim().length||n.length&&"\n"!==e&&" "!==e&&" "===(t?n[n.length-1]:n[0])||n.length&&"\n"===(t?n[n.length-1]:n[0])&&"\n"!==e&&" "!==e))if(t){if(("\n"===e||" "===e)&&n.length&&" "===n[n.length-1])for(;n.length&&" "===n[n.length-1];)n.pop();n.push(" "===e||"\n"===e?e:" ")}else{if(("\n"===e||" "===e)&&n.length&&" "===n[0])for(;n.length&&" "===n[0];)n.shift();n.unshift(" "===e||"\n"===e?e:" ")}}return function(t,e){if("string"==typeof t&&t.length){var i,r,o=!1;if(t.includes("\r\n")&&(o=!0),i=e&&"number"==typeof e?e:1,""===t.trim()){var f=[];for(r=i,Array.from(t).forEach((function(t){("\n"!==t||r)&&("\n"===t&&r--,n(f,!0,t))}));f.length>1&&" "===f[f.length-1];)f.pop();return f.join("")}var l=[];if(r=i,""===t[0].trim())for(var h=0,g=t.length;h<g&&0===t[h].trim().length;h++)("\n"!==t[h]||r)&&("\n"===t[h]&&r--,n(l,!0,t[h]));var c=[];if(r=i,""===t.slice(-1).trim())for(var u=t.length;u--&&0===t[u].trim().length;)("\n"!==t[u]||r)&&("\n"===t[u]&&r--,n(c,!1,t[u]));return o?"".concat(l.join("")).concat(t.trim()).concat(c.join("")).replace(/\n/g,"\r\n"):l.join("")+t.trim()+c.join("")}return t}}));
