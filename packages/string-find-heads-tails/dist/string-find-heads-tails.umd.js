/**
 * string-find-heads-tails
 * Search for string pairs. A special case of string search algorithm.
 * Version: 3.16.10
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/string-find-heads-tails
 */

!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):(t="undefined"!=typeof globalThis?globalThis:t||self).stringFindHeadsTails=e()}(this,(function(){"use strict";function t(e){return(t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(e)}function e(t,e,r){return e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}function r(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),r.push.apply(r,n)}return r}function n(t){for(var n=1;n<arguments.length;n++){var i=null!=arguments[n]?arguments[n]:{};n%2?r(Object(i),!0).forEach((function(r){e(t,r,i[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(i)):r(Object(i)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(i,e))}))}return t}function i(t){return"string"==typeof t?t.length>0?[t]:[]:t}function o(t){return t&&"object"==typeof t&&!Array.isArray(t)}function a(t){return"string"==typeof t}function s(t,e,r,n,i,o){const a="function"==typeof r?r():r;if(e<0&&i&&"EOL"===a)return a;if(e>=t.length&&!i)return!1;let s=i?1:r.length,c=!1,h=!1,l=n.maxMismatches,f=e,u=!1,g=!1,d=!1;for(;t[f];){const e=o(f);if(n.trimBeforeMatching&&""===t[f].trim()){if(!t[e]&&i&&"EOL"===r)return!0;f=o(f);continue}if(!n.i&&n.trimCharsBeforeMatching.includes(t[f])||n.i&&n.trimCharsBeforeMatching.map(t=>t.toLowerCase()).includes(t[f].toLowerCase())){if(i&&"EOL"===r&&!t[e])return!0;f=o(f);continue}const a=e>f?r[r.length-s]:r[s-1];if(!n.i&&t[f]===a||n.i&&t[f].toLowerCase()===a.toLowerCase()){if(u||(u=!0),h||(h=!0),s===r.length?g=!0:1===s&&(d=!0),s-=1,s<1)return f}else{if(!(n.maxMismatches&&l&&f))return!(0!==f||1!==s||n.lastMustMatch||!h)&&0;l-=1;for(let i=0;i<=l;i++){const a=e>f?r[r.length-s+1+i]:r[s-2-i],c=t[o(f)];if(a&&(!n.i&&t[f]===a||n.i&&t[f].toLowerCase()===a.toLowerCase())&&(!n.firstMustMatch||s!==r.length)){s-=2,u=!0;break}if(c&&a&&(!n.i&&c===a||n.i&&c.toLowerCase()===a.toLowerCase())&&(!n.firstMustMatch||s!==r.length)){s-=1,u=!0;break}if(void 0===a&&l>=0&&u&&(!n.firstMustMatch||g)&&(!n.lastMustMatch||d))return f}u||(c=f)}if(!1!==c&&c!==f&&(c=!1),s<1)return f;f=o(f)}return s>0?!(!i||"EOL"!==a)||!!(n.maxMismatches>=s&&h)&&(c||0):void 0}function c(t,e,r,n){return function(t,e,r,n,c){if(o(c)&&Object.prototype.hasOwnProperty.call(c,"trimBeforeMatching")&&"boolean"!=typeof c.trimBeforeMatching)throw new Error(`string-match-left-right/${t}(): [THROW_ID_09] opts.trimBeforeMatching should be boolean!${Array.isArray(c.trimBeforeMatching)?" Did you mean to use opts.trimCharsBeforeMatching?":""}`);const h={i:!1,trimBeforeMatching:!1,trimCharsBeforeMatching:[],maxMismatches:0,firstMustMatch:!1,lastMustMatch:!1,...c};if(h.trimCharsBeforeMatching=i(h.trimCharsBeforeMatching),h.trimCharsBeforeMatching=h.trimCharsBeforeMatching.map(t=>a(t)?t:String(t)),!a(e))return!1;if(!e.length)return!1;if(!Number.isInteger(r)||r<0)throw new Error(`string-match-left-right/${t}(): [THROW_ID_03] the second argument should be a natural number. Currently it's of a type: ${typeof r}, equal to:\n${JSON.stringify(r,null,4)}`);let l,f,u,g;if(a(n))l=[n];else if(Array.isArray(n))l=n;else if(n){if("function"!=typeof n)throw new Error(`string-match-left-right/${t}(): [THROW_ID_05] the third argument, whatToMatch, is neither string nor array of strings! It's ${typeof n}, equal to:\n${JSON.stringify(n,null,4)}`);l=[],l.push(n)}else l=n;if(c&&!o(c))throw new Error(`string-match-left-right/${t}(): [THROW_ID_06] the fourth argument, options object, should be a plain object. Currently it's of a type "${typeof c}", and equal to:\n${JSON.stringify(c,null,4)}`);if(h.trimCharsBeforeMatching.some((t,e)=>t.length>1&&(u=e,g=t,!0)))throw new Error(`string-match-left-right/${t}(): [THROW_ID_07] the fourth argument, options object contains trimCharsBeforeMatching. It was meant to list the single characters but one of the entries at index ${u} is longer than 1 character, ${g.length} (equals to ${g}). Please split it into separate characters and put into array as separate elements.`);if(!l||!Array.isArray(l)||Array.isArray(l)&&!l.length||Array.isArray(l)&&1===l.length&&a(l[0])&&!l[0].trim()){if("function"==typeof h.cb){let n,i=r;if("matchLeftIncl"!==t&&"matchRight"!==t||(i+=1),"L"===t[5])for(let t=i;t--;){const r=e[t];if((!h.trimBeforeMatching||h.trimBeforeMatching&&void 0!==r&&r.trim())&&(!h.trimCharsBeforeMatching.length||void 0!==r&&!h.trimCharsBeforeMatching.includes(r))){n=t;break}}else if(t.startsWith("matchRight"))for(let t=i;t<e.length;t++){const r=e[t];if((!h.trimBeforeMatching||h.trimBeforeMatching&&r.trim())&&(!h.trimCharsBeforeMatching.length||!h.trimCharsBeforeMatching.includes(r))){n=t;break}}if(void 0===n)return!1;const o=e[n],a=n+1;let s="";return a&&a>0&&(s=e.slice(0,a)),"L"===t[5]?h.cb(o,s,n):(n&&n>0&&(s=e.slice(n)),h.cb(o,s,n))}let n="";throw c||(n=" More so, the whole options object, the fourth input argument, is missing!"),new Error(`string-match-left-right/${t}(): [THROW_ID_08] the third argument, "whatToMatch", was given as an empty string. This means, you intend to match purely by a callback. The callback was not set though, the opts key "cb" is not set!${n}`)}for(let n=0,i=l.length;n<i;n++){f="function"==typeof l[n];const i=l[n];let o,a,c="",u=r;"matchRight"===t?u+=1:"matchLeft"===t&&(u-=1);const g=s(e,u,i,h,f,e=>"L"===t[5]?e-1:e+1);if(g&&f&&"function"==typeof i&&"EOL"===i())return!(!i()||h.cb&&!h.cb(o,c,a))&&i();if(Number.isInteger(g)&&(a=t.startsWith("matchLeft")?g-1:g+1,c="L"===t[5]?e.slice(0,g):e.slice(a)),a<0&&(a=void 0),e[a]&&(o=e[a]),Number.isInteger(g)&&(!h.cb||h.cb(o,c,a)))return i}return!1}("matchRightIncl",t,e,r,n)}function h(t){return"string"==typeof t}return function(e,r,o,a){if(a&&(!(s=a)||"object"!==t(s)||Array.isArray(s)))throw new TypeError("string-find-heads-tails: [THROW_ID_01] the fourth input argument, an Optional Options Object, must be a plain object! Currently it's equal to: ".concat(a," (type: ").concat(t(a),")"));var s,l,f,u={fromIndex:0,throwWhenSomethingWrongIsDetected:!0,allowWholeValueToBeOnlyHeadsOrTails:!0,source:"string-find-heads-tails",matchHeadsAndTailsStrictlyInPairsByTheirOrder:!1,relaxedAPI:!1},g=n(n({},u),a);if("string"==typeof g.fromIndex&&/^\d*$/.test(g.fromIndex))g.fromIndex=Number(g.fromIndex);else if(!Number.isInteger(g.fromIndex)||g.fromIndex<0)throw new TypeError("".concat(g.source," [THROW_ID_18] the fourth input argument must be a natural number or zero! Currently it's: ").concat(g.fromIndex));if(!h(e)||0===e.length){if(g.relaxedAPI)return[];throw new TypeError("string-find-heads-tails: [THROW_ID_02] the first input argument, input string, must be a non-zero-length string! Currently it's: ".concat(t(e),", equal to: ").concat(e))}if("string"!=typeof r&&!Array.isArray(r)){if(g.relaxedAPI)return[];throw new TypeError("string-find-heads-tails: [THROW_ID_03] the second input argument, heads, must be either a string or an array of strings! Currently it's: ".concat(t(r),", equal to:\n").concat(JSON.stringify(r,null,4)))}if("string"==typeof r){if(0===r.length){if(g.relaxedAPI)return[];throw new TypeError("string-find-heads-tails: [THROW_ID_04] the second input argument, heads, must be a non-empty string! Currently it's empty.")}r=i(r)}else if(Array.isArray(r)){if(0===r.length){if(g.relaxedAPI)return[];throw new TypeError("string-find-heads-tails: [THROW_ID_05] the second input argument, heads, must be a non-empty array and contain at least one string! Currently it's empty.")}if(r.every((function(t,e){return l=t,f=e,h(t)}))){if(!r.every((function(t,e){return f=e,h(t)&&t.length>0&&""!==t.trim()}))){if(!g.relaxedAPI)throw new TypeError("string-find-heads-tails: [THROW_ID_07] the second input argument, heads, should not contain empty strings! For example, there's one detected at index ".concat(f," of heads array:\n").concat(JSON.stringify(r,null,4),"."));if(0===(r=r.filter((function(t){return h(t)&&t.length>0}))).length)return[]}}else{if(!g.relaxedAPI)throw new TypeError("string-find-heads-tails: [THROW_ID_06] the second input argument, heads, contains non-string elements! For example, element at ".concat(f,"th index is ").concat(t(l),", equal to:\n").concat(JSON.stringify(l,null,4),". Whole heads array looks like:\n").concat(JSON.stringify(r,null,4)));if(0===(r=r.filter((function(t){return h(t)&&t.length>0}))).length)return[]}}if(!h(o)&&!Array.isArray(o)){if(g.relaxedAPI)return[];throw new TypeError("string-find-heads-tails: [THROW_ID_08] the third input argument, tails, must be either a string or an array of strings! Currently it's: ".concat(t(o),", equal to:\n").concat(JSON.stringify(o,null,4)))}if(h(o)){if(0===o.length){if(g.relaxedAPI)return[];throw new TypeError("string-find-heads-tails: [THROW_ID_09] the third input argument, tails, must be a non-empty string! Currently it's empty.")}o=i(o)}else if(Array.isArray(o)){if(0===o.length){if(g.relaxedAPI)return[];throw new TypeError("string-find-heads-tails: [THROW_ID_10] the third input argument, tails, must be a non-empty array and contain at least one string! Currently it's empty.")}if(o.every((function(t,e){return l=t,f=e,h(t)}))){if(!o.every((function(t,e){return f=e,h(t)&&t.length>0&&""!==t.trim()}))){if(!g.relaxedAPI)throw new TypeError("string-find-heads-tails: [THROW_ID_12] the third input argument, tails, should not contain empty strings! For example, there's one detected at index ".concat(f,". Whole tails array is equal to:\n").concat(JSON.stringify(o,null,4)));if(0===(o=o.filter((function(t){return h(t)&&t.length>0}))).length)return[]}}else{if(!g.relaxedAPI)throw new TypeError("string-find-heads-tails: [THROW_ID_11] the third input argument, tails, contains non-string elements! For example, element at ".concat(f,"th index is ").concat(t(l),", equal to:\n").concat(JSON.stringify(l,null,4),". Whole tails array is equal to:\n").concat(JSON.stringify(o,null,4)));if(0===(o=o.filter((function(t){return h(t)&&t.length>0}))).length)return[]}}var d=g.source===u.source;if(g.throwWhenSomethingWrongIsDetected&&!g.allowWholeValueToBeOnlyHeadsOrTails){if(i(r).includes(e))throw new Error("".concat(g.source).concat(d?": [THROW_ID_16]":""," the whole input string can't be equal to ").concat(h(r)?"":"one of ","heads (").concat(e,")!"));if(i(o).includes(e))throw new Error("".concat(g.source).concat(d?": [THROW_ID_17]":""," the whole input string can't be equal to ").concat(h(o)?"":"one of ","tails (").concat(e,")!"))}for(var m,y=r.concat(o).map((function(t){return t.charAt(0)})).reduce((function(t,e){return e.charCodeAt(0)>t[1]?[t[0],e.charCodeAt(0)]:e.charCodeAt(0)<t[0]?[e.charCodeAt(0),t[1]]:t}),[r[0].charCodeAt(0),r[0].charCodeAt(0)]),p=[],w=!1,b={},O=!1,I=g.fromIndex,T=e.length;I<T;I++){var A=e[I].charCodeAt(0);if(A<=y[1]&&A>=y[0]){var W=c(e,I,r);if(W&&g.matchHeadsAndTailsStrictlyInPairsByTheirOrder)for(var _=r.length;_--;)if(r[_]===W){m=_;break}if(W){if(!w){(b={}).headsStartAt=I,b.headsEndAt=I+W.length,w=!0,I+=W.length-1,O&&(O=!1);continue}if(g.throwWhenSomethingWrongIsDetected)throw new TypeError("".concat(g.source).concat(d?": [THROW_ID_19]":"",' When processing "').concat(e,'", we found heads (').concat(e.slice(I,I+W.length),') starting at character with index number "').concat(I,'" and there was another set of heads before it! Generally speaking, there should be "heads-tails-heads-tails", not "heads-heads-tails"!\nWe\'re talking about the area of the code:\n\n\n--------------------------------------starts\n').concat(e.slice(Math.max(I-200,0),I),"\n      ","[".concat(33,"m-------\x3e[",39,"m")," ","[".concat(31,"m",e.slice(I,I+W.length),"[",39,"m")," [",33,"m","<-------","[",39,"m\n").concat(e.slice(I+W.length,Math.min(T,I+200)),"\n--------------------------------------ends\n\n\nTo turn off this error being thrown, set opts.throwWhenSomethingWrongIsDetected to Boolean false."))}var M=c(e,I,o);if(w&&M&&g.matchHeadsAndTailsStrictlyInPairsByTheirOrder&&void 0!==m&&void 0!==o[m]&&o[m]!==M){for(var x=void 0,C=o.length;C--;)if(o[C]===M){x=C;break}throw new TypeError("".concat(g.source).concat(d?": [THROW_ID_20]":"",' When processing "').concat(e,'", we had "opts.matchHeadsAndTailsStrictlyInPairsByTheirOrder" on. We found heads (').concat(r[m],") but the tails the followed it were not of the same index, ").concat(m," (").concat(o[m],") but ").concat(x," (").concat(M,")."))}if(M){if(w){b.tailsStartAt=I,b.tailsEndAt=I+M.length,p.push(b),b={},w=!1,I+=M.length-1;continue}g.throwWhenSomethingWrongIsDetected&&(O="".concat(g.source).concat(d?": [THROW_ID_21]":"",' When processing "').concat(e,'", we found tails (').concat(e.slice(I,I+M.length),') starting at character with index number "').concat(I,"\" but there were no heads preceding it. That's very naughty!"))}}if(g.throwWhenSomethingWrongIsDetected&&I===T-1){if(0!==Object.keys(b).length)throw new TypeError("".concat(g.source).concat(d?": [THROW_ID_22]":"",' When processing "').concat(e,"\", we reached the end of the string and yet didn't find any tails (").concat(JSON.stringify(o,null,4),") to match the last detected heads (").concat(e.slice(b.headsStartAt,b.headsEndAt),")!"));if(O)throw new Error(O)}}return p}}));
