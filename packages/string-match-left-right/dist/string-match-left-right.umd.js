/**
 * string-match-left-right
 * Do substrings match what's on the left or right of a given index?
 * Version: 4.0.5
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/string-match-left-right
 */

!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e((t=t||self).stringMatchLeftRight={})}(this,(function(t){"use strict";function e(t){return(e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function r(t,e,r){return e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}function n(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),r.push.apply(r,n)}return r}function i(t){for(var e=1;e<arguments.length;e++){var i=null!=arguments[e]?arguments[e]:{};e%2?n(Object(i),!0).forEach((function(e){r(t,e,i[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(i)):n(Object(i)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(i,e))}))}return t}function o(t){return t&&"object"===e(t)&&!Array.isArray(t)}function a(t){return"string"==typeof t}function c(t,e,r,n,i,o){var a="function"==typeof r?r():r;if(e<0&&i&&"EOL"===a)return a;if(e>=t.length&&!i)return!1;for(var c=i?1:r.length,s=!1,f=!1,h=n.maxMismatches,u=e,l=!1,g=!1,m=!1;t[u];){var y=o(u);if(n.trimBeforeMatching&&""===t[u].trim()){if(!t[y]&&i&&"EOL"===r)return!0;u=o(u)}else if(!n.i&&n.trimCharsBeforeMatching.includes(t[u])||n.i&&n.trimCharsBeforeMatching.map((function(t){return t.toLowerCase()})).includes(t[u].toLowerCase())){if(i&&"EOL"===r&&!t[y])return!0;u=o(u)}else{var p=y>u?r[r.length-c]:r[c-1];if(!n.i&&t[u]===p||n.i&&t[u].toLowerCase()===p.toLowerCase()){if(l||(l=!0),f||(f=!0),c===r.length?g=!0:1===c&&(m=!0),(c-=1)<1)return u}else{if(!(n.maxMismatches&&h&&u))return!(0!==u||1!==c||n.lastMustMatch||!f)&&0;h-=1;for(var b=0;b<=h;b++){var M=y>u?r[r.length-c+1+b]:r[c-2-b],d=t[o(u)];if(M&&(!n.i&&t[u]===M||n.i&&t[u].toLowerCase()===M.toLowerCase())&&(!n.firstMustMatch||c!==r.length)){c-=2,l=!0;break}if(d&&M&&(!n.i&&d===M||n.i&&d.toLowerCase()===M.toLowerCase())&&(!n.firstMustMatch||c!==r.length)){c-=1,l=!0;break}if(void 0===M&&h>=0&&l&&(!n.firstMustMatch||g)&&(!n.lastMustMatch||m))return u}l||(s=u)}if(!1!==s&&s!==u&&(s=!1),c<1)return u;u=o(u)}}return c>0?!(!i||"EOL"!==a)||!!(n.maxMismatches>=c&&f)&&(s||0):void 0}function s(t,r,n,s,f){if(o(f)&&Object.prototype.hasOwnProperty.call(f,"trimBeforeMatching")&&"boolean"!=typeof f.trimBeforeMatching)throw new Error("string-match-left-right/".concat(t,"(): [THROW_ID_09] opts.trimBeforeMatching should be boolean!").concat(Array.isArray(f.trimBeforeMatching)?" Did you mean to use opts.trimCharsBeforeMatching?":""));var h,u,l,g,m,y=i(i({},{i:!1,trimBeforeMatching:!1,trimCharsBeforeMatching:[],maxMismatches:0,firstMustMatch:!1,lastMustMatch:!1}),f);if(y.trimCharsBeforeMatching="string"==typeof(h=y.trimCharsBeforeMatching)?h.length>0?[h]:[]:h,y.trimCharsBeforeMatching=y.trimCharsBeforeMatching.map((function(t){return a(t)?t:String(t)})),!a(r))return!1;if(!r.length)return!1;if(!Number.isInteger(n)||n<0)throw new Error("string-match-left-right/".concat(t,"(): [THROW_ID_03] the second argument should be a natural number. Currently it's of a type: ").concat(e(n),", equal to:\n").concat(JSON.stringify(n,null,4)));if(a(s))u=[s];else if(Array.isArray(s))u=s;else if(s){if("function"!=typeof s)throw new Error("string-match-left-right/".concat(t,"(): [THROW_ID_05] the third argument, whatToMatch, is neither string nor array of strings! It's ").concat(e(s),", equal to:\n").concat(JSON.stringify(s,null,4)));(u=[]).push(s)}else u=s;if(f&&!o(f))throw new Error("string-match-left-right/".concat(t,"(): [THROW_ID_06] the fourth argument, options object, should be a plain object. Currently it's of a type \"").concat(e(f),'", and equal to:\n').concat(JSON.stringify(f,null,4)));if(y.trimCharsBeforeMatching.some((function(t,e){return t.length>1&&(g=e,m=t,!0)})))throw new Error("string-match-left-right/".concat(t,"(): [THROW_ID_07] the fourth argument, options object contains trimCharsBeforeMatching. It was meant to list the single characters but one of the entries at index ").concat(g," is longer than 1 character, ").concat(m.length," (equals to ").concat(m,"). Please split it into separate characters and put into array as separate elements."));if(!u||!Array.isArray(u)||Array.isArray(u)&&!u.length||Array.isArray(u)&&1===u.length&&a(u[0])&&!u[0].trim()){if("function"==typeof y.cb){var p,b=n;if("matchLeftIncl"!==t&&"matchRight"!==t||(b+=1),"L"===t[5])for(var M=b;M--;){var d=r[M];if((!y.trimBeforeMatching||y.trimBeforeMatching&&void 0!==d&&d.trim())&&(!y.trimCharsBeforeMatching.length||void 0!==d&&!y.trimCharsBeforeMatching.includes(d))){p=M;break}}else if(t.startsWith("matchRight"))for(var O=b;O<r.length;O++){var w=r[O];if((!y.trimBeforeMatching||y.trimBeforeMatching&&w.trim())&&(!y.trimCharsBeforeMatching.length||!y.trimCharsBeforeMatching.includes(w))){p=O;break}}if(void 0===p)return!1;var v=r[p],L=p+1,B="";return L&&L>0&&(B=r.slice(0,L)),"L"===t[5]?y.cb(v,B,p):(p&&p>0&&(B=r.slice(p)),y.cb(v,B,p))}var C="";throw f||(C=" More so, the whole options object, the fourth input argument, is missing!"),new Error("string-match-left-right/".concat(t,'(): [THROW_ID_08] the third argument, "whatToMatch", was given as an empty string. This means, you intend to match purely by a callback. The callback was not set though, the opts key "cb" is not set!').concat(C))}for(var j=0,I=u.length;j<I;j++){l="function"==typeof u[j];var R=u[j],_=void 0,E=void 0,A="",P=n;"matchRight"===t?P+=1:"matchLeft"===t&&(P-=1);var D=c(r,P,R,y,l,(function(e){return"L"===t[5]?e-1:e+1}));if(D&&l&&"function"==typeof R&&"EOL"===R())return!(!R()||y.cb&&!y.cb(_,A,E))&&R();if(Number.isInteger(D)&&(E=t.startsWith("matchLeft")?D-1:D+1,A="L"===t[5]?r.slice(0,D):r.slice(E)),E<0&&(E=void 0),r[E]&&(_=r[E]),Number.isInteger(D)&&(!y.cb||y.cb(_,A,E)))return R}return!1}t.matchLeft=function(t,e,r,n){return s("matchLeft",t,e,r,n)},t.matchLeftIncl=function(t,e,r,n){return s("matchLeftIncl",t,e,r,n)},t.matchRight=function(t,e,r,n){return s("matchRight",t,e,r,n)},t.matchRightIncl=function(t,e,r,n){return s("matchRightIncl",t,e,r,n)},Object.defineProperty(t,"__esModule",{value:!0})}));
