/**
 * ranges-apply
 * Take an array of string slice ranges, delete/replace the string according to them
 * Version: 3.1.6
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/ranges-apply
 */

!function(e,r){"object"==typeof exports&&"undefined"!=typeof module?module.exports=r():"function"==typeof define&&define.amd?define(r):(e=e||self).rangesApply=r()}(this,(function(){"use strict";function e(r){return(e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(r)}function r(e,r){if(!Array.isArray(e))throw new TypeError(`ranges-sort: [THROW_ID_01] Input must be an array, consisting of range arrays! Currently its type is: ${typeof e}, equal to: ${JSON.stringify(e,null,4)}`);if(0===e.length)return e;const n={strictlyTwoElementsInRangeArrays:!1,progressFn:null,...r};let t,o;if(n.strictlyTwoElementsInRangeArrays&&!e.every((e,r)=>2===e.length||(t=r,o=e.length,!1)))throw new TypeError(`ranges-sort: [THROW_ID_03] The first argument should be an array and must consist of arrays which are natural number indexes representing TWO string index ranges. However, ${t}th range (${JSON.stringify(e[t],null,4)}) has not two but ${o} elements!`);if(!e.every((e,r)=>!(!Number.isInteger(e[0])||e[0]<0||!Number.isInteger(e[1])||e[1]<0)||(t=r,!1)))throw new TypeError(`ranges-sort: [THROW_ID_04] The first argument should be an array and must consist of arrays which are natural number indexes representing string index ranges. However, ${t}th range (${JSON.stringify(e[t],null,4)}) does not consist of only natural numbers!`);const s=e.length*e.length;let a=0;return Array.from(e).sort((e,r)=>(n.progressFn&&(a+=1,n.progressFn(Math.floor(100*a/s))),e[0]===r[0]?e[1]<r[1]?-1:e[1]>r[1]?1:0:e[0]<r[0]?-1:1))}function n(e,n){function t(e){return"string"==typeof e}function o(e){return e&&"object"==typeof e&&!Array.isArray(e)}if(!Array.isArray(e))return e;const s={mergeType:1,progressFn:null,joinRangesThatTouchEdges:!0};let a;if(n){if(!o(n))throw new Error(`emlint: [THROW_ID_03] the second input argument must be a plain object. It was given as:\n${JSON.stringify(n,null,4)} (type ${typeof n})`);if(a={...s,...n},a.progressFn&&o(a.progressFn)&&!Object.keys(a.progressFn).length)a.progressFn=null;else if(a.progressFn&&"function"!=typeof a.progressFn)throw new Error(`ranges-merge: [THROW_ID_01] opts.progressFn must be a function! It was given of a type: "${typeof a.progressFn}", equal to ${JSON.stringify(a.progressFn,null,4)}`);if(a.mergeType&&1!==a.mergeType&&2!==a.mergeType)if(t(a.mergeType)&&"1"===a.mergeType.trim())a.mergeType=1;else{if(!t(a.mergeType)||"2"!==a.mergeType.trim())throw new Error(`ranges-merge: [THROW_ID_02] opts.mergeType was customised to a wrong thing! It was given of a type: "${typeof a.mergeType}", equal to ${JSON.stringify(a.mergeType,null,4)}`);a.mergeType=2}if("boolean"!=typeof a.joinRangesThatTouchEdges)throw new Error(`ranges-merge: [THROW_ID_04] opts.joinRangesThatTouchEdges was customised to a wrong thing! It was given of a type: "${typeof a.joinRangesThatTouchEdges}", equal to ${JSON.stringify(a.joinRangesThatTouchEdges,null,4)}`)}else a={...s};const i=e.map(e=>[...e]).filter(e=>void 0!==e[2]||e[0]!==e[1]);let g,u,l;g=a.progressFn?r(i,{progressFn:e=>{l=Math.floor(e/5),l!==u&&(u=l,a.progressFn(l))}}):r(i);const y=g.length-1;for(let e=y;e>0;e--)a.progressFn&&(l=Math.floor(78*(1-e/y))+21,l!==u&&l>u&&(u=l,a.progressFn(l))),(g[e][0]<=g[e-1][0]||!a.joinRangesThatTouchEdges&&g[e][0]<g[e-1][1]||a.joinRangesThatTouchEdges&&g[e][0]<=g[e-1][1])&&(g[e-1][0]=Math.min(g[e][0],g[e-1][0]),g[e-1][1]=Math.max(g[e][1],g[e-1][1]),void 0!==g[e][2]&&(g[e-1][0]>=g[e][0]||g[e-1][1]<=g[e][1])&&null!==g[e-1][2]&&(null===g[e][2]&&null!==g[e-1][2]?g[e-1][2]=null:void 0!==g[e-1][2]?2===a.mergeType&&g[e-1][0]===g[e][0]?g[e-1][2]=g[e][2]:g[e-1][2]+=g[e][2]:g[e-1][2]=g[e][2]),g.splice(e,1),e=g.length);return g}function t(e){return null!=e}function o(e){return"string"==typeof e}return function(r,s,a){var i,g=0,u=0;if(0===arguments.length)throw new Error("ranges-apply: [THROW_ID_01] inputs missing!");if(!o(r))throw new TypeError("ranges-apply: [THROW_ID_02] first input argument must be a string! Currently it's: ".concat(e(r),", equal to: ").concat(JSON.stringify(r,null,4)));if(null===s)return r;if(!Array.isArray(s))throw new TypeError("ranges-apply: [THROW_ID_03] second input argument must be an array (or null)! Currently it's: ".concat(e(s),", equal to: ").concat(JSON.stringify(s,null,4)));if(a&&"function"!=typeof a)throw new TypeError("ranges-apply: [THROW_ID_04] the third input argument must be a function (or falsey)! Currently it's: ".concat(e(a),", equal to: ").concat(JSON.stringify(a,null,4)));var l=(i=Array.isArray(s)&&(Number.isInteger(s[0])&&s[0]>=0||/^\d*$/.test(s[0]))&&(Number.isInteger(s[1])&&s[1]>=0||/^\d*$/.test(s[1]))?[Array.from(s)]:Array.from(s)).length,y=0;i.forEach((function(r,n){if(a&&(g=Math.floor(y/l*10))!==u&&(u=g,a(g)),!Array.isArray(r))throw new TypeError("ranges-apply: [THROW_ID_05] ranges array, second input arg., has ".concat(n,"th element not an array: ").concat(JSON.stringify(r,null,4),", which is ").concat(e(r)));if(!Number.isInteger(r[0])||r[0]<0){if(!/^\d*$/.test(r[0]))throw new TypeError("ranges-apply: [THROW_ID_06] ranges array, second input arg. has ".concat(n,"th element, array [").concat(r[0],",").concat(r[1],"]. That array has first element not an integer, but ").concat(e(r[0]),", equal to: ").concat(JSON.stringify(r[0],null,4),". Computer doesn't like this."));i[n][0]=Number.parseInt(i[n][0],10)}if(!Number.isInteger(r[1])){if(!/^\d*$/.test(r[1]))throw new TypeError("ranges-apply: [THROW_ID_07] ranges array, second input arg. has ".concat(n,"th element, array [").concat(r[0],",").concat(r[1],"]. That array has second element not an integer, but ").concat(e(r[1]),", equal to: ").concat(JSON.stringify(r[1],null,4),". Computer doesn't like this."));i[n][1]=Number.parseInt(i[n][1],10)}y+=1}));var f=n(i,{progressFn:function(e){a&&(g=10+Math.floor(e/10))!==u&&(u=g,a(g))}}),p=f.length;if(p>0){var c=r.slice(f[p-1][1]);r=f.reduce((function(e,n,o,s){a&&(g=20+Math.floor(o/p*80))!==u&&(u=g,a(g));var i=0===o?0:s[o-1][1],l=s[o][0];return e+r.slice(i,l)+(t(s[o][2])?s[o][2]:"")}),""),r+=c}return r}}));
