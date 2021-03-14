/**
 * ast-monkey-util
 * Utility library of AST helper functions
 * Version: 1.3.8
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ast-monkey-util/
 */

!function(e,n){"object"==typeof exports&&"undefined"!=typeof module?n(exports):"function"==typeof define&&define.amd?define(["exports"],n):n((e="undefined"!=typeof globalThis?globalThis:e||self).astMonkeyUtil={})}(this,(function(e){"use strict";e.parent=function(e){if(e.includes(".")){var n=e.lastIndexOf(".");if(!e.slice(0,n).includes("."))return e.slice(0,n);for(var t=n-1;t--;)if("."===e[t])return e.slice(t+1,n)}return null},e.pathNext=function(e){return e.includes(".")&&/^\d*$/.test(e.slice(e.lastIndexOf(".")+1))?""+e.slice(0,e.lastIndexOf(".")+1)+(+e.slice(e.lastIndexOf(".")+1)+1):/^\d*$/.test(e)?""+(+e+1):e},e.pathPrev=function(e){if(!e)return null;var n=e.slice(e.lastIndexOf(".")+1);return"0"===n?null:e.includes(".")&&/^\d*$/.test(n)?""+e.slice(0,e.lastIndexOf(".")+1)+(+e.slice(e.lastIndexOf(".")+1)-1):/^\d*$/.test(e)?""+(+e-1):null},e.pathUp=function(e){if(e.includes(".")&&e.slice(e.indexOf(".")+1).includes("."))for(var n=0,t=e.length;t--;)if("."===e[t]&&(n+=1),2===n)return e.slice(0,t);return"0"},e.version="1.3.8",Object.defineProperty(e,"__esModule",{value:!0})}));
