/**
 * ranges-iterate
 * Iterate a string and any changes within already existing ranges
 * Version: 1.0.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/ranges-iterate
 */

!function(t,n){"object"==typeof exports&&"undefined"!=typeof module?module.exports=n():"function"==typeof define&&define.amd?define(n):(t=t||self).rangesIterate=n()}(this,function(){"use strict";function t(n){return(t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(n)}var n=Array.isArray;return function(e,r,o){var i=arguments.length>3&&void 0!==arguments[3]?arguments[3]:0;if("string"!=typeof e)throw new TypeError("ranges-iterate: [THROW_ID_01] Input string must be a string! It was given as ".concat(t(e),", equal to: ").concat(JSON.stringify(e,null,0)));if(!e.length)throw new TypeError("ranges-iterate: [THROW_ID_02] Input string must be non-empty!");if(null!==r&&!n(r))throw new TypeError("ranges-iterate: [THROW_ID_03] Input ranges must be an array, consisting of zero or more arrays! Currently its type is: ".concat(t(r),", equal to: ").concat(JSON.stringify(r,null,0)));if(!o)throw new TypeError("ranges-iterate: [THROW_ID_04] You should provide a callback function as third input argument!");if("function"!=typeof o)throw new TypeError("ranges-iterate: [THROW_ID_05] The calllback function (third input argument) must be a function. It was given as: ".concat(t(o),", equal to: ").concat(JSON.stringify(o,null,0)));if(null!==r&&r.length){var a=i,f=i;if(f<r[0][0])for(;f<r[0][0]&&e[f];f++,a++)o({i:f,val:e[f]});r[0][0]<=a&&r.forEach(function(t,n){if(t[2])for(var i=0,u=t[2].length;i<u;i++)o({i:f,val:t[2][i]}),f++;for(;a<t[1];)a++;var l=e.length;for(r[n+1]&&(l=r[n+1][0]);a<l;f++,a++)o({i:f,val:e[a]})})}else for(var u=0;u<e.length;u++)o({i:u,val:e[u]})}});
