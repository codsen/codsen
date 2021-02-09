/**
 * array-of-arrays-into-ast
 * Turns an array of arrays of data into a nested tree of plain objects
 * Version: 2.0.3
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/array-of-arrays-into-ast/
 */

!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e((t="undefined"!=typeof globalThis?globalThis:t||self).arrayOfArraysIntoAst={})}(this,(function(t){"use strict";function e(t,e,r){return e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}function r(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),r.push.apply(r,n)}return r}function n(t){for(var n=1;n<arguments.length;n++){var o=null!=arguments[n]?arguments[n]:{};n%2?r(Object(o),!0).forEach((function(r){e(t,r,o[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(o)):r(Object(o)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(o,e))}))}return t}function o(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=new Array(e);r<e;r++)n[r]=t[r];return n}function a(t,e){var r;if("undefined"==typeof Symbol||null==t[Symbol.iterator]){if(Array.isArray(t)||(r=function(t,e){if(t){if("string"==typeof t)return o(t,e);var r=Object.prototype.toString.call(t).slice(8,-1);return"Object"===r&&t.constructor&&(r=t.constructor.name),"Map"===r||"Set"===r?Array.from(t):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?o(t,e):void 0}}(t))||e&&t&&"number"==typeof t.length){r&&(t=r);var n=0;return function(){return n>=t.length?{done:!0}:{done:!1,value:t[n++]}}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}return(r=t[Symbol.iterator]()).next.bind(r)}var u="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{};function c(t){var e={exports:{}};return t(e,e.exports),e.exports}var i=c((function(t,e){var r="__lodash_hash_undefined__",n=9007199254740991,o="[object Arguments]",a="[object Boolean]",c="[object Date]",i="[object Function]",f="[object GeneratorFunction]",y="[object Map]",p="[object Number]",s="[object Object]",l="[object Promise]",h="[object RegExp]",v="[object Set]",b="[object String]",g="[object Symbol]",d="[object WeakMap]",_="[object ArrayBuffer]",j="[object DataView]",O="[object Float32Array]",k="[object Float64Array]",A="[object Int8Array]",m="[object Int16Array]",w="[object Int32Array]",S="[object Uint8Array]",E="[object Uint8ClampedArray]",M="[object Uint16Array]",x="[object Uint32Array]",P=/\w*$/,$=/^\[object .+?Constructor\]$/,I=/^(?:0|[1-9]\d*)$/,T={};T[o]=T["[object Array]"]=T[_]=T[j]=T[a]=T[c]=T[O]=T[k]=T[A]=T[m]=T[w]=T[y]=T[p]=T[s]=T[h]=T[v]=T[b]=T[g]=T[S]=T[E]=T[M]=T[x]=!0,T["[object Error]"]=T[i]=T[d]=!1;var F="object"==typeof self&&self&&self.Object===Object&&self,K="object"==typeof u&&u&&u.Object===Object&&u||F||Function("return this")(),B=e&&!e.nodeType&&e,C=B&&t&&!t.nodeType&&t,D=C&&C.exports===B;function N(t,e){return t.set(e[0],e[1]),t}function R(t,e){return t.add(e),t}function U(t,e,r,n){var o=-1,a=t?t.length:0;for(n&&a&&(r=t[++o]);++o<a;)r=e(r,t[o],o,t);return r}function W(t){var e=!1;if(null!=t&&"function"!=typeof t.toString)try{e=!!(t+"")}catch(t){}return e}function V(t){var e=-1,r=Array(t.size);return t.forEach((function(t,n){r[++e]=[n,t]})),r}function z(t,e){return function(r){return t(e(r))}}function G(t){var e=-1,r=Array(t.size);return t.forEach((function(t){r[++e]=t})),r}var H,J=Array.prototype,L=Function.prototype,q=Object.prototype,Q=K["__core-js_shared__"],X=(H=/[^.]+$/.exec(Q&&Q.keys&&Q.keys.IE_PROTO||""))?"Symbol(src)_1."+H:"",Y=L.toString,Z=q.hasOwnProperty,tt=q.toString,et=RegExp("^"+Y.call(Z).replace(/[\\^$.*+?()[\]{}|]/g,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$"),rt=D?K.Buffer:void 0,nt=K.Symbol,ot=K.Uint8Array,at=z(Object.getPrototypeOf,Object),ut=Object.create,ct=q.propertyIsEnumerable,it=J.splice,ft=Object.getOwnPropertySymbols,yt=rt?rt.isBuffer:void 0,pt=z(Object.keys,Object),st=Ct(K,"DataView"),lt=Ct(K,"Map"),ht=Ct(K,"Promise"),vt=Ct(K,"Set"),bt=Ct(K,"WeakMap"),gt=Ct(Object,"create"),dt=Wt(st),_t=Wt(lt),jt=Wt(ht),Ot=Wt(vt),kt=Wt(bt),At=nt?nt.prototype:void 0,mt=At?At.valueOf:void 0;function wt(t){var e=-1,r=t?t.length:0;for(this.clear();++e<r;){var n=t[e];this.set(n[0],n[1])}}function St(t){var e=-1,r=t?t.length:0;for(this.clear();++e<r;){var n=t[e];this.set(n[0],n[1])}}function Et(t){var e=-1,r=t?t.length:0;for(this.clear();++e<r;){var n=t[e];this.set(n[0],n[1])}}function Mt(t){this.__data__=new St(t)}function xt(t,e){var r=zt(t)||function(t){return function(t){return function(t){return!!t&&"object"==typeof t}(t)&&Gt(t)}(t)&&Z.call(t,"callee")&&(!ct.call(t,"callee")||tt.call(t)==o)}(t)?function(t,e){for(var r=-1,n=Array(t);++r<t;)n[r]=e(r);return n}(t.length,String):[],n=r.length,a=!!n;for(var u in t)!e&&!Z.call(t,u)||a&&("length"==u||Rt(u,n))||r.push(u);return r}function Pt(t,e,r){var n=t[e];Z.call(t,e)&&Vt(n,r)&&(void 0!==r||e in t)||(t[e]=r)}function $t(t,e){for(var r=t.length;r--;)if(Vt(t[r][0],e))return r;return-1}function It(t,e,r,n,u,l,d){var $;if(n&&($=l?n(t,u,l,d):n(t)),void 0!==$)return $;if(!Lt(t))return t;var I=zt(t);if(I){if($=function(t){var e=t.length,r=t.constructor(e);e&&"string"==typeof t[0]&&Z.call(t,"index")&&(r.index=t.index,r.input=t.input);return r}(t),!e)return function(t,e){var r=-1,n=t.length;e||(e=Array(n));for(;++r<n;)e[r]=t[r];return e}(t,$)}else{var F=Nt(t),K=F==i||F==f;if(Ht(t))return function(t,e){if(e)return t.slice();var r=new t.constructor(t.length);return t.copy(r),r}(t,e);if(F==s||F==o||K&&!l){if(W(t))return l?t:{};if($=function(t){return"function"!=typeof t.constructor||Ut(t)?{}:(e=at(t),Lt(e)?ut(e):{});var e}(K?{}:t),!e)return function(t,e){return Kt(t,Dt(t),e)}(t,function(t,e){return t&&Kt(e,qt(e),t)}($,t))}else{if(!T[F])return l?t:{};$=function(t,e,r,n){var o=t.constructor;switch(e){case _:return Ft(t);case a:case c:return new o(+t);case j:return function(t,e){var r=e?Ft(t.buffer):t.buffer;return new t.constructor(r,t.byteOffset,t.byteLength)}(t,n);case O:case k:case A:case m:case w:case S:case E:case M:case x:return function(t,e){var r=e?Ft(t.buffer):t.buffer;return new t.constructor(r,t.byteOffset,t.length)}(t,n);case y:return function(t,e,r){return U(e?r(V(t),!0):V(t),N,new t.constructor)}(t,n,r);case p:case b:return new o(t);case h:return function(t){var e=new t.constructor(t.source,P.exec(t));return e.lastIndex=t.lastIndex,e}(t);case v:return function(t,e,r){return U(e?r(G(t),!0):G(t),R,new t.constructor)}(t,n,r);case g:return u=t,mt?Object(mt.call(u)):{}}var u}(t,F,It,e)}}d||(d=new Mt);var B=d.get(t);if(B)return B;if(d.set(t,$),!I)var C=r?function(t){return function(t,e,r){var n=e(t);return zt(t)?n:function(t,e){for(var r=-1,n=e.length,o=t.length;++r<n;)t[o+r]=e[r];return t}(n,r(t))}(t,qt,Dt)}(t):qt(t);return function(t,e){for(var r=-1,n=t?t.length:0;++r<n&&!1!==e(t[r],r,t););}(C||t,(function(o,a){C&&(o=t[a=o]),Pt($,a,It(o,e,r,n,a,t,d))})),$}function Tt(t){return!(!Lt(t)||(e=t,X&&X in e))&&(Jt(t)||W(t)?et:$).test(Wt(t));var e}function Ft(t){var e=new t.constructor(t.byteLength);return new ot(e).set(new ot(t)),e}function Kt(t,e,r,n){r||(r={});for(var o=-1,a=e.length;++o<a;){var u=e[o],c=n?n(r[u],t[u],u,r,t):void 0;Pt(r,u,void 0===c?t[u]:c)}return r}function Bt(t,e){var r,n,o=t.__data__;return("string"==(n=typeof(r=e))||"number"==n||"symbol"==n||"boolean"==n?"__proto__"!==r:null===r)?o["string"==typeof e?"string":"hash"]:o.map}function Ct(t,e){var r=function(t,e){return null==t?void 0:t[e]}(t,e);return Tt(r)?r:void 0}wt.prototype.clear=function(){this.__data__=gt?gt(null):{}},wt.prototype.delete=function(t){return this.has(t)&&delete this.__data__[t]},wt.prototype.get=function(t){var e=this.__data__;if(gt){var n=e[t];return n===r?void 0:n}return Z.call(e,t)?e[t]:void 0},wt.prototype.has=function(t){var e=this.__data__;return gt?void 0!==e[t]:Z.call(e,t)},wt.prototype.set=function(t,e){return this.__data__[t]=gt&&void 0===e?r:e,this},St.prototype.clear=function(){this.__data__=[]},St.prototype.delete=function(t){var e=this.__data__,r=$t(e,t);return!(r<0)&&(r==e.length-1?e.pop():it.call(e,r,1),!0)},St.prototype.get=function(t){var e=this.__data__,r=$t(e,t);return r<0?void 0:e[r][1]},St.prototype.has=function(t){return $t(this.__data__,t)>-1},St.prototype.set=function(t,e){var r=this.__data__,n=$t(r,t);return n<0?r.push([t,e]):r[n][1]=e,this},Et.prototype.clear=function(){this.__data__={hash:new wt,map:new(lt||St),string:new wt}},Et.prototype.delete=function(t){return Bt(this,t).delete(t)},Et.prototype.get=function(t){return Bt(this,t).get(t)},Et.prototype.has=function(t){return Bt(this,t).has(t)},Et.prototype.set=function(t,e){return Bt(this,t).set(t,e),this},Mt.prototype.clear=function(){this.__data__=new St},Mt.prototype.delete=function(t){return this.__data__.delete(t)},Mt.prototype.get=function(t){return this.__data__.get(t)},Mt.prototype.has=function(t){return this.__data__.has(t)},Mt.prototype.set=function(t,e){var r=this.__data__;if(r instanceof St){var n=r.__data__;if(!lt||n.length<199)return n.push([t,e]),this;r=this.__data__=new Et(n)}return r.set(t,e),this};var Dt=ft?z(ft,Object):function(){return[]},Nt=function(t){return tt.call(t)};function Rt(t,e){return!!(e=null==e?n:e)&&("number"==typeof t||I.test(t))&&t>-1&&t%1==0&&t<e}function Ut(t){var e=t&&t.constructor;return t===("function"==typeof e&&e.prototype||q)}function Wt(t){if(null!=t){try{return Y.call(t)}catch(t){}try{return t+""}catch(t){}}return""}function Vt(t,e){return t===e||t!=t&&e!=e}(st&&Nt(new st(new ArrayBuffer(1)))!=j||lt&&Nt(new lt)!=y||ht&&Nt(ht.resolve())!=l||vt&&Nt(new vt)!=v||bt&&Nt(new bt)!=d)&&(Nt=function(t){var e=tt.call(t),r=e==s?t.constructor:void 0,n=r?Wt(r):void 0;if(n)switch(n){case dt:return j;case _t:return y;case jt:return l;case Ot:return v;case kt:return d}return e});var zt=Array.isArray;function Gt(t){return null!=t&&function(t){return"number"==typeof t&&t>-1&&t%1==0&&t<=n}(t.length)&&!Jt(t)}var Ht=yt||function(){return!1};function Jt(t){var e=Lt(t)?tt.call(t):"";return e==i||e==f}function Lt(t){var e=typeof t;return!!t&&("object"==e||"function"==e)}function qt(t){return Gt(t)?xt(t):function(t){if(!Ut(t))return pt(t);var e=[];for(var r in Object(t))Z.call(t,r)&&"constructor"!=r&&e.push(r);return e}(t)}t.exports=function(t){return It(t,!0,!0)}})),f=1/0,y=9007199254740991,p=17976931348623157e292,s=NaN,l="[object Arguments]",h="[object Function]",v="[object GeneratorFunction]",b="[object String]",g="[object Symbol]",d=/^\s+|\s+$/g,_=/^[-+]0x[0-9a-f]+$/i,j=/^0b[01]+$/i,O=/^0o[0-7]+$/i,k=/^(?:0|[1-9]\d*)$/,A=parseInt;function m(t){return t!=t}function w(t,e){return function(t,e){for(var r=-1,n=t?t.length:0,o=Array(n);++r<n;)o[r]=e(t[r],r,t);return o}(e,(function(e){return t[e]}))}var S,E,M=Object.prototype,x=M.hasOwnProperty,P=M.toString,$=M.propertyIsEnumerable,I=(S=Object.keys,E=Object,function(t){return S(E(t))}),T=Math.max;function F(t,e){var r=C(t)||function(t){return function(t){return R(t)&&D(t)}(t)&&x.call(t,"callee")&&(!$.call(t,"callee")||P.call(t)==l)}(t)?function(t,e){for(var r=-1,n=Array(t);++r<t;)n[r]=e(r);return n}(t.length,String):[],n=r.length,o=!!n;for(var a in t)!e&&!x.call(t,a)||o&&("length"==a||B(a,n))||r.push(a);return r}function K(t){if((e=t)!==("function"==typeof(r=e&&e.constructor)&&r.prototype||M))return I(t);var e,r,n=[];for(var o in Object(t))x.call(t,o)&&"constructor"!=o&&n.push(o);return n}function B(t,e){return!!(e=null==e?y:e)&&("number"==typeof t||k.test(t))&&t>-1&&t%1==0&&t<e}var C=Array.isArray;function D(t){return null!=t&&function(t){return"number"==typeof t&&t>-1&&t%1==0&&t<=y}(t.length)&&!function(t){var e=N(t)?P.call(t):"";return e==h||e==v}(t)}function N(t){var e=typeof t;return!!t&&("object"==e||"function"==e)}function R(t){return!!t&&"object"==typeof t}var U=function(t,e,r,n){var o;t=D(t)?t:(o=t)?w(o,function(t){return D(t)?F(t):K(t)}(o)):[],r=r&&!n?function(t){var e=function(t){if(!t)return 0===t?t:0;if((t=function(t){if("number"==typeof t)return t;if(function(t){return"symbol"==typeof t||R(t)&&P.call(t)==g}(t))return s;if(N(t)){var e="function"==typeof t.valueOf?t.valueOf():t;t=N(e)?e+"":e}if("string"!=typeof t)return 0===t?t:+t;t=t.replace(d,"");var r=j.test(t);return r||O.test(t)?A(t.slice(2),r?2:8):_.test(t)?s:+t}(t))===f||t===-1/0){return(t<0?-1:1)*p}return t==t?t:0}(t),r=e%1;return e==e?r?e-r:e:0}(r):0;var a=t.length;return r<0&&(r=T(a+r,0)),function(t){return"string"==typeof t||!C(t)&&R(t)&&P.call(t)==b}(t)?r<=a&&t.indexOf(e,r)>-1:!!a&&function(t,e,r){if(e!=e)return function(t,e,r,n){for(var o=t.length,a=r+(n?1:-1);n?a--:++a<o;)if(e(t[a],a,t))return a;return-1}(t,m,r);for(var n=r-1,o=t.length;++n<o;)if(t[n]===e)return n;return-1}(t,e,r)>-1},W="__lodash_hash_undefined__",V="[object Function]",z="[object GeneratorFunction]",G=/^\[object .+?Constructor\]$/,H="object"==typeof self&&self&&self.Object===Object&&self,J="object"==typeof u&&u&&u.Object===Object&&u||H||Function("return this")();function L(t,e){return!!(t?t.length:0)&&function(t,e,r){if(e!=e)return function(t,e,r,n){var o=t.length,a=r+(n?1:-1);for(;n?a--:++a<o;)if(e(t[a],a,t))return a;return-1}(t,Q,r);var n=r-1,o=t.length;for(;++n<o;)if(t[n]===e)return n;return-1}(t,e,0)>-1}function q(t,e,r){for(var n=-1,o=t?t.length:0;++n<o;)if(r(e,t[n]))return!0;return!1}function Q(t){return t!=t}function X(t,e){return t.has(e)}function Y(t){var e=-1,r=Array(t.size);return t.forEach((function(t){r[++e]=t})),r}var Z,tt=Array.prototype,et=Function.prototype,rt=Object.prototype,nt=J["__core-js_shared__"],ot=(Z=/[^.]+$/.exec(nt&&nt.keys&&nt.keys.IE_PROTO||""))?"Symbol(src)_1."+Z:"",at=et.toString,ut=rt.hasOwnProperty,ct=rt.toString,it=RegExp("^"+at.call(ut).replace(/[\\^$.*+?()[\]{}|]/g,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$"),ft=tt.splice,yt=Ot(J,"Map"),pt=Ot(J,"Set"),st=Ot(Object,"create");function lt(t){var e=-1,r=t?t.length:0;for(this.clear();++e<r;){var n=t[e];this.set(n[0],n[1])}}function ht(t){var e=-1,r=t?t.length:0;for(this.clear();++e<r;){var n=t[e];this.set(n[0],n[1])}}function vt(t){var e=-1,r=t?t.length:0;for(this.clear();++e<r;){var n=t[e];this.set(n[0],n[1])}}function bt(t){var e=-1,r=t?t.length:0;for(this.__data__=new vt;++e<r;)this.add(t[e])}function gt(t,e){for(var r,n,o=t.length;o--;)if((r=t[o][0])===(n=e)||r!=r&&n!=n)return o;return-1}function dt(t){return!(!kt(t)||function(t){return!!ot&&ot in t}(t))&&(function(t){var e=kt(t)?ct.call(t):"";return e==V||e==z}(t)||function(t){var e=!1;if(null!=t&&"function"!=typeof t.toString)try{e=!!(t+"")}catch(t){}return e}(t)?it:G).test(function(t){if(null!=t){try{return at.call(t)}catch(t){}try{return t+""}catch(t){}}return""}(t))}lt.prototype.clear=function(){this.__data__=st?st(null):{}},lt.prototype.delete=function(t){return this.has(t)&&delete this.__data__[t]},lt.prototype.get=function(t){var e=this.__data__;if(st){var r=e[t];return r===W?void 0:r}return ut.call(e,t)?e[t]:void 0},lt.prototype.has=function(t){var e=this.__data__;return st?void 0!==e[t]:ut.call(e,t)},lt.prototype.set=function(t,e){return this.__data__[t]=st&&void 0===e?W:e,this},ht.prototype.clear=function(){this.__data__=[]},ht.prototype.delete=function(t){var e=this.__data__,r=gt(e,t);return!(r<0)&&(r==e.length-1?e.pop():ft.call(e,r,1),!0)},ht.prototype.get=function(t){var e=this.__data__,r=gt(e,t);return r<0?void 0:e[r][1]},ht.prototype.has=function(t){return gt(this.__data__,t)>-1},ht.prototype.set=function(t,e){var r=this.__data__,n=gt(r,t);return n<0?r.push([t,e]):r[n][1]=e,this},vt.prototype.clear=function(){this.__data__={hash:new lt,map:new(yt||ht),string:new lt}},vt.prototype.delete=function(t){return jt(this,t).delete(t)},vt.prototype.get=function(t){return jt(this,t).get(t)},vt.prototype.has=function(t){return jt(this,t).has(t)},vt.prototype.set=function(t,e){return jt(this,t).set(t,e),this},bt.prototype.add=bt.prototype.push=function(t){return this.__data__.set(t,W),this},bt.prototype.has=function(t){return this.__data__.has(t)};var _t=pt&&1/Y(new pt([,-0]))[1]==1/0?function(t){return new pt(t)}:function(){};function jt(t,e){var r,n,o=t.__data__;return("string"==(n=typeof(r=e))||"number"==n||"symbol"==n||"boolean"==n?"__proto__"!==r:null===r)?o["string"==typeof e?"string":"hash"]:o.map}function Ot(t,e){var r=function(t,e){return null==t?void 0:t[e]}(t,e);return dt(r)?r:void 0}function kt(t){var e=typeof t;return!!t&&("object"==e||"function"==e)}var At=function(t){return t&&t.length?function(t,e,r){var n=-1,o=L,a=t.length,u=!0,c=[],i=c;if(r)u=!1,o=q;else if(a>=200){var f=e?null:_t(t);if(f)return Y(f);u=!1,o=X,i=new bt}else i=e?[]:c;t:for(;++n<a;){var y=t[n],p=e?e(y):y;if(y=r||0!==y?y:0,u&&p==p){for(var s=i.length;s--;)if(i[s]===p)continue t;e&&i.push(p),c.push(y)}else o(i,p,r)||(i!==c&&i.push(p),c.push(y))}return c}(t):[]};var mt=Object.prototype,wt=Function.prototype.toString,St=mt.hasOwnProperty,Et=wt.call(Object),Mt=mt.toString,xt=function(t,e){return function(r){return t(e(r))}}(Object.getPrototypeOf,Object);var Pt=function(t){if(!function(t){return!!t&&"object"==typeof t}(t)||"[object Object]"!=Mt.call(t)||function(t){var e=!1;if(null!=t&&"function"!=typeof t.toString)try{e=!!(t+"")}catch(t){}return e}(t))return!1;var e=xt(t);if(null===e)return!0;var r=St.call(e,"constructor")&&e.constructor;return"function"==typeof r&&r instanceof r&&wt.call(r)==Et},$t=c((function(t,e){var r=e&&!e.nodeType&&e,n=r&&t&&!t.nodeType&&t,o=n&&n.exports===r&&("object"==typeof u&&u&&u.Object===Object&&u).process,a=function(){try{return o&&o.binding("util")}catch(t){}}(),c=a&&a.isDate;var i=Object.prototype.toString;var f=c?function(t){return function(e){return t(e)}}(c):function(t){return function(t){return!!t&&"object"==typeof t}(t)&&"[object Date]"==i.call(t)};t.exports=f})),It=new Map;function Tt(t,e){e=n({caseSensitive:!1},e);var r=t+JSON.stringify(e);if(It.has(r))return It.get(r);var o="!"===t[0];o&&(t=t.slice(1)),t=function(t){if("string"!=typeof t)throw new TypeError("Expected a string");return t.replace(/[|\\{}()[\]^$+*?.]/g,"\\$&").replace(/-/g,"\\x2d")}(t).replace(/\\\*/g,"[\\s\\S]*");var a=new RegExp("^"+t+"$",e.caseSensitive?"":"i");return a.negated=o,It.set(r,a),a}var Ft=function(t,e,r){if(!Array.isArray(t)||!Array.isArray(e))throw new TypeError("Expected two arrays, got "+typeof t+" "+typeof e);if(0===e.length)return t;var n="!"===e[0][0];e=e.map((function(t){return Tt(t,r)}));for(var o,u=[],c=a(t);!(o=c()).done;){for(var i,f=o.value,y=n,p=a(e);!(i=p()).done;){var s=i.value;s.test(f)&&(y=!s.negated)}y&&u.push(f)}return u};Ft.isMatch=function(t,e,r){var n=Array.isArray(t)?t:[t],o=Array.isArray(e)?e:[e];return n.some((function(t){return o.every((function(e){var n=Tt(e,r),o=n.test(t);return n.negated?!o:o}))}))};var Kt={arrayVsArrayAllMustBeFound:"any",caseSensitive:!0};function Bt(t,e,r){if(!t.length||!e.length)return!1;var o=n(n({},Kt),r),a="string"==typeof t?[t]:Array.from(t);return"string"==typeof e?a.some((function(t){return Ft.isMatch(t,e,{caseSensitive:o.caseSensitive})})):"any"===o.arrayVsArrayAllMustBeFound?e.some((function(t){return a.some((function(e){return Ft.isMatch(e,t,{caseSensitive:o.caseSensitive})}))})):e.every((function(t){return a.some((function(e){return Ft.isMatch(e,t,{caseSensitive:o.caseSensitive})}))}))}function Ct(t){return null!=t&&(Array.isArray(t)||"string"==typeof t?!!t.length:Pt(t)?!!Object.keys(t).length:"number"==typeof t)}function Dt(t){return"string"==typeof t}function Nt(t){return"boolean"==typeof t}var Rt=Array.isArray;function Ut(t){return!!t&&t.some((function(t){return"string"==typeof t}))}function Wt(t,e){return 0===Object.keys(t).length||0===Object.keys(e).length||Object.keys(t).every((function(t){return Object.keys(e).includes(t)}))||Object.keys(e).every((function(e){return Object.keys(t).includes(e)}))}function Vt(t){return null===t?"null":$t(t)?"date":Pt(t)?"object":Rt(t)?"array":typeof t}var zt={cb:null,mergeObjectsOnlyWhenKeysetMatches:!0,ignoreKeys:[],hardMergeKeys:[],hardArrayConcatKeys:[],mergeArraysContainingStringsToBeEmpty:!1,oneToManyArrayObjectMerge:!1,hardMergeEverything:!1,hardArrayConcat:!1,ignoreEverything:!1,concatInsteadOfMerging:!0,dedupeStringsInArrayValues:!1,mergeBoolsUsingOrNotAnd:!0,useNullAsExplicitFalse:!1};function Gt(t,e,r,o){var a,u=n(n({},zt),o);if("string"==typeof u.ignoreKeys&&(u.ignoreKeys=[u.ignoreKeys]),"string"==typeof u.hardMergeKeys&&(u.hardMergeKeys=[u.hardMergeKeys]),u.hardMergeKeys.includes("*")&&(u.hardMergeEverything=!0),u.ignoreKeys.includes("*")&&(u.ignoreEverything=!0),u.useNullAsExplicitFalse&&(null===e||null===r))return"function"==typeof u.cb?u.cb(e,r,null,{path:t.path,key:t.key,type:t.type}):null;var c,f=Rt(e)||Pt(e)?i(e):e,y=Rt(r)||Pt(r)?i(r):r;u.ignoreEverything?c=f:u.hardMergeEverything&&(c=y);var p=u.hardMergeEverything||u.ignoreEverything;if(!Rt(f)){if(Pt(f)){if(Ct(f)){if(Rt(y)){if(Ct(y)){var s=p?c:y;return"function"==typeof u.cb?u.cb(i(e),i(r),s,{path:a,key:t.key,type:t.type}):s}var l=p?c:f;return"function"==typeof u.cb?u.cb(i(e),i(r),l,{path:a,key:t.key,type:t.type}):l}if(Pt(y)){Object.keys(y).forEach((function(e){a=t.path&&t.path.length?t.path+"."+e:""+e,f[e]=f.hasOwnProperty(e)?Bt(e,u.ignoreKeys)?Gt({path:a,key:e,type:[Vt(f),Vt(y)]},f[e],y[e],n(n({},u),{},{ignoreEverything:!0})):Bt(e,u.hardMergeKeys)?Gt({path:a,key:e,type:[Vt(f),Vt(y)]},f[e],y[e],n(n({},u),{},{hardMergeEverything:!0})):Bt(e,u.hardArrayConcatKeys)?Gt({path:a,key:e,type:[Vt(f),Vt(y)]},f[e],y[e],n(n({},u),{},{hardArrayConcat:!0})):Gt({path:a,key:e,type:[Vt(f[e]),Vt(y[e])]},f[e],y[e],u):y[e]}));var h=p?c:f;return"function"==typeof u.cb?u.cb(i(e),i(r),h,{path:t.path,key:t.key,type:t.type}):f}var v=p?c:f;return"function"==typeof u.cb?u.cb(i(e),i(r),v,{path:t.path,key:t.key,type:t.type}):v}if(Rt(y)||Pt(y)||Ct(y)){var b=p?c:y;return"function"==typeof u.cb?u.cb(i(e),i(r),b,{path:t.path,key:t.key,type:t.type}):b}var g=p?c:f;return"function"==typeof u.cb?u.cb(i(e),i(r),g,{path:t.path,key:t.key,type:t.type}):g}if($t(f)){if(isFinite(f)){if($t(y)){if(isFinite(y)){var d=p?c:f>y?f:y;return"function"==typeof u.cb?u.cb(i(e),i(r),d,{path:t.path,key:t.key,type:t.type}):d}var _=p?c:f;return"function"==typeof u.cb?u.cb(i(e),i(r),_,{path:t.path,key:t.key,type:t.type}):_}var j=p?c:y||f;return"function"==typeof u.cb?u.cb(i(e),i(r),j,{path:t.path,key:t.key,type:t.type}):j}if($t(y)){var O=p?c:y;return"function"==typeof u.cb?u.cb(i(e),i(r),O,{path:t.path,key:t.key,type:t.type}):O}var k=p?c:y;return"function"==typeof u.cb?u.cb(i(e),i(r),k,{path:t.path,key:t.key,type:t.type}):k}if(Dt(f)){if(Ct(f)){if((Rt(y)||Pt(y)||Dt(y))&&Ct(y)){var A=p?c:y;return"function"==typeof u.cb?u.cb(i(e),i(r),A,{path:t.path,key:t.key,type:t.type}):A}var m=p?c:f;return"function"==typeof u.cb?u.cb(i(e),i(r),m,{path:t.path,key:t.key,type:t.type}):m}if(null!=y&&!Nt(y)){var w=p?c:y;return"function"==typeof u.cb?u.cb(i(e),i(r),w,{path:t.path,key:t.key,type:t.type}):w}var S=p?c:f;return"function"==typeof u.cb?u.cb(i(e),i(r),S,{path:t.path,key:t.key,type:t.type}):S}if("number"==typeof f){if(Ct(y)){var E=p?c:y;return"function"==typeof u.cb?u.cb(i(e),i(r),E,{path:t.path,key:t.key,type:t.type}):E}var M=p?c:f;return"function"==typeof u.cb?u.cb(i(e),i(r),M,{path:t.path,key:t.key,type:t.type}):M}if(Nt(f)){if(Nt(y)){if(u.mergeBoolsUsingOrNotAnd){var x=p?c:f||y;return"function"==typeof u.cb?u.cb(i(e),i(r),x,{path:t.path,key:t.key,type:t.type}):x}var P=p?c:f&&y;return"function"==typeof u.cb?u.cb(i(e),i(r),P,{path:t.path,key:t.key,type:t.type}):P}if(null!=y){var $=p?c:y;return"function"==typeof u.cb?u.cb(i(e),i(r),$,{path:t.path,key:t.key,type:t.type}):$}var I=p?c:f;return"function"==typeof u.cb?u.cb(i(e),i(r),I,{path:t.path,key:t.key,type:t.type}):I}if(null===f){if(null!=y){var T=p?c:y;return"function"==typeof u.cb?u.cb(i(e),i(r),T,{path:t.path,key:t.key,type:t.type}):T}var F=p?c:f;return"function"==typeof u.cb?u.cb(i(e),i(r),F,{path:t.path,key:t.key,type:t.type}):F}var K=p?c:y;return"function"==typeof u.cb?u.cb(i(e),i(r),K,{path:t.path,key:t.key,type:t.type}):K}if(!Ct(f)){if(Ct(y)){var B=p?c:y;return"function"==typeof u.cb?u.cb(i(e),i(r),B,{path:a,key:t.key,type:t.type}):B}var C=p?c:f;return"function"==typeof u.cb?u.cb(i(e),i(r),C,{path:a,key:t.key,type:t.type}):C}if(!Rt(y)||!Ct(y)){var D=p?c:f;return"function"==typeof u.cb?u.cb(i(e),i(r),D,{path:a,key:t.key,type:t.type}):D}if(u.mergeArraysContainingStringsToBeEmpty&&(Ut(f)||Ut(y))){var N=p?c:[];return"function"==typeof u.cb?u.cb(i(e),i(r),N,{path:a,key:t.key,type:t.type}):N}if(u.hardArrayConcat){var R=p?c:f.concat(y);return"function"==typeof u.cb?u.cb(i(e),i(r),R,{path:a,key:t.key,type:t.type}):R}for(var W=[],V=0,z=Math.max(f.length,y.length);V<z;V++)a=t.path&&t.path.length?t.path+"."+V:""+V,Pt(f[V])&&Pt(y[V])&&(u.mergeObjectsOnlyWhenKeysetMatches&&Wt(f[V],y[V])||!u.mergeObjectsOnlyWhenKeysetMatches)?W.push(Gt({path:a,key:t.key,type:[Vt(f),Vt(y)]},f[V],y[V],u)):!u.oneToManyArrayObjectMerge||1!==f.length&&1!==y.length?u.concatInsteadOfMerging?(V<f.length&&W.push(f[V]),V<y.length&&W.push(y[V])):(V<f.length&&W.push(f[V]),V<y.length&&!U(f,y[V])&&W.push(y[V])):W.push(1===f.length?Gt({path:a,key:t.key,type:[Vt(f),Vt(y)]},f[0],y[V],u):Gt({path:a,key:t.key,type:[Vt(f),Vt(y)]},f[V],y[0],u));u.dedupeStringsInArrayValues&&W.every((function(t){return Dt(t)}))&&(W=At(W).sort()),f=i(W);var G=p?c:f;return"function"==typeof u.cb?u.cb(i(e),i(r),G,{path:t.path,key:t.key,type:t.type}):G}var Ht={dedupe:!0};t.defaults=Ht,t.generateAst=function(t,e){if(!Array.isArray(t))throw new Error("array-of-arrays-into-ast: [THROW_ID_01] input must be array. Currently it's of a type "+typeof t+" equal to:\n"+JSON.stringify(t,null,4));if(0===t.length)return{};var r,o=n(n({},Ht),e),a={};return t.forEach((function(t){for(var e=null,r=t.length;r--;){var n;(n={})[t[r]]=[e],e=n}a=function(t,e,r){if(!arguments.length)throw new TypeError("object-merge-advanced/mergeAdvanced(): [THROW_ID_01] Both inputs are missing");return Gt({key:null,path:"",type:[Vt(t),Vt(e)]},t,e,r)}(a,e,{concatInsteadOfMerging:!o.dedupe})})),r=a,Object.keys(r).sort().reduce((function(t,e){return t[e]=r[e],t}),{})},t.version="2.0.3",Object.defineProperty(t,"__esModule",{value:!0})}));
