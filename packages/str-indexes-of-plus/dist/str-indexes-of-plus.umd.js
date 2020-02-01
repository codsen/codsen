/**
 * str-indexes-of-plus
 * Search for a string in another string. Get array of indexes. Full Unicode support.
 * Version: 2.10.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/str-indexes-of-plus
 */

!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):(t=t||self).strIndexesOfPlus=e()}(this,(function(){"use strict";function t(e){return(t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(e)}function e(t){return null!=t}function n(t){return"string"==typeof t}return function(r,o,s){if(0===arguments.length)throw new Error("str-indexes-of-plus/strIndexesOfPlus(): inputs missing!");if(!n(r))throw new TypeError("str-indexes-of-plus/strIndexesOfPlus(): first input argument must be a string! Currently it's: ".concat(t(r)));if(!n(o))throw new TypeError("str-indexes-of-plus/strIndexesOfPlus(): second input argument must be a string! Currently it's: ".concat(t(o)));if(arguments.length>=3&&!Number.isInteger(s)&&(!n(s)||!/^\d*$/.test(s)))throw new TypeError("str-indexes-of-plus/strIndexesOfPlus(): third input argument must be a natural number! Currently it's: ".concat(s));/^\d*$/.test(s)&&(s=Number(s));var u=Array.from(r),f=Array.from(o);if(0===u.length||0===f.length||e(s)&&s>=u.length)return[];e(s)||(s=0);for(var i,l=[],p=!1,y=s,c=u.length;y<c;y++)p&&(u[y]===f[y-i]?y-i+1===f.length&&l.push(i):(i=null,p=!1)),p||u[y]===f[0]&&(1===f.length?l.push(y):(p=!0,i=y));return l}}));
