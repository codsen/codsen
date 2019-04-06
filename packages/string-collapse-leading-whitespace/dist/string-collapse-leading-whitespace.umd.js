/**
 * string-collapse-leading-whitespace
 * Collapse the leading and trailing whitespace of a string
 * Version: 1.12.20
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/string-collapse-leading-whitespace
 */

!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e=e||self).stringCollapseLeadingWhitespace=t()}(this,function(){"use strict";return function(e,t){var n;if(n=t&&"number"==typeof t?t:1,"string"==typeof e){if(0===e.length)return"";if(""===e.trim()){var r=(e.match(/\n/g)||[]).length;return r?"\n".repeat(Math.min(r,n)):" "}var i="";if(""===e[0].trim()){i=" ";for(var f=0,a=0,o=e.length;a<o&&("\n"===e[a]&&f++,0===e[a].trim().length);a++);f&&(i="\n".repeat(Math.min(f,n)))}var m="";if(""===e.slice(-1).trim()){m=" ";for(var u=0,h=e.length;h--&&("\n"===e[h]&&u++,0===e[h].trim().length););u&&(m="\n".repeat(Math.min(u,n)))}return i+e.trim()+m}return e}});
