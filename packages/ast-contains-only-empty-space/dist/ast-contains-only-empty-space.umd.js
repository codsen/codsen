/**
 * ast-contains-only-empty-space
 * Returns Boolean depending if passed AST contain only empty space
 * Version: 1.9.9
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/ast-contains-only-empty-space
 */

!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):(t="undefined"!=typeof globalThis?globalThis:t||self).astContainsOnlyEmptySpace=e()}(this,(function(){"use strict";function t(e){return(t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(e)}var e="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{};var r=function(t,e,r){return t(r={path:e,exports:{},require:function(t,e){return function(){throw new Error("Dynamic requires are not currently supported by @rollup/plugin-commonjs")}(null==e&&r.path)}},r.exports),r.exports}((function(t,r){var n="[object Arguments]",o="[object Function]",c="[object GeneratorFunction]",u="[object Map]",a="[object Set]",i=/\w*$/,f=/^\[object .+?Constructor\]$/,s=/^(?:0|[1-9]\d*)$/,l={};l[n]=l["[object Array]"]=l["[object ArrayBuffer]"]=l["[object DataView]"]=l["[object Boolean]"]=l["[object Date]"]=l["[object Float32Array]"]=l["[object Float64Array]"]=l["[object Int8Array]"]=l["[object Int16Array]"]=l["[object Int32Array]"]=l[u]=l["[object Number]"]=l["[object Object]"]=l["[object RegExp]"]=l[a]=l["[object String]"]=l["[object Symbol]"]=l["[object Uint8Array]"]=l["[object Uint8ClampedArray]"]=l["[object Uint16Array]"]=l["[object Uint32Array]"]=!0,l["[object Error]"]=l[o]=l["[object WeakMap]"]=!1;var p="object"==typeof e&&e&&e.Object===Object&&e,y="object"==typeof self&&self&&self.Object===Object&&self,b=p||y||Function("return this")(),h=r&&!r.nodeType&&r,_=h&&t&&!t.nodeType&&t,d=_&&_.exports===h;function v(t,e){return t.set(e[0],e[1]),t}function j(t,e){return t.add(e),t}function g(t,e,r,n){var o=-1,c=t?t.length:0;for(n&&c&&(r=t[++o]);++o<c;)r=e(r,t[o],o,t);return r}function w(t){var e=!1;if(null!=t&&"function"!=typeof t.toString)try{e=!!(t+"")}catch(t){}return e}function m(t){var e=-1,r=Array(t.size);return t.forEach((function(t,n){r[++e]=[n,t]})),r}function A(t,e){return function(r){return t(e(r))}}function O(t){var e=-1,r=Array(t.size);return t.forEach((function(t){r[++e]=t})),r}var S,x=Array.prototype,$=Function.prototype,E=Object.prototype,I=b["__core-js_shared__"],T=(S=/[^.]+$/.exec(I&&I.keys&&I.keys.IE_PROTO||""))?"Symbol(src)_1."+S:"",U=$.toString,k=E.hasOwnProperty,D=E.toString,F=RegExp("^"+U.call(k).replace(/[\\^$.*+?()[\]{}|]/g,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$"),N=d?b.Buffer:void 0,P=b.Symbol,B=b.Uint8Array,M=A(Object.getPrototypeOf,Object),V=Object.create,C=E.propertyIsEnumerable,R=x.splice,W=Object.getOwnPropertySymbols,q=N?N.isBuffer:void 0,z=A(Object.keys,Object),L=_t(b,"DataView"),G=_t(b,"Map"),K=_t(b,"Promise"),H=_t(b,"Set"),J=_t(b,"WeakMap"),Q=_t(Object,"create"),X=wt(L),Y=wt(G),Z=wt(K),tt=wt(H),et=wt(J),rt=P?P.prototype:void 0,nt=rt?rt.valueOf:void 0;function ot(t){var e=-1,r=t?t.length:0;for(this.clear();++e<r;){var n=t[e];this.set(n[0],n[1])}}function ct(t){var e=-1,r=t?t.length:0;for(this.clear();++e<r;){var n=t[e];this.set(n[0],n[1])}}function ut(t){var e=-1,r=t?t.length:0;for(this.clear();++e<r;){var n=t[e];this.set(n[0],n[1])}}function at(t){this.__data__=new ct(t)}function it(t,e){var r=At(t)||function(t){return function(t){return function(t){return!!t&&"object"==typeof t}(t)&&Ot(t)}(t)&&k.call(t,"callee")&&(!C.call(t,"callee")||D.call(t)==n)}(t)?function(t,e){for(var r=-1,n=Array(t);++r<t;)n[r]=e(r);return n}(t.length,String):[],o=r.length,c=!!o;for(var u in t)!e&&!k.call(t,u)||c&&("length"==u||jt(u,o))||r.push(u);return r}function ft(t,e,r){var n=t[e];k.call(t,e)&&mt(n,r)&&(void 0!==r||e in t)||(t[e]=r)}function st(t,e){for(var r=t.length;r--;)if(mt(t[r][0],e))return r;return-1}function lt(t,e,r,f,s,p,y){var b;if(f&&(b=p?f(t,s,p,y):f(t)),void 0!==b)return b;if(!$t(t))return t;var h=At(t);if(h){if(b=function(t){var e=t.length,r=t.constructor(e);e&&"string"==typeof t[0]&&k.call(t,"index")&&(r.index=t.index,r.input=t.input);return r}(t),!e)return function(t,e){var r=-1,n=t.length;e||(e=Array(n));for(;++r<n;)e[r]=t[r];return e}(t,b)}else{var _=vt(t),d=_==o||_==c;if(St(t))return function(t,e){if(e)return t.slice();var r=new t.constructor(t.length);return t.copy(r),r}(t,e);if("[object Object]"==_||_==n||d&&!p){if(w(t))return p?t:{};if(b=function(t){return"function"!=typeof t.constructor||gt(t)?{}:(e=M(t),$t(e)?V(e):{});var e}(d?{}:t),!e)return function(t,e){return bt(t,dt(t),e)}(t,function(t,e){return t&&bt(e,Et(e),t)}(b,t))}else{if(!l[_])return p?t:{};b=function(t,e,r,n){var o=t.constructor;switch(e){case"[object ArrayBuffer]":return yt(t);case"[object Boolean]":case"[object Date]":return new o(+t);case"[object DataView]":return function(t,e){var r=e?yt(t.buffer):t.buffer;return new t.constructor(r,t.byteOffset,t.byteLength)}(t,n);case"[object Float32Array]":case"[object Float64Array]":case"[object Int8Array]":case"[object Int16Array]":case"[object Int32Array]":case"[object Uint8Array]":case"[object Uint8ClampedArray]":case"[object Uint16Array]":case"[object Uint32Array]":return function(t,e){var r=e?yt(t.buffer):t.buffer;return new t.constructor(r,t.byteOffset,t.length)}(t,n);case u:return function(t,e,r){return g(e?r(m(t),!0):m(t),v,new t.constructor)}(t,n,r);case"[object Number]":case"[object String]":return new o(t);case"[object RegExp]":return function(t){var e=new t.constructor(t.source,i.exec(t));return e.lastIndex=t.lastIndex,e}(t);case a:return function(t,e,r){return g(e?r(O(t),!0):O(t),j,new t.constructor)}(t,n,r);case"[object Symbol]":return c=t,nt?Object(nt.call(c)):{}}var c}(t,_,lt,e)}}y||(y=new at);var A=y.get(t);if(A)return A;if(y.set(t,b),!h)var S=r?function(t){return function(t,e,r){var n=e(t);return At(t)?n:function(t,e){for(var r=-1,n=e.length,o=t.length;++r<n;)t[o+r]=e[r];return t}(n,r(t))}(t,Et,dt)}(t):Et(t);return function(t,e){for(var r=-1,n=t?t.length:0;++r<n&&!1!==e(t[r],r,t););}(S||t,(function(n,o){S&&(n=t[o=n]),ft(b,o,lt(n,e,r,f,o,t,y))})),b}function pt(t){return!(!$t(t)||(e=t,T&&T in e))&&(xt(t)||w(t)?F:f).test(wt(t));var e}function yt(t){var e=new t.constructor(t.byteLength);return new B(e).set(new B(t)),e}function bt(t,e,r,n){r||(r={});for(var o=-1,c=e.length;++o<c;){var u=e[o],a=n?n(r[u],t[u],u,r,t):void 0;ft(r,u,void 0===a?t[u]:a)}return r}function ht(t,e){var r,n,o=t.__data__;return("string"==(n=typeof(r=e))||"number"==n||"symbol"==n||"boolean"==n?"__proto__"!==r:null===r)?o["string"==typeof e?"string":"hash"]:o.map}function _t(t,e){var r=function(t,e){return null==t?void 0:t[e]}(t,e);return pt(r)?r:void 0}ot.prototype.clear=function(){this.__data__=Q?Q(null):{}},ot.prototype.delete=function(t){return this.has(t)&&delete this.__data__[t]},ot.prototype.get=function(t){var e=this.__data__;if(Q){var r=e[t];return"__lodash_hash_undefined__"===r?void 0:r}return k.call(e,t)?e[t]:void 0},ot.prototype.has=function(t){var e=this.__data__;return Q?void 0!==e[t]:k.call(e,t)},ot.prototype.set=function(t,e){return this.__data__[t]=Q&&void 0===e?"__lodash_hash_undefined__":e,this},ct.prototype.clear=function(){this.__data__=[]},ct.prototype.delete=function(t){var e=this.__data__,r=st(e,t);return!(r<0)&&(r==e.length-1?e.pop():R.call(e,r,1),!0)},ct.prototype.get=function(t){var e=this.__data__,r=st(e,t);return r<0?void 0:e[r][1]},ct.prototype.has=function(t){return st(this.__data__,t)>-1},ct.prototype.set=function(t,e){var r=this.__data__,n=st(r,t);return n<0?r.push([t,e]):r[n][1]=e,this},ut.prototype.clear=function(){this.__data__={hash:new ot,map:new(G||ct),string:new ot}},ut.prototype.delete=function(t){return ht(this,t).delete(t)},ut.prototype.get=function(t){return ht(this,t).get(t)},ut.prototype.has=function(t){return ht(this,t).has(t)},ut.prototype.set=function(t,e){return ht(this,t).set(t,e),this},at.prototype.clear=function(){this.__data__=new ct},at.prototype.delete=function(t){return this.__data__.delete(t)},at.prototype.get=function(t){return this.__data__.get(t)},at.prototype.has=function(t){return this.__data__.has(t)},at.prototype.set=function(t,e){var r=this.__data__;if(r instanceof ct){var n=r.__data__;if(!G||n.length<199)return n.push([t,e]),this;r=this.__data__=new ut(n)}return r.set(t,e),this};var dt=W?A(W,Object):function(){return[]},vt=function(t){return D.call(t)};function jt(t,e){return!!(e=null==e?9007199254740991:e)&&("number"==typeof t||s.test(t))&&t>-1&&t%1==0&&t<e}function gt(t){var e=t&&t.constructor;return t===("function"==typeof e&&e.prototype||E)}function wt(t){if(null!=t){try{return U.call(t)}catch(t){}try{return t+""}catch(t){}}return""}function mt(t,e){return t===e||t!=t&&e!=e}(L&&"[object DataView]"!=vt(new L(new ArrayBuffer(1)))||G&&vt(new G)!=u||K&&"[object Promise]"!=vt(K.resolve())||H&&vt(new H)!=a||J&&"[object WeakMap]"!=vt(new J))&&(vt=function(t){var e=D.call(t),r="[object Object]"==e?t.constructor:void 0,n=r?wt(r):void 0;if(n)switch(n){case X:return"[object DataView]";case Y:return u;case Z:return"[object Promise]";case tt:return a;case et:return"[object WeakMap]"}return e});var At=Array.isArray;function Ot(t){return null!=t&&function(t){return"number"==typeof t&&t>-1&&t%1==0&&t<=9007199254740991}(t.length)&&!xt(t)}var St=q||function(){return!1};function xt(t){var e=$t(t)?D.call(t):"";return e==o||e==c}function $t(t){var e=typeof t;return!!t&&("object"==e||"function"==e)}function Et(t){return Ot(t)?it(t):function(t){if(!gt(t))return z(t);var e=[];for(var r in Object(t))k.call(t,r)&&"constructor"!=r&&e.push(r);return e}(t)}t.exports=function(t){return lt(t,!0,!0)}}));function n(t){return"string"==typeof t&&t.length&&"."===t[0]?t.slice(1):t}function o(t,e){return function t(e,o,c,u){const a=r(e);let i,f,s;const l={depth:-1,path:"",...c};if(l.depth+=1,Array.isArray(a))for(i=0,f=a.length;i<f&&!u.now;i++){const e=`${l.path}.${i}`;void 0!==a[i]?(l.parent=r(a),l.parentType="array",s=t(o(a[i],void 0,{...l,path:n(e)},u),o,{...l,path:n(e)},u),Number.isNaN(s)&&i<a.length?(a.splice(i,1),i-=1):a[i]=s):a.splice(i,1)}else if((p=a)&&"object"==typeof p&&!Array.isArray(p))for(const e in a){if(u.now&&null!=e)break;const c=`${l.path}.${e}`;0===l.depth&&null!=e&&(l.topmostKey=e),l.parent=r(a),l.parentType="object",s=t(o(e,a[e],{...l,path:n(c)},u),o,{...l,path:n(c)},u),Number.isNaN(s)?delete a[e]:a[e]=s}var p;return a}(t,e,{},{now:!1})}return function(e){if("string"==typeof e)return!e.trim();if(!["object","string"].includes(t(e))||!e)return!1;var r=!0;return e=o(e,(function(t,e,n,o){var c=void 0!==e?e:t;return"string"==typeof c&&c.trim()&&(r=!1,o.now=!0),c})),r}}));
