/**
 * ast-delete-object
 * Delete all plain objects that contain a certain key/value pair
 * Version: 1.8.64
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/ast-delete-object
 */

!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):(t=t||self).astDeleteObject=e()}(this,(function(){"use strict";function t(e){return(t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(e)}function e(t,e,r){return e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}function r(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),r.push.apply(r,n)}return r}function n(t){for(var n=1;n<arguments.length;n++){var o=null!=arguments[n]?arguments[n]:{};n%2?r(Object(o),!0).forEach((function(r){e(t,r,o[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(o)):r(Object(o)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(o,e))}))}return t}var o="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{};function i(t,e){return t(e={exports:{}},e.exports),e.exports}var a=i((function(t,e){var r="[object Arguments]",n="[object Function]",i="[object GeneratorFunction]",a="[object Map]",c="[object Set]",u=/\w*$/,s=/^\[object .+?Constructor\]$/,f=/^(?:0|[1-9]\d*)$/,l={};l[r]=l["[object Array]"]=l["[object ArrayBuffer]"]=l["[object DataView]"]=l["[object Boolean]"]=l["[object Date]"]=l["[object Float32Array]"]=l["[object Float64Array]"]=l["[object Int8Array]"]=l["[object Int16Array]"]=l["[object Int32Array]"]=l[a]=l["[object Number]"]=l["[object Object]"]=l["[object RegExp]"]=l[c]=l["[object String]"]=l["[object Symbol]"]=l["[object Uint8Array]"]=l["[object Uint8ClampedArray]"]=l["[object Uint16Array]"]=l["[object Uint32Array]"]=!0,l["[object Error]"]=l[n]=l["[object WeakMap]"]=!1;var y="object"==typeof o&&o&&o.Object===Object&&o,p="object"==typeof self&&self&&self.Object===Object&&self,h=y||p||Function("return this")(),b=e&&!e.nodeType&&e,g=b&&t&&!t.nodeType&&t,d=g&&g.exports===b;function j(t,e){return t.set(e[0],e[1]),t}function v(t,e){return t.add(e),t}function m(t,e,r,n){var o=-1,i=t?t.length:0;for(n&&i&&(r=t[++o]);++o<i;)r=e(r,t[o],o,t);return r}function _(t){var e=!1;if(null!=t&&"function"!=typeof t.toString)try{e=!!(t+"")}catch(t){}return e}function w(t){var e=-1,r=Array(t.size);return t.forEach((function(t,n){r[++e]=[n,t]})),r}function O(t,e){return function(r){return t(e(r))}}function S(t){var e=-1,r=Array(t.size);return t.forEach((function(t){r[++e]=t})),r}var A,W=Array.prototype,T=Function.prototype,$=Object.prototype,M=h["__core-js_shared__"],E=(A=/[^.]+$/.exec(M&&M.keys&&M.keys.IE_PROTO||""))?"Symbol(src)_1."+A:"",k=T.toString,D=$.hasOwnProperty,N=$.toString,P=RegExp("^"+k.call(D).replace(/[\\^$.*+?()[\]{}|]/g,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$"),F=d?h.Buffer:void 0,x=h.Symbol,I=h.Uint8Array,H=O(Object.getPrototypeOf,Object),R=Object.create,J=$.propertyIsEnumerable,L=W.splice,U=Object.getOwnPropertySymbols,B=F?F.isBuffer:void 0,V=O(Object.keys,Object),C=gt(h,"DataView"),z=gt(h,"Map"),q=gt(h,"Promise"),K=gt(h,"Set"),G=gt(h,"WeakMap"),Q=gt(Object,"create"),X=_t(C),Y=_t(z),Z=_t(q),tt=_t(K),et=_t(G),rt=x?x.prototype:void 0,nt=rt?rt.valueOf:void 0;function ot(t){var e=-1,r=t?t.length:0;for(this.clear();++e<r;){var n=t[e];this.set(n[0],n[1])}}function it(t){var e=-1,r=t?t.length:0;for(this.clear();++e<r;){var n=t[e];this.set(n[0],n[1])}}function at(t){var e=-1,r=t?t.length:0;for(this.clear();++e<r;){var n=t[e];this.set(n[0],n[1])}}function ct(t){this.__data__=new it(t)}function ut(t,e){var n=Ot(t)||function(t){return function(t){return function(t){return!!t&&"object"==typeof t}(t)&&St(t)}(t)&&D.call(t,"callee")&&(!J.call(t,"callee")||N.call(t)==r)}(t)?function(t,e){for(var r=-1,n=Array(t);++r<t;)n[r]=e(r);return n}(t.length,String):[],o=n.length,i=!!o;for(var a in t)!e&&!D.call(t,a)||i&&("length"==a||vt(a,o))||n.push(a);return n}function st(t,e,r){var n=t[e];D.call(t,e)&&wt(n,r)&&(void 0!==r||e in t)||(t[e]=r)}function ft(t,e){for(var r=t.length;r--;)if(wt(t[r][0],e))return r;return-1}function lt(t,e,o,s,f,y,p){var h;if(s&&(h=y?s(t,f,y,p):s(t)),void 0!==h)return h;if(!Tt(t))return t;var b=Ot(t);if(b){if(h=function(t){var e=t.length,r=t.constructor(e);e&&"string"==typeof t[0]&&D.call(t,"index")&&(r.index=t.index,r.input=t.input);return r}(t),!e)return function(t,e){var r=-1,n=t.length;e||(e=Array(n));for(;++r<n;)e[r]=t[r];return e}(t,h)}else{var g=jt(t),d=g==n||g==i;if(At(t))return function(t,e){if(e)return t.slice();var r=new t.constructor(t.length);return t.copy(r),r}(t,e);if("[object Object]"==g||g==r||d&&!y){if(_(t))return y?t:{};if(h=function(t){return"function"!=typeof t.constructor||mt(t)?{}:(e=H(t),Tt(e)?R(e):{});var e}(d?{}:t),!e)return function(t,e){return ht(t,dt(t),e)}(t,function(t,e){return t&&ht(e,$t(e),t)}(h,t))}else{if(!l[g])return y?t:{};h=function(t,e,r,n){var o=t.constructor;switch(e){case"[object ArrayBuffer]":return pt(t);case"[object Boolean]":case"[object Date]":return new o(+t);case"[object DataView]":return function(t,e){var r=e?pt(t.buffer):t.buffer;return new t.constructor(r,t.byteOffset,t.byteLength)}(t,n);case"[object Float32Array]":case"[object Float64Array]":case"[object Int8Array]":case"[object Int16Array]":case"[object Int32Array]":case"[object Uint8Array]":case"[object Uint8ClampedArray]":case"[object Uint16Array]":case"[object Uint32Array]":return function(t,e){var r=e?pt(t.buffer):t.buffer;return new t.constructor(r,t.byteOffset,t.length)}(t,n);case a:return function(t,e,r){return m(e?r(w(t),!0):w(t),j,new t.constructor)}(t,n,r);case"[object Number]":case"[object String]":return new o(t);case"[object RegExp]":return function(t){var e=new t.constructor(t.source,u.exec(t));return e.lastIndex=t.lastIndex,e}(t);case c:return function(t,e,r){return m(e?r(S(t),!0):S(t),v,new t.constructor)}(t,n,r);case"[object Symbol]":return i=t,nt?Object(nt.call(i)):{}}var i}(t,g,lt,e)}}p||(p=new ct);var O=p.get(t);if(O)return O;if(p.set(t,h),!b)var A=o?function(t){return function(t,e,r){var n=e(t);return Ot(t)?n:function(t,e){for(var r=-1,n=e.length,o=t.length;++r<n;)t[o+r]=e[r];return t}(n,r(t))}(t,$t,dt)}(t):$t(t);return function(t,e){for(var r=-1,n=t?t.length:0;++r<n&&!1!==e(t[r],r,t););}(A||t,(function(r,n){A&&(r=t[n=r]),st(h,n,lt(r,e,o,s,n,t,p))})),h}function yt(t){return!(!Tt(t)||(e=t,E&&E in e))&&(Wt(t)||_(t)?P:s).test(_t(t));var e}function pt(t){var e=new t.constructor(t.byteLength);return new I(e).set(new I(t)),e}function ht(t,e,r,n){r||(r={});for(var o=-1,i=e.length;++o<i;){var a=e[o],c=n?n(r[a],t[a],a,r,t):void 0;st(r,a,void 0===c?t[a]:c)}return r}function bt(t,e){var r,n,o=t.__data__;return("string"==(n=typeof(r=e))||"number"==n||"symbol"==n||"boolean"==n?"__proto__"!==r:null===r)?o["string"==typeof e?"string":"hash"]:o.map}function gt(t,e){var r=function(t,e){return null==t?void 0:t[e]}(t,e);return yt(r)?r:void 0}ot.prototype.clear=function(){this.__data__=Q?Q(null):{}},ot.prototype.delete=function(t){return this.has(t)&&delete this.__data__[t]},ot.prototype.get=function(t){var e=this.__data__;if(Q){var r=e[t];return"__lodash_hash_undefined__"===r?void 0:r}return D.call(e,t)?e[t]:void 0},ot.prototype.has=function(t){var e=this.__data__;return Q?void 0!==e[t]:D.call(e,t)},ot.prototype.set=function(t,e){return this.__data__[t]=Q&&void 0===e?"__lodash_hash_undefined__":e,this},it.prototype.clear=function(){this.__data__=[]},it.prototype.delete=function(t){var e=this.__data__,r=ft(e,t);return!(r<0)&&(r==e.length-1?e.pop():L.call(e,r,1),!0)},it.prototype.get=function(t){var e=this.__data__,r=ft(e,t);return r<0?void 0:e[r][1]},it.prototype.has=function(t){return ft(this.__data__,t)>-1},it.prototype.set=function(t,e){var r=this.__data__,n=ft(r,t);return n<0?r.push([t,e]):r[n][1]=e,this},at.prototype.clear=function(){this.__data__={hash:new ot,map:new(z||it),string:new ot}},at.prototype.delete=function(t){return bt(this,t).delete(t)},at.prototype.get=function(t){return bt(this,t).get(t)},at.prototype.has=function(t){return bt(this,t).has(t)},at.prototype.set=function(t,e){return bt(this,t).set(t,e),this},ct.prototype.clear=function(){this.__data__=new it},ct.prototype.delete=function(t){return this.__data__.delete(t)},ct.prototype.get=function(t){return this.__data__.get(t)},ct.prototype.has=function(t){return this.__data__.has(t)},ct.prototype.set=function(t,e){var r=this.__data__;if(r instanceof it){var n=r.__data__;if(!z||n.length<199)return n.push([t,e]),this;r=this.__data__=new at(n)}return r.set(t,e),this};var dt=U?O(U,Object):function(){return[]},jt=function(t){return N.call(t)};function vt(t,e){return!!(e=null==e?9007199254740991:e)&&("number"==typeof t||f.test(t))&&t>-1&&t%1==0&&t<e}function mt(t){var e=t&&t.constructor;return t===("function"==typeof e&&e.prototype||$)}function _t(t){if(null!=t){try{return k.call(t)}catch(t){}try{return t+""}catch(t){}}return""}function wt(t,e){return t===e||t!=t&&e!=e}(C&&"[object DataView]"!=jt(new C(new ArrayBuffer(1)))||z&&jt(new z)!=a||q&&"[object Promise]"!=jt(q.resolve())||K&&jt(new K)!=c||G&&"[object WeakMap]"!=jt(new G))&&(jt=function(t){var e=N.call(t),r="[object Object]"==e?t.constructor:void 0,n=r?_t(r):void 0;if(n)switch(n){case X:return"[object DataView]";case Y:return a;case Z:return"[object Promise]";case tt:return c;case et:return"[object WeakMap]"}return e});var Ot=Array.isArray;function St(t){return null!=t&&function(t){return"number"==typeof t&&t>-1&&t%1==0&&t<=9007199254740991}(t.length)&&!Wt(t)}var At=B||function(){return!1};function Wt(t){var e=Tt(t)?N.call(t):"";return e==n||e==i}function Tt(t){var e=typeof t;return!!t&&("object"==e||"function"==e)}function $t(t){return St(t)?ut(t):function(t){if(!mt(t))return V(t);var e=[];for(var r in Object(t))D.call(t,r)&&"constructor"!=r&&e.push(r);return e}(t)}t.exports=function(t){return lt(t,!0,!0)}})),c=i((function(t,e){var r,n,i,a,c,u,s,f,l,y,p,h,b,g,d,j,v,m;t.exports=(r="function"==typeof Promise,n="object"==typeof self?self:o,i="undefined"!=typeof Symbol,a="undefined"!=typeof Map,c="undefined"!=typeof Set,u="undefined"!=typeof WeakMap,s="undefined"!=typeof WeakSet,f="undefined"!=typeof DataView,l=i&&void 0!==Symbol.iterator,y=i&&void 0!==Symbol.toStringTag,p=c&&"function"==typeof Set.prototype.entries,h=a&&"function"==typeof Map.prototype.entries,b=p&&Object.getPrototypeOf((new Set).entries()),g=h&&Object.getPrototypeOf((new Map).entries()),d=l&&"function"==typeof Array.prototype[Symbol.iterator],j=d&&Object.getPrototypeOf([][Symbol.iterator]()),v=l&&"function"==typeof String.prototype[Symbol.iterator],m=v&&Object.getPrototypeOf(""[Symbol.iterator]()),function(t){var e=typeof t;if("object"!==e)return e;if(null===t)return"null";if(t===n)return"global";if(Array.isArray(t)&&(!1===y||!(Symbol.toStringTag in t)))return"Array";if("object"==typeof window&&null!==window){if("object"==typeof window.location&&t===window.location)return"Location";if("object"==typeof window.document&&t===window.document)return"Document";if("object"==typeof window.navigator){if("object"==typeof window.navigator.mimeTypes&&t===window.navigator.mimeTypes)return"MimeTypeArray";if("object"==typeof window.navigator.plugins&&t===window.navigator.plugins)return"PluginArray"}if(("function"==typeof window.HTMLElement||"object"==typeof window.HTMLElement)&&t instanceof window.HTMLElement){if("BLOCKQUOTE"===t.tagName)return"HTMLQuoteElement";if("TD"===t.tagName)return"HTMLTableDataCellElement";if("TH"===t.tagName)return"HTMLTableHeaderCellElement"}}var o=y&&t[Symbol.toStringTag];if("string"==typeof o)return o;var i=Object.getPrototypeOf(t);return i===RegExp.prototype?"RegExp":i===Date.prototype?"Date":r&&i===Promise.prototype?"Promise":c&&i===Set.prototype?"Set":a&&i===Map.prototype?"Map":s&&i===WeakSet.prototype?"WeakSet":u&&i===WeakMap.prototype?"WeakMap":f&&i===DataView.prototype?"DataView":a&&i===g?"Map Iterator":c&&i===b?"Set Iterator":d&&i===j?"Array Iterator":v&&i===m?"String Iterator":null===i?"Object":Object.prototype.toString.call(t).slice(8,-1)})}));function u(t){return"string"==typeof t&&t.length&&"."===t[0]?t.slice(1):t}function s(t,e){return function t(e,r,n,o){const i=a(e);let c,s,f;const l={depth:-1,path:"",...n};if(l.depth+=1,Array.isArray(i))for(c=0,s=i.length;c<s&&!o.now;c++){const e=`${l.path}.${c}`;void 0!==i[c]?(l.parent=a(i),l.parentType="array",f=t(r(i[c],void 0,{...l,path:u(e)},o),r,{...l,path:u(e)},o),Number.isNaN(f)&&c<i.length?(i.splice(c,1),c-=1):i[c]=f):i.splice(c,1)}else if((y=i)&&"object"==typeof y&&!Array.isArray(y))for(const e in i){if(o.now&&null!=e)break;const n=`${l.path}.${e}`;0===l.depth&&null!=e&&(l.topmostKey=e),l.parent=a(i),l.parentType="object",f=t(r(e,i[e],{...l,path:u(n)},o),r,{...l,path:u(n)},o),Number.isNaN(f)?delete i[e]:i[e]=f}var y;return i}(t,e,{},{now:!1})}function f(t){if("string"==typeof t)return!t.trim();if(!["object","string"].includes(typeof t)||!t)return!1;let e=!0;return t=s(t,(t,r,n,o)=>{const i=void 0!==r?r:t;return"string"==typeof i&&i.trim()&&(e=!1,o.now=!0),i}),e}const l=new Map;function y(t,e){e={caseSensitive:!1,...e};const r=t+JSON.stringify(e);if(l.has(r))return l.get(r);const n="!"===t[0];n&&(t=t.slice(1)),t=(t=>{if("string"!=typeof t)throw new TypeError("Expected a string");return t.replace(/[|\\{}()[\]^$+*?.]/g,"\\$&").replace(/-/g,"\\x2d")})(t).replace(/\\\*/g,"[\\s\\S]*");const o=new RegExp(`^${t}$`,e.caseSensitive?"":"i");return o.negated=n,l.set(r,o),o}var p=(t,e,r)=>{if(!Array.isArray(t)||!Array.isArray(e))throw new TypeError(`Expected two arrays, got ${typeof t} ${typeof e}`);if(0===e.length)return t;const n="!"===e[0][0];e=e.map(t=>y(t,r));const o=[];for(const r of t){let t=n;for(const n of e)n.test(r)&&(t=!n.negated);t&&o.push(r)}return o};p.isMatch=(t,e,r)=>{const n=Array.isArray(t)?t:[t],o=Array.isArray(e)?e:[e];return n.some(t=>o.every(e=>{const n=y(e,r),o=n.test(t);return n.negated?!o:o}))};const h=Array.isArray;function b(t){return null!=t}function g(t){return t&&"object"==typeof t&&!Array.isArray(t)}function d(t){return"string"==typeof t}function j(t){return g(t)||d(t)||function(t){return"number"==typeof t}(t)||function(t){return"boolean"==typeof t}(t)||h(t)||function(t){return null===t}(t)}function v(t,e,r){if(void 0===t)throw new TypeError("ast-compare/compare(): [THROW_ID_01] first argument is missing!");if(void 0===e)throw new TypeError("ast-compare/compare(): [THROW_ID_02] second argument is missing!");if(b(t)&&!j(t))throw new TypeError(`ast-compare/compare(): [THROW_ID_03] first input argument is of a wrong type, ${c(t)}, equal to: ${JSON.stringify(t,null,4)}`);if(b(e)&&!j(e))throw new TypeError(`ast-compare/compare(): [THROW_ID_04] second input argument is of a wrong type, ${c(e)}, equal to: ${JSON.stringify(e,null,4)}`);if(b(r)&&!g(r))throw new TypeError(`ast-compare/compare(): [THROW_ID_05] third argument, options object, must, well, be an object! Currently it's: ${c(r)} and equal to: ${JSON.stringify(r,null,4)}`);let n,o,i,a=0;const u={hungryForWhitespace:!1,matchStrictly:!1,verboseWhenMismatches:!1,useWildcards:!1,...r};if(u.hungryForWhitespace&&u.matchStrictly&&g(t)&&f(t)&&g(e)&&!Object.keys(e).length)return!0;if((!u.hungryForWhitespace||u.hungryForWhitespace&&!f(t)&&f(e))&&g(t)&&0!==Object.keys(t).length&&g(e)&&0===Object.keys(e).length||c(t)!==c(e)&&(!u.hungryForWhitespace||u.hungryForWhitespace&&!f(t)))return!1;if(d(t)&&d(e))return!!(u.hungryForWhitespace&&f(t)&&f(e))||(u.verboseWhenMismatches?t===e||`Given string ${e} is not matched! We have ${t} on the other end.`:u.useWildcards?p.isMatch(t,e,{caseSensitive:!0}):t===e);if(h(t)&&h(e)){if(u.hungryForWhitespace&&f(e)&&(!u.matchStrictly||u.matchStrictly&&t.length===e.length))return!0;if(!u.hungryForWhitespace&&e.length>t.length||u.matchStrictly&&e.length!==t.length)return!!u.verboseWhenMismatches&&`The length of a given array, ${JSON.stringify(e,null,4)} is ${e.length} but the length of an array on the other end, ${JSON.stringify(t,null,4)} is ${t.length}`;if(0===e.length)return 0===t.length||!!u.verboseWhenMismatches&&`The given array has no elements, but the array on the other end, ${JSON.stringify(t,null,4)} does have some`;for(let r=0,n=e.length;r<n;r++){i=!1;for(let n=a,o=t.length;n<o;n++)if(a+=1,!0===v(t[n],e[r],u)){i=!0;break}if(!i)return!!u.verboseWhenMismatches&&`The given array ${JSON.stringify(e,null,4)} is not a subset of an array on the other end, ${JSON.stringify(t,null,4)}`}}else{if(!g(t)||!g(e))return!!(u.hungryForWhitespace&&f(t)&&f(e)&&(!u.matchStrictly||u.matchStrictly&&(s=e,g(s)?0===Object.keys(s).length:(h(s)||d(s))&&0===s.length)))||t===e;if(n=new Set(Object.keys(e)),o=new Set(Object.keys(t)),u.matchStrictly&&n.size!==o.size){if(!u.verboseWhenMismatches)return!1;const t=new Set([...n].filter(t=>!o.has(t))),e=t.size?` First object has unique keys: ${JSON.stringify(t,null,4)}.`:"",r=new Set([...o].filter(t=>!n.has(t)));return`When matching strictly, we found that both objects have different amount of keys.${e}${r.size?` Second object has unique keys:\n        ${JSON.stringify(r,null,4)}.`:""}`}for(const r of n){if(!Object.prototype.hasOwnProperty.call(t,r))return!u.useWildcards||u.useWildcards&&!r.includes("*")?!!u.verboseWhenMismatches&&`The given object has key "${r}" which the other-one does not have.`:!!Object.keys(t).some(t=>p.isMatch(t,r,{caseSensitive:!0}))||!!u.verboseWhenMismatches&&`The given object has key "${r}" which the other-one does not have.`;if(b(t[r])&&c(t[r])!==c(e[r])){if(!(f(t[r])&&f(e[r])&&u.hungryForWhitespace))return!!u.verboseWhenMismatches&&`The given key ${r} is of a different type on both objects. On the first-one, it's ${c(e[r])}, on the second-one, it's ${c(t[r])}`}else if(!0!==v(t[r],e[r],u))return!!u.verboseWhenMismatches&&`The given piece ${JSON.stringify(e[r],null,4)} and ${JSON.stringify(t[r],null,4)} don't match.`}}var s;return!0}function m(e){return e&&"object"===t(e)&&!Array.isArray(e)}return function(t,e,r){if(!t)throw new Error("ast-delete-object/deleteObj(): [THROW_ID_01] Missing input!");if(!e)throw new Error("ast-delete-object/deleteObj(): [THROW_ID_02] Missing second argument, object to search for and delete!");if(r&&!m(r))throw new Error("ast-delete-object/deleteObj(): [THROW_ID_03] Third argument, options object, must be an object!");var o,i=n(n({},{matchKeysStrictly:!1,hungryForWhitespace:!1}),r),c=a(t);return v(c,e,{hungryForWhitespace:i.hungryForWhitespace,matchStrictly:i.matchKeysStrictly})?{}:c=s(c,(function(t,r){if(m(o=void 0!==r?r:t)){if(m(e)&&m(o)&&!Object.keys(e).length&&!Object.keys(o).length)return NaN;if(v(o,e,{hungryForWhitespace:i.hungryForWhitespace,matchStrictly:i.matchKeysStrictly}))return NaN}return o}))}}));
