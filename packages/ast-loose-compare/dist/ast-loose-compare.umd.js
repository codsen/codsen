/**
 * ast-loose-compare
 * Compare anything: AST, objects, arrays and strings
 * Version: 1.9.1
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ast-loose-compare/
 */

!function(t,r){"object"==typeof exports&&"undefined"!=typeof module?module.exports=r():"function"==typeof define&&define.amd?define(r):(t="undefined"!=typeof globalThis?globalThis:t||self).astLooseCompare=r()}(this,(function(){"use strict";function t(r){return(t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(r)}function r(t,r,e){return r in t?Object.defineProperty(t,r,{value:e,enumerable:!0,configurable:!0,writable:!0}):t[r]=e,t}function e(t,r){var e=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(t,r).enumerable}))),e.push.apply(e,n)}return e}function n(t){for(var n=1;n<arguments.length;n++){var o=null!=arguments[n]?arguments[n]:{};n%2?e(Object(o),!0).forEach((function(e){r(t,e,o[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(o)):e(Object(o)).forEach((function(r){Object.defineProperty(t,r,Object.getOwnPropertyDescriptor(o,r))}))}return t}var o="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{};var u=function(t){var r={exports:{}};return t(r,r.exports),r.exports}((function(r,e){var n="__lodash_hash_undefined__",u=9007199254740991,i="[object Arguments]",c="[object Boolean]",a="[object Date]",f="[object Function]",s="[object GeneratorFunction]",l="[object Map]",p="[object Number]",y="[object Object]",h="[object Promise]",b="[object RegExp]",v="[object Set]",d="[object String]",_="[object Symbol]",g="[object WeakMap]",j="[object ArrayBuffer]",O="[object DataView]",w="[object Float32Array]",m="[object Float64Array]",A="[object Int8Array]",S="[object Int16Array]",x="[object Int32Array]",P="[object Uint8Array]",k="[object Uint8ClampedArray]",E="[object Uint16Array]",T="[object Uint32Array]",I=/\w*$/,$=/^\[object .+?Constructor\]$/,D=/^(?:0|[1-9]\d*)$/,N={};N[i]=N["[object Array]"]=N[j]=N[O]=N[c]=N[a]=N[w]=N[m]=N[A]=N[S]=N[x]=N[l]=N[p]=N[y]=N[b]=N[v]=N[d]=N[_]=N[P]=N[k]=N[E]=N[T]=!0,N["[object Error]"]=N[f]=N[g]=!1;var F="object"==t(o)&&o&&o.Object===Object&&o,B="object"==("undefined"==typeof self?"undefined":t(self))&&self&&self.Object===Object&&self,U=F||B||Function("return this")(),M=e&&!e.nodeType&&e,C=M&&r&&!r.nodeType&&r,K=C&&C.exports===M;function L(t,r){return t.set(r[0],r[1]),t}function R(t,r){return t.add(r),t}function z(t,r,e,n){var o=-1,u=t?t.length:0;for(n&&u&&(e=t[++o]);++o<u;)e=r(e,t[o],o,t);return e}function V(t){var r=!1;if(null!=t&&"function"!=typeof t.toString)try{r=!!(t+"")}catch(t){}return r}function W(t){var r=-1,e=Array(t.size);return t.forEach((function(t,n){e[++r]=[n,t]})),e}function G(t,r){return function(e){return t(r(e))}}function q(t){var r=-1,e=Array(t.size);return t.forEach((function(t){e[++r]=t})),e}var H,J=Array.prototype,Q=Function.prototype,X=Object.prototype,Y=U["__core-js_shared__"],Z=(H=/[^.]+$/.exec(Y&&Y.keys&&Y.keys.IE_PROTO||""))?"Symbol(src)_1."+H:"",tt=Q.toString,rt=X.hasOwnProperty,et=X.toString,nt=RegExp("^"+tt.call(rt).replace(/[\\^$.*+?()[\]{}|]/g,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$"),ot=K?U.Buffer:void 0,ut=U.Symbol,it=U.Uint8Array,ct=G(Object.getPrototypeOf,Object),at=Object.create,ft=X.propertyIsEnumerable,st=J.splice,lt=Object.getOwnPropertySymbols,pt=ot?ot.isBuffer:void 0,yt=G(Object.keys,Object),ht=Ct(U,"DataView"),bt=Ct(U,"Map"),vt=Ct(U,"Promise"),dt=Ct(U,"Set"),_t=Ct(U,"WeakMap"),gt=Ct(Object,"create"),jt=Vt(ht),Ot=Vt(bt),wt=Vt(vt),mt=Vt(dt),At=Vt(_t),St=ut?ut.prototype:void 0,xt=St?St.valueOf:void 0;function Pt(t){var r=-1,e=t?t.length:0;for(this.clear();++r<e;){var n=t[r];this.set(n[0],n[1])}}function kt(t){var r=-1,e=t?t.length:0;for(this.clear();++r<e;){var n=t[r];this.set(n[0],n[1])}}function Et(t){var r=-1,e=t?t.length:0;for(this.clear();++r<e;){var n=t[r];this.set(n[0],n[1])}}function Tt(t){this.__data__=new kt(t)}function It(r,e){var n=Gt(r)||function(r){return function(r){return function(r){return!!r&&"object"==t(r)}(r)&&qt(r)}(r)&&rt.call(r,"callee")&&(!ft.call(r,"callee")||et.call(r)==i)}(r)?function(t,r){for(var e=-1,n=Array(t);++e<t;)n[e]=r(e);return n}(r.length,String):[],o=n.length,u=!!o;for(var c in r)!e&&!rt.call(r,c)||u&&("length"==c||Rt(c,o))||n.push(c);return n}function $t(t,r,e){var n=t[r];rt.call(t,r)&&Wt(n,e)&&(void 0!==e||r in t)||(t[r]=e)}function Dt(t,r){for(var e=t.length;e--;)if(Wt(t[e][0],r))return e;return-1}function Nt(t,r,e,n,o,u,h){var g;if(n&&(g=u?n(t,o,u,h):n(t)),void 0!==g)return g;if(!Qt(t))return t;var $=Gt(t);if($){if(g=function(t){var r=t.length,e=t.constructor(r);r&&"string"==typeof t[0]&&rt.call(t,"index")&&(e.index=t.index,e.input=t.input);return e}(t),!r)return function(t,r){var e=-1,n=t.length;r||(r=Array(n));for(;++e<n;)r[e]=t[e];return r}(t,g)}else{var D=Lt(t),F=D==f||D==s;if(Ht(t))return function(t,r){if(r)return t.slice();var e=new t.constructor(t.length);return t.copy(e),e}(t,r);if(D==y||D==i||F&&!u){if(V(t))return u?t:{};if(g=function(t){return"function"!=typeof t.constructor||zt(t)?{}:(r=ct(t),Qt(r)?at(r):{});var r}(F?{}:t),!r)return function(t,r){return Ut(t,Kt(t),r)}(t,function(t,r){return t&&Ut(r,Xt(r),t)}(g,t))}else{if(!N[D])return u?t:{};g=function(t,r,e,n){var o=t.constructor;switch(r){case j:return Bt(t);case c:case a:return new o(+t);case O:return function(t,r){var e=r?Bt(t.buffer):t.buffer;return new t.constructor(e,t.byteOffset,t.byteLength)}(t,n);case w:case m:case A:case S:case x:case P:case k:case E:case T:return function(t,r){var e=r?Bt(t.buffer):t.buffer;return new t.constructor(e,t.byteOffset,t.length)}(t,n);case l:return function(t,r,e){return z(r?e(W(t),!0):W(t),L,new t.constructor)}(t,n,e);case p:case d:return new o(t);case b:return function(t){var r=new t.constructor(t.source,I.exec(t));return r.lastIndex=t.lastIndex,r}(t);case v:return function(t,r,e){return z(r?e(q(t),!0):q(t),R,new t.constructor)}(t,n,e);case _:return u=t,xt?Object(xt.call(u)):{}}var u}(t,D,Nt,r)}}h||(h=new Tt);var B=h.get(t);if(B)return B;if(h.set(t,g),!$)var U=e?function(t){return function(t,r,e){var n=r(t);return Gt(t)?n:function(t,r){for(var e=-1,n=r.length,o=t.length;++e<n;)t[o+e]=r[e];return t}(n,e(t))}(t,Xt,Kt)}(t):Xt(t);return function(t,r){for(var e=-1,n=t?t.length:0;++e<n&&!1!==r(t[e],e,t););}(U||t,(function(o,u){U&&(o=t[u=o]),$t(g,u,Nt(o,r,e,n,u,t,h))})),g}function Ft(t){return!(!Qt(t)||(r=t,Z&&Z in r))&&(Jt(t)||V(t)?nt:$).test(Vt(t));var r}function Bt(t){var r=new t.constructor(t.byteLength);return new it(r).set(new it(t)),r}function Ut(t,r,e,n){e||(e={});for(var o=-1,u=r.length;++o<u;){var i=r[o],c=n?n(e[i],t[i],i,e,t):void 0;$t(e,i,void 0===c?t[i]:c)}return e}function Mt(r,e){var n,o,u=r.__data__;return("string"==(o=t(n=e))||"number"==o||"symbol"==o||"boolean"==o?"__proto__"!==n:null===n)?u["string"==typeof e?"string":"hash"]:u.map}function Ct(t,r){var e=function(t,r){return null==t?void 0:t[r]}(t,r);return Ft(e)?e:void 0}Pt.prototype.clear=function(){this.__data__=gt?gt(null):{}},Pt.prototype.delete=function(t){return this.has(t)&&delete this.__data__[t]},Pt.prototype.get=function(t){var r=this.__data__;if(gt){var e=r[t];return e===n?void 0:e}return rt.call(r,t)?r[t]:void 0},Pt.prototype.has=function(t){var r=this.__data__;return gt?void 0!==r[t]:rt.call(r,t)},Pt.prototype.set=function(t,r){return this.__data__[t]=gt&&void 0===r?n:r,this},kt.prototype.clear=function(){this.__data__=[]},kt.prototype.delete=function(t){var r=this.__data__,e=Dt(r,t);return!(e<0)&&(e==r.length-1?r.pop():st.call(r,e,1),!0)},kt.prototype.get=function(t){var r=this.__data__,e=Dt(r,t);return e<0?void 0:r[e][1]},kt.prototype.has=function(t){return Dt(this.__data__,t)>-1},kt.prototype.set=function(t,r){var e=this.__data__,n=Dt(e,t);return n<0?e.push([t,r]):e[n][1]=r,this},Et.prototype.clear=function(){this.__data__={hash:new Pt,map:new(bt||kt),string:new Pt}},Et.prototype.delete=function(t){return Mt(this,t).delete(t)},Et.prototype.get=function(t){return Mt(this,t).get(t)},Et.prototype.has=function(t){return Mt(this,t).has(t)},Et.prototype.set=function(t,r){return Mt(this,t).set(t,r),this},Tt.prototype.clear=function(){this.__data__=new kt},Tt.prototype.delete=function(t){return this.__data__.delete(t)},Tt.prototype.get=function(t){return this.__data__.get(t)},Tt.prototype.has=function(t){return this.__data__.has(t)},Tt.prototype.set=function(t,r){var e=this.__data__;if(e instanceof kt){var n=e.__data__;if(!bt||n.length<199)return n.push([t,r]),this;e=this.__data__=new Et(n)}return e.set(t,r),this};var Kt=lt?G(lt,Object):function(){return[]},Lt=function(t){return et.call(t)};function Rt(t,r){return!!(r=null==r?u:r)&&("number"==typeof t||D.test(t))&&t>-1&&t%1==0&&t<r}function zt(t){var r=t&&t.constructor;return t===("function"==typeof r&&r.prototype||X)}function Vt(t){if(null!=t){try{return tt.call(t)}catch(t){}try{return t+""}catch(t){}}return""}function Wt(t,r){return t===r||t!=t&&r!=r}(ht&&Lt(new ht(new ArrayBuffer(1)))!=O||bt&&Lt(new bt)!=l||vt&&Lt(vt.resolve())!=h||dt&&Lt(new dt)!=v||_t&&Lt(new _t)!=g)&&(Lt=function(t){var r=et.call(t),e=r==y?t.constructor:void 0,n=e?Vt(e):void 0;if(n)switch(n){case jt:return O;case Ot:return l;case wt:return h;case mt:return v;case At:return g}return r});var Gt=Array.isArray;function qt(t){return null!=t&&function(t){return"number"==typeof t&&t>-1&&t%1==0&&t<=u}(t.length)&&!Jt(t)}var Ht=pt||function(){return!1};function Jt(t){var r=Qt(t)?et.call(t):"";return r==f||r==s}function Qt(r){var e=t(r);return!!r&&("object"==e||"function"==e)}function Xt(t){return qt(t)?It(t):function(t){if(!zt(t))return yt(t);var r=[];for(var e in Object(t))rt.call(t,e)&&"constructor"!=e&&r.push(e);return r}(t)}r.exports=function(t){return Nt(t,!0,!0)}}));function i(t){if("string"==typeof t){if(!t.includes("."))return null;var r=t.lastIndexOf(".");if(!t.slice(0,r).includes("."))return t.slice(0,r);for(var e=r-1;e--;)if("."===t[e])return t.slice(e+1,r)}return null}function c(r,e){return function r(e,o,c,a){var f,s,l,p,y=u(e),h=n({depth:-1,path:""},c);if(h.depth+=1,Array.isArray(y))for(f=0,s=y.length;f<s&&!a.now;f++){var b=h.path?"".concat(h.path,".").concat(f):"".concat(f);void 0!==y[f]?(h.parent=u(y),h.parentType="array",h.parentKey=i(b),l=r(o(y[f],void 0,n(n({},h),{},{path:b}),a),o,n(n({},h),{},{path:b}),a),Number.isNaN(l)&&f<y.length?(y.splice(f,1),f-=1):y[f]=l):y.splice(f,1)}else if((p=y)&&"object"===t(p)&&!Array.isArray(p))for(var v in y){if(a.now&&null!=v)break;var d=h.path?"".concat(h.path,".").concat(v):v;0===h.depth&&null!=v&&(h.topmostKey=v),h.parent=u(y),h.parentType="object",h.parentKey=i(d),l=r(o(v,y[v],n(n({},h),{},{path:d}),a),o,n(n({},h),{},{path:d}),a),Number.isNaN(l)?delete y[v]:y[v]=l}return y}(r,e,{},{now:!1})}function a(r){if("string"==typeof r)return!r.trim();if(!["object","string"].includes(t(r))||!r)return!1;var e=!0;return r=c(r,(function(t,r,n,o){var u=void 0!==r?r:t;return"string"==typeof u&&u.trim()&&(e=!1,o.now=!0),u})),e}function f(r){return r&&"object"===t(r)&&!Array.isArray(r)}function s(r,e,n){function o(t){return null!=t}var u,i;if(void 0===n){if(!o(r)||!o(e))return}else if(!o(r)||!o(e))return!1;if(n=n||!0,t(r)!==t(e))return!(!a(r)||!a(e));if(Array.isArray(r)&&Array.isArray(e)){if(!(e.length>0))return!!(0===e.length&&0===r.length||a(e)&&a(r))||(n=!1,!1);for(u=0,i=e.length;u<i;u++)if(Array.isArray(e[u])||f(e[u])){if(!(n=s(r[u],e[u],n)))return!1}else if(e[u]!==r[u])return!(!a(e[u])||!a(r[u]))||(n=!1,!1)}else if(f(r)&&f(e)){if(!(Object.keys(e).length>0))return!!(0===Object.keys(e).length&&0===Object.keys(r).length||a(e)&&a(r))||(n=!1,!1);var c=Object.keys(e);for(u=0,i=c.length;u<i;u++)if(Array.isArray(e[c[u]])||f(e[c[u]])||"string"==typeof e[c[u]]){if(!(n=s(r[c[u]],e[c[u]],n)))return!1}else if(!(e[c[u]]===r[c[u]]||a(e[c[u]])&&a(r[c[u]])))return n=!1,!1}else{if("string"!=typeof r||"string"!=typeof e)return!(!a(e)||!a(r))||(n=!1,!1);if(r!==e)return!(!a(e)||!a(r))||(n=!1,!1)}return n}return function(t,r){return s(t,r)}}));
