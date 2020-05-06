/**
 * ast-monkey-traverse-with-lookahead
 * Utility library to traverse parsed HTML (AST's) or anything nested (plain objects within arrays within plain objects)
 * Version: 1.1.3
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/ast-monkey-traverse-with-lookahead
 */

!function(t,r){"object"==typeof exports&&"undefined"!=typeof module?module.exports=r():"function"==typeof define&&define.amd?define(r):(t=t||self).astMonkeyTraverseWithLookahead=r()}(this,(function(){"use strict";function t(r){return(t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(r)}function r(t,r,e){return r in t?Object.defineProperty(t,r,{value:e,enumerable:!0,configurable:!0,writable:!0}):t[r]=e,t}function e(t,r){var e=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(t,r).enumerable}))),e.push.apply(e,n)}return e}function n(t){for(var n=1;n<arguments.length;n++){var o=null!=arguments[n]?arguments[n]:{};n%2?e(Object(o),!0).forEach((function(e){r(t,e,o[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(o)):e(Object(o)).forEach((function(r){Object.defineProperty(t,r,Object.getOwnPropertyDescriptor(o,r))}))}return t}function o(t){return function(t){if(Array.isArray(t))return c(t)}(t)||function(t){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(t))return Array.from(t)}(t)||function(t,r){if(!t)return;if("string"==typeof t)return c(t,r);var e=Object.prototype.toString.call(t).slice(8,-1);"Object"===e&&t.constructor&&(e=t.constructor.name);if("Map"===e||"Set"===e)return Array.from(t);if("Arguments"===e||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e))return c(t,r)}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function c(t,r){(null==r||r>t.length)&&(r=t.length);for(var e=0,n=new Array(r);e<r;e++)n[e]=t[e];return n}var a="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{};var u=function(t,r){return t(r={exports:{}},r.exports),r.exports}((function(t,r){var e="[object Arguments]",n="[object Function]",o="[object GeneratorFunction]",c="[object Map]",u="[object Set]",i=/\w*$/,f=/^\[object .+?Constructor\]$/,s=/^(?:0|[1-9]\d*)$/,l={};l[e]=l["[object Array]"]=l["[object ArrayBuffer]"]=l["[object DataView]"]=l["[object Boolean]"]=l["[object Date]"]=l["[object Float32Array]"]=l["[object Float64Array]"]=l["[object Int8Array]"]=l["[object Int16Array]"]=l["[object Int32Array]"]=l[c]=l["[object Number]"]=l["[object Object]"]=l["[object RegExp]"]=l[u]=l["[object String]"]=l["[object Symbol]"]=l["[object Uint8Array]"]=l["[object Uint8ClampedArray]"]=l["[object Uint16Array]"]=l["[object Uint32Array]"]=!0,l["[object Error]"]=l[n]=l["[object WeakMap]"]=!1;var p="object"==typeof a&&a&&a.Object===Object&&a,y="object"==typeof self&&self&&self.Object===Object&&self,b=p||y||Function("return this")(),h=r&&!r.nodeType&&r,_=h&&t&&!t.nodeType&&t,v=_&&_.exports===h;function d(t,r){return t.set(r[0],r[1]),t}function j(t,r){return t.add(r),t}function g(t,r,e,n){var o=-1,c=t?t.length:0;for(n&&c&&(e=t[++o]);++o<c;)e=r(e,t[o],o,t);return e}function w(t){var r=!1;if(null!=t&&"function"!=typeof t.toString)try{r=!!(t+"")}catch(t){}return r}function O(t){var r=-1,e=Array(t.size);return t.forEach((function(t,n){e[++r]=[n,t]})),e}function m(t,r){return function(e){return t(r(e))}}function A(t){var r=-1,e=Array(t.size);return t.forEach((function(t){e[++r]=t})),e}var S,x=Array.prototype,P=Function.prototype,I=Object.prototype,k=b["__core-js_shared__"],D=(S=/[^.]+$/.exec(k&&k.keys&&k.keys.IE_PROTO||""))?"Symbol(src)_1."+S:"",E=P.toString,U=I.hasOwnProperty,T=I.toString,$=RegExp("^"+E.call(U).replace(/[\\^$.*+?()[\]{}|]/g,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$"),F=v?b.Buffer:void 0,M=b.Symbol,B=b.Uint8Array,V=m(Object.getPrototypeOf,Object),W=Object.create,C=I.propertyIsEnumerable,R=x.splice,L=Object.getOwnPropertySymbols,z=F?F.isBuffer:void 0,N=m(Object.keys,Object),G=_t(b,"DataView"),K=_t(b,"Map"),q=_t(b,"Promise"),H=_t(b,"Set"),J=_t(b,"WeakMap"),Q=_t(Object,"create"),X=wt(G),Y=wt(K),Z=wt(q),tt=wt(H),rt=wt(J),et=M?M.prototype:void 0,nt=et?et.valueOf:void 0;function ot(t){var r=-1,e=t?t.length:0;for(this.clear();++r<e;){var n=t[r];this.set(n[0],n[1])}}function ct(t){var r=-1,e=t?t.length:0;for(this.clear();++r<e;){var n=t[r];this.set(n[0],n[1])}}function at(t){var r=-1,e=t?t.length:0;for(this.clear();++r<e;){var n=t[r];this.set(n[0],n[1])}}function ut(t){this.__data__=new ct(t)}function it(t,r){var n=mt(t)||function(t){return function(t){return function(t){return!!t&&"object"==typeof t}(t)&&At(t)}(t)&&U.call(t,"callee")&&(!C.call(t,"callee")||T.call(t)==e)}(t)?function(t,r){for(var e=-1,n=Array(t);++e<t;)n[e]=r(e);return n}(t.length,String):[],o=n.length,c=!!o;for(var a in t)!r&&!U.call(t,a)||c&&("length"==a||jt(a,o))||n.push(a);return n}function ft(t,r,e){var n=t[r];U.call(t,r)&&Ot(n,e)&&(void 0!==e||r in t)||(t[r]=e)}function st(t,r){for(var e=t.length;e--;)if(Ot(t[e][0],r))return e;return-1}function lt(t,r,a,f,s,p,y){var b;if(f&&(b=p?f(t,s,p,y):f(t)),void 0!==b)return b;if(!Pt(t))return t;var h=mt(t);if(h){if(b=function(t){var r=t.length,e=t.constructor(r);r&&"string"==typeof t[0]&&U.call(t,"index")&&(e.index=t.index,e.input=t.input);return e}(t),!r)return function(t,r){var e=-1,n=t.length;r||(r=Array(n));for(;++e<n;)r[e]=t[e];return r}(t,b)}else{var _=dt(t),v=_==n||_==o;if(St(t))return function(t,r){if(r)return t.slice();var e=new t.constructor(t.length);return t.copy(e),e}(t,r);if("[object Object]"==_||_==e||v&&!p){if(w(t))return p?t:{};if(b=function(t){return"function"!=typeof t.constructor||gt(t)?{}:(r=V(t),Pt(r)?W(r):{});var r}(v?{}:t),!r)return function(t,r){return bt(t,vt(t),r)}(t,function(t,r){return t&&bt(r,It(r),t)}(b,t))}else{if(!l[_])return p?t:{};b=function(t,r,e,n){var o=t.constructor;switch(r){case"[object ArrayBuffer]":return yt(t);case"[object Boolean]":case"[object Date]":return new o(+t);case"[object DataView]":return function(t,r){var e=r?yt(t.buffer):t.buffer;return new t.constructor(e,t.byteOffset,t.byteLength)}(t,n);case"[object Float32Array]":case"[object Float64Array]":case"[object Int8Array]":case"[object Int16Array]":case"[object Int32Array]":case"[object Uint8Array]":case"[object Uint8ClampedArray]":case"[object Uint16Array]":case"[object Uint32Array]":return function(t,r){var e=r?yt(t.buffer):t.buffer;return new t.constructor(e,t.byteOffset,t.length)}(t,n);case c:return function(t,r,e){return g(r?e(O(t),!0):O(t),d,new t.constructor)}(t,n,e);case"[object Number]":case"[object String]":return new o(t);case"[object RegExp]":return function(t){var r=new t.constructor(t.source,i.exec(t));return r.lastIndex=t.lastIndex,r}(t);case u:return function(t,r,e){return g(r?e(A(t),!0):A(t),j,new t.constructor)}(t,n,e);case"[object Symbol]":return a=t,nt?Object(nt.call(a)):{}}var a}(t,_,lt,r)}}y||(y=new ut);var m=y.get(t);if(m)return m;if(y.set(t,b),!h)var S=a?function(t){return function(t,r,e){var n=r(t);return mt(t)?n:function(t,r){for(var e=-1,n=r.length,o=t.length;++e<n;)t[o+e]=r[e];return t}(n,e(t))}(t,It,vt)}(t):It(t);return function(t,r){for(var e=-1,n=t?t.length:0;++e<n&&!1!==r(t[e],e,t););}(S||t,(function(e,n){S&&(e=t[n=e]),ft(b,n,lt(e,r,a,f,n,t,y))})),b}function pt(t){return!(!Pt(t)||(r=t,D&&D in r))&&(xt(t)||w(t)?$:f).test(wt(t));var r}function yt(t){var r=new t.constructor(t.byteLength);return new B(r).set(new B(t)),r}function bt(t,r,e,n){e||(e={});for(var o=-1,c=r.length;++o<c;){var a=r[o],u=n?n(e[a],t[a],a,e,t):void 0;ft(e,a,void 0===u?t[a]:u)}return e}function ht(t,r){var e,n,o=t.__data__;return("string"==(n=typeof(e=r))||"number"==n||"symbol"==n||"boolean"==n?"__proto__"!==e:null===e)?o["string"==typeof r?"string":"hash"]:o.map}function _t(t,r){var e=function(t,r){return null==t?void 0:t[r]}(t,r);return pt(e)?e:void 0}ot.prototype.clear=function(){this.__data__=Q?Q(null):{}},ot.prototype.delete=function(t){return this.has(t)&&delete this.__data__[t]},ot.prototype.get=function(t){var r=this.__data__;if(Q){var e=r[t];return"__lodash_hash_undefined__"===e?void 0:e}return U.call(r,t)?r[t]:void 0},ot.prototype.has=function(t){var r=this.__data__;return Q?void 0!==r[t]:U.call(r,t)},ot.prototype.set=function(t,r){return this.__data__[t]=Q&&void 0===r?"__lodash_hash_undefined__":r,this},ct.prototype.clear=function(){this.__data__=[]},ct.prototype.delete=function(t){var r=this.__data__,e=st(r,t);return!(e<0)&&(e==r.length-1?r.pop():R.call(r,e,1),!0)},ct.prototype.get=function(t){var r=this.__data__,e=st(r,t);return e<0?void 0:r[e][1]},ct.prototype.has=function(t){return st(this.__data__,t)>-1},ct.prototype.set=function(t,r){var e=this.__data__,n=st(e,t);return n<0?e.push([t,r]):e[n][1]=r,this},at.prototype.clear=function(){this.__data__={hash:new ot,map:new(K||ct),string:new ot}},at.prototype.delete=function(t){return ht(this,t).delete(t)},at.prototype.get=function(t){return ht(this,t).get(t)},at.prototype.has=function(t){return ht(this,t).has(t)},at.prototype.set=function(t,r){return ht(this,t).set(t,r),this},ut.prototype.clear=function(){this.__data__=new ct},ut.prototype.delete=function(t){return this.__data__.delete(t)},ut.prototype.get=function(t){return this.__data__.get(t)},ut.prototype.has=function(t){return this.__data__.has(t)},ut.prototype.set=function(t,r){var e=this.__data__;if(e instanceof ct){var n=e.__data__;if(!K||n.length<199)return n.push([t,r]),this;e=this.__data__=new at(n)}return e.set(t,r),this};var vt=L?m(L,Object):function(){return[]},dt=function(t){return T.call(t)};function jt(t,r){return!!(r=null==r?9007199254740991:r)&&("number"==typeof t||s.test(t))&&t>-1&&t%1==0&&t<r}function gt(t){var r=t&&t.constructor;return t===("function"==typeof r&&r.prototype||I)}function wt(t){if(null!=t){try{return E.call(t)}catch(t){}try{return t+""}catch(t){}}return""}function Ot(t,r){return t===r||t!=t&&r!=r}(G&&"[object DataView]"!=dt(new G(new ArrayBuffer(1)))||K&&dt(new K)!=c||q&&"[object Promise]"!=dt(q.resolve())||H&&dt(new H)!=u||J&&"[object WeakMap]"!=dt(new J))&&(dt=function(t){var r=T.call(t),e="[object Object]"==r?t.constructor:void 0,n=e?wt(e):void 0;if(n)switch(n){case X:return"[object DataView]";case Y:return c;case Z:return"[object Promise]";case tt:return u;case rt:return"[object WeakMap]"}return r});var mt=Array.isArray;function At(t){return null!=t&&function(t){return"number"==typeof t&&t>-1&&t%1==0&&t<=9007199254740991}(t.length)&&!xt(t)}var St=z||function(){return!1};function xt(t){var r=Pt(t)?T.call(t):"";return r==n||r==o}function Pt(t){var r=typeof t;return!!t&&("object"==r||"function"==r)}function It(t){return At(t)?it(t):function(t){if(!gt(t))return N(t);var r=[];for(var e in Object(t))U.call(t,e)&&"constructor"!=e&&r.push(e);return r}(t)}t.exports=function(t){return lt(t,!0,!0)}}));function i(t){return"string"==typeof t&&"."===t[0]?t.slice(1):t}function f(r){return r&&"object"===t(r)&&!Array.isArray(r)}return function(t,r){var e=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,c={now:!1},a=[];function s(t,r,e,o){if((e=n({depth:-1,path:""},e)).depth+=1,Array.isArray(t))for(var c=0,a=t.length;c<a&&!o.now;c++){var l="".concat(e.path,".").concat(c);e.parent=u(t),e.parentType="array",r(t[c],void 0,n(n({},e),{},{path:i(l)}),o),s(t[c],r,n(n({},e),{},{path:i(l)}),o)}else if(f(t))for(var p in t){if(o.now&&null!=p)break;var y="".concat(e.path,".").concat(p);0===e.depth&&null!=p&&(e.topmostKey=p),e.parent=u(t),e.parentType="object",r(p,t[p],n(n({},e),{},{path:i(y)}),o),s(t[p],r,n(n({},e),{},{path:i(y)}),o)}return t}function l(){var t=a.shift();t[2].next=[];for(var n=0;n<e&&a[n];n++)t[2].next.push(u([a[n][0],a[n][1],a[n][2]]));r.apply(void 0,o(t))}function p(){for(var t=arguments.length,r=new Array(t),n=0;n<t;n++)r[n]=arguments[n];a.push([].concat(r)),a.length>e&&l()}if(s(t,p,{},c),a.length)for(var y=0,b=a.length;y<b;y++)l()}}));
