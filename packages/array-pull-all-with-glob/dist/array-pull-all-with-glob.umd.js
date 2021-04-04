/**
 * @name array-pull-all-with-glob
 * @fileoverview Like _.pullAll but with globs (wildcards)
 * @version 5.0.14
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/array-pull-all-with-glob/}
 */

!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t((e="undefined"!=typeof globalThis?globalThis:e||self).arrayPullAllWithGlob={})}(this,(function(e){"use strict";const t=new Map;function r(e,t){if(!Array.isArray(e))switch(typeof e){case"string":e=[e];break;case"undefined":e=[];break;default:throw new TypeError(`Expected '${t}' to be a string or an array, but got a type of '${typeof e}'`)}return e.filter((e=>{if("string"!=typeof e){if(void 0===e)return!1;throw new TypeError(`Expected '${t}' to be an array of strings, but found a type of '${typeof e}' in the array`)}return!0}))}function n(e,r){r={caseSensitive:!1,...r};const n=e+JSON.stringify(r);if(t.has(n))return t.get(n);const o="!"===e[0];o&&(e=e.slice(1)),e=(e=>{if("string"!=typeof e)throw new TypeError("Expected a string");return e.replace(/[|\\{}()[\]^$+*?.]/g,"\\$&").replace(/-/g,"\\x2d")})(e).replace(/\\\*/g,"[\\s\\S]*");const s=new RegExp(`^${e}$`,r.caseSensitive?"":"i");return s.negated=o,t.set(n,s),s}var o=(e,t,o)=>{if(e=r(e,"inputs"),0===(t=r(t,"patterns")).length)return[];const s="!"===t[0][0];t=t.map((e=>n(e,o)));const i=[];for(const r of e){let e=s;for(const n of t)n.test(r)&&(e=!n.negated);e&&i.push(r)}return i};o.isMatch=(e,t,o)=>(e=r(e,"inputs"),0!==(t=r(t,"patterns")).length&&e.some((e=>t.every((t=>{const r=n(t,o),s=r.test(e);return r.negated?!s:s})))));e.pull=function(e,t,r){if(!e.length)return[];if(!e.length||!t.length)return Array.from(e);const n="string"==typeof t?[t]:Array.from(t),s={caseSensitive:!0,...r};return Array.from(e).filter((e=>!n.some((t=>o.isMatch(e,t,{caseSensitive:s.caseSensitive})))))},e.version="5.0.14",Object.defineProperty(e,"__esModule",{value:!0})}));
