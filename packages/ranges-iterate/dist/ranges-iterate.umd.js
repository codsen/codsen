/**
 * ranges-iterate
 * Iterate a string and any changes within already existing ranges
 * Version: 1.1.38
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/ranges-iterate
 */

!function(t,n){"object"==typeof exports&&"undefined"!=typeof module?module.exports=n():"function"==typeof define&&define.amd?define(n):(t=t||self).rangesIterate=n()}(this,(function(){"use strict";function t(n){return(t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(n)}var n=Array.isArray;return function(r,e,o){var i=arguments.length>3&&void 0!==arguments[3]?arguments[3]:0;if("string"!=typeof r)throw new TypeError("ranges-iterate: [THROW_ID_01] Input string must be a string! It was given as ".concat(t(r),", equal to: ").concat(JSON.stringify(r,null,0)));if(!r.length)throw new TypeError("ranges-iterate: [THROW_ID_02] Input string must be non-empty!");if(null!==e&&!n(e))throw new TypeError("ranges-iterate: [THROW_ID_03] Input ranges must be an array, consisting of zero or more arrays! Currently its type is: ".concat(t(e),", equal to: ").concat(JSON.stringify(e,null,0)));if(!o)throw new TypeError("ranges-iterate: [THROW_ID_04] You should provide a callback function as third input argument!");if("function"!=typeof o)throw new TypeError("ranges-iterate: [THROW_ID_05] The calllback function (third input argument) must be a function. It was given as: ".concat(t(o),", equal to: ").concat(JSON.stringify(o,null,0)));if(null!==e&&e.length){var a=Array.from(e),f=i,u=i;if(u<a[0][0])for(;u<a[0][0]&&r[u];u++,f++)o({i:u,val:r[u]});a[0][0]<=f&&a.forEach((function(t,n){if(t[2])for(var e=0,i=t[2].length;e<i;e++)o({i:u,val:t[2][e]}),u+=1;for(;f<t[1];)f+=1;var l=r.length;for(a[n+1]&&(l=a[n+1][0]);f<l;u++,f++)o({i:u,val:r[f]})}))}else for(var l=0;l<r.length;l++)o({i:l,val:r[l]})}}));
