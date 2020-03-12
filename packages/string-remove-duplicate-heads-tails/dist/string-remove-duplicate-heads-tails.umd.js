/**
 * string-remove-duplicate-heads-tails
 * Detect and (recursively) remove head and tail wrappings around the input string
 * Version: 3.0.50
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/string-remove-duplicate-heads-tails
 */

!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e=e||self).stringRemoveDuplicateHeadsTails=t()}(this,(function(){"use strict";function e(t){return(e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(t)}var t,r,n=Function.prototype,i=Object.prototype,s=n.toString,o=i.hasOwnProperty,a=s.call(Object),l=i.toString,h=(t=Object.getPrototypeOf,r=Object,function(e){return t(r(e))});var u=function(e){if(!function(e){return!!e&&"object"==typeof e}(e)||"[object Object]"!=l.call(e)||function(e){var t=!1;if(null!=e&&"function"!=typeof e.toString)try{t=!!(e+"")}catch(e){}return t}(e))return!1;var t=h(e);if(null===t)return!0;var r=o.call(t,"constructor")&&t.constructor;return"function"==typeof r&&r instanceof r&&s.call(r)==a};function g(e){return"string"==typeof e?e.length>0?[e]:[]:e}function f(e){return e&&"object"==typeof e&&!Array.isArray(e)}function c(e){return"string"==typeof e}function p(e,t,r,n,i,s){const o="function"==typeof r?r():r;if(t<0&&i&&"EOL"===o)return o;if(t>=e.length&&!i)return!1;let a=i?1:r.length,l=!1,h=!1,u=n.maxMismatches,g=t,f=!1;for(;e[g];){const t=s(g);if(n.trimBeforeMatching&&""===e[g].trim()){if(!e[t]&&i&&"EOL"===r)return!0;g=s(g);continue}if(!n.i&&n.trimCharsBeforeMatching.includes(e[g])||n.i&&n.trimCharsBeforeMatching.map(e=>e.toLowerCase()).includes(e[g].toLowerCase())){if(i&&"EOL"===r&&!e[t])return!0;g=s(g);continue}const o=t>g?r[r.length-a]:r[a-1];if(!n.i&&e[g]===o||n.i&&e[g].toLowerCase()===o.toLowerCase()){if(f||(f=!0),h||(h=!0),a-=1,a<1)return g}else{if(!(n.maxMismatches&&u&&g)||n.firstMustMatch&&a===r.length)return!(0!==g||1!==a||!h)&&0;u--;for(let i=0;i<=u;i++){const o=t>g?r[r.length-a+1+i]:r[a-2-i],l=e[s(g)];if(o&&(!n.i&&e[g]===o||n.i&&e[g].toLowerCase()===o.toLowerCase())){a-=2,f=!0;break}if(l&&(!n.i&&l===o||n.i&&l.toLowerCase()===o.toLowerCase())){a-=1,f=!0;break}if(void 0===o&&u>=0&&f)return g}f||(l=g)}if(!1!==l&&l!==g&&(l=!1),a<1)return g;g=s(g)}return a>0?!(!i||"EOL"!==o)||!!(n.maxMismatches>=a&&h)&&(l||0):void 0}function y(e,t,r,n,i){if(f(i)&&Object.prototype.hasOwnProperty.call(i,"trimBeforeMatching")&&"boolean"!=typeof i.trimBeforeMatching)throw new Error(`string-match-left-right/${e}(): [THROW_ID_09] opts.trimBeforeMatching should be boolean!${Array.isArray(i.trimBeforeMatching)?" Did you mean to use opts.trimCharsBeforeMatching?":""}`);const s=Object.assign({},{i:!1,trimBeforeMatching:!1,trimCharsBeforeMatching:[],maxMismatches:0,firstMustMatch:!1,lastMustMatch:!1},i);if(s.trimCharsBeforeMatching=g(s.trimCharsBeforeMatching),s.trimCharsBeforeMatching=s.trimCharsBeforeMatching.map(e=>c(e)?e:String(e)),!c(t))return!1;if(!t.length)return!1;if(!Number.isInteger(r)||r<0)throw new Error(`string-match-left-right/${e}(): [THROW_ID_03] the second argument should be a natural number. Currently it's of a type: ${typeof r}, equal to:\n${JSON.stringify(r,null,4)}`);let o,a,l,h;if(c(n))o=[n];else if(Array.isArray(n))o=n;else if(n){if("function"!=typeof n)throw new Error(`string-match-left-right/${e}(): [THROW_ID_05] the third argument, whatToMatch, is neither string nor array of strings! It's ${typeof n}, equal to:\n${JSON.stringify(n,null,4)}`);o=[],o.push(n)}else o=n;if(i&&!f(i))throw new Error(`string-match-left-right/${e}(): [THROW_ID_06] the fourth argument, options object, should be a plain object. Currently it's of a type "${typeof i}", and equal to:\n${JSON.stringify(i,null,4)}`);if(s.trimCharsBeforeMatching.some((e,t)=>e.length>1&&(l=t,h=e,!0)))throw new Error(`string-match-left-right/${e}(): [THROW_ID_07] the fourth argument, options object contains trimCharsBeforeMatching. It was meant to list the single characters but one of the entries at index ${l} is longer than 1 character, ${h.length} (equals to ${h}). Please split it into separate characters and put into array as separate elements.`);if(!o||!Array.isArray(o)||Array.isArray(o)&&!o.length||Array.isArray(o)&&1===o.length&&c(o[0])&&!o[0].trim().length){if("function"==typeof s.cb){let n,i=r;if("matchLeftIncl"!==e&&"matchRight"!==e||(i+=1),"L"===e[5])for(let e=i;e--;){const r=t[e];if((!s.trimBeforeMatching||s.trimBeforeMatching&&void 0!==r&&r.trim().length)&&(!s.trimCharsBeforeMatching.length||void 0!==r&&!s.trimCharsBeforeMatching.includes(r))){n=e;break}}else if(e.startsWith("matchRight"))for(let e=i;e<t.length;e++){const r=t[e];if((!s.trimBeforeMatching||s.trimBeforeMatching&&r.trim().length)&&(!s.trimCharsBeforeMatching.length||!s.trimCharsBeforeMatching.includes(r))){n=e;break}}if(void 0===n)return!1;const o=t[n],a=n+1;let l="";return a&&a>0&&(l=t.slice(0,a)),"L"===e[5]?s.cb(o,l,n):(n&&n>0&&(l=t.slice(n)),s.cb(o,l,n))}let n="";throw i||(n=" More so, the whole options object, the fourth input argument, is missing!"),new Error(`string-match-left-right/${e}(): [THROW_ID_08] the third argument, "whatToMatch", was given as an empty string. This means, you intend to match purely by a callback. The callback was not set though, the opts key "cb" is not set!${n}`)}for(let n=0,i=o.length;n<i;n++){a="function"==typeof o[n];const i=o[n];let l,h,u="",g=r;"matchRight"===e?g++:"matchLeft"===e&&g--;const f=p(t,g,i,s,a,t=>"L"===e[5]?t-1:t+1);if(f&&a&&"function"==typeof i&&"EOL"===i())return!(!i()||s.cb&&!s.cb(l,u,h))&&i();if(Number.isInteger(f)&&(h=e.startsWith("matchLeft")?f-1:f+1,u="L"===e[5]?t.slice(0,f):t.slice(h)),h<0&&(h=void 0),t[h]&&(l=t[h]),Number.isInteger(f)&&(!s.cb||s.cb(l,u,h)))return i}return!1}function m(e,t,r,n){return y("matchLeftIncl",e,t,r,n)}function d(e,t,r,n){return y("matchRightIncl",e,t,r,n)}function T(e,t=!0,r){if(!(r.trim().length||e.length&&"\n"!==r&&" "!==r&&" "===(t?e[e.length-1]:e[0])||e.length&&"\n"===(t?e[e.length-1]:e[0])&&"\n"!==r&&" "!==r))if(t){if(("\n"===r||" "===r)&&e.length&&" "===e[e.length-1])for(;e.length&&" "===e[e.length-1];)e.pop();e.push(" "===r||"\n"===r?r:" ")}else{if(("\n"===r||" "===r)&&e.length&&" "===e[0])for(;e.length&&" "===e[0];)e.shift();e.unshift(" "===r||"\n"===r?r:" ")}}function w(e,t){if("string"==typeof e&&e.length){let r,n,i=!1;if(e.includes("\r\n")&&(i=!0),r=t&&"number"==typeof t?t:1,""===e.trim()){const t=[];for(n=r,Array.from(e).forEach(e=>{("\n"!==e||n)&&("\n"===e&&n--,T(t,!0,e))});t.length>1&&" "===t[t.length-1];)t.pop();return t.join("")}const s=[];if(n=r,""===e[0].trim())for(let t=0,r=e.length;t<r&&0===e[t].trim().length;t++)("\n"!==e[t]||n)&&("\n"===e[t]&&n--,T(s,!0,e[t]));const o=[];if(n=r,""===e.slice(-1).trim())for(let t=e.length;t--&&0===e[t].trim().length;)("\n"!==e[t]||n)&&("\n"===e[t]&&n--,T(o,!1,e[t]));return i?`${s.join("")}${e.trim()}${o.join("")}`.replace(/\n/g,"\r\n"):s.join("")+e.trim()+o.join("")}return e}function b(e,t){if(!Array.isArray(e))throw new TypeError(`ranges-sort: [THROW_ID_01] Input must be an array, consisting of range arrays! Currently its type is: ${typeof e}, equal to: ${JSON.stringify(e,null,4)}`);if(0===e.length)return e;const r=Object.assign({},{strictlyTwoElementsInRangeArrays:!1,progressFn:null},t);let n,i;if(r.strictlyTwoElementsInRangeArrays&&!e.every((e,t)=>2===e.length||(n=t,i=e.length,!1)))throw new TypeError(`ranges-sort: [THROW_ID_03] The first argument should be an array and must consist of arrays which are natural number indexes representing TWO string index ranges. However, ${n}th range (${JSON.stringify(e[n],null,4)}) has not two but ${i} elements!`);if(!e.every((e,t)=>!(!Number.isInteger(e[0])||e[0]<0||!Number.isInteger(e[1])||e[1]<0)||(n=t,!1)))throw new TypeError(`ranges-sort: [THROW_ID_04] The first argument should be an array and must consist of arrays which are natural number indexes representing string index ranges. However, ${n}th range (${JSON.stringify(e[n],null,4)}) does not consist of only natural numbers!`);const s=e.length*e.length;let o=0;return Array.from(e).sort((e,t)=>(r.progressFn&&(o++,r.progressFn(Math.floor(100*o/s))),e[0]===t[0]?e[1]<t[1]?-1:e[1]>t[1]?1:0:e[0]<t[0]?-1:1))}function O(e,t){function r(e){return"string"==typeof e}function n(e){return e&&"object"==typeof e&&!Array.isArray(e)}if(!Array.isArray(e))return e;const i={mergeType:1,progressFn:null,joinRangesThatTouchEdges:!0};let s;if(t){if(!n(t))throw new Error(`emlint: [THROW_ID_03] the second input argument must be a plain object. It was given as:\n${JSON.stringify(t,null,4)} (type ${typeof t})`);if(s=Object.assign({},i,t),s.progressFn&&n(s.progressFn)&&!Object.keys(s.progressFn).length)s.progressFn=null;else if(s.progressFn&&"function"!=typeof s.progressFn)throw new Error(`ranges-merge: [THROW_ID_01] opts.progressFn must be a function! It was given of a type: "${typeof s.progressFn}", equal to ${JSON.stringify(s.progressFn,null,4)}`);if(s.mergeType&&1!==s.mergeType&&2!==s.mergeType)if(r(s.mergeType)&&"1"===s.mergeType.trim())s.mergeType=1;else{if(!r(s.mergeType)||"2"!==s.mergeType.trim())throw new Error(`ranges-merge: [THROW_ID_02] opts.mergeType was customised to a wrong thing! It was given of a type: "${typeof s.mergeType}", equal to ${JSON.stringify(s.mergeType,null,4)}`);s.mergeType=2}if("boolean"!=typeof s.joinRangesThatTouchEdges)throw new Error(`ranges-merge: [THROW_ID_04] opts.joinRangesThatTouchEdges was customised to a wrong thing! It was given of a type: "${typeof s.joinRangesThatTouchEdges}", equal to ${JSON.stringify(s.joinRangesThatTouchEdges,null,4)}`)}else s=Object.assign({},i);const o=e.map(e=>[...e]).filter(e=>void 0!==e[2]||e[0]!==e[1]);let a,l,h;a=s.progressFn?b(o,{progressFn:e=>{h=Math.floor(e/5),h!==l&&(l=h,s.progressFn(h))}}):b(o);const u=a.length-1;for(let e=u;e>0;e--)s.progressFn&&(h=Math.floor(78*(1-e/u))+21,h!==l&&h>l&&(l=h,s.progressFn(h))),(a[e][0]<=a[e-1][0]||!s.joinRangesThatTouchEdges&&a[e][0]<a[e-1][1]||s.joinRangesThatTouchEdges&&a[e][0]<=a[e-1][1])&&(a[e-1][0]=Math.min(a[e][0],a[e-1][0]),a[e-1][1]=Math.max(a[e][1],a[e-1][1]),void 0!==a[e][2]&&(a[e-1][0]>=a[e][0]||a[e-1][1]<=a[e][1])&&null!==a[e-1][2]&&(null===a[e][2]&&null!==a[e-1][2]?a[e-1][2]=null:void 0!==a[e-1][2]?2===s.mergeType&&a[e-1][0]===a[e][0]?a[e-1][2]=a[e][2]:a[e-1][2]+=a[e][2]:a[e-1][2]=a[e][2]),a.splice(e,1),e=a.length);return a}function $(e){return null!=e}function _(e){return Number.isInteger(e)&&e>=0}function I(e){return"string"==typeof e}function v(e){return/^\d*$/.test(e)?parseInt(e,10):e}class A{constructor(e){const t=Object.assign({},{limitToBeAddedWhitespace:!1,limitLinebreaksCount:1,mergeType:1},e);if(t.mergeType&&1!==t.mergeType&&2!==t.mergeType)if(I(t.mergeType)&&"1"===t.mergeType.trim())t.mergeType=1;else{if(!I(t.mergeType)||"2"!==t.mergeType.trim())throw new Error(`ranges-push: [THROW_ID_02] opts.mergeType was customised to a wrong thing! It was given of a type: "${typeof t.mergeType}", equal to ${JSON.stringify(t.mergeType,null,4)}`);t.mergeType=2}this.opts=t}add(e,t,r,...n){if(n.length>0)throw new TypeError(`ranges-push/Ranges/add(): [THROW_ID_03] Please don't overload the add() method. From the 4th input argument onwards we see these redundant arguments: ${JSON.stringify(n,null,4)}`);if(!$(e)&&!$(t))return;if($(e)&&!$(t)){if(Array.isArray(e)){if(e.length){if(e.some(e=>Array.isArray(e)))return void e.forEach(e=>{Array.isArray(e)&&this.add(...e)});e.length>1&&_(v(e[0]))&&_(v(e[1]))&&this.add(...e)}return}throw new TypeError(`ranges-push/Ranges/add(): [THROW_ID_12] the first input argument, "from" is set (${JSON.stringify(e,null,0)}) but second-one, "to" is not (${JSON.stringify(t,null,0)})`)}if(!$(e)&&$(t))throw new TypeError(`ranges-push/Ranges/add(): [THROW_ID_13] the second input argument, "to" is set (${JSON.stringify(t,null,0)}) but first-one, "from" is not (${JSON.stringify(e,null,0)})`);const i=/^\d*$/.test(e)?parseInt(e,10):e,s=/^\d*$/.test(t)?parseInt(t,10):t;if(_(r)&&(r=String(r)),!_(i)||!_(s))throw _(i)&&i>=0?new TypeError(`ranges-push/Ranges/add(): [THROW_ID_10] "to" value, the second input argument, must be a natural number or zero! Currently it's of a type "${typeof s}" equal to: ${JSON.stringify(s,null,4)}`):new TypeError(`ranges-push/Ranges/add(): [THROW_ID_09] "from" value, the first input argument, must be a natural number or zero! Currently it's of a type "${typeof i}" equal to: ${JSON.stringify(i,null,4)}`);if($(r)&&!I(r)&&!_(r))throw new TypeError(`ranges-push/Ranges/add(): [THROW_ID_08] The third argument, the value to add, was given not as string but ${typeof r}, equal to:\n${JSON.stringify(r,null,4)}`);if($(this.slices)&&Array.isArray(this.last())&&i===this.last()[1]){if(this.last()[1]=s,this.last()[2],null!==this.last()[2]&&$(r)){let e=!($(this.last()[2])&&this.last()[2].length>0)||this.opts&&this.opts.mergeType&&1!==this.opts.mergeType?r:this.last()[2]+r;this.opts.limitToBeAddedWhitespace&&(e=w(e,this.opts.limitLinebreaksCount)),I(e)&&!e.length||(this.last()[2]=e)}}else{this.slices||(this.slices=[]);const e=void 0===r||I(r)&&!r.length?[i,s]:[i,s,this.opts.limitToBeAddedWhitespace?w(r,this.opts.limitLinebreaksCount):r];this.slices.push(e)}}push(e,t,r,...n){this.add(e,t,r,...n)}current(){return null!=this.slices?(this.slices=O(this.slices,{mergeType:this.opts.mergeType}),this.opts.limitToBeAddedWhitespace?this.slices.map(e=>$(e[2])?[e[0],e[1],w(e[2],this.opts.limitLinebreaksCount)]:e):this.slices):null}wipe(){this.slices=void 0}replace(e){if(Array.isArray(e)&&e.length){if(!Array.isArray(e[0])||!_(e[0][0]))throw new Error(`ranges-push/Ranges/replace(): [THROW_ID_11] Single range was given but we expected array of arrays! The first element, ${JSON.stringify(e[0],null,4)} should be an array and its first element should be an integer, a string index.`);this.slices=Array.from(e)}else this.slices=void 0}last(){return void 0!==this.slices&&Array.isArray(this.slices)?this.slices[this.slices.length-1]:null}}function M(e){return null!=e}function R(e){return"string"==typeof e}function E(e,t,r){let n=0,i=0;if(0===arguments.length)throw new Error("ranges-apply: [THROW_ID_01] inputs missing!");if(!R(e))throw new TypeError(`ranges-apply: [THROW_ID_02] first input argument must be a string! Currently it's: ${typeof e}, equal to: ${JSON.stringify(e,null,4)}`);if(null===t)return e;if(!Array.isArray(t))throw new TypeError(`ranges-apply: [THROW_ID_03] second input argument must be an array (or null)! Currently it's: ${typeof t}, equal to: ${JSON.stringify(t,null,4)}`);if(r&&"function"!=typeof r)throw new TypeError(`ranges-apply: [THROW_ID_04] the third input argument must be a function (or falsey)! Currently it's: ${typeof r}, equal to: ${JSON.stringify(r,null,4)}`);Array.isArray(t)&&(Number.isInteger(t[0])&&t[0]>=0||/^\d*$/.test(t[0]))&&(Number.isInteger(t[1])&&t[1]>=0||/^\d*$/.test(t[1]))&&(t=[t]);const s=t.length;let o=0;t.forEach((e,a)=>{if(r&&(n=Math.floor(o/s*10),n!==i&&(i=n,r(n))),!Array.isArray(e))throw new TypeError(`ranges-apply: [THROW_ID_05] ranges array, second input arg., has ${a}th element not an array: ${JSON.stringify(e,null,4)}, which is ${typeof e}`);if(!Number.isInteger(e[0])||e[0]<0){if(!/^\d*$/.test(e[0]))throw new TypeError(`ranges-apply: [THROW_ID_06] ranges array, second input arg. has ${a}th element, array [${e[0]},${e[1]}]. That array has first element not an integer, but ${typeof e[0]}, equal to: ${JSON.stringify(e[0],null,4)}. Computer doesn't like this.`);t[a][0]=Number.parseInt(t[a][0],10)}if(!Number.isInteger(e[1])){if(!/^\d*$/.test(e[1]))throw new TypeError(`ranges-apply: [THROW_ID_07] ranges array, second input arg. has ${a}th element, array [${e[0]},${e[1]}]. That array has second element not an integer, but ${typeof e[1]}, equal to: ${JSON.stringify(e[1],null,4)}. Computer doesn't like this.`);t[a][1]=Number.parseInt(t[a][1],10)}o++});const a=O(t,{progressFn:e=>{r&&(n=10+Math.floor(e/10),n!==i&&(i=n,r(n)))}}),l=a.length;if(l>0){const t=e.slice(a[l-1][1]);e=a.reduce((t,s,o,a)=>{r&&(n=20+Math.floor(o/l*80),n!==i&&(i=n,r(n)));const h=0===o?0:a[o-1][1],u=a[o][0];return t+e.slice(h,u)+(M(a[o][2])?a[o][2]:"")},""),e+=t}return e}function W(e,t){if("string"!=typeof e)throw new Error(`string-trim-spaces-only: [THROW_ID_01] input must be string! It was given as ${typeof e}, equal to:\n${JSON.stringify(e,null,4)}`);const r=Object.assign({},{classicTrim:!1,cr:!1,lf:!1,tab:!1,space:!0,nbsp:!1},t);function n(e){return r.classicTrim&&0===e.trim().length||!r.classicTrim&&(r.space&&" "===e||r.cr&&"\r"===e||r.lf&&"\n"===e||r.tab&&"\t"===e||r.nbsp&&" "===e)}let i,s;if(e.length>0){if(n(e[0]))for(let t=0,r=e.length;t<r;t++){if(!n(e[t])){i=t;break}if(t===e.length-1)return{res:"",ranges:[[0,e.length]]}}if(n(e[e.length-1]))for(let t=e.length;t--;)if(!n(e[t])){s=t+1;break}return i?s?{res:e.slice(i,s),ranges:[[0,i],[s,e.length]]}:{res:e.slice(i),ranges:[[0,i]]}:s?{res:e.slice(0,s),ranges:[[s,e.length]]}:{res:e,ranges:[]}}return{res:"",ranges:[]}}return function(t){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};function n(e){return null!=e}var i=Object.prototype.hasOwnProperty;function s(e){return"string"==typeof e}if(void 0===t)throw new Error("string-remove-duplicate-heads-tails: [THROW_ID_01] The input is missing!");if("string"!=typeof t)return t;if(n(r)&&!u(r))throw new Error("string-remove-duplicate-heads-tails: [THROW_ID_03] The given options are not a plain object but ".concat(e(r),"!"));if(n(r)&&i.call(r,"heads")){if(!g(r.heads).every((function(e){return s(e)})))throw new Error("string-remove-duplicate-heads-tails: [THROW_ID_04] The opts.heads contains elements which are not string-type!");s(r.heads)&&(r.heads=g(r.heads))}if(n(r)&&i.call(r,"tails")){if(!g(r.tails).every((function(e){return s(e)})))throw new Error("string-remove-duplicate-heads-tails: [THROW_ID_05] The opts.tails contains elements which are not string-type!");s(r.tails)&&(r.tails=g(r.tails))}var o=W(t).res;if(0===o.length)return t;t=o;var a={heads:["{{"],tails:["}}"]},l=Object.assign({},a,r);l.heads=l.heads.map((function(e){return e.trim()})),l.tails=l.tails.map((function(e){return e.trim()}));var h=!1,f=!1,c=new A({limitToBeAddedWhitespace:!0}),p=new A({limitToBeAddedWhitespace:!0}),y=!0,T=!0,w="";function b(e,t){var r;return d(e,0,t.heads,{trimBeforeMatching:!0,cb:function(e,t,n){return r=n,!0},relaxedApi:!0})&&d(e,r,t.tails,{trimBeforeMatching:!0,cb:function(e,t,n){return r=n,!0},relaxedApi:!0})?e.slice(r):e}for(;t!==b(t,l);)t=W(b(t,l)).res;function O(e,t){var r;return m(e,e.length-1,t.tails,{trimBeforeMatching:!0,cb:function(e,t,n){return r=n,!0},relaxedApi:!0})&&m(e,r,t.heads,{trimBeforeMatching:!0,cb:function(e,t,n){return r=n,!0},relaxedApi:!0})?e.slice(0,r+1):e}for(;t!==O(t,l);)t=W(O(t,l)).res;if(!(l.heads.length&&d(t,0,l.heads,{trimBeforeMatching:!0,relaxedApi:!0})&&l.tails.length&&m(t,t.length-1,l.tails,{trimBeforeMatching:!0,relaxedApi:!0})))return W(t).res;for(var $=0,_=t.length;$<_;$++)if(""===t[$].trim());else{var I=void 0,v=d(t,$,l.heads,{trimBeforeMatching:!0,cb:function(e,t,r){return I=r,!0},relaxedApi:!0});if(v){T=!0,y&&(y=!0);var M=void 0,R=d(t,I,l.tails,{trimBeforeMatching:!0,cb:function(e,t,r){return M=r,!0},relaxedApi:!0});R&&c.push($,M),p.current()&&h&&"tails"!==w&&c.push(p.current()),h?p.push($,I):(p.current()&&(c.push(p.current()),p.wipe()),p.push($,I)),w="heads",$=I-1;continue}var B=d(t,$,l.tails,{trimBeforeMatching:!0,cb:function(e,r,i){return I=n(i)?i:t.length,!0},relaxedApi:!0});if(B){T=!0,y?("heads"===w&&p.wipe(),y=!1):p.push($,I),w="tails",$=I-1;continue}y&&(y=!0),T&&!h?(h=!0,T=!1):T&&!f?(f=!0,y=!0,T=!1,"heads"===w&&p.wipe()):T&&f&&p.wipe()}return p.current()&&c.push(p.current()),c.current()?E(t,c.current()).trim():t.trim()}}));
