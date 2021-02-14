/**
 * ranges-iterate
 * Iterate a string and any changes within given string index ranges
 * Version: 2.0.5
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ranges-iterate/
 */

!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t((e="undefined"!=typeof globalThis?globalThis:e||self).rangesIterate={})}(this,(function(e){"use strict";e.rIterate=function(e,t,r,n){if(void 0===n&&(n=0),"string"!=typeof e)throw new TypeError("ranges-iterate: [THROW_ID_01] Input string must be a string! It was given as "+typeof e+", equal to: "+JSON.stringify(e,null,0));if(!e.length)throw new TypeError("ranges-iterate: [THROW_ID_02] Input string must be non-empty!");if(t&&!Array.isArray(t))throw new TypeError("ranges-iterate: [THROW_ID_03] Input ranges must be an array, consisting of zero or more arrays! Currently its type is: "+typeof t+", equal to: "+JSON.stringify(t,null,0));if(!r)throw new TypeError("ranges-iterate: [THROW_ID_04] You should provide a callback function as third input argument!");if("function"!=typeof r)throw new TypeError("ranges-iterate: [THROW_ID_05] The calllback function (third input argument) must be a function. It was given as: "+typeof r+", equal to: "+JSON.stringify(r,null,0));if(null!==t&&t.length){var i=Array.from(t),o=n,a=n;if(a<i[0][0])for(;a<i[0][0]&&e[a];a++,o++)r({i:a,val:e[a]});i[0][0]<=o&&i.forEach((function(t,n){if(t[2])for(var f=0,s=t[2].length;f<s;f++)r({i:a,val:t[2][f]}),a+=1;for(;o<t[1];)o+=1;var l=e.length;for(i[n+1]&&(l=i[n+1][0]);o<l;a++,o++)r({i:a,val:e[o]})}))}else for(var f=0;f<e.length;f++)r({i:f,val:e[f]})},e.version="2.0.5",Object.defineProperty(e,"__esModule",{value:!0})}));
