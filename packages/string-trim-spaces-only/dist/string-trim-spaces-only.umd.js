/**
 * @name string-trim-spaces-only
 * @fileoverview Like String.trim() but you can choose granularly what to trim
 * @version 3.1.0
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/string-trim-spaces-only/}
 */

!function(e,n){"object"==typeof exports&&"undefined"!=typeof module?n(exports):"function"==typeof define&&define.amd?define(["exports"],n):n((e="undefined"!=typeof globalThis?globalThis:e||self).stringTrimSpacesOnly={})}(this,(function(e){"use strict";const n={classicTrim:!1,cr:!1,lf:!1,tab:!1,space:!0,nbsp:!1};e.defaults=n,e.trimSpaces=function(e,t){if("string"!=typeof e)throw new Error(`string-trim-spaces-only: [THROW_ID_01] input must be string! It was given as ${typeof e}, equal to:\n${JSON.stringify(e,null,4)}`);const s={...n,...t};function r(e){return s.classicTrim&&!e.trim()||!s.classicTrim&&(s.space&&" "===e||s.cr&&"\r"===e||s.lf&&"\n"===e||s.tab&&"\t"===e||s.nbsp&&" "===e)}let i,l;if(e.length){if(r(e[0]))for(let n=0,t=e.length;n<t;n++){if(!r(e[n])){i=n;break}if(n===e.length-1)return{res:"",ranges:[[0,e.length]]}}if(r(e[e.length-1]))for(let n=e.length;n--;)if(!r(e[n])){l=n+1;break}return i?l?{res:e.slice(i,l),ranges:[[0,i],[l,e.length]]}:{res:e.slice(i),ranges:[[0,i]]}:l?{res:e.slice(0,l),ranges:[[l,e.length]]}:{res:e,ranges:[]}}return{res:"",ranges:[]}},e.version="3.1.0",Object.defineProperty(e,"__esModule",{value:!0})}));
