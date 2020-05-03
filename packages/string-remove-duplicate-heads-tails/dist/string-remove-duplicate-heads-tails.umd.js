/**
 * string-remove-duplicate-heads-tails
 * Detect and (recursively) remove head and tail wrappings around the input string
 * Version: 3.0.57
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/string-remove-duplicate-heads-tails
 */

!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e=e||self).stringRemoveDuplicateHeadsTails=t()}(this,(function(){"use strict";function e(t){return(e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(t)}function t(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function r(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function n(e){for(var n=1;n<arguments.length;n++){var i=null!=arguments[n]?arguments[n]:{};n%2?r(Object(i),!0).forEach((function(r){t(e,r,i[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(i)):r(Object(i)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(i,t))}))}return e}var i,s,o=Function.prototype,a=Object.prototype,l=o.toString,u=a.hasOwnProperty,h=l.call(Object),f=a.toString,g=(i=Object.getPrototypeOf,s=Object,function(e){return i(s(e))});var c=function(e){if(!function(e){return!!e&&"object"==typeof e}(e)||"[object Object]"!=f.call(e)||function(e){var t=!1;if(null!=e&&"function"!=typeof e.toString)try{t=!!(e+"")}catch(e){}return t}(e))return!1;var t=g(e);if(null===t)return!0;var r=u.call(t,"constructor")&&t.constructor;return"function"==typeof r&&r instanceof r&&l.call(r)==h};function p(e){return"string"==typeof e?e.length>0?[e]:[]:e}function y(e){return e&&"object"==typeof e&&!Array.isArray(e)}function m(e){return"string"==typeof e}function d(e,t,r,n,i,s){const o="function"==typeof r?r():r;if(t<0&&i&&"EOL"===o)return o;if(t>=e.length&&!i)return!1;let a=i?1:r.length,l=!1,u=!1,h=n.maxMismatches,f=t,g=!1,c=!1,p=!1;for(;e[f];){const t=s(f);if(n.trimBeforeMatching&&""===e[f].trim()){if(!e[t]&&i&&"EOL"===r)return!0;f=s(f);continue}if(!n.i&&n.trimCharsBeforeMatching.includes(e[f])||n.i&&n.trimCharsBeforeMatching.map(e=>e.toLowerCase()).includes(e[f].toLowerCase())){if(i&&"EOL"===r&&!e[t])return!0;f=s(f);continue}const o=t>f?r[r.length-a]:r[a-1];if(!n.i&&e[f]===o||n.i&&e[f].toLowerCase()===o.toLowerCase()){if(g||(g=!0),u||(u=!0),a===r.length?c=!0:1===a&&(p=!0),a-=1,a<1)return f}else{if(!(n.maxMismatches&&h&&f))return!(0!==f||1!==a||n.lastMustMatch||!u)&&0;h-=1;for(let i=0;i<=h;i++){const o=t>f?r[r.length-a+1+i]:r[a-2-i],l=e[s(f)];if(o&&(!n.i&&e[f]===o||n.i&&e[f].toLowerCase()===o.toLowerCase())&&(!n.firstMustMatch||a!==r.length)){a-=2,g=!0;break}if(l&&o&&(!n.i&&l===o||n.i&&l.toLowerCase()===o.toLowerCase())&&(!n.firstMustMatch||a!==r.length)){a-=1,g=!0;break}if(void 0===o&&h>=0&&g&&(!n.firstMustMatch||c)&&(!n.lastMustMatch||p))return f}g||(l=f)}if(!1!==l&&l!==f&&(l=!1),a<1)return f;f=s(f)}return a>0?!(!i||"EOL"!==o)||!!(n.maxMismatches>=a&&u)&&(l||0):void 0}function b(e,t,r,n,i){if(y(i)&&Object.prototype.hasOwnProperty.call(i,"trimBeforeMatching")&&"boolean"!=typeof i.trimBeforeMatching)throw new Error(`string-match-left-right/${e}(): [THROW_ID_09] opts.trimBeforeMatching should be boolean!${Array.isArray(i.trimBeforeMatching)?" Did you mean to use opts.trimCharsBeforeMatching?":""}`);const s={i:!1,trimBeforeMatching:!1,trimCharsBeforeMatching:[],maxMismatches:0,firstMustMatch:!1,lastMustMatch:!1,...i};if(s.trimCharsBeforeMatching=p(s.trimCharsBeforeMatching),s.trimCharsBeforeMatching=s.trimCharsBeforeMatching.map(e=>m(e)?e:String(e)),!m(t))return!1;if(!t.length)return!1;if(!Number.isInteger(r)||r<0)throw new Error(`string-match-left-right/${e}(): [THROW_ID_03] the second argument should be a natural number. Currently it's of a type: ${typeof r}, equal to:\n${JSON.stringify(r,null,4)}`);let o,a,l,u;if(m(n))o=[n];else if(Array.isArray(n))o=n;else if(n){if("function"!=typeof n)throw new Error(`string-match-left-right/${e}(): [THROW_ID_05] the third argument, whatToMatch, is neither string nor array of strings! It's ${typeof n}, equal to:\n${JSON.stringify(n,null,4)}`);o=[],o.push(n)}else o=n;if(i&&!y(i))throw new Error(`string-match-left-right/${e}(): [THROW_ID_06] the fourth argument, options object, should be a plain object. Currently it's of a type "${typeof i}", and equal to:\n${JSON.stringify(i,null,4)}`);if(s.trimCharsBeforeMatching.some((e,t)=>e.length>1&&(l=t,u=e,!0)))throw new Error(`string-match-left-right/${e}(): [THROW_ID_07] the fourth argument, options object contains trimCharsBeforeMatching. It was meant to list the single characters but one of the entries at index ${l} is longer than 1 character, ${u.length} (equals to ${u}). Please split it into separate characters and put into array as separate elements.`);if(!o||!Array.isArray(o)||Array.isArray(o)&&!o.length||Array.isArray(o)&&1===o.length&&m(o[0])&&!o[0].trim()){if("function"==typeof s.cb){let n,i=r;if("matchLeftIncl"!==e&&"matchRight"!==e||(i+=1),"L"===e[5])for(let e=i;e--;){const r=t[e];if((!s.trimBeforeMatching||s.trimBeforeMatching&&void 0!==r&&r.trim())&&(!s.trimCharsBeforeMatching.length||void 0!==r&&!s.trimCharsBeforeMatching.includes(r))){n=e;break}}else if(e.startsWith("matchRight"))for(let e=i;e<t.length;e++){const r=t[e];if((!s.trimBeforeMatching||s.trimBeforeMatching&&r.trim())&&(!s.trimCharsBeforeMatching.length||!s.trimCharsBeforeMatching.includes(r))){n=e;break}}if(void 0===n)return!1;const o=t[n],a=n+1;let l="";return a&&a>0&&(l=t.slice(0,a)),"L"===e[5]?s.cb(o,l,n):(n&&n>0&&(l=t.slice(n)),s.cb(o,l,n))}let n="";throw i||(n=" More so, the whole options object, the fourth input argument, is missing!"),new Error(`string-match-left-right/${e}(): [THROW_ID_08] the third argument, "whatToMatch", was given as an empty string. This means, you intend to match purely by a callback. The callback was not set though, the opts key "cb" is not set!${n}`)}for(let n=0,i=o.length;n<i;n++){a="function"==typeof o[n];const i=o[n];let l,u,h="",f=r;"matchRight"===e?f+=1:"matchLeft"===e&&(f-=1);const g=d(t,f,i,s,a,t=>"L"===e[5]?t-1:t+1);if(g&&a&&"function"==typeof i&&"EOL"===i())return!(!i()||s.cb&&!s.cb(l,h,u))&&i();if(Number.isInteger(g)&&(u=e.startsWith("matchLeft")?g-1:g+1,h="L"===e[5]?t.slice(0,g):t.slice(u)),u<0&&(u=void 0),t[u]&&(l=t[u]),Number.isInteger(g)&&(!s.cb||s.cb(l,h,u)))return i}return!1}function w(e,t,r,n){return b("matchLeftIncl",e,t,r,n)}function T(e,t,r,n){return b("matchRightIncl",e,t,r,n)}function O(e,t=!0,r){if(!(r.trim()||e.length&&"\n"!==r&&" "!==r&&" "===(t?e[e.length-1]:e[0])||e.length&&"\n"===(t?e[e.length-1]:e[0])&&"\n"!==r&&" "!==r))if(t){if(("\n"===r||" "===r)&&e.length&&" "===e[e.length-1])for(;e.length&&" "===e[e.length-1];)e.pop();e.push(" "===r||"\n"===r?r:" ")}else{if(("\n"===r||" "===r)&&e.length&&" "===e[0])for(;e.length&&" "===e[0];)e.shift();e.unshift(" "===r||"\n"===r?r:" ")}}function $(e,t){if("string"==typeof e&&e.length){let r,n,i=!1;if(e.includes("\r\n")&&(i=!0),r=t&&"number"==typeof t?t:1,""===e.trim()){const t=[];for(n=r,Array.from(e).forEach(e=>{("\n"!==e||n)&&("\n"===e&&(n-=1),O(t,!0,e))});t.length>1&&" "===t[t.length-1];)t.pop();return t.join("")}const s=[];if(n=r,""===e[0].trim())for(let t=0,r=e.length;t<r&&!e[t].trim();t++)("\n"!==e[t]||n)&&("\n"===e[t]&&(n-=1),O(s,!0,e[t]));const o=[];if(n=r,""===e.slice(-1).trim())for(let t=e.length;t--&&!e[t].trim();)("\n"!==e[t]||n)&&("\n"===e[t]&&(n-=1),O(o,!1,e[t]));return i?`${s.join("")}${e.trim()}${o.join("")}`.replace(/\n/g,"\r\n"):s.join("")+e.trim()+o.join("")}return e}function _(e,t){if(!Array.isArray(e))throw new TypeError(`ranges-sort: [THROW_ID_01] Input must be an array, consisting of range arrays! Currently its type is: ${typeof e}, equal to: ${JSON.stringify(e,null,4)}`);if(0===e.length)return e;const r={strictlyTwoElementsInRangeArrays:!1,progressFn:null,...t};let n,i;if(r.strictlyTwoElementsInRangeArrays&&!e.every((e,t)=>2===e.length||(n=t,i=e.length,!1)))throw new TypeError(`ranges-sort: [THROW_ID_03] The first argument should be an array and must consist of arrays which are natural number indexes representing TWO string index ranges. However, ${n}th range (${JSON.stringify(e[n],null,4)}) has not two but ${i} elements!`);if(!e.every((e,t)=>!(!Number.isInteger(e[0])||e[0]<0||!Number.isInteger(e[1])||e[1]<0)||(n=t,!1)))throw new TypeError(`ranges-sort: [THROW_ID_04] The first argument should be an array and must consist of arrays which are natural number indexes representing string index ranges. However, ${n}th range (${JSON.stringify(e[n],null,4)}) does not consist of only natural numbers!`);const s=e.length*e.length;let o=0;return Array.from(e).sort((e,t)=>(r.progressFn&&(o+=1,r.progressFn(Math.floor(100*o/s))),e[0]===t[0]?e[1]<t[1]?-1:e[1]>t[1]?1:0:e[0]<t[0]?-1:1))}function v(e,t){function r(e){return"string"==typeof e}function n(e){return e&&"object"==typeof e&&!Array.isArray(e)}if(!Array.isArray(e))return e;const i={mergeType:1,progressFn:null,joinRangesThatTouchEdges:!0};let s;if(t){if(!n(t))throw new Error(`emlint: [THROW_ID_03] the second input argument must be a plain object. It was given as:\n${JSON.stringify(t,null,4)} (type ${typeof t})`);if(s={...i,...t},s.progressFn&&n(s.progressFn)&&!Object.keys(s.progressFn).length)s.progressFn=null;else if(s.progressFn&&"function"!=typeof s.progressFn)throw new Error(`ranges-merge: [THROW_ID_01] opts.progressFn must be a function! It was given of a type: "${typeof s.progressFn}", equal to ${JSON.stringify(s.progressFn,null,4)}`);if(s.mergeType&&1!==s.mergeType&&2!==s.mergeType)if(r(s.mergeType)&&"1"===s.mergeType.trim())s.mergeType=1;else{if(!r(s.mergeType)||"2"!==s.mergeType.trim())throw new Error(`ranges-merge: [THROW_ID_02] opts.mergeType was customised to a wrong thing! It was given of a type: "${typeof s.mergeType}", equal to ${JSON.stringify(s.mergeType,null,4)}`);s.mergeType=2}if("boolean"!=typeof s.joinRangesThatTouchEdges)throw new Error(`ranges-merge: [THROW_ID_04] opts.joinRangesThatTouchEdges was customised to a wrong thing! It was given of a type: "${typeof s.joinRangesThatTouchEdges}", equal to ${JSON.stringify(s.joinRangesThatTouchEdges,null,4)}`)}else s={...i};const o=e.map(e=>[...e]).filter(e=>void 0!==e[2]||e[0]!==e[1]);let a,l,u;a=s.progressFn?_(o,{progressFn:e=>{u=Math.floor(e/5),u!==l&&(l=u,s.progressFn(u))}}):_(o);const h=a.length-1;for(let e=h;e>0;e--)s.progressFn&&(u=Math.floor(78*(1-e/h))+21,u!==l&&u>l&&(l=u,s.progressFn(u))),(a[e][0]<=a[e-1][0]||!s.joinRangesThatTouchEdges&&a[e][0]<a[e-1][1]||s.joinRangesThatTouchEdges&&a[e][0]<=a[e-1][1])&&(a[e-1][0]=Math.min(a[e][0],a[e-1][0]),a[e-1][1]=Math.max(a[e][1],a[e-1][1]),void 0!==a[e][2]&&(a[e-1][0]>=a[e][0]||a[e-1][1]<=a[e][1])&&null!==a[e-1][2]&&(null===a[e][2]&&null!==a[e-1][2]?a[e-1][2]=null:void 0!==a[e-1][2]?2===s.mergeType&&a[e-1][0]===a[e][0]?a[e-1][2]=a[e][2]:a[e-1][2]+=a[e][2]:a[e-1][2]=a[e][2]),a.splice(e,1),e=a.length);return a}function I(e){return null!=e}function M(e){return Number.isInteger(e)&&e>=0}function A(e){return"string"==typeof e}function R(e){return/^\d*$/.test(e)?parseInt(e,10):e}class E{constructor(e){const t={limitToBeAddedWhitespace:!1,limitLinebreaksCount:1,mergeType:1,...e};if(t.mergeType&&1!==t.mergeType&&2!==t.mergeType)if(A(t.mergeType)&&"1"===t.mergeType.trim())t.mergeType=1;else{if(!A(t.mergeType)||"2"!==t.mergeType.trim())throw new Error(`ranges-push: [THROW_ID_02] opts.mergeType was customised to a wrong thing! It was given of a type: "${typeof t.mergeType}", equal to ${JSON.stringify(t.mergeType,null,4)}`);t.mergeType=2}this.opts=t}add(e,t,r,...n){if(n.length>0)throw new TypeError(`ranges-push/Ranges/add(): [THROW_ID_03] Please don't overload the add() method. From the 4th input argument onwards we see these redundant arguments: ${JSON.stringify(n,null,4)}`);if(!I(e)&&!I(t))return;if(I(e)&&!I(t)){if(Array.isArray(e)){if(e.length){if(e.some(e=>Array.isArray(e)))return void e.forEach(e=>{Array.isArray(e)&&this.add(...e)});e.length>1&&M(R(e[0]))&&M(R(e[1]))&&this.add(...e)}return}throw new TypeError(`ranges-push/Ranges/add(): [THROW_ID_12] the first input argument, "from" is set (${JSON.stringify(e,null,0)}) but second-one, "to" is not (${JSON.stringify(t,null,0)})`)}if(!I(e)&&I(t))throw new TypeError(`ranges-push/Ranges/add(): [THROW_ID_13] the second input argument, "to" is set (${JSON.stringify(t,null,0)}) but first-one, "from" is not (${JSON.stringify(e,null,0)})`);const i=/^\d*$/.test(e)?parseInt(e,10):e,s=/^\d*$/.test(t)?parseInt(t,10):t;if(M(r)&&(r=String(r)),!M(i)||!M(s))throw M(i)&&i>=0?new TypeError(`ranges-push/Ranges/add(): [THROW_ID_10] "to" value, the second input argument, must be a natural number or zero! Currently it's of a type "${typeof s}" equal to: ${JSON.stringify(s,null,4)}`):new TypeError(`ranges-push/Ranges/add(): [THROW_ID_09] "from" value, the first input argument, must be a natural number or zero! Currently it's of a type "${typeof i}" equal to: ${JSON.stringify(i,null,4)}`);if(I(r)&&!A(r)&&!M(r))throw new TypeError(`ranges-push/Ranges/add(): [THROW_ID_08] The third argument, the value to add, was given not as string but ${typeof r}, equal to:\n${JSON.stringify(r,null,4)}`);if(I(this.slices)&&Array.isArray(this.last())&&i===this.last()[1]){if(this.last()[1]=s,this.last()[2],null!==this.last()[2]&&I(r)){let e=!(I(this.last()[2])&&this.last()[2].length>0)||this.opts&&this.opts.mergeType&&1!==this.opts.mergeType?r:this.last()[2]+r;this.opts.limitToBeAddedWhitespace&&(e=$(e,this.opts.limitLinebreaksCount)),A(e)&&!e.length||(this.last()[2]=e)}}else{this.slices||(this.slices=[]);const e=void 0===r||A(r)&&!r.length?[i,s]:[i,s,this.opts.limitToBeAddedWhitespace?$(r,this.opts.limitLinebreaksCount):r];this.slices.push(e)}}push(e,t,r,...n){this.add(e,t,r,...n)}current(){return null!=this.slices?(this.slices=v(this.slices,{mergeType:this.opts.mergeType}),this.opts.limitToBeAddedWhitespace?this.slices.map(e=>I(e[2])?[e[0],e[1],$(e[2],this.opts.limitLinebreaksCount)]:e):this.slices):null}wipe(){this.slices=void 0}replace(e){if(Array.isArray(e)&&e.length){if(!Array.isArray(e[0])||!M(e[0][0]))throw new Error(`ranges-push/Ranges/replace(): [THROW_ID_11] Single range was given but we expected array of arrays! The first element, ${JSON.stringify(e[0],null,4)} should be an array and its first element should be an integer, a string index.`);this.slices=Array.from(e)}else this.slices=void 0}last(){return void 0!==this.slices&&Array.isArray(this.slices)?this.slices[this.slices.length-1]:null}}function j(e){return null!=e}function W(e){return"string"==typeof e}function S(e,t,r){let n,i=0,s=0;if(0===arguments.length)throw new Error("ranges-apply: [THROW_ID_01] inputs missing!");if(!W(e))throw new TypeError(`ranges-apply: [THROW_ID_02] first input argument must be a string! Currently it's: ${typeof e}, equal to: ${JSON.stringify(e,null,4)}`);if(null===t)return e;if(!Array.isArray(t))throw new TypeError(`ranges-apply: [THROW_ID_03] second input argument must be an array (or null)! Currently it's: ${typeof t}, equal to: ${JSON.stringify(t,null,4)}`);if(r&&"function"!=typeof r)throw new TypeError(`ranges-apply: [THROW_ID_04] the third input argument must be a function (or falsey)! Currently it's: ${typeof r}, equal to: ${JSON.stringify(r,null,4)}`);n=Array.isArray(t)&&(Number.isInteger(t[0])&&t[0]>=0||/^\d*$/.test(t[0]))&&(Number.isInteger(t[1])&&t[1]>=0||/^\d*$/.test(t[1]))?[Array.from(t)]:Array.from(t);const o=n.length;let a=0;n.forEach((e,t)=>{if(r&&(i=Math.floor(a/o*10),i!==s&&(s=i,r(i))),!Array.isArray(e))throw new TypeError(`ranges-apply: [THROW_ID_05] ranges array, second input arg., has ${t}th element not an array: ${JSON.stringify(e,null,4)}, which is ${typeof e}`);if(!Number.isInteger(e[0])||e[0]<0){if(!/^\d*$/.test(e[0]))throw new TypeError(`ranges-apply: [THROW_ID_06] ranges array, second input arg. has ${t}th element, array [${e[0]},${e[1]}]. That array has first element not an integer, but ${typeof e[0]}, equal to: ${JSON.stringify(e[0],null,4)}. Computer doesn't like this.`);n[t][0]=Number.parseInt(n[t][0],10)}if(!Number.isInteger(e[1])){if(!/^\d*$/.test(e[1]))throw new TypeError(`ranges-apply: [THROW_ID_07] ranges array, second input arg. has ${t}th element, array [${e[0]},${e[1]}]. That array has second element not an integer, but ${typeof e[1]}, equal to: ${JSON.stringify(e[1],null,4)}. Computer doesn't like this.`);n[t][1]=Number.parseInt(n[t][1],10)}a+=1});const l=v(n,{progressFn:e=>{r&&(i=10+Math.floor(e/10),i!==s&&(s=i,r(i)))}}),u=l.length;if(u>0){const t=e.slice(l[u-1][1]);e=l.reduce((t,n,o,a)=>{r&&(i=20+Math.floor(o/u*80),i!==s&&(s=i,r(i)));const l=0===o?0:a[o-1][1],h=a[o][0];return t+e.slice(l,h)+(j(a[o][2])?a[o][2]:"")},""),e+=t}return e}function B(e,t){if("string"!=typeof e)throw new Error(`string-trim-spaces-only: [THROW_ID_01] input must be string! It was given as ${typeof e}, equal to:\n${JSON.stringify(e,null,4)}`);const r={classicTrim:!1,cr:!1,lf:!1,tab:!1,space:!0,nbsp:!1,...t};function n(e){return r.classicTrim&&!e.trim()||!r.classicTrim&&(r.space&&" "===e||r.cr&&"\r"===e||r.lf&&"\n"===e||r.tab&&"\t"===e||r.nbsp&&" "===e)}let i,s;if(e.length){if(n(e[0]))for(let t=0,r=e.length;t<r;t++){if(!n(e[t])){i=t;break}if(t===e.length-1)return{res:"",ranges:[[0,e.length]]}}if(n(e[e.length-1]))for(let t=e.length;t--;)if(!n(e[t])){s=t+1;break}return i?s?{res:e.slice(i,s),ranges:[[0,i],[s,e.length]]}:{res:e.slice(i),ranges:[[0,i]]}:s?{res:e.slice(0,s),ranges:[[s,e.length]]}:{res:e,ranges:[]}}return{res:"",ranges:[]}}return function(t){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};function i(e){return null!=e}var s=Object.prototype.hasOwnProperty;function o(e){return"string"==typeof e}if(void 0===t)throw new Error("string-remove-duplicate-heads-tails: [THROW_ID_01] The input is missing!");if("string"!=typeof t)return t;if(i(r)&&!c(r))throw new Error("string-remove-duplicate-heads-tails: [THROW_ID_03] The given options are not a plain object but ".concat(e(r),"!"));if(i(r)&&s.call(r,"heads")){if(!p(r.heads).every((function(e){return o(e)})))throw new Error("string-remove-duplicate-heads-tails: [THROW_ID_04] The opts.heads contains elements which are not string-type!");o(r.heads)&&(r.heads=p(r.heads))}if(i(r)&&s.call(r,"tails")){if(!p(r.tails).every((function(e){return o(e)})))throw new Error("string-remove-duplicate-heads-tails: [THROW_ID_05] The opts.tails contains elements which are not string-type!");o(r.tails)&&(r.tails=p(r.tails))}var a=B(t).res;if(0===a.length)return t;t=a;var l={heads:["{{"],tails:["}}"]},u=n(n({},l),r);u.heads=u.heads.map((function(e){return e.trim()})),u.tails=u.tails.map((function(e){return e.trim()}));var h=!1,f=!1,g=new E({limitToBeAddedWhitespace:!0}),y=new E({limitToBeAddedWhitespace:!0}),m=!0,d=!0,b="";function O(e,t){var r;return T(e,0,t.heads,{trimBeforeMatching:!0,cb:function(e,t,n){return r=n,!0},relaxedApi:!0})&&T(e,r,t.tails,{trimBeforeMatching:!0,cb:function(e,t,n){return r=n,!0},relaxedApi:!0})?e.slice(r):e}for(;t!==O(t,u);)t=B(O(t,u)).res;function $(e,t){var r;return w(e,e.length-1,t.tails,{trimBeforeMatching:!0,cb:function(e,t,n){return r=n,!0},relaxedApi:!0})&&w(e,r,t.heads,{trimBeforeMatching:!0,cb:function(e,t,n){return r=n,!0},relaxedApi:!0})?e.slice(0,r+1):e}for(;t!==$(t,u);)t=B($(t,u)).res;if(!(u.heads.length&&T(t,0,u.heads,{trimBeforeMatching:!0,relaxedApi:!0})&&u.tails.length&&w(t,t.length-1,u.tails,{trimBeforeMatching:!0,relaxedApi:!0})))return B(t).res;for(var _=0,v=t.length;_<v;_++)if(""===t[_].trim());else{var I=void 0,M=T(t,_,u.heads,{trimBeforeMatching:!0,cb:function(e,t,r){return I=r,!0},relaxedApi:!0});if(M){d=!0,m&&(m=!0);var A=void 0,R=T(t,I,u.tails,{trimBeforeMatching:!0,cb:function(e,t,r){return A=r,!0},relaxedApi:!0});R&&g.push(_,A),y.current()&&h&&"tails"!==b&&g.push(y.current()),h||y.current()&&(g.push(y.current()),y.wipe()),y.push(_,I),b="heads",_=I-1;continue}var j=T(t,_,u.tails,{trimBeforeMatching:!0,cb:function(e,r,n){return I=i(n)?n:t.length,!0},relaxedApi:!0});if(j){d=!0,m?("heads"===b&&y.wipe(),m=!1):y.push(_,I),b="tails",_=I-1;continue}m&&(m=!0),d&&!h?(h=!0,d=!1):d&&!f?(f=!0,m=!0,d=!1,"heads"===b&&y.wipe()):d&&f&&y.wipe()}return y.current()&&g.push(y.current()),g.current()?S(t,g.current()).trim():t.trim()}}));
