/**
 * ranges-merge
 * Merge and sort arrays which mean string slice ranges
 * Version: 4.3.4
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/ranges-merge
 */

!function(e,r){"object"==typeof exports&&"undefined"!=typeof module?module.exports=r():"function"==typeof define&&define.amd?define(r):(e=e||self).rangesMerge=r()}(this,(function(){"use strict";function e(r){return(e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(r)}function r(e,r,n){return r in e?Object.defineProperty(e,r,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[r]=n,e}function n(e,r){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);r&&(t=t.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),n.push.apply(n,t)}return n}function t(e){for(var t=1;t<arguments.length;t++){var o=null!=arguments[t]?arguments[t]:{};t%2?n(Object(o),!0).forEach((function(n){r(e,n,o[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(o)):n(Object(o)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(o,r))}))}return e}function o(e){return function(e){if(Array.isArray(e))return s(e)}(e)||function(e){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}(e)||function(e,r){if(!e)return;if("string"==typeof e)return s(e,r);var n=Object.prototype.toString.call(e).slice(8,-1);"Object"===n&&e.constructor&&(n=e.constructor.name);if("Map"===n||"Set"===n)return Array.from(e);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return s(e,r)}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function s(e,r){(null==r||r>e.length)&&(r=e.length);for(var n=0,t=new Array(r);n<r;n++)t[n]=e[n];return t}function i(e,r){if(!Array.isArray(e))throw new TypeError(`ranges-sort: [THROW_ID_01] Input must be an array, consisting of range arrays! Currently its type is: ${typeof e}, equal to: ${JSON.stringify(e,null,4)}`);if(0===e.length)return e;const n={strictlyTwoElementsInRangeArrays:!1,progressFn:null,...r};let t,o;if(n.strictlyTwoElementsInRangeArrays&&!e.every((e,r)=>2===e.length||(t=r,o=e.length,!1)))throw new TypeError(`ranges-sort: [THROW_ID_03] The first argument should be an array and must consist of arrays which are natural number indexes representing TWO string index ranges. However, ${t}th range (${JSON.stringify(e[t],null,4)}) has not two but ${o} elements!`);if(!e.every((e,r)=>!(!Number.isInteger(e[0])||e[0]<0||!Number.isInteger(e[1])||e[1]<0)||(t=r,!1)))throw new TypeError(`ranges-sort: [THROW_ID_04] The first argument should be an array and must consist of arrays which are natural number indexes representing string index ranges. However, ${t}th range (${JSON.stringify(e[t],null,4)}) does not consist of only natural numbers!`);const s=e.length*e.length;let i=0;return Array.from(e).sort((e,r)=>(n.progressFn&&(i+=1,n.progressFn(Math.floor(100*i/s))),e[0]===r[0]?e[1]<r[1]?-1:e[1]>r[1]?1:0:e[0]<r[0]?-1:1))}return function(r,n){function s(e){return"string"==typeof e}function a(r){return r&&"object"===e(r)&&!Array.isArray(r)}if(!Array.isArray(r))return r;var u,g={mergeType:1,progressFn:null,joinRangesThatTouchEdges:!0};if(n){if(!a(n))throw new Error("emlint: [THROW_ID_03] the second input argument must be a plain object. It was given as:\n".concat(JSON.stringify(n,null,4)," (type ").concat(e(n),")"));if((u=t(t({},g),n)).progressFn&&a(u.progressFn)&&!Object.keys(u.progressFn).length)u.progressFn=null;else if(u.progressFn&&"function"!=typeof u.progressFn)throw new Error('ranges-merge: [THROW_ID_01] opts.progressFn must be a function! It was given of a type: "'.concat(e(u.progressFn),'", equal to ').concat(JSON.stringify(u.progressFn,null,4)));if(u.mergeType&&1!==u.mergeType&&2!==u.mergeType)if(s(u.mergeType)&&"1"===u.mergeType.trim())u.mergeType=1;else{if(!s(u.mergeType)||"2"!==u.mergeType.trim())throw new Error('ranges-merge: [THROW_ID_02] opts.mergeType was customised to a wrong thing! It was given of a type: "'.concat(e(u.mergeType),'", equal to ').concat(JSON.stringify(u.mergeType,null,4)));u.mergeType=2}if("boolean"!=typeof u.joinRangesThatTouchEdges)throw new Error('ranges-merge: [THROW_ID_04] opts.joinRangesThatTouchEdges was customised to a wrong thing! It was given of a type: "'.concat(e(u.joinRangesThatTouchEdges),'", equal to ').concat(JSON.stringify(u.joinRangesThatTouchEdges,null,4)))}else u=t({},g);for(var c,f,l,y=r.map((function(e){return o(e)})).filter((function(e){return void 0!==e[2]||e[0]!==e[1]})),p=(c=u.progressFn?i(y,{progressFn:function(e){(l=Math.floor(e/5))!==f&&(f=l,u.progressFn(l))}}):i(y)).length-1,m=p;m>0;m--)u.progressFn&&(l=Math.floor(78*(1-m/p))+21)!==f&&l>f&&(f=l,u.progressFn(l)),(c[m][0]<=c[m-1][0]||!u.joinRangesThatTouchEdges&&c[m][0]<c[m-1][1]||u.joinRangesThatTouchEdges&&c[m][0]<=c[m-1][1])&&(c[m-1][0]=Math.min(c[m][0],c[m-1][0]),c[m-1][1]=Math.max(c[m][1],c[m-1][1]),void 0!==c[m][2]&&(c[m-1][0]>=c[m][0]||c[m-1][1]<=c[m][1])&&null!==c[m-1][2]&&(null===c[m][2]&&null!==c[m-1][2]?c[m-1][2]=null:void 0!==c[m-1][2]?2===u.mergeType&&c[m-1][0]===c[m][0]?c[m-1][2]=c[m][2]:c[m-1][2]+=c[m][2]:c[m-1][2]=c[m][2]),c.splice(m,1),m=c.length);return c}}));
