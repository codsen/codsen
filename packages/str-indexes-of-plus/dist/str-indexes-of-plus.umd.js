/**
 * str-indexes-of-plus
 * Search for a string in another string. Get array of indexes. Full Unicode support.
 * Version: 2.9.51
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/str-indexes-of-plus
 */

!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e=e||self).strIndexesOfPlus=t()}(this,(function(){"use strict";function e(t){return(e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(t)}
/*!
   * is-natural-number-string | MIT (c) Shinnosuke Watanabe
   * https://github.com/shinnn/is-natural-number-string
  */var t=function(e,t){if("string"!=typeof e)return!1;if(t&&"includeZero"in t){if("boolean"!=typeof t.includeZero)throw new TypeError(String(t.includeZero)+" is neither true nor false. `includeZero` option must be a Boolean value.");if(t.includeZero)return/^(-?0|[1-9]\d*)(\.0+)?$/.test(e)}return/^[1-9]\d*(\.0+)?$/.test(e)};function n(e){return null!=e}function r(e){return"string"==typeof e}return function(o,u,i){if(0===arguments.length)throw new Error("str-indexes-of-plus/strIndexesOfPlus(): inputs missing!");if(!r(o))throw new TypeError("str-indexes-of-plus/strIndexesOfPlus(): first input argument must be a string! Currently it's: ".concat(e(o)));if(!r(u))throw new TypeError("str-indexes-of-plus/strIndexesOfPlus(): second input argument must be a string! Currently it's: ".concat(e(u)));if(arguments.length>=3&&!Number.isInteger(i,{includeZero:!0})&&!t(i,{includeZero:!0}))throw new TypeError("str-indexes-of-plus/strIndexesOfPlus(): third input argument must be a natural number! Currently it's: ".concat(i));t(i,{includeZero:!0})&&(i=Number(i));var s=Array.from(o),f=Array.from(u);if(0===s.length||0===f.length||n(i)&&i>=s.length)return[];n(i)||(i=0);for(var l,c=[],p=!1,d=i,y=s.length;d<y;d++)p&&(s[d]===f[d-l]?d-l+1===f.length&&c.push(l):(l=null,p=!1)),p||s[d]===f[0]&&(1===f.length?c.push(d):(p=!0,l=d));return c}}));
