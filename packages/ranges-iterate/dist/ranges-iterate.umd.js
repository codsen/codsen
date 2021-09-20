/**
 * @name ranges-iterate
 * @fileoverview Iterate a string and any changes within given string index ranges
 * @version 3.0.2
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/ranges-iterate/}
 */

!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t((e="undefined"!=typeof globalThis?globalThis:e||self).rangesIterate={})}(this,(function(e){"use strict";e.rIterate=function(e,t,r,n=0){if("string"!=typeof e)throw new TypeError(`ranges-iterate: [THROW_ID_01] Input string must be a string! It was given as ${typeof e}, equal to: ${JSON.stringify(e,null,0)}`);if(!e.length)throw new TypeError("ranges-iterate: [THROW_ID_02] Input string must be non-empty!");if(t&&!Array.isArray(t))throw new TypeError(`ranges-iterate: [THROW_ID_03] Input ranges must be an array, consisting of zero or more arrays! Currently its type is: ${typeof t}, equal to: ${JSON.stringify(t,null,0)}`);if(!r)throw new TypeError("ranges-iterate: [THROW_ID_04] You should provide a callback function as third input argument!");if("function"!=typeof r)throw new TypeError(`ranges-iterate: [THROW_ID_05] The calllback function (third input argument) must be a function. It was given as: ${typeof r}, equal to: ${JSON.stringify(r,null,0)}`);if(null!==t&&t.length){const i=Array.from(t);let o=n,a=n;if(a<i[0][0])for(;a<i[0][0]&&e[a];a++,o++)r({i:a,val:e[a]});i[0][0]<=o&&i.forEach(((t,n)=>{if(t[2])for(let e=0,n=t[2].length;e<n;e++)r({i:a,val:t[2][e]}),a+=1;for(;o<t[1];)o+=1;let f=e.length;for(i[n+1]&&(f=i[n+1][0]);o<f;a++,o++)r({i:a,val:e[o]})}))}else for(let t=0;t<e.length;t++)r({i:t,val:e[t]})},e.version="3.0.2",Object.defineProperty(e,"__esModule",{value:!0})}));
