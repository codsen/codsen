/**
 * ast-monkey-util
 * Utility library of AST helper functions
 * Version: 1.3.11
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ast-monkey-util/
 */

!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t((e="undefined"!=typeof globalThis?globalThis:e||self).astMonkeyUtil={})}(this,(function(e){"use strict";e.parent=function(e){if(e.includes(".")){const t=e.lastIndexOf(".");if(!e.slice(0,t).includes("."))return e.slice(0,t);for(let n=t-1;n--;)if("."===e[n])return e.slice(n+1,t)}return null},e.pathNext=function(e){return e.includes(".")&&/^\d*$/.test(e.slice(e.lastIndexOf(".")+1))?`${e.slice(0,e.lastIndexOf(".")+1)}${+e.slice(e.lastIndexOf(".")+1)+1}`:/^\d*$/.test(e)?""+(+e+1):e},e.pathPrev=function(e){if(!e)return null;const t=e.slice(e.lastIndexOf(".")+1);return"0"===t?null:e.includes(".")&&/^\d*$/.test(t)?`${e.slice(0,e.lastIndexOf(".")+1)}${+e.slice(e.lastIndexOf(".")+1)-1}`:/^\d*$/.test(e)?""+(+e-1):null},e.pathUp=function(e){if(e.includes(".")&&e.slice(e.indexOf(".")+1).includes(".")){let t=0;for(let n=e.length;n--;)if("."===e[n]&&(t+=1),2===t)return e.slice(0,n)}return"0"},e.version="1.3.11",Object.defineProperty(e,"__esModule",{value:!0})}));
