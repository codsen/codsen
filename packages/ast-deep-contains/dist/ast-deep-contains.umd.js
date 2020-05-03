/**
 * ast-deep-contains
 * an alternative assertion for Ava's t.deepEqual and Tap's t.same
 * Version: 1.1.10
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/ast-deep-contains
 */

!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):(t=t||self).astDeepContains=e()}(this,(function(){"use strict";function t(e){return(t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(e)}function e(t,e,r){return e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}function r(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),r.push.apply(r,n)}return r}function n(t){for(var n=1;n<arguments.length;n++){var o=null!=arguments[n]?arguments[n]:{};n%2?r(Object(o),!0).forEach((function(r){e(t,r,o[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(o)):r(Object(o)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(o,e))}))}return t}var o="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{};function c(t,e){return t(e={exports:{}},e.exports),e.exports}var i=c((function(t){t.exports=function(){var t=Object.prototype.toString;function e(t,e){return null!=t&&Object.prototype.hasOwnProperty.call(t,e)}function r(t){if(!t)return!0;if(o(t)&&0===t.length)return!0;if("string"!=typeof t){for(var r in t)if(e(t,r))return!1;return!0}return!1}function n(e){return t.call(e)}var o=Array.isArray||function(e){return"[object Array]"===t.call(e)};function c(t){var e=parseInt(t);return e.toString()===t?e:t}function i(t){t=t||{};var i=function(t){return Object.keys(i).reduce((function(e,r){return"create"===r||"function"==typeof i[r]&&(e[r]=i[r].bind(i,t)),e}),{})};function u(r,n){return t.includeInheritedProps||"number"==typeof n&&Array.isArray(r)||e(r,n)}function a(t,e){if(u(t,e))return t[e]}function f(t,e,r,n){if("number"==typeof e&&(e=[e]),!e||0===e.length)return t;if("string"==typeof e)return f(t,e.split(".").map(c),r,n);var o=e[0],i=a(t,o);return 1===e.length?(void 0!==i&&n||(t[o]=r),i):(void 0===i&&("number"==typeof e[1]?t[o]=[]:t[o]={}),f(t[o],e.slice(1),r,n))}return i.has=function(r,n){if("number"==typeof n?n=[n]:"string"==typeof n&&(n=n.split(".")),!n||0===n.length)return!!r;for(var i=0;i<n.length;i++){var u=c(n[i]);if(!("number"==typeof u&&o(r)&&u<r.length||(t.includeInheritedProps?u in Object(r):e(r,u))))return!1;r=r[u]}return!0},i.ensureExists=function(t,e,r){return f(t,e,r,!0)},i.set=function(t,e,r,n){return f(t,e,r,n)},i.insert=function(t,e,r,n){var c=i.get(t,e);n=~~n,o(c)||(c=[],i.set(t,e,c)),c.splice(n,0,r)},i.empty=function(t,e){var c,a;if(!r(e)&&null!=t&&(c=i.get(t,e))){if("string"==typeof c)return i.set(t,e,"");if(function(t){return"boolean"==typeof t||"[object Boolean]"===n(t)}(c))return i.set(t,e,!1);if("number"==typeof c)return i.set(t,e,0);if(o(c))c.length=0;else{if(!function(t){return"object"==typeof t&&"[object Object]"===n(t)}(c))return i.set(t,e,null);for(a in c)u(c,a)&&delete c[a]}}},i.push=function(t,e){var r=i.get(t,e);o(r)||(r=[],i.set(t,e,r)),r.push.apply(r,Array.prototype.slice.call(arguments,2))},i.coalesce=function(t,e,r){for(var n,o=0,c=e.length;o<c;o++)if(void 0!==(n=i.get(t,e[o])))return n;return r},i.get=function(t,e,r){if("number"==typeof e&&(e=[e]),!e||0===e.length)return t;if(null==t)return r;if("string"==typeof e)return i.get(t,e.split("."),r);var n=c(e[0]),o=a(t,n);return void 0===o?r:1===e.length?o:i.get(t[n],e.slice(1),r)},i.del=function(t,e){if("number"==typeof e&&(e=[e]),null==t)return t;if(r(e))return t;if("string"==typeof e)return i.del(t,e.split("."));var n=c(e[0]);return u(t,n)?1!==e.length?i.del(t[n],e.slice(1)):(o(t)?t.splice(n,1):delete t[n],t):t},i}var u=i();return u.create=i,u.withInheritedProps=i({includeInheritedProps:!0}),u}()})),u=c((function(t,e){var r="[object Arguments]",n="[object Function]",c="[object GeneratorFunction]",i="[object Map]",u="[object Set]",a=/\w*$/,f=/^\[object .+?Constructor\]$/,s=/^(?:0|[1-9]\d*)$/,l={};l[r]=l["[object Array]"]=l["[object ArrayBuffer]"]=l["[object DataView]"]=l["[object Boolean]"]=l["[object Date]"]=l["[object Float32Array]"]=l["[object Float64Array]"]=l["[object Int8Array]"]=l["[object Int16Array]"]=l["[object Int32Array]"]=l[i]=l["[object Number]"]=l["[object Object]"]=l["[object RegExp]"]=l[u]=l["[object String]"]=l["[object Symbol]"]=l["[object Uint8Array]"]=l["[object Uint8ClampedArray]"]=l["[object Uint16Array]"]=l["[object Uint32Array]"]=!0,l["[object Error]"]=l[n]=l["[object WeakMap]"]=!1;var p="object"==typeof o&&o&&o.Object===Object&&o,y="object"==typeof self&&self&&self.Object===Object&&self,b=p||y||Function("return this")(),h=e&&!e.nodeType&&e,v=h&&t&&!t.nodeType&&t,d=v&&v.exports===h;function g(t,e){return t.set(e[0],e[1]),t}function j(t,e){return t.add(e),t}function _(t,e,r,n){var o=-1,c=t?t.length:0;for(n&&c&&(r=t[++o]);++o<c;)r=e(r,t[o],o,t);return r}function O(t){var e=!1;if(null!=t&&"function"!=typeof t.toString)try{e=!!(t+"")}catch(t){}return e}function m(t){var e=-1,r=Array(t.size);return t.forEach((function(t,n){r[++e]=[n,t]})),r}function w(t,e){return function(r){return t(e(r))}}function A(t){var e=-1,r=Array(t.size);return t.forEach((function(t){r[++e]=t})),r}var S,P=Array.prototype,x=Function.prototype,k=Object.prototype,E=b["__core-js_shared__"],I=(S=/[^.]+$/.exec(E&&E.keys&&E.keys.IE_PROTO||""))?"Symbol(src)_1."+S:"",N=x.toString,D=k.hasOwnProperty,$=k.toString,C=RegExp("^"+N.call(D).replace(/[\\^$.*+?()[\]{}|]/g,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$"),U=d?b.Buffer:void 0,B=b.Symbol,F=b.Uint8Array,T=w(Object.getPrototypeOf,Object),J=Object.create,M=k.propertyIsEnumerable,V=P.splice,L=Object.getOwnPropertySymbols,R=U?U.isBuffer:void 0,W=w(Object.keys,Object),z=vt(b,"DataView"),G=vt(b,"Map"),K=vt(b,"Promise"),q=vt(b,"Set"),H=vt(b,"WeakMap"),Q=vt(Object,"create"),X=Ot(z),Y=Ot(G),Z=Ot(K),tt=Ot(q),et=Ot(H),rt=B?B.prototype:void 0,nt=rt?rt.valueOf:void 0;function ot(t){var e=-1,r=t?t.length:0;for(this.clear();++e<r;){var n=t[e];this.set(n[0],n[1])}}function ct(t){var e=-1,r=t?t.length:0;for(this.clear();++e<r;){var n=t[e];this.set(n[0],n[1])}}function it(t){var e=-1,r=t?t.length:0;for(this.clear();++e<r;){var n=t[e];this.set(n[0],n[1])}}function ut(t){this.__data__=new ct(t)}function at(t,e){var n=wt(t)||function(t){return function(t){return function(t){return!!t&&"object"==typeof t}(t)&&At(t)}(t)&&D.call(t,"callee")&&(!M.call(t,"callee")||$.call(t)==r)}(t)?function(t,e){for(var r=-1,n=Array(t);++r<t;)n[r]=e(r);return n}(t.length,String):[],o=n.length,c=!!o;for(var i in t)!e&&!D.call(t,i)||c&&("length"==i||jt(i,o))||n.push(i);return n}function ft(t,e,r){var n=t[e];D.call(t,e)&&mt(n,r)&&(void 0!==r||e in t)||(t[e]=r)}function st(t,e){for(var r=t.length;r--;)if(mt(t[r][0],e))return r;return-1}function lt(t,e,o,f,s,p,y){var b;if(f&&(b=p?f(t,s,p,y):f(t)),void 0!==b)return b;if(!xt(t))return t;var h=wt(t);if(h){if(b=function(t){var e=t.length,r=t.constructor(e);e&&"string"==typeof t[0]&&D.call(t,"index")&&(r.index=t.index,r.input=t.input);return r}(t),!e)return function(t,e){var r=-1,n=t.length;e||(e=Array(n));for(;++r<n;)e[r]=t[r];return e}(t,b)}else{var v=gt(t),d=v==n||v==c;if(St(t))return function(t,e){if(e)return t.slice();var r=new t.constructor(t.length);return t.copy(r),r}(t,e);if("[object Object]"==v||v==r||d&&!p){if(O(t))return p?t:{};if(b=function(t){return"function"!=typeof t.constructor||_t(t)?{}:(e=T(t),xt(e)?J(e):{});var e}(d?{}:t),!e)return function(t,e){return bt(t,dt(t),e)}(t,function(t,e){return t&&bt(e,kt(e),t)}(b,t))}else{if(!l[v])return p?t:{};b=function(t,e,r,n){var o=t.constructor;switch(e){case"[object ArrayBuffer]":return yt(t);case"[object Boolean]":case"[object Date]":return new o(+t);case"[object DataView]":return function(t,e){var r=e?yt(t.buffer):t.buffer;return new t.constructor(r,t.byteOffset,t.byteLength)}(t,n);case"[object Float32Array]":case"[object Float64Array]":case"[object Int8Array]":case"[object Int16Array]":case"[object Int32Array]":case"[object Uint8Array]":case"[object Uint8ClampedArray]":case"[object Uint16Array]":case"[object Uint32Array]":return function(t,e){var r=e?yt(t.buffer):t.buffer;return new t.constructor(r,t.byteOffset,t.length)}(t,n);case i:return function(t,e,r){return _(e?r(m(t),!0):m(t),g,new t.constructor)}(t,n,r);case"[object Number]":case"[object String]":return new o(t);case"[object RegExp]":return function(t){var e=new t.constructor(t.source,a.exec(t));return e.lastIndex=t.lastIndex,e}(t);case u:return function(t,e,r){return _(e?r(A(t),!0):A(t),j,new t.constructor)}(t,n,r);case"[object Symbol]":return c=t,nt?Object(nt.call(c)):{}}var c}(t,v,lt,e)}}y||(y=new ut);var w=y.get(t);if(w)return w;if(y.set(t,b),!h)var S=o?function(t){return function(t,e,r){var n=e(t);return wt(t)?n:function(t,e){for(var r=-1,n=e.length,o=t.length;++r<n;)t[o+r]=e[r];return t}(n,r(t))}(t,kt,dt)}(t):kt(t);return function(t,e){for(var r=-1,n=t?t.length:0;++r<n&&!1!==e(t[r],r,t););}(S||t,(function(r,n){S&&(r=t[n=r]),ft(b,n,lt(r,e,o,f,n,t,y))})),b}function pt(t){return!(!xt(t)||(e=t,I&&I in e))&&(Pt(t)||O(t)?C:f).test(Ot(t));var e}function yt(t){var e=new t.constructor(t.byteLength);return new F(e).set(new F(t)),e}function bt(t,e,r,n){r||(r={});for(var o=-1,c=e.length;++o<c;){var i=e[o],u=n?n(r[i],t[i],i,r,t):void 0;ft(r,i,void 0===u?t[i]:u)}return r}function ht(t,e){var r,n,o=t.__data__;return("string"==(n=typeof(r=e))||"number"==n||"symbol"==n||"boolean"==n?"__proto__"!==r:null===r)?o["string"==typeof e?"string":"hash"]:o.map}function vt(t,e){var r=function(t,e){return null==t?void 0:t[e]}(t,e);return pt(r)?r:void 0}ot.prototype.clear=function(){this.__data__=Q?Q(null):{}},ot.prototype.delete=function(t){return this.has(t)&&delete this.__data__[t]},ot.prototype.get=function(t){var e=this.__data__;if(Q){var r=e[t];return"__lodash_hash_undefined__"===r?void 0:r}return D.call(e,t)?e[t]:void 0},ot.prototype.has=function(t){var e=this.__data__;return Q?void 0!==e[t]:D.call(e,t)},ot.prototype.set=function(t,e){return this.__data__[t]=Q&&void 0===e?"__lodash_hash_undefined__":e,this},ct.prototype.clear=function(){this.__data__=[]},ct.prototype.delete=function(t){var e=this.__data__,r=st(e,t);return!(r<0)&&(r==e.length-1?e.pop():V.call(e,r,1),!0)},ct.prototype.get=function(t){var e=this.__data__,r=st(e,t);return r<0?void 0:e[r][1]},ct.prototype.has=function(t){return st(this.__data__,t)>-1},ct.prototype.set=function(t,e){var r=this.__data__,n=st(r,t);return n<0?r.push([t,e]):r[n][1]=e,this},it.prototype.clear=function(){this.__data__={hash:new ot,map:new(G||ct),string:new ot}},it.prototype.delete=function(t){return ht(this,t).delete(t)},it.prototype.get=function(t){return ht(this,t).get(t)},it.prototype.has=function(t){return ht(this,t).has(t)},it.prototype.set=function(t,e){return ht(this,t).set(t,e),this},ut.prototype.clear=function(){this.__data__=new ct},ut.prototype.delete=function(t){return this.__data__.delete(t)},ut.prototype.get=function(t){return this.__data__.get(t)},ut.prototype.has=function(t){return this.__data__.has(t)},ut.prototype.set=function(t,e){var r=this.__data__;if(r instanceof ct){var n=r.__data__;if(!G||n.length<199)return n.push([t,e]),this;r=this.__data__=new it(n)}return r.set(t,e),this};var dt=L?w(L,Object):function(){return[]},gt=function(t){return $.call(t)};function jt(t,e){return!!(e=null==e?9007199254740991:e)&&("number"==typeof t||s.test(t))&&t>-1&&t%1==0&&t<e}function _t(t){var e=t&&t.constructor;return t===("function"==typeof e&&e.prototype||k)}function Ot(t){if(null!=t){try{return N.call(t)}catch(t){}try{return t+""}catch(t){}}return""}function mt(t,e){return t===e||t!=t&&e!=e}(z&&"[object DataView]"!=gt(new z(new ArrayBuffer(1)))||G&&gt(new G)!=i||K&&"[object Promise]"!=gt(K.resolve())||q&&gt(new q)!=u||H&&"[object WeakMap]"!=gt(new H))&&(gt=function(t){var e=$.call(t),r="[object Object]"==e?t.constructor:void 0,n=r?Ot(r):void 0;if(n)switch(n){case X:return"[object DataView]";case Y:return i;case Z:return"[object Promise]";case tt:return u;case et:return"[object WeakMap]"}return e});var wt=Array.isArray;function At(t){return null!=t&&function(t){return"number"==typeof t&&t>-1&&t%1==0&&t<=9007199254740991}(t.length)&&!Pt(t)}var St=R||function(){return!1};function Pt(t){var e=xt(t)?$.call(t):"";return e==n||e==c}function xt(t){var e=typeof t;return!!t&&("object"==e||"function"==e)}function kt(t){return At(t)?at(t):function(t){if(!_t(t))return W(t);var e=[];for(var r in Object(t))D.call(t,r)&&"constructor"!=r&&e.push(r);return e}(t)}t.exports=function(t){return lt(t,!0,!0)}}));function a(t){return"string"==typeof t&&t.length&&"."===t[0]?t.slice(1):t}function f(t,e){return function t(e,r,n,o){const c=u(e);let i,f,s;const l={depth:-1,path:"",...n};if(l.depth+=1,Array.isArray(c))for(i=0,f=c.length;i<f&&!o.now;i++){const e=`${l.path}.${i}`;void 0!==c[i]?(l.parent=u(c),l.parentType="array",s=t(r(c[i],void 0,{...l,path:a(e)},o),r,{...l,path:a(e)},o),Number.isNaN(s)&&i<c.length?(c.splice(i,1),i-=1):c[i]=s):c.splice(i,1)}else if((p=c)&&"object"==typeof p&&!Array.isArray(p))for(const e in c){if(o.now&&null!=e)break;const n=`${l.path}.${e}`;0===l.depth&&null!=e&&(l.topmostKey=e),l.parent=u(c),l.parentType="object",s=t(r(e,c[e],{...l,path:a(n)},o),r,{...l,path:a(n)},o),Number.isNaN(s)?delete c[e]:c[e]=s}var p;return c}(t,e,{},{now:!1})}var s=Array.isArray;function l(e){return null===e?"null":t(e)}function p(t){return"object"===l(t)}return function t(e,r,o,c,u){var a=n(n({},{skipContainers:!0,arrayStrictComparison:!1}),u);l(e)!==l(r)?c("the first input arg is of a type ".concat(l(e).toLowerCase()," but the second is ").concat(l(r).toLowerCase(),". Values are - 1st:\n").concat(JSON.stringify(e,null,4),"\n2nd:\n").concat(JSON.stringify(r,null,4))):f(r,(function(r,n,u,f){var l=void 0!==n?n:r,y=u.path;if(i.has(e,y))if(!a.arrayStrictComparison&&p(l)&&"array"===u.parentType&&u.parent.length>1)!function(){f.now=!0;var r=Array.from(u.path.includes(".")?i.get(e,function(t){for(var e=t.length;e--;)if("."===t[e])return t.slice(0,e);return t}(y)):e);r.length<u.parent.length?c("the first array: ".concat(JSON.stringify(r,null,4),"\nhas less objects than array we're matching against, ").concat(JSON.stringify(u.parent,null,4))):function(){for(var e=u.parent,n=r.map((function(t,e){return e})),i=(e.map((function(t,e){return e})),[]),f=function(t,e){var r,o,c=[],u=n[t],a=(r=n,o=t,Array.from(r).filter((function(t,e){return e!==o})));c.push(u),a.forEach((function(t){i.push(Array.from(c).concat(t))}))},s=0,l=n.length;s<l;s++)f(s);for(var y=i.map((function(t){return t.map((function(t,e){return[e,t]}))})),b=0,h=0,v=y.length;h<v;h++){var d=0;y[h].forEach((function(t){p(e[t[0]])&&p(r[t[1]])&&Object.keys(e[t[0]]).forEach((function(n){Object.keys(r[t[1]]).includes(n)&&(d+=1,r[t[1]][n]===e[t[0]][n]&&(d+=5))}))})),y[h].push(d),d>b&&(b=d)}for(var g=function(n,i){if(y[n][2]===b)return y[n].forEach((function(i,u){u<y[n].length-1&&t(r[i[1]],e[i[0]],o,c,a)})),"break"},j=0,_=y.length;j<_;j++){if("break"===g(j))break}}()}();else{var b=i.get(e,y);a.skipContainers&&(p(b)||s(b))||o(b,l,y)}else c("the first input: ".concat(JSON.stringify(e,null,4),'\ndoes not have the path "').concat(y,'", we were looking, would it contain a value ').concat(JSON.stringify(l,null,0),"."));return l}))}}));
