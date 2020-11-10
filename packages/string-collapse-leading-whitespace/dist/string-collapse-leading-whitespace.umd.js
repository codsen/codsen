/**
 * string-collapse-leading-whitespace
 * Collapse the leading and trailing whitespace of a string
 * Version: 3.0.3
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/string-collapse-leading-whitespace/
 */

!function(e,r){"object"==typeof exports&&"undefined"!=typeof module?module.exports=r():"function"==typeof define&&define.amd?define(r):(e="undefined"!=typeof globalThis?globalThis:e||self).stringCollapseLeadingWhitespace=r()}(this,(function(){"use strict";var e=" ";return function(r){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1;function t(e){return Array.from(e).reverse().join("")}function i(r,n,t){var i=t?"\n":"\r",f=t?"\r":"\n";if(!r)return r;for(var o=0,a="",c=0,l=r.length;c<l;c++)(r[c]===i||r[c]===f&&r[c-1]!==i)&&o++,"\r\n".includes(r[c])||r[c]===e?r[c]===e?a+=r[c]:r[c]===i?o<=n&&(a+=r[c],r[c+1]===f&&(a+=r[c+1],c++)):r[c]===f&&(!r[c-1]||r[c-1]!==i)&&o<=n&&(a+=r[c]):r[c+1]||o||(a+=" ");return a}if("string"==typeof r&&r.length){var f=1;"number"==typeof+n&&Number.isInteger(+n)&&+n>=0&&(f=+n);var o="",a="";if(r.trim()){if(!r[0].trim())for(var c=0,l=r.length;c<l;c++)if(r[c].trim()){o=r.slice(0,c);break}}else o=r;if(r.trim()&&(""===r.slice(-1).trim()||r.slice(-1)===e))for(var s=r.length;s--;)if(r[s].trim()){a=r.slice(s+1);break}return"".concat(i(o,f,!1)).concat(r.trim()).concat(t(i(t(a),f,!0)))}return r}}));
