/**
 * array-group-str-omit-num-char
 * Groups array of strings by omitting number characters
 * Version: 3.0.3
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/array-group-str-omit-num-char/
 */

!function(t,r){"object"==typeof exports&&"undefined"!=typeof module?module.exports=r():"function"==typeof define&&define.amd?define(r):(t="undefined"!=typeof globalThis?globalThis:t||self).arrayGroupStrOmitNumChar=r()}(this,(function(){"use strict";function t(r){return(t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(r)}function r(t,r,e){return r in t?Object.defineProperty(t,r,{value:e,enumerable:!0,configurable:!0,writable:!0}):t[r]=e,t}function e(t,r){var e=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(t,r).enumerable}))),e.push.apply(e,n)}return e}function n(t){for(var n=1;n<arguments.length;n++){var o=null!=arguments[n]?arguments[n]:{};n%2?e(Object(o),!0).forEach((function(e){r(t,e,o[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(o)):e(Object(o)).forEach((function(r){Object.defineProperty(t,r,Object.getOwnPropertyDescriptor(o,r))}))}return t}function o(t){return function(t){if(Array.isArray(t))return a(t)}(t)||function(t){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(t))return Array.from(t)}(t)||function(t,r){if(!t)return;if("string"==typeof t)return a(t,r);var e=Object.prototype.toString.call(t).slice(8,-1);"Object"===e&&t.constructor&&(e=t.constructor.name);if("Map"===e||"Set"===e)return Array.from(t);if("Arguments"===e||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e))return a(t,r)}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function a(t,r){(null==r||r>t.length)&&(r=t.length);for(var e=0,n=new Array(r);e<r;e++)n[e]=t[e];return n}var i="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},s="__lodash_hash_undefined__",u="[object Function]",c="[object GeneratorFunction]",l=/^\[object .+?Constructor\]$/,f="object"==t(i)&&i&&i.Object===Object&&i,h="object"==("undefined"==typeof self?"undefined":t(self))&&self&&self.Object===Object&&self,p=f||h||Function("return this")();function g(t,r){return!!(t?t.length:0)&&function(t,r,e){if(r!=r)return function(t,r,e,n){var o=t.length,a=e+(n?1:-1);for(;n?a--:++a<o;)if(r(t[a],a,t))return a;return-1}(t,d,e);var n=e-1,o=t.length;for(;++n<o;)if(t[n]===r)return n;return-1}(t,r,0)>-1}function y(t,r,e){for(var n=-1,o=t?t.length:0;++n<o;)if(e(r,t[n]))return!0;return!1}function d(t){return t!=t}function _(t,r){return t.has(r)}function m(t){var r=-1,e=Array(t.size);return t.forEach((function(t){e[++r]=t})),e}var b,v=Array.prototype,w=Function.prototype,O=Object.prototype,T=p["__core-js_shared__"],W=(b=/[^.]+$/.exec(T&&T.keys&&T.keys.IE_PROTO||""))?"Symbol(src)_1."+b:"",j=w.toString,R=O.hasOwnProperty,E=O.toString,I=RegExp("^"+j.call(R).replace(/[\\^$.*+?()[\]{}|]/g,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$"),A=v.splice,S=q(p,"Map"),F=q(p,"Set"),N=q(Object,"create");function C(t){var r=-1,e=t?t.length:0;for(this.clear();++r<e;){var n=t[r];this.set(n[0],n[1])}}function D(t){var r=-1,e=t?t.length:0;for(this.clear();++r<e;){var n=t[r];this.set(n[0],n[1])}}function H(t){var r=-1,e=t?t.length:0;for(this.clear();++r<e;){var n=t[r];this.set(n[0],n[1])}}function P(t){var r=-1,e=t?t.length:0;for(this.__data__=new H;++r<e;)this.add(t[r])}function J(t,r){for(var e,n,o=t.length;o--;)if((e=t[o][0])===(n=r)||e!=e&&n!=n)return o;return-1}function M(t){return!(!k(t)||(r=t,W&&W in r))&&(function(t){var r=k(t)?E.call(t):"";return r==u||r==c}(t)||function(t){var r=!1;if(null!=t&&"function"!=typeof t.toString)try{r=!!(t+"")}catch(t){}return r}(t)?I:l).test(function(t){if(null!=t){try{return j.call(t)}catch(t){}try{return t+""}catch(t){}}return""}(t));var r}C.prototype.clear=function(){this.__data__=N?N(null):{}},C.prototype.delete=function(t){return this.has(t)&&delete this.__data__[t]},C.prototype.get=function(t){var r=this.__data__;if(N){var e=r[t];return e===s?void 0:e}return R.call(r,t)?r[t]:void 0},C.prototype.has=function(t){var r=this.__data__;return N?void 0!==r[t]:R.call(r,t)},C.prototype.set=function(t,r){return this.__data__[t]=N&&void 0===r?s:r,this},D.prototype.clear=function(){this.__data__=[]},D.prototype.delete=function(t){var r=this.__data__,e=J(r,t);return!(e<0)&&(e==r.length-1?r.pop():A.call(r,e,1),!0)},D.prototype.get=function(t){var r=this.__data__,e=J(r,t);return e<0?void 0:r[e][1]},D.prototype.has=function(t){return J(this.__data__,t)>-1},D.prototype.set=function(t,r){var e=this.__data__,n=J(e,t);return n<0?e.push([t,r]):e[n][1]=r,this},H.prototype.clear=function(){this.__data__={hash:new C,map:new(S||D),string:new C}},H.prototype.delete=function(t){return x(this,t).delete(t)},H.prototype.get=function(t){return x(this,t).get(t)},H.prototype.has=function(t){return x(this,t).has(t)},H.prototype.set=function(t,r){return x(this,t).set(t,r),this},P.prototype.add=P.prototype.push=function(t){return this.__data__.set(t,s),this},P.prototype.has=function(t){return this.__data__.has(t)};var $=F&&1/m(new F([,-0]))[1]==1/0?function(t){return new F(t)}:function(){};function x(r,e){var n,o,a=r.__data__;return("string"==(o=t(n=e))||"number"==o||"symbol"==o||"boolean"==o?"__proto__"!==n:null===n)?a["string"==typeof e?"string":"hash"]:a.map}function q(t,r){var e=function(t,r){return null==t?void 0:t[r]}(t,r);return M(e)?e:void 0}function k(r){var e=t(r);return!!r&&("object"==e||"function"==e)}var G=function(t){return t&&t.length?function(t,r,e){var n=-1,o=g,a=t.length,i=!0,s=[],u=s;if(e)i=!1,o=y;else if(a>=200){var c=r?null:$(t);if(c)return m(c);i=!1,o=_,u=new P}else u=r?[]:s;t:for(;++n<a;){var l=t[n],f=r?r(l):l;if(l=e||0!==l?l:0,i&&f==f){for(var h=u.length;h--;)if(u[h]===f)continue t;r&&u.push(f),s.push(l)}else o(u,f,e)||(u!==s&&u.push(f),s.push(l))}return s}(t):[]};function z(t,r){if(!Array.isArray(t)||!t.length)return t;var e,o,a=n(n({},{strictlyTwoElementsInRangeArrays:!1,progressFn:null}),r);if(a.strictlyTwoElementsInRangeArrays&&!t.filter((function(t){return t})).every((function(t,r){return 2===t.length||(e=r,o=t.length,!1)})))throw new TypeError("ranges-sort: [THROW_ID_03] The first argument should be an array and must consist of arrays which are natural number indexes representing TWO string index ranges. However, ".concat(e,"th range (").concat(JSON.stringify(t[e],null,4),") has not two but ").concat(o," elements!"));if(!t.filter((function(t){return t})).every((function(t,r){return!(!Number.isInteger(t[0])||t[0]<0||!Number.isInteger(t[1])||t[1]<0)||(e=r,!1)})))throw new TypeError("ranges-sort: [THROW_ID_04] The first argument should be an array and must consist of arrays which are natural number indexes representing string index ranges. However, ".concat(e,"th range (").concat(JSON.stringify(t[e],null,4),") does not consist of only natural numbers!"));var i=Math.pow(t.filter((function(t){return t})).length,2),s=0;return Array.from(t).filter((function(t){return t})).sort((function(t,r){return a.progressFn&&(s+=1,a.progressFn(Math.floor(100*s/i))),t[0]===r[0]?t[1]<r[1]?-1:t[1]>r[1]?1:0:t[0]<r[0]?-1:1}))}function U(r,e){function a(r){return r&&"object"===t(r)&&!Array.isArray(r)}if(!Array.isArray(r)||!r.length)return null;var i,s={mergeType:1,progressFn:null,joinRangesThatTouchEdges:!0};if(e){if(!a(e))throw new Error("emlint: [THROW_ID_03] the second input argument must be a plain object. It was given as:\n".concat(JSON.stringify(e,null,4)," (type ").concat(t(e),")"));if((i=n(n({},s),e)).progressFn&&a(i.progressFn)&&!Object.keys(i.progressFn).length)i.progressFn=null;else if(i.progressFn&&"function"!=typeof i.progressFn)throw new Error('ranges-merge: [THROW_ID_01] opts.progressFn must be a function! It was given of a type: "'.concat(t(i.progressFn),'", equal to ').concat(JSON.stringify(i.progressFn,null,4)));if(i.mergeType&&1!=+i.mergeType&&2!=+i.mergeType)throw new Error('ranges-merge: [THROW_ID_02] opts.mergeType was customised to a wrong thing! It was given of a type: "'.concat(t(i.mergeType),'", equal to ').concat(JSON.stringify(i.mergeType,null,4)));if("boolean"!=typeof i.joinRangesThatTouchEdges)throw new Error('ranges-merge: [THROW_ID_04] opts.joinRangesThatTouchEdges was customised to a wrong thing! It was given of a type: "'.concat(t(i.joinRangesThatTouchEdges),'", equal to ').concat(JSON.stringify(i.joinRangesThatTouchEdges,null,4)))}else i=n({},s);for(var u,c,l,f=r.filter((function(t){return t})).map((function(t){return o(t)})).filter((function(t){return void 0!==t[2]||t[0]!==t[1]})),h=(u=i.progressFn?z(f,{progressFn:function(t){(l=Math.floor(t/5))!==c&&(c=l,i.progressFn(l))}}):z(f)).length-1,p=h;p>0;p--)i.progressFn&&(l=Math.floor(78*(1-p/h))+21)!==c&&l>c&&(c=l,i.progressFn(l)),(u[p][0]<=u[p-1][0]||!i.joinRangesThatTouchEdges&&u[p][0]<u[p-1][1]||i.joinRangesThatTouchEdges&&u[p][0]<=u[p-1][1])&&(u[p-1][0]=Math.min(u[p][0],u[p-1][0]),u[p-1][1]=Math.max(u[p][1],u[p-1][1]),void 0!==u[p][2]&&(u[p-1][0]>=u[p][0]||u[p-1][1]<=u[p][1])&&null!==u[p-1][2]&&(null===u[p][2]&&null!==u[p-1][2]?u[p-1][2]=null:void 0!==u[p-1][2]?2==+i.mergeType&&u[p-1][0]===u[p][0]?u[p-1][2]=u[p][2]:u[p-1][2]+=u[p][2]:u[p-1][2]=u[p][2]),u.splice(p,1),p=u.length);return u.length?u:null}function B(t){return null!=t}function K(t){return"string"==typeof t}var L=Array.isArray;return function(r,e){if(!L(r))return r;if(!r.length)return{};var o,a,i={wildcard:"*",dedupePlease:!0};o=null!=e?n(n({},i),e):n({},i);for(var s=(a=o.dedupePlease?G(r):Array.from(r)).length,u={},c=0;c<s;c++){var l=a[c].match(/\d+/gm);l?function(){var t=a[c].replace(/\d+/gm,o.wildcard);Object.prototype.hasOwnProperty.call(u,t)?(l.forEach((function(r,e){u[t].elementsWhichWeCanReplaceWithWildcards[e]&&r!==u[t].elementsWhichWeCanReplaceWithWildcards[e]&&(u[t].elementsWhichWeCanReplaceWithWildcards[e]=!1)})),u[t].count+=1):u[t]={count:1,elementsWhichWeCanReplaceWithWildcards:Array.from(l)}}():u[a[c]]={count:1}}var f={};return Object.keys(u).forEach((function(r){var e=r;if(L(u[r].elementsWhichWeCanReplaceWithWildcards)&&u[r].elementsWhichWeCanReplaceWithWildcards.some((function(t){return!1!==t}))){for(var n=[],a=0,i=0;i<u[r].elementsWhichWeCanReplaceWithWildcards.length;i++)a=e.indexOf(o.wildcard,a+o.wildcard.length),!1!==u[r].elementsWhichWeCanReplaceWithWildcards[i]&&n.push([a,a+o.wildcard.length,u[r].elementsWhichWeCanReplaceWithWildcards[i]]);e=function(r,e,n){var o,a=0,i=0;if(0===arguments.length)throw new Error("ranges-apply: [THROW_ID_01] inputs missing!");if(!K(r))throw new TypeError("ranges-apply: [THROW_ID_02] first input argument must be a string! Currently it's: ".concat(t(r),", equal to: ").concat(JSON.stringify(r,null,4)));if(e&&!Array.isArray(e))throw new TypeError("ranges-apply: [THROW_ID_03] second input argument must be an array (or null)! Currently it's: ".concat(t(e),", equal to: ").concat(JSON.stringify(e,null,4)));if(n&&"function"!=typeof n)throw new TypeError("ranges-apply: [THROW_ID_04] the third input argument must be a function (or falsey)! Currently it's: ".concat(t(n),", equal to: ").concat(JSON.stringify(n,null,4)));if(!e||!e.filter((function(t){return t})).length)return r;var s=(o=Array.isArray(e)&&(Number.isInteger(e[0])&&e[0]>=0||/^\d*$/.test(e[0]))&&(Number.isInteger(e[1])&&e[1]>=0||/^\d*$/.test(e[1]))?[Array.from(e)]:Array.from(e)).length,u=0;o.filter((function(t){return t})).forEach((function(r,e){if(n&&(a=Math.floor(u/s*10))!==i&&(i=a,n(a)),!Array.isArray(r))throw new TypeError("ranges-apply: [THROW_ID_05] ranges array, second input arg., has ".concat(e,"th element not an array: ").concat(JSON.stringify(r,null,4),", which is ").concat(t(r)));if(!Number.isInteger(r[0])||r[0]<0){if(!/^\d*$/.test(r[0]))throw new TypeError("ranges-apply: [THROW_ID_06] ranges array, second input arg. has ".concat(e,"th element, array [").concat(r[0],",").concat(r[1],"]. That array has first element not an integer, but ").concat(t(r[0]),", equal to: ").concat(JSON.stringify(r[0],null,4),". Computer doesn't like this."));o[e][0]=Number.parseInt(o[e][0],10)}if(!Number.isInteger(r[1])){if(!/^\d*$/.test(r[1]))throw new TypeError("ranges-apply: [THROW_ID_07] ranges array, second input arg. has ".concat(e,"th element, array [").concat(r[0],",").concat(r[1],"]. That array has second element not an integer, but ").concat(t(r[1]),", equal to: ").concat(JSON.stringify(r[1],null,4),". Computer doesn't like this."));o[e][1]=Number.parseInt(o[e][1],10)}u+=1}));var c=U(o,{progressFn:function(t){n&&(a=10+Math.floor(t/10))!==i&&(i=a,n(a))}});if(!c)return r;var l=c.length;if(l>0){var f=r.slice(c[l-1][1]);r=c.reduce((function(t,e,o,s){n&&(a=20+Math.floor(o/l*80))!==i&&(i=a,n(a));var u=0===o?0:s[o-1][1],c=s[o][0];return t+r.slice(u,c)+(B(s[o][2])?s[o][2]:"")}),""),r+=f}return r}(e,n)}f[e]=u[r].count})),f}}));
