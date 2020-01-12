/**
 * array-pull-all-with-glob
 * pullAllWithGlob - like _.pullAll but pulling stronger, with globs
 * Version: 4.12.59
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/array-pull-all-with-glob
 */

!function(r,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(r=r||self).arrayPullAllWithGlob=t()}(this,(function(){"use strict";function r(t){return(r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(r){return typeof r}:function(r){return r&&"function"==typeof Symbol&&r.constructor===Symbol&&r!==Symbol.prototype?"symbol":typeof r})(t)}const t=/[|\\{}()[\]^$+*?.-]/g;const n=new Map;function e(r,e){e={caseSensitive:!1,...e};const o=r+JSON.stringify(e);if(n.has(o))return n.get(o);const i="!"===r[0];i&&(r=r.slice(1)),r=(r=>{if("string"!=typeof r)throw new TypeError("Expected a string");return r.replace(t,"\\$&")})(r).replace(/\\\*/g,".*");const a=new RegExp(`^${r}$`,e.caseSensitive?"":"i");return a.negated=i,n.set(o,a),a}var o=(r,t,n)=>{if(!Array.isArray(r)||!Array.isArray(t))throw new TypeError(`Expected two arrays, got ${typeof r} ${typeof t}`);if(0===t.length)return r;const o="!"===t[0][0];t=t.map(r=>e(r,n));const i=[];for(const n of r){let r=o;for(const e of t)e.test(n)&&(r=!e.negated);r&&i.push(n)}return i};return o.isMatch=(r,t,n)=>{const o=Array.isArray(r)?r:[r],i=Array.isArray(t)?t:[t];return o.some(r=>i.every(t=>{const o=e(t,n),i=o.test(r);return o.negated?!i:i}))},function(t,n,e){function i(r){return"string"==typeof r}if(!Array.isArray(t))throw new Error("array-pull-all-with-glob: [THROW_ID_01] first argument must be an array! Currently it's ".concat(r(t),", equal to: ").concat(JSON.stringify(t,null,4)));if(!t.length)return[];if(null==n)throw new Error("array-pull-all-with-glob: [THROW_ID_02] second argument is missing!");var a,s;if("string"==typeof n){if(0===n.length)return t;a=[n]}else if(Array.isArray(n)){if(0===n.length)return t;a=Array.from(n)}else if(!Array.isArray(n))throw new Error("array-pull-all-with-glob: [THROW_ID_04] first argument must be an array! Currently it's ".concat(r(n),", equal to: ").concat(JSON.stringify(n,null,4)));if(0===t.length||0===n.length)return t;if(!t.every((function(r){return i(r)})))throw new Error("array-pull-all-with-glob: [THROW_ID_05] first argument array contains non-string elements: ".concat(JSON.stringify(t,null,4)));if(!a.every((function(r){return i(r)})))throw new Error("array-pull-all-with-glob: [THROW_ID_06] first argument array contains non-string elements: ".concat(JSON.stringify(a,null,4)));if(e&&(Array.isArray(e)||"object"!==r(e)))throw new Error("array-pull-all-with-glob: [THROW_ID_07] third argument, options object is not a plain object but ".concat(Array.isArray(e)?"array":r(e)));var l={caseSensitive:!0};return s=null===e?Object.assign({},l):Object.assign({},l,e),Array.from(t).filter((function(r){return!a.some((function(t){return o.isMatch(r,t,{caseSensitive:s.caseSensitive})}))}))}}));
