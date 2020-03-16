/**
 * ast-monkey-util
 * Utility library of various AST helper functions
 * Version: 1.1.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/ast-monkey-util
 */

!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t((e=e||self).astMonkeyUtil={})}(this,(function(e){"use strict";e.pathNext=function(e){return"string"==typeof e&&e.length?e.includes(".")&&/^\d*$/.test(e.slice(e.lastIndexOf(".")+1))?"".concat(e.slice(0,e.lastIndexOf(".")+1)).concat(+e.slice(e.lastIndexOf(".")+1)+1):/^\d*$/.test(e)?"".concat(+e+1):e:e},e.pathPrev=function(e){if("string"!=typeof e||!e.length)return null;var t=e.slice(e.lastIndexOf(".")+1);return"0"===t?null:e.includes(".")&&/^\d*$/.test(t)?"".concat(e.slice(0,e.lastIndexOf(".")+1)).concat(+e.slice(e.lastIndexOf(".")+1)-1):/^\d*$/.test(e)?"".concat(+e-1):null},e.pathUp=function(e){if("string"==typeof e){if(!e.includes(".")||!e.slice(e.indexOf(".")+1).includes("."))return null;for(var t=0,n=e.length;n--;)if("."===e[n]&&t++,2===t)return e.slice(0,n)}return e},Object.defineProperty(e,"__esModule",{value:!0})}));
