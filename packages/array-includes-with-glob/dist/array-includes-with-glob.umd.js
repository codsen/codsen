/**
 * array-includes-with-glob
 * like _.includes but with wildcards
 * Version: 2.12.35
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/array-includes-with-glob
 */

!function(r,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):(r=r||self).arrayIncludesWithGlob=e()}(this,(function(){"use strict";function r(e){return(r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(r){return typeof r}:function(r){return r&&"function"==typeof Symbol&&r.constructor===Symbol&&r!==Symbol.prototype?"symbol":typeof r})(e)}function e(r,e,t){return e in r?Object.defineProperty(r,e,{value:t,enumerable:!0,configurable:!0,writable:!0}):r[e]=t,r}function t(r,e){var t=Object.keys(r);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(r);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(r,e).enumerable}))),t.push.apply(t,n)}return t}function n(r){for(var n=1;n<arguments.length;n++){var o=null!=arguments[n]?arguments[n]:{};n%2?t(Object(o),!0).forEach((function(t){e(r,t,o[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(r,Object.getOwnPropertyDescriptors(o)):t(Object(o)).forEach((function(e){Object.defineProperty(r,e,Object.getOwnPropertyDescriptor(o,e))}))}return r}const o=new Map;function a(r,e){e={caseSensitive:!1,...e};const t=r+JSON.stringify(e);if(o.has(t))return o.get(t);const n="!"===r[0];n&&(r=r.slice(1)),r=(r=>{if("string"!=typeof r)throw new TypeError("Expected a string");return r.replace(/[|\\{}()[\]^$+*?.]/g,"\\$&").replace(/-/g,"\\x2d")})(r).replace(/\\\*/g,"[\\s\\S]*");const a=new RegExp(`^${r}$`,e.caseSensitive?"":"i");return a.negated=n,o.set(t,a),a}var s=(r,e,t)=>{if(!Array.isArray(r)||!Array.isArray(e))throw new TypeError(`Expected two arrays, got ${typeof r} ${typeof e}`);if(0===e.length)return r;const n="!"===e[0][0];e=e.map(r=>a(r,t));const o=[];for(const t of r){let r=n;for(const n of e)n.test(t)&&(r=!n.negated);r&&o.push(t)}return o};s.isMatch=(r,e,t)=>{const n=Array.isArray(r)?r:[r],o=Array.isArray(e)?e:[e];return n.some(r=>o.every(e=>{const n=a(e,t),o=n.test(r);return n.negated?!o:o}))};var i=Array.isArray;return function(e,t,o){function a(r){return null!=r}function u(r){return"string"==typeof r}var c={arrayVsArrayAllMustBeFound:"any"},l=n(n({},c),o);if(0===arguments.length)throw new Error("array-includes-with-glob/arrayIncludesWithGlob(): [THROW_ID_01] all inputs missing!");if(1===arguments.length)throw new Error("array-includes-with-glob/arrayIncludesWithGlob(): [THROW_ID_02] second argument missing!");if(!i(e)){if(!u(e))throw new Error("array-includes-with-glob/arrayIncludesWithGlob(): [THROW_ID_03] first argument must be an array! It was given as ".concat(r(e)));e=[e]}if(!u(t)&&!i(t))throw new Error("array-includes-with-glob/arrayIncludesWithGlob(): [THROW_ID_04] second argument must be a string or array of strings! It was given as ".concat(r(t)));if("any"!==l.arrayVsArrayAllMustBeFound&&"all"!==l.arrayVsArrayAllMustBeFound)throw new Error("array-includes-with-glob/arrayIncludesWithGlob(): [THROW_ID_05] opts.arrayVsArrayAllMustBeFound was customised to an unrecognised value, ".concat(l.arrayVsArrayAllMustBeFound,'. It must be equal to either "any" or "all".'));if(0===e.length)return!1;var y=e.filter((function(r){return a(r)}));return 0!==y.length&&(u(t)?y.some((function(r){return s.isMatch(r,t,{caseSensitive:!0})})):"any"===l.arrayVsArrayAllMustBeFound?t.some((function(r){return y.some((function(e){return s.isMatch(e,r,{caseSensitive:!0})}))})):t.every((function(r){return y.some((function(e){return s.isMatch(e,r,{caseSensitive:!0})}))})))}}));
