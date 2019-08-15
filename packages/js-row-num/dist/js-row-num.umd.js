/**
 * js-row-num
 * Update all row numbers in all console.logs in JS code
 * Version: 2.3.13
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/js-row-num
 */

!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e=e||self).jsRowNum=t()}(this,function(){"use strict";var e=function(e,t){if(t){if("object"!=typeof t)throw new TypeError(String(t)+" is not an object. Expected an object that has boolean `includeZero` property.");if("includeZero"in t){if("boolean"!=typeof t.includeZero)throw new TypeError(String(t.includeZero)+" is neither true nor false. `includeZero` option must be a Boolean value.");if(t.includeZero&&0===e)return!0}}return Number.isSafeInteger(e)&&e>=1},t=function(e,t){if("string"!=typeof e)return!1;if(t&&"includeZero"in t){if("boolean"!=typeof t.includeZero)throw new TypeError(String(t.includeZero)+" is neither true nor false. `includeZero` option must be a Boolean value.");if(t.includeZero)return/^(-?0|[1-9]\d*)(\.0+)?$/.test(e)}return/^[1-9]\d*(\.0+)?$/.test(e)},r="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{};function n(e,t){return e(t={exports:{}},t.exports),t.exports}var o=n(function(e,t){(t=e.exports=function(e){return e+t.suffix(+e)}).suffix=function(e){return e%=100,1===Math.floor(e/10)?"th":e%10==1?"st":e%10==2?"nd":e%10==3?"rd":"th"}}),i=(o.suffix,n(function(e,t){var n,o,i,a,s,u,c,l,f,p,h,y,g,d,m,b,v,_,w,j;e.exports=(n="function"==typeof Promise,o="object"==typeof self?self:r,i="undefined"!=typeof Symbol,a="undefined"!=typeof Map,s="undefined"!=typeof Set,u="undefined"!=typeof WeakMap,c="undefined"!=typeof WeakSet,l="undefined"!=typeof DataView,f=i&&void 0!==Symbol.iterator,p=i&&void 0!==Symbol.toStringTag,h=s&&"function"==typeof Set.prototype.entries,y=a&&"function"==typeof Map.prototype.entries,g=h&&Object.getPrototypeOf((new Set).entries()),d=y&&Object.getPrototypeOf((new Map).entries()),m=f&&"function"==typeof Array.prototype[Symbol.iterator],b=m&&Object.getPrototypeOf([][Symbol.iterator]()),v=f&&"function"==typeof String.prototype[Symbol.iterator],_=v&&Object.getPrototypeOf(""[Symbol.iterator]()),w=8,j=-1,function(e){var t=typeof e;if("object"!==t)return t;if(null===e)return"null";if(e===o)return"global";if(Array.isArray(e)&&(!1===p||!(Symbol.toStringTag in e)))return"Array";if("object"==typeof window&&null!==window){if("object"==typeof window.location&&e===window.location)return"Location";if("object"==typeof window.document&&e===window.document)return"Document";if("object"==typeof window.navigator){if("object"==typeof window.navigator.mimeTypes&&e===window.navigator.mimeTypes)return"MimeTypeArray";if("object"==typeof window.navigator.plugins&&e===window.navigator.plugins)return"PluginArray"}if(("function"==typeof window.HTMLElement||"object"==typeof window.HTMLElement)&&e instanceof window.HTMLElement){if("BLOCKQUOTE"===e.tagName)return"HTMLQuoteElement";if("TD"===e.tagName)return"HTMLTableDataCellElement";if("TH"===e.tagName)return"HTMLTableHeaderCellElement"}}var r=p&&e[Symbol.toStringTag];if("string"==typeof r)return r;var i=Object.getPrototypeOf(e);return i===RegExp.prototype?"RegExp":i===Date.prototype?"Date":n&&i===Promise.prototype?"Promise":s&&i===Set.prototype?"Set":a&&i===Map.prototype?"Map":c&&i===WeakSet.prototype?"WeakSet":u&&i===WeakMap.prototype?"WeakMap":l&&i===DataView.prototype?"DataView":a&&i===d?"Map Iterator":s&&i===g?"Set Iterator":m&&i===b?"Array Iterator":v&&i===_?"String Iterator":null===i?"Object":Object.prototype.toString.call(e).slice(w,j)})}));function a(e,t,r){if(t!=t)return function(e,t,r,n){for(var o=e.length,i=r+(n?1:-1);n?i--:++i<o;)if(t(e[i],i,e))return i;return-1}(e,u,r);for(var n=r-1,o=e.length;++n<o;)if(e[n]===t)return n;return-1}function s(e,t,r,n){for(var o=r-1,i=e.length;++o<i;)if(n(e[o],t))return o;return-1}function u(e){return e!=e}var c=Array.prototype.splice;function l(e,t,r,n){var o,i=n?s:a,u=-1,l=t.length,f=e;for(e===t&&(t=function(e,t){var r=-1,n=e.length;t||(t=Array(n));for(;++r<n;)t[r]=e[r];return t}(t)),r&&(f=function(e,t){for(var r=-1,n=e?e.length:0,o=Array(n);++r<n;)o[r]=t(e[r],r,e);return o}(e,(o=r,function(e){return o(e)})));++u<l;)for(var p=0,h=t[u],y=r?r(h):h;(p=i(f,y,p,n))>-1;)f!==e&&c.call(f,p,1),c.call(e,p,1);return e}var f=function(e,t){return e&&e.length&&t&&t.length?l(e,t):e},p=n(function(e,t){var n=200,o="__lodash_hash_undefined__",i=9007199254740991,a="[object Arguments]",s="[object Boolean]",u="[object Date]",c="[object Function]",l="[object GeneratorFunction]",f="[object Map]",p="[object Number]",h="[object Object]",y="[object RegExp]",g="[object Set]",d="[object String]",m="[object Symbol]",b="[object ArrayBuffer]",v="[object DataView]",_="[object Float32Array]",w="[object Float64Array]",j="[object Int8Array]",O="[object Int16Array]",T="[object Int32Array]",$="[object Uint8Array]",S="[object Uint8ClampedArray]",A="[object Uint16Array]",E="[object Uint32Array]",I=/\w*$/,N=/^\[object .+?Constructor\]$/,R=/^(?:0|[1-9]\d*)$/,k={};k[a]=k["[object Array]"]=k[b]=k[v]=k[s]=k[u]=k[_]=k[w]=k[j]=k[O]=k[T]=k[f]=k[p]=k[h]=k[y]=k[g]=k[d]=k[m]=k[$]=k[S]=k[A]=k[E]=!0,k["[object Error]"]=k[c]=k["[object WeakMap]"]=!1;var x="object"==typeof r&&r&&r.Object===Object&&r,M="object"==typeof self&&self&&self.Object===Object&&self,W=x||M||Function("return this")(),D=t&&!t.nodeType&&t,H=D&&e&&!e.nodeType&&e,P=H&&H.exports===D;function F(e,t){return e.set(t[0],t[1]),e}function C(e,t){return e.add(t),e}function J(e,t,r,n){var o=-1,i=e?e.length:0;for(n&&i&&(r=e[++o]);++o<i;)r=t(r,e[o],o,e);return r}function Z(e){var t=!1;if(null!=e&&"function"!=typeof e.toString)try{t=!!(e+"")}catch(e){}return t}function L(e){var t=-1,r=Array(e.size);return e.forEach(function(e,n){r[++t]=[n,e]}),r}function q(e,t){return function(r){return e(t(r))}}function K(e){var t=-1,r=Array(e.size);return e.forEach(function(e){r[++t]=e}),r}var V,B=Array.prototype,z=Function.prototype,U=Object.prototype,G=W["__core-js_shared__"],Q=(V=/[^.]+$/.exec(G&&G.keys&&G.keys.IE_PROTO||""))?"Symbol(src)_1."+V:"",X=z.toString,Y=U.hasOwnProperty,ee=U.toString,te=RegExp("^"+X.call(Y).replace(/[\\^$.*+?()[\]{}|]/g,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$"),re=P?W.Buffer:void 0,ne=W.Symbol,oe=W.Uint8Array,ie=q(Object.getPrototypeOf,Object),ae=Object.create,se=U.propertyIsEnumerable,ue=B.splice,ce=Object.getOwnPropertySymbols,le=re?re.isBuffer:void 0,fe=q(Object.keys,Object),pe=He(W,"DataView"),he=He(W,"Map"),ye=He(W,"Promise"),ge=He(W,"Set"),de=He(W,"WeakMap"),me=He(Object,"create"),be=Ze(pe),ve=Ze(he),_e=Ze(ye),we=Ze(ge),je=Ze(de),Oe=ne?ne.prototype:void 0,Te=Oe?Oe.valueOf:void 0;function $e(e){var t=-1,r=e?e.length:0;for(this.clear();++t<r;){var n=e[t];this.set(n[0],n[1])}}function Se(e){var t=-1,r=e?e.length:0;for(this.clear();++t<r;){var n=e[t];this.set(n[0],n[1])}}function Ae(e){var t=-1,r=e?e.length:0;for(this.clear();++t<r;){var n=e[t];this.set(n[0],n[1])}}function Ee(e){this.__data__=new Se(e)}function Ie(e,t){var r=qe(e)||function(e){return function(e){return function(e){return!!e&&"object"==typeof e}(e)&&Ke(e)}(e)&&Y.call(e,"callee")&&(!se.call(e,"callee")||ee.call(e)==a)}(e)?function(e,t){for(var r=-1,n=Array(e);++r<e;)n[r]=t(r);return n}(e.length,String):[],n=r.length,o=!!n;for(var i in e)!t&&!Y.call(e,i)||o&&("length"==i||Ce(i,n))||r.push(i);return r}function Ne(e,t,r){var n=e[t];Y.call(e,t)&&Le(n,r)&&(void 0!==r||t in e)||(e[t]=r)}function Re(e,t){for(var r=e.length;r--;)if(Le(e[r][0],t))return r;return-1}function ke(e,t,r,n,o,i,N){var R;if(n&&(R=i?n(e,o,i,N):n(e)),void 0!==R)return R;if(!ze(e))return e;var x=qe(e);if(x){if(R=function(e){var t=e.length,r=e.constructor(t);t&&"string"==typeof e[0]&&Y.call(e,"index")&&(r.index=e.index,r.input=e.input);return r}(e),!t)return function(e,t){var r=-1,n=e.length;t||(t=Array(n));for(;++r<n;)t[r]=e[r];return t}(e,R)}else{var M=Fe(e),W=M==c||M==l;if(Ve(e))return function(e,t){if(t)return e.slice();var r=new e.constructor(e.length);return e.copy(r),r}(e,t);if(M==h||M==a||W&&!i){if(Z(e))return i?e:{};if(R=function(e){return"function"!=typeof e.constructor||Je(e)?{}:(t=ie(e),ze(t)?ae(t):{});var t}(W?{}:e),!t)return function(e,t){return We(e,Pe(e),t)}(e,function(e,t){return e&&We(t,Ue(t),e)}(R,e))}else{if(!k[M])return i?e:{};R=function(e,t,r,n){var o=e.constructor;switch(t){case b:return Me(e);case s:case u:return new o(+e);case v:return function(e,t){var r=t?Me(e.buffer):e.buffer;return new e.constructor(r,e.byteOffset,e.byteLength)}(e,n);case _:case w:case j:case O:case T:case $:case S:case A:case E:return function(e,t){var r=t?Me(e.buffer):e.buffer;return new e.constructor(r,e.byteOffset,e.length)}(e,n);case f:return function(e,t,r){return J(t?r(L(e),!0):L(e),F,new e.constructor)}(e,n,r);case p:case d:return new o(e);case y:return(c=new(a=e).constructor(a.source,I.exec(a))).lastIndex=a.lastIndex,c;case g:return function(e,t,r){return J(t?r(K(e),!0):K(e),C,new e.constructor)}(e,n,r);case m:return i=e,Te?Object(Te.call(i)):{}}var i;var a,c}(e,M,ke,t)}}N||(N=new Ee);var D=N.get(e);if(D)return D;if(N.set(e,R),!x)var H=r?function(e){return function(e,t,r){var n=t(e);return qe(e)?n:function(e,t){for(var r=-1,n=t.length,o=e.length;++r<n;)e[o+r]=t[r];return e}(n,r(e))}(e,Ue,Pe)}(e):Ue(e);return function(e,t){for(var r=-1,n=e?e.length:0;++r<n&&!1!==t(e[r],r,e););}(H||e,function(o,i){H&&(o=e[i=o]),Ne(R,i,ke(o,t,r,n,i,e,N))}),R}function xe(e){return!(!ze(e)||(t=e,Q&&Q in t))&&(Be(e)||Z(e)?te:N).test(Ze(e));var t}function Me(e){var t=new e.constructor(e.byteLength);return new oe(t).set(new oe(e)),t}function We(e,t,r,n){r||(r={});for(var o=-1,i=t.length;++o<i;){var a=t[o],s=n?n(r[a],e[a],a,r,e):void 0;Ne(r,a,void 0===s?e[a]:s)}return r}function De(e,t){var r,n,o=e.__data__;return("string"==(n=typeof(r=t))||"number"==n||"symbol"==n||"boolean"==n?"__proto__"!==r:null===r)?o["string"==typeof t?"string":"hash"]:o.map}function He(e,t){var r=function(e,t){return null==e?void 0:e[t]}(e,t);return xe(r)?r:void 0}$e.prototype.clear=function(){this.__data__=me?me(null):{}},$e.prototype.delete=function(e){return this.has(e)&&delete this.__data__[e]},$e.prototype.get=function(e){var t=this.__data__;if(me){var r=t[e];return r===o?void 0:r}return Y.call(t,e)?t[e]:void 0},$e.prototype.has=function(e){var t=this.__data__;return me?void 0!==t[e]:Y.call(t,e)},$e.prototype.set=function(e,t){return this.__data__[e]=me&&void 0===t?o:t,this},Se.prototype.clear=function(){this.__data__=[]},Se.prototype.delete=function(e){var t=this.__data__,r=Re(t,e);return!(r<0||(r==t.length-1?t.pop():ue.call(t,r,1),0))},Se.prototype.get=function(e){var t=this.__data__,r=Re(t,e);return r<0?void 0:t[r][1]},Se.prototype.has=function(e){return Re(this.__data__,e)>-1},Se.prototype.set=function(e,t){var r=this.__data__,n=Re(r,e);return n<0?r.push([e,t]):r[n][1]=t,this},Ae.prototype.clear=function(){this.__data__={hash:new $e,map:new(he||Se),string:new $e}},Ae.prototype.delete=function(e){return De(this,e).delete(e)},Ae.prototype.get=function(e){return De(this,e).get(e)},Ae.prototype.has=function(e){return De(this,e).has(e)},Ae.prototype.set=function(e,t){return De(this,e).set(e,t),this},Ee.prototype.clear=function(){this.__data__=new Se},Ee.prototype.delete=function(e){return this.__data__.delete(e)},Ee.prototype.get=function(e){return this.__data__.get(e)},Ee.prototype.has=function(e){return this.__data__.has(e)},Ee.prototype.set=function(e,t){var r=this.__data__;if(r instanceof Se){var o=r.__data__;if(!he||o.length<n-1)return o.push([e,t]),this;r=this.__data__=new Ae(o)}return r.set(e,t),this};var Pe=ce?q(ce,Object):function(){return[]},Fe=function(e){return ee.call(e)};function Ce(e,t){return!!(t=null==t?i:t)&&("number"==typeof e||R.test(e))&&e>-1&&e%1==0&&e<t}function Je(e){var t=e&&e.constructor;return e===("function"==typeof t&&t.prototype||U)}function Ze(e){if(null!=e){try{return X.call(e)}catch(e){}try{return e+""}catch(e){}}return""}function Le(e,t){return e===t||e!=e&&t!=t}(pe&&Fe(new pe(new ArrayBuffer(1)))!=v||he&&Fe(new he)!=f||ye&&"[object Promise]"!=Fe(ye.resolve())||ge&&Fe(new ge)!=g||de&&"[object WeakMap]"!=Fe(new de))&&(Fe=function(e){var t=ee.call(e),r=t==h?e.constructor:void 0,n=r?Ze(r):void 0;if(n)switch(n){case be:return v;case ve:return f;case _e:return"[object Promise]";case we:return g;case je:return"[object WeakMap]"}return t});var qe=Array.isArray;function Ke(e){return null!=e&&function(e){return"number"==typeof e&&e>-1&&e%1==0&&e<=i}(e.length)&&!Be(e)}var Ve=le||function(){return!1};function Be(e){var t=ze(e)?ee.call(e):"";return t==c||t==l}function ze(e){var t=typeof e;return!!e&&("object"==t||"function"==t)}function Ue(e){return Ke(e)?Ie(e):function(e){if(!Je(e))return fe(e);var t=[];for(var r in Object(e))Y.call(e,r)&&"constructor"!=r&&t.push(r);return t}(e)}e.exports=function(e){return ke(e,!0,!0)}}),h="[object Object]";var y,g,d=Function.prototype,m=Object.prototype,b=d.toString,v=m.hasOwnProperty,_=b.call(Object),w=m.toString,j=(y=Object.getPrototypeOf,g=Object,function(e){return y(g(e))});var O=function(e){if(!function(e){return!!e&&"object"==typeof e}(e)||w.call(e)!=h||function(e){var t=!1;if(null!=e&&"function"!=typeof e.toString)try{t=!!(e+"")}catch(e){}return t}(e))return!1;var t=j(e);if(null===t)return!0;var r=v.call(t,"constructor")&&t.constructor;return"function"==typeof r&&r instanceof r&&b.call(r)==_};const T=Array.isArray;function $(e){return"string"==typeof e&&e.length>0&&"."===e[0]?e.slice(1):e}function S(e,t){return function e(t,r,n){const o=p(t);let i,a,s,u,c;if((n=Object.assign({depth:-1,path:""},n)).depth+=1,T(o))for(i=0,a=o.length;i<a;i++){const t=`${n.path}.${i}`;void 0!==o[i]?(n.parent=p(o),n.parentType="array",s=e(r(o[i],void 0,Object.assign({},n,{path:$(t)})),r,Object.assign({},n,{path:$(t)})),Number.isNaN(s)&&i<o.length?(o.splice(i,1),i-=1):o[i]=s):o.splice(i,1)}else if(O(o))for(i=0,a=(u=Object.keys(o)).length;i<a;i++){c=u[i];const t=`${n.path}.${c}`;0===n.depth&&null!=c&&(n.topmostKey=c),n.parent=p(o),n.parentType="object",s=e(r(c,o[c],Object.assign({},n,{path:$(t)})),r,Object.assign({},n,{path:$(t)})),Number.isNaN(s)?delete o[c]:o[c]=s}return o}(e,t,{})}var A="__lodash_hash_undefined__",E=9007199254740991,I="[object Function]",N="[object GeneratorFunction]",R=/^\[object .+?Constructor\]$/,k="object"==typeof r&&r&&r.Object===Object&&r,x="object"==typeof self&&self&&self.Object===Object&&self,M=k||x||Function("return this")();function W(e,t,r){switch(r.length){case 0:return e.call(t);case 1:return e.call(t,r[0]);case 2:return e.call(t,r[0],r[1]);case 3:return e.call(t,r[0],r[1],r[2])}return e.apply(t,r)}function D(e,t){return!!(e?e.length:0)&&function(e,t,r){if(t!=t)return function(e,t,r,n){var o=e.length,i=r+(n?1:-1);for(;n?i--:++i<o;)if(t(e[i],i,e))return i;return-1}(e,F,r);var n=r-1,o=e.length;for(;++n<o;)if(e[n]===t)return n;return-1}(e,t,0)>-1}function H(e,t,r){for(var n=-1,o=e?e.length:0;++n<o;)if(r(t,e[n]))return!0;return!1}function P(e,t){for(var r=-1,n=e?e.length:0,o=Array(n);++r<n;)o[r]=t(e[r],r,e);return o}function F(e){return e!=e}function C(e){return function(t){return e(t)}}function J(e,t){return e.has(t)}var Z,L=Array.prototype,q=Function.prototype,K=Object.prototype,V=M["__core-js_shared__"],B=(Z=/[^.]+$/.exec(V&&V.keys&&V.keys.IE_PROTO||""))?"Symbol(src)_1."+Z:"",z=q.toString,U=K.hasOwnProperty,G=K.toString,Q=RegExp("^"+z.call(U).replace(/[\\^$.*+?()[\]{}|]/g,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$"),X=L.splice,Y=Math.max,ee=Math.min,te=fe(M,"Map"),re=fe(Object,"create");function ne(e){var t=-1,r=e?e.length:0;for(this.clear();++t<r;){var n=e[t];this.set(n[0],n[1])}}function oe(e){var t=-1,r=e?e.length:0;for(this.clear();++t<r;){var n=e[t];this.set(n[0],n[1])}}function ie(e){var t=-1,r=e?e.length:0;for(this.clear();++t<r;){var n=e[t];this.set(n[0],n[1])}}function ae(e){var t=-1,r=e?e.length:0;for(this.__data__=new ie;++t<r;)this.add(e[t])}function se(e,t){for(var r,n,o=e.length;o--;)if((r=e[o][0])===(n=t)||r!=r&&n!=n)return o;return-1}function ue(e){return!(!he(e)||function(e){return!!B&&B in e}(e))&&(pe(e)||function(e){var t=!1;if(null!=e&&"function"!=typeof e.toString)try{t=!!(e+"")}catch(e){}return t}(e)?Q:R).test(function(e){if(null!=e){try{return z.call(e)}catch(e){}try{return e+""}catch(e){}}return""}(e))}function ce(e){return function(e){return function(e){return!!e&&"object"==typeof e}(e)&&function(e){return null!=e&&function(e){return"number"==typeof e&&e>-1&&e%1==0&&e<=E}(e.length)&&!pe(e)}(e)}(e)?e:[]}function le(e,t){var r,n,o=e.__data__;return("string"==(n=typeof(r=t))||"number"==n||"symbol"==n||"boolean"==n?"__proto__"!==r:null===r)?o["string"==typeof t?"string":"hash"]:o.map}function fe(e,t){var r=function(e,t){return null==e?void 0:e[t]}(e,t);return ue(r)?r:void 0}function pe(e){var t=he(e)?G.call(e):"";return t==I||t==N}function he(e){var t=typeof e;return!!e&&("object"==t||"function"==t)}ne.prototype.clear=function(){this.__data__=re?re(null):{}},ne.prototype.delete=function(e){return this.has(e)&&delete this.__data__[e]},ne.prototype.get=function(e){var t=this.__data__;if(re){var r=t[e];return r===A?void 0:r}return U.call(t,e)?t[e]:void 0},ne.prototype.has=function(e){var t=this.__data__;return re?void 0!==t[e]:U.call(t,e)},ne.prototype.set=function(e,t){return this.__data__[e]=re&&void 0===t?A:t,this},oe.prototype.clear=function(){this.__data__=[]},oe.prototype.delete=function(e){var t=this.__data__,r=se(t,e);return!(r<0||(r==t.length-1?t.pop():X.call(t,r,1),0))},oe.prototype.get=function(e){var t=this.__data__,r=se(t,e);return r<0?void 0:t[r][1]},oe.prototype.has=function(e){return se(this.__data__,e)>-1},oe.prototype.set=function(e,t){var r=this.__data__,n=se(r,e);return n<0?r.push([e,t]):r[n][1]=t,this},ie.prototype.clear=function(){this.__data__={hash:new ne,map:new(te||oe),string:new ne}},ie.prototype.delete=function(e){return le(this,e).delete(e)},ie.prototype.get=function(e){return le(this,e).get(e)},ie.prototype.has=function(e){return le(this,e).has(e)},ie.prototype.set=function(e,t){return le(this,e).set(e,t),this},ae.prototype.add=ae.prototype.push=function(e){return this.__data__.set(e,A),this},ae.prototype.has=function(e){return this.__data__.has(e)};var ye=function(e,t){return t=Y(void 0===t?e.length-1:t,0),function(){for(var r=arguments,n=-1,o=Y(r.length-t,0),i=Array(o);++n<o;)i[n]=r[t+n];n=-1;for(var a=Array(t+1);++n<t;)a[n]=r[n];return a[t]=i,W(e,this,a)}}(function(e){var t=P(e,ce);return t.length&&t[0]===e[0]?function(e,t,r){for(var n=r?H:D,o=e[0].length,i=e.length,a=i,s=Array(i),u=1/0,c=[];a--;){var l=e[a];a&&t&&(l=P(l,C(t))),u=ee(l.length,u),s[a]=!r&&(t||o>=120&&l.length>=120)?new ae(a&&l):void 0}l=e[0];var f=-1,p=s[0];e:for(;++f<o&&c.length<u;){var h=l[f],y=t?t(h):h;if(h=r||0!==h?h:0,!(p?J(p,y):n(c,y,r))){for(a=i;--a;){var g=s[a];if(!(g?J(g,y):n(e[a],y,r)))continue e}p&&p.push(y),c.push(h)}}return c}(t):[]});function ge(e){return"string"==typeof e?e.length>0?[e]:[]:e}var de=n(function(e){e.exports=function(){var e=Object.prototype.toString;function t(e,t){return null!=e&&Object.prototype.hasOwnProperty.call(e,t)}function r(e){if(!e)return!0;if(o(e)&&0===e.length)return!0;if("string"!=typeof e){for(var r in e)if(t(e,r))return!1;return!0}return!1}function n(t){return e.call(t)}var o=Array.isArray||function(t){return"[object Array]"===e.call(t)};function i(e){var t=parseInt(e);return t.toString()===e?t:e}function a(e){e=e||{};var a=function(e){return Object.keys(a).reduce(function(t,r){return"create"===r?t:("function"==typeof a[r]&&(t[r]=a[r].bind(a,e)),t)},{})};function s(r,n){return e.includeInheritedProps||"number"==typeof n&&Array.isArray(r)||t(r,n)}function u(e,t){if(s(e,t))return e[t]}function c(e,t,r,n){if("number"==typeof t&&(t=[t]),!t||0===t.length)return e;if("string"==typeof t)return c(e,t.split(".").map(i),r,n);var o=t[0],a=u(e,o);return 1===t.length?(void 0!==a&&n||(e[o]=r),a):(void 0===a&&("number"==typeof t[1]?e[o]=[]:e[o]={}),c(e[o],t.slice(1),r,n))}return a.has=function(r,n){if("number"==typeof n?n=[n]:"string"==typeof n&&(n=n.split(".")),!n||0===n.length)return!!r;for(var a=0;a<n.length;a++){var s=i(n[a]);if(!("number"==typeof s&&o(r)&&s<r.length||(e.includeInheritedProps?s in Object(r):t(r,s))))return!1;r=r[s]}return!0},a.ensureExists=function(e,t,r){return c(e,t,r,!0)},a.set=function(e,t,r,n){return c(e,t,r,n)},a.insert=function(e,t,r,n){var i=a.get(e,t);n=~~n,o(i)||(i=[],a.set(e,t,i)),i.splice(n,0,r)},a.empty=function(e,t){var i,u;if(!r(t)&&null!=e&&(i=a.get(e,t))){if("string"==typeof i)return a.set(e,t,"");if(function(e){return"boolean"==typeof e||"[object Boolean]"===n(e)}(i))return a.set(e,t,!1);if("number"==typeof i)return a.set(e,t,0);if(o(i))i.length=0;else{if(!function(e){return"object"==typeof e&&"[object Object]"===n(e)}(i))return a.set(e,t,null);for(u in i)s(i,u)&&delete i[u]}}},a.push=function(e,t){var r=a.get(e,t);o(r)||(r=[],a.set(e,t,r)),r.push.apply(r,Array.prototype.slice.call(arguments,2))},a.coalesce=function(e,t,r){for(var n,o=0,i=t.length;o<i;o++)if(void 0!==(n=a.get(e,t[o])))return n;return r},a.get=function(e,t,r){if("number"==typeof t&&(t=[t]),!t||0===t.length)return e;if(null==e)return r;if("string"==typeof t)return a.get(e,t.split("."),r);var n=i(t[0]),o=u(e,n);return void 0===o?r:1===t.length?o:a.get(e[n],t.slice(1),r)},a.del=function(e,t){if("number"==typeof t&&(t=[t]),null==e)return e;if(r(t))return e;if("string"==typeof t)return a.del(e,t.split("."));var n=i(t[0]);return s(e,n)?1!==t.length?a.del(e[n],t.slice(1)):(o(e)?e.splice(n,1):delete e[n],e):e},a}var s=a();return s.create=a,s.withInheritedProps=a({includeInheritedProps:!0}),s}()}),me=function(e){var t=(e=Math.abs(e))%100;if(t>=10&&t<=20)return"th";var r=e%10;return 1===r?"st":2===r?"nd":3===r?"rd":"th"};function be(e){if("number"!=typeof e)throw new TypeError("Expected Number, got "+typeof e+" "+e);return Number.isFinite(e)?e+me(e):e}be.indicator=me;var ve=be;const _e=/[|\\{}()[\]^$+*?.-]/g;var we=e=>{if("string"!=typeof e)throw new TypeError("Expected a string");return e.replace(_e,"\\$&")};const je=new Map;function Oe(e,t){t={caseSensitive:!1,...t};const r=e+JSON.stringify(t);if(je.has(r))return je.get(r);const n="!"===e[0];n&&(e=e.slice(1)),e=we(e).replace(/\\\*/g,".*");const o=new RegExp(`^${e}$`,t.caseSensitive?"":"i");return o.negated=n,je.set(r,o),o}var Te=(e,t,r)=>{if(!Array.isArray(e)||!Array.isArray(t))throw new TypeError(`Expected two arrays, got ${typeof e} ${typeof t}`);if(0===t.length)return e;const n="!"===t[0][0];t=t.map(e=>Oe(e,r));const o=[];for(const r of e){let e=n;for(const n of t)n.test(r)&&(e=!n.negated);e&&o.push(r)}return o};function $e(e,t,r){return function e(t,r,n,o=!0){const a=Object.prototype.hasOwnProperty;function s(e){return null!=e}function u(e){return"Object"===i(e)}function c(e,t){return t=ge(t),Array.from(e).filter(e=>!t.some(t=>Te.isMatch(e,t,{caseSensitive:!0})))}const l=["any","anything","every","everything","all","whatever","whatevs"],p=Array.isArray;if(!s(t))throw new Error("check-types-mini: [THROW_ID_01] First argument is missing!");const h={ignoreKeys:[],ignorePaths:[],acceptArrays:!1,acceptArraysIgnore:[],enforceStrictKeyset:!0,schema:{},msg:"check-types-mini",optsVarName:"opts"};let y;if(y=s(n)&&u(n)?Object.assign({},h,n):Object.assign({},h),s(y.ignoreKeys)&&y.ignoreKeys?y.ignoreKeys=ge(y.ignoreKeys):y.ignoreKeys=[],s(y.ignorePaths)&&y.ignorePaths?y.ignorePaths=ge(y.ignorePaths):y.ignorePaths=[],s(y.acceptArraysIgnore)&&y.acceptArraysIgnore?y.acceptArraysIgnore=ge(y.acceptArraysIgnore):y.acceptArraysIgnore=[],y.msg="string"==typeof y.msg?y.msg.trim():y.msg,":"===y.msg[y.msg.length-1]&&(y.msg=y.msg.slice(0,y.msg.length-1).trim()),y.schema&&(Object.keys(y.schema).forEach(e=>{if(u(y.schema[e])){const t={};S(y.schema[e],(r,n,o)=>{const i=void 0!==n?n:r;return p(i)||u(i)||(t[`${e}.${o.path}`]=i),i}),delete y.schema[e],y.schema=Object.assign(y.schema,t)}}),Object.keys(y.schema).forEach(e=>{p(y.schema[e])||(y.schema[e]=[y.schema[e]]),y.schema[e]=y.schema[e].map(String).map(e=>e.toLowerCase()).map(e=>e.trim())})),s(r)||(r={}),o&&e(y,h,{enforceStrictKeyset:!1},!1),y.enforceStrictKeyset)if(s(y.schema)&&Object.keys(y.schema).length>0){if(0!==c(f(Object.keys(t),Object.keys(r).concat(Object.keys(y.schema))),y.ignoreKeys).length){const e=f(Object.keys(t),Object.keys(r).concat(Object.keys(y.schema)));throw new TypeError(`${y.msg}: ${y.optsVarName}.enforceStrictKeyset is on and the following key${e.length>1?"s":""} ${e.length>1?"are":"is"} not covered by schema and/or reference objects: ${e.join(", ")}`)}}else{if(!(s(r)&&Object.keys(r).length>0))throw new TypeError(`${y.msg}: Both ${y.optsVarName}.schema and reference objects are missing! We don't have anything to match the keys as you requested via opts.enforceStrictKeyset!`);if(0!==c(f(Object.keys(t),Object.keys(r)),y.ignoreKeys).length){const e=f(Object.keys(t),Object.keys(r));throw new TypeError(`${y.msg}: The input object has key${e.length>1?"s":""} which ${e.length>1?"are":"is"} not covered by the reference object: ${e.join(", ")}`)}if(0!==c(f(Object.keys(r),Object.keys(t)),y.ignoreKeys).length){const e=f(Object.keys(r),Object.keys(t));throw new TypeError(`${y.msg}: The reference object has key${e.length>1?"s":""} which ${e.length>1?"are":"is"} not present in the input object: ${e.join(", ")}`)}}const g=[];S(t,(e,n,o)=>{let s=n,c=e;if("array"===o.parentType&&(c=void 0,s=e),p(g)&&g.length&&g.some(e=>o.path.startsWith(e)))return s;if(c&&y.ignoreKeys.some(e=>Te.isMatch(c,e)))return s;if(y.ignorePaths.some(e=>Te.isMatch(o.path,e)))return s;const f=!(!u(s)&&!p(s)&&p(o.parent));let h=!1;u(y.schema)&&a.call(y.schema,de.get(o.path))&&(h=!0);let d=!1;if(u(r)&&de.has(r,de.get(o.path))&&(d=!0),y.enforceStrictKeyset&&f&&!h&&!d)throw new TypeError(`${y.msg}: ${y.optsVarName}.${o.path} is neither covered by reference object (second input argument), nor ${y.optsVarName}.schema! To stop this error, turn off ${y.optsVarName}.enforceStrictKeyset or provide some type reference (2nd argument or ${y.optsVarName}.schema).\n\nDebug info:\n\nobj = ${JSON.stringify(t,null,4)}\n\nref = ${JSON.stringify(r,null,4)}\n\ninnerObj = ${JSON.stringify(o,null,4)}\n\nopts = ${JSON.stringify(y,null,4)}\n\ncurrent = ${JSON.stringify(s,null,4)}\n\n`);if(h){const e=ge(y.schema[o.path]).map(String).map(e=>e.toLowerCase());if(de.set(y.schema,o.path,e),ye(e,l).length)g.push(o.path);else if(!0!==s&&!1!==s&&!e.includes(i(s).toLowerCase())||(!0===s||!1===s)&&!e.includes(String(s))&&!e.includes("boolean")){if(!p(s)||!y.acceptArrays)throw new TypeError(`${y.msg}: ${y.optsVarName}.${o.path} was customised to ${"string"!==i(s)?'"':""}${JSON.stringify(s,null,0)}${"string"!==i(s)?'"':""} (type: ${i(s).toLowerCase()}) which is not among the allowed types in schema (which is equal to ${JSON.stringify(e,null,0)})`);for(let t=0,r=s.length;t<r;t++)if(!e.includes(i(s[t]).toLowerCase()))throw new TypeError(`${y.msg}: ${y.optsVarName}.${o.path}.${t}, the ${ve(t+1)} element (equal to ${JSON.stringify(s[t],null,0)}) is of a type ${i(s[t]).toLowerCase()}, but only the following are allowed by the ${y.optsVarName}.schema: ${e.join(", ")}`)}}else if(d){const t=de.get(r,o.path);if(y.acceptArrays&&p(s)&&!y.acceptArraysIgnore.includes(e)){if(!s.every(t=>i(t).toLowerCase()===i(r[e]).toLowerCase()))throw new TypeError(`${y.msg}: ${y.optsVarName}.${o.path} was customised to be array, but not all of its elements are ${i(r[e]).toLowerCase()}-type`)}else if(i(s)!==i(t))throw new TypeError(`${y.msg}: ${y.optsVarName}.${o.path} was customised to ${"string"===i(s).toLowerCase()?"":'"'}${JSON.stringify(s,null,0)}${"string"===i(s).toLowerCase()?"":'"'} which is not ${i(t).toLowerCase()} but ${i(s).toLowerCase()}`)}return s})}(e,t,r)}Te.isMatch=(e,t,r)=>{const n=Oe(t,r),o=n.test(e);return n.negated?!o:o};const Se=Array.isArray;function Ae(t,r){if(!Se(t))throw new TypeError(`ranges-sort: [THROW_ID_01] Input must be an array, consisting of range arrays! Currently its type is: ${typeof t}, equal to: ${JSON.stringify(t,null,4)}`);if(0===t.length)return t;const n={strictlyTwoElementsInRangeArrays:!1,progressFn:null},i=Object.assign({},n,r);let a,s;if($e(i,n,{msg:"ranges-sort: [THROW_ID_02*]",schema:{progressFn:["function","false","null"]}}),i.strictlyTwoElementsInRangeArrays&&!t.every((e,t)=>2===e.length||(a=t,s=e.length,!1)))throw new TypeError(`ranges-sort: [THROW_ID_03] The first argument should be an array and must consist of arrays which are natural number indexes representing TWO string index ranges. However, ${o(a)} range (${JSON.stringify(t[a],null,4)}) has not two but ${s} elements!`);if(!t.every((t,r)=>!(!e(t[0],{includeZero:!0})||!e(t[1],{includeZero:!0}))||(a=r,!1)))throw new TypeError(`ranges-sort: [THROW_ID_04] The first argument should be an array and must consist of arrays which are natural number indexes representing string index ranges. However, ${o(a)} range (${JSON.stringify(t[a],null,4)}) does not consist of only natural numbers!`);const u=t.length*t.length;let c=0;return Array.from(t).sort((e,t)=>(i.progressFn&&(c++,i.progressFn(Math.floor(100*c/u))),e[0]===t[0]?e[1]<t[1]?-1:e[1]>t[1]?1:0:e[0]<t[0]?-1:1))}function Ee(e,t){function r(e){return"string"==typeof e}if(!Array.isArray(e))return e;const n={mergeType:1,progressFn:null,joinRangesThatTouchEdges:!0};let o;if(t){if(!O(t))throw new Error(`emlint: [THROW_ID_03] the second input argument must be a plain object. It was given as:\n${JSON.stringify(t,null,4)} (type ${typeof t})`);if((o=Object.assign({},n,t)).progressFn&&O(o.progressFn)&&!Object.keys(o.progressFn).length)o.progressFn=null;else if(o.progressFn&&"function"!=typeof o.progressFn)throw new Error(`ranges-merge: [THROW_ID_01] opts.progressFn must be a function! It was given of a type: "${typeof o.progressFn}", equal to ${JSON.stringify(o.progressFn,null,4)}`);if(o.mergeType&&1!==o.mergeType&&2!==o.mergeType)if(r(o.mergeType)&&"1"===o.mergeType.trim())o.mergeType=1;else{if(!r(o.mergeType)||"2"!==o.mergeType.trim())throw new Error(`ranges-merge: [THROW_ID_02] opts.mergeType was customised to a wrong thing! It was given of a type: "${typeof o.mergeType}", equal to ${JSON.stringify(o.mergeType,null,4)}`);o.mergeType=2}if("boolean"!=typeof o.joinRangesThatTouchEdges)throw new Error(`ranges-merge: [THROW_ID_04] opts.joinRangesThatTouchEdges was customised to a wrong thing! It was given of a type: "${typeof o.joinRangesThatTouchEdges}", equal to ${JSON.stringify(o.joinRangesThatTouchEdges,null,4)}`)}else o=p(n);const i=p(e).filter(e=>void 0!==e[2]||e[0]!==e[1]);let a,s,u;const c=(a=o.progressFn?Ae(i,{progressFn:e=>{(u=Math.floor(e/5))!==s&&(s=u,o.progressFn(u))}}):Ae(i)).length-1;for(let e=c;e>0;e--)o.progressFn&&(u=Math.floor(78*(1-e/c))+21)!==s&&u>s&&(s=u,o.progressFn(u)),(a[e][0]<=a[e-1][0]||!o.joinRangesThatTouchEdges&&a[e][0]<a[e-1][1]||o.joinRangesThatTouchEdges&&a[e][0]<=a[e-1][1])&&(a[e-1][0]=Math.min(a[e][0],a[e-1][0]),a[e-1][1]=Math.max(a[e][1],a[e-1][1]),void 0!==a[e][2]&&(a[e-1][0]>=a[e][0]||a[e-1][1]<=a[e][1])&&null!==a[e-1][2]&&(null===a[e][2]&&null!==a[e-1][2]?a[e-1][2]=null:void 0!==a[e-1][2]?2===o.mergeType&&a[e-1][0]===a[e][0]?a[e-1][2]=a[e][2]:a[e-1][2]+=a[e][2]:a[e-1][2]=a[e][2]),a.splice(e,1),e=a.length);return a}function Ie(e,t){let r;if(r=t&&"number"==typeof t?t:1,"string"==typeof e){if(0===e.length)return"";if(""===e.trim()){const t=(e.match(/\n/g)||[]).length;return t?"\n".repeat(Math.min(t,r)):" "}let t="";if(""===e[0].trim()){t=" ";let n=0;for(let t=0,r=e.length;t<r&&("\n"===e[t]&&n++,0===e[t].trim().length);t++);n&&(t="\n".repeat(Math.min(n,r)))}let n="";if(""===e.slice(-1).trim()){n=" ";let t=0;for(let r=e.length;r--&&("\n"===e[r]&&t++,0===e[r].trim().length););t&&(n="\n".repeat(Math.min(t,r)))}return t+e.trim()+n}return e}function Ne(e){return null!=e}const Re=Array.isArray,ke=Number.isInteger;function xe(e){return"string"==typeof e}function Me(e){return t(e,{includeZero:!0})?parseInt(e,10):e}class We{constructor(e){const t=Object.assign({},{limitToBeAddedWhitespace:!1,limitLinebreaksCount:1,mergeType:1},e);if(t.mergeType&&1!==t.mergeType&&2!==t.mergeType)if(xe(t.mergeType)&&"1"===t.mergeType.trim())t.mergeType=1;else{if(!xe(t.mergeType)||"2"!==t.mergeType.trim())throw new Error(`ranges-push: [THROW_ID_02] opts.mergeType was customised to a wrong thing! It was given of a type: "${typeof t.mergeType}", equal to ${JSON.stringify(t.mergeType,null,4)}`);t.mergeType=2}this.opts=t}add(r=function(e){throw new Error(`ranges-push/Ranges/add(): [THROW_ID_01] Missing ${o(e)} input parameter!`)}(1),n,i,...a){if(a.length>0)throw new TypeError(`ranges-push/Ranges/add(): [THROW_ID_03] Please don't overload the add() method. From the 4th input argument onwards we see these redundant arguments: ${JSON.stringify(a,null,4)}`);if(null===r&&void 0===n&&void 0===i)return;const s=t(r,{includeZero:!0})?parseInt(r,10):r,u=t(n,{includeZero:!0})?parseInt(n,10):n;if(Re(r)&&!Ne(n)){let t,n;if(r.length>0){if(!r.every((e,r)=>!!Re(e)||(t=r,n=e,!1)))throw new TypeError(`ranges-push/Ranges/add(): [THROW_ID_07] first argument was given as array but it contains not only range arrays. For example, at index ${t} we have ${typeof n}-type value:\n${JSON.stringify(n,null,4)}.`);r.forEach((t,r)=>{if(!e(Me(t[0]),{includeZero:!0}))throw new TypeError(`ranges-push/Ranges/add(): [THROW_ID_06] The ${o(r)} ranges array's starting range index, an element at its zero'th index, is not a natural number! It's equal to: ${t[0]}.`);if(!e(Me(t[1]),{includeZero:!0}))throw new TypeError(`ranges-push/Ranges/add(): [THROW_ID_05] The ${o(r)} ranges array's ending range index, an element at its first index, is not a natural number! It's equal to: ${t[1]}.`);if(Ne(t[2])&&!xe(t[2]))throw new TypeError(`ranges-push/Ranges/add(): [THROW_ID_04] The ${o(r)} ranges array's "to add" value is not string but ${typeof t[2]}! It's equal to: ${t[2]}.`);this.add(...t)})}}else{if(!e(s,{includeZero:!0})||!e(u,{includeZero:!0}))throw e(s,{includeZero:!0})?new TypeError(`ranges-push/Ranges/add(): [THROW_ID_10] "to" value, the second input argument, must be a natural number or zero! Currently it's of a type "${typeof u}" equal to: ${JSON.stringify(u,null,4)}`):new TypeError(`ranges-push/Ranges/add(): [THROW_ID_09] "from" value, the first input argument, must be a natural number or zero! Currently it's of a type "${typeof s}" equal to: ${JSON.stringify(s,null,4)}`);if(Ne(i)&&!xe(i))throw new TypeError(`ranges-push/Ranges/add(): [THROW_ID_08] The third argument, the value to add, was given not as string but ${typeof i}, equal to:\n${JSON.stringify(i,null,4)}`);if(Ne(this.slices)&&Re(this.last())&&s===this.last()[1]){if(this.last()[1]=u,null!==this.last()[2]&&Ne(i)){let e=!(Ne(this.last()[2])&&this.last()[2].length>0)||this.opts&&this.opts.mergeType&&1!==this.opts.mergeType?i:this.last()[2]+i;this.opts.limitToBeAddedWhitespace&&(e=Ie(e,this.opts.limitLinebreaksCount)),xe(e)&&!e.length||(this.last()[2]=e)}}else{this.slices||(this.slices=[]);const e=void 0===i||xe(i)&&!i.length?[s,u]:[s,u,this.opts.limitToBeAddedWhitespace?Ie(i,this.opts.limitLinebreaksCount):i];this.slices.push(e)}}}push(e,t,r,...n){this.add(e,t,r,...n)}current(){return null!=this.slices?(this.slices=Ee(this.slices,{mergeType:this.opts.mergeType}),this.opts.limitToBeAddedWhitespace?this.slices.map(e=>Ne(e[2])?[e[0],e[1],Ie(e[2],this.opts.limitLinebreaksCount)]:e):this.slices):null}wipe(){this.slices=void 0}replace(e){if(Re(e)&&e.length){if(!Re(e[0])||!ke(e[0][0]))throw new Error(`ranges-push/Ranges/replace(): [THROW_ID_11] Single range was given but we expected array of arrays! The first element, ${JSON.stringify(e[0],null,4)} should be an array and its first element should be an integer, a string index.`);this.slices=p(e)}else this.slices=void 0}last(){return void 0!==this.slices&&Array.isArray(this.slices)?this.slices[this.slices.length-1]:null}}const De=Array.isArray;function He(e){return null!=e}function Pe(e,t,r){if(t>>=0,r=He(r)?String(r):" ",!He(e))return e;if("number"==typeof e)e=String(e);else if("string"!=typeof e)return e;return e.length>=t?e:((t-=e.length)>r.length&&(r+=r.repeat(t/r.length)),r.slice(0,t)+e)}return function(r,n){if("string"!=typeof r||0===r.length)return r;function i(e){return/[0-9]/.test(e)}var a=Object.assign({},{padStart:3},n);(!a.padStart||"number"!=typeof a.padStart||"number"==typeof a.padStart&&a.padStart<0)&&(a.padStart=0);var s,u,c=new We,l=r.length,f=null,p=null,h=null,y=1,g=!1,d=null;for(a.padStart&&l>45e3&&(a.padStart=4),s=0;s<l;s++){if(("\n"===r[s]||"\r"===r[s]&&"\n"!==r[s+1])&&y++,d&&!i(r[s])&&s>d&&(c.push(d,s,a.padStart?Pe(y,a.padStart,"0"):"".concat(y)),d=null,g=!0),f&&f.start<s&&!g&&!d&&i(r[s])&&(d=s),f&&f.start<s&&!g&&(u=r[s],/[A-Za-z]/.test(u))){if("\\"===r[s-1]&&"u"===r[s]&&"0"===r[s+1]&&"0"===r[s+2]&&"1"===r[s+3]&&("b"===r[s+4]||"B"===r[s+5])&&"["===r[s+5]){var m=void 0;i(r[s+6])?m=s+6:"$"===r[s+6]&&"{"===r[s+7]&&i(r[s+8])&&(m=s+8);var b=void 0;if(m)for(var v=m;v<l;v++)if(!i(r[v])){b=v;break}var _=void 0;if("m"===r[b]?_=b:"}"===r[b]&&"m"===r[b+1]&&(_=b+1),!_){g=!0;continue}if("$"===r[_+1]&&"{"===r[_+2]&&"`"===r[_+3]){s=_+3;continue}}g=!0}f&&f.start<s&&f.type===r[s]&&(f=null,p=null,h=null,d=null,g=!1),!f&&p&&p<s&&h&&h<s&&r[s].trim().length&&('"'===r[s]||"'"===r[s]||"`"===r[s]?((f={}).start=s,f.type=r[s],g=!1):"/"!==r[s]&&(p=null,h=null,d=null)),!h&&r[s].trim().length&&p&&p<=s&&("("===r[s]?h=s:(p=null,d=null)),"c"!==r[s]||"o"!==r[s+1]||"n"!==r[s+2]||"s"!==r[s+3]||"o"!==r[s+4]||"l"!==r[s+5]||"e"!==r[s+6]||"."!==r[s+7]||"l"!==r[s+8]||"o"!==r[s+9]||"g"!==r[s+10]||(p=s+11,s+=10)}return c.current()?function(r,n,i){let a=0,s=0;if(0===arguments.length)throw new Error("ranges-apply: [THROW_ID_01] inputs missing!");if("string"!=typeof r)throw new TypeError(`ranges-apply: [THROW_ID_02] first input argument must be a string! Currently it's: ${typeof r}, equal to: ${JSON.stringify(r,null,4)}`);if(null===n)return r;if(!De(n))throw new TypeError(`ranges-apply: [THROW_ID_03] second input argument must be an array (or null)! Currently it's: ${typeof n}, equal to: ${JSON.stringify(n,null,4)}`);if(i&&"function"!=typeof i)throw new TypeError(`ranges-apply: [THROW_ID_04] the third input argument must be a function (or falsey)! Currently it's: ${typeof i}, equal to: ${JSON.stringify(i,null,4)}`);De(n)&&(e(n[0],{includeZero:!0})||t(n[0],{includeZero:!0}))&&(e(n[1],{includeZero:!0})||t(n[1],{includeZero:!0}))&&(n=[n]);const u=n.length;let c=0;n.forEach((r,l)=>{if(i&&(a=Math.floor(c/u*10))!==s&&(s=a,i(a)),!De(r))throw new TypeError(`ranges-apply: [THROW_ID_05] ranges array, second input arg., has ${o(l)} element not an array: ${JSON.stringify(r,null,4)}, which is ${typeof r}`);if(!e(r[0],{includeZero:!0})){if(!t(r[0],{includeZero:!0}))throw new TypeError(`ranges-apply: [THROW_ID_06] ranges array, second input arg. has ${o(l)} element, array [${r[0]},${r[1]}]. That array has first element not an integer, but ${typeof r[0]}, equal to: ${JSON.stringify(r[0],null,4)}. Computer doesn't like this.`);n[l][0]=Number.parseInt(n[l][0],10)}if(!e(r[1],{includeZero:!0})){if(!t(r[1],{includeZero:!0}))throw new TypeError(`ranges-apply: [THROW_ID_07] ranges array, second input arg. has ${o(l)} element, array [${r[0]},${r[1]}]. That array has second element not an integer, but ${typeof r[1]}, equal to: ${JSON.stringify(r[1],null,4)}. Computer doesn't like this.`);n[l][1]=Number.parseInt(n[l][1],10)}c++});const l=Ee(n,{progressFn:e=>{i&&(a=10+Math.floor(e/10))!==s&&(s=a,i(a))}}),f=l.length;if(f>0){const e=r.slice(l[f-1][1]);r=l.reduce((e,t,n,o)=>{i&&(a=20+Math.floor(n/f*80))!==s&&(s=a,i(a));const u=0===n?0:o[n-1][1],c=o[n][0];return e+r.slice(u,c)+(function(e){return null!=e}(o[n][2])?o[n][2]:"")},""),r+=e}return r}(r,c.current()):(f=void 0,p=void 0,h=void 0,y=void 0,g=void 0,d=void 0,y=void 0,r)}});
