/**
 * string-fix-broken-named-entities
 * Finds and fixes common and not so common broken named HTML entities, returns ranges array of fixes
 * Version: 1.6.6
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/string-fix-broken-named-entities
 */

!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e=e||self).stringFixBrokenNamedEntities=t()}(this,function(){"use strict";function e(t){return(e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(t)}function t(e){return function(e){if(Array.isArray(e)){for(var t=0,n=new Array(e.length);t<e.length;t++)n[t]=e[t];return n}}(e)||function(e){if(Symbol.iterator in Object(e)||"[object Arguments]"===Object.prototype.toString.call(e))return Array.from(e)}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance")}()}var n=function(e,t){if(t){if("object"!=typeof t)throw new TypeError(String(t)+" is not an object. Expected an object that has boolean `includeZero` property.");if("includeZero"in t){if("boolean"!=typeof t.includeZero)throw new TypeError(String(t.includeZero)+" is neither true nor false. `includeZero` option must be a Boolean value.");if(t.includeZero&&0===e)return!0}}return Number.isSafeInteger(e)&&e>=1},r="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{};function o(e,t){return e(t={exports:{}},t.exports),t.exports}var a=o(function(e,t){(t=e.exports=function(e){return e+t.suffix(+e)}).suffix=function(e){return e%=100,1===Math.floor(e/10)?"th":e%10==1?"st":e%10==2?"nd":e%10==3?"rd":"th"}}),i=(a.suffix,o(function(e,t){var n,o,a,i,s,c,u,l,f,p,h,y,g,d,m,b,v,_,w,j;e.exports=(n="function"==typeof Promise,o="object"==typeof self?self:r,a="undefined"!=typeof Symbol,i="undefined"!=typeof Map,s="undefined"!=typeof Set,c="undefined"!=typeof WeakMap,u="undefined"!=typeof WeakSet,l="undefined"!=typeof DataView,f=a&&void 0!==Symbol.iterator,p=a&&void 0!==Symbol.toStringTag,h=s&&"function"==typeof Set.prototype.entries,y=i&&"function"==typeof Map.prototype.entries,g=h&&Object.getPrototypeOf((new Set).entries()),d=y&&Object.getPrototypeOf((new Map).entries()),m=f&&"function"==typeof Array.prototype[Symbol.iterator],b=m&&Object.getPrototypeOf([][Symbol.iterator]()),v=f&&"function"==typeof String.prototype[Symbol.iterator],_=v&&Object.getPrototypeOf(""[Symbol.iterator]()),w=8,j=-1,function(e){var t=typeof e;if("object"!==t)return t;if(null===e)return"null";if(e===o)return"global";if(Array.isArray(e)&&(!1===p||!(Symbol.toStringTag in e)))return"Array";if("object"==typeof window&&null!==window){if("object"==typeof window.location&&e===window.location)return"Location";if("object"==typeof window.document&&e===window.document)return"Document";if("object"==typeof window.navigator){if("object"==typeof window.navigator.mimeTypes&&e===window.navigator.mimeTypes)return"MimeTypeArray";if("object"==typeof window.navigator.plugins&&e===window.navigator.plugins)return"PluginArray"}if(("function"==typeof window.HTMLElement||"object"==typeof window.HTMLElement)&&e instanceof window.HTMLElement){if("BLOCKQUOTE"===e.tagName)return"HTMLQuoteElement";if("TD"===e.tagName)return"HTMLTableDataCellElement";if("TH"===e.tagName)return"HTMLTableHeaderCellElement"}}var r=p&&e[Symbol.toStringTag];if("string"==typeof r)return r;var a=Object.getPrototypeOf(e);return a===RegExp.prototype?"RegExp":a===Date.prototype?"Date":n&&a===Promise.prototype?"Promise":s&&a===Set.prototype?"Set":i&&a===Map.prototype?"Map":u&&a===WeakSet.prototype?"WeakSet":c&&a===WeakMap.prototype?"WeakMap":l&&a===DataView.prototype?"DataView":i&&a===d?"Map Iterator":s&&a===g?"Set Iterator":m&&a===b?"Array Iterator":v&&a===_?"String Iterator":null===a?"Object":Object.prototype.toString.call(e).slice(w,j)})}));function s(e,t,n){if(t!=t)return function(e,t,n,r){for(var o=e.length,a=n+(r?1:-1);r?a--:++a<o;)if(t(e[a],a,e))return a;return-1}(e,u,n);for(var r=n-1,o=e.length;++r<o;)if(e[r]===t)return r;return-1}function c(e,t,n,r){for(var o=n-1,a=e.length;++o<a;)if(r(e[o],t))return o;return-1}function u(e){return e!=e}var l=Array.prototype.splice;function f(e,t,n,r){var o,a=r?c:s,i=-1,u=t.length,f=e;for(e===t&&(t=function(e,t){var n=-1,r=e.length;t||(t=Array(r));for(;++n<r;)t[n]=e[n];return t}(t)),n&&(f=function(e,t){for(var n=-1,r=e?e.length:0,o=Array(r);++n<r;)o[n]=t(e[n],n,e);return o}(e,(o=n,function(e){return o(e)})));++i<u;)for(var p=0,h=t[i],y=n?n(h):h;(p=a(f,y,p,r))>-1;)f!==e&&l.call(f,p,1),l.call(e,p,1);return e}var p=function(e,t){return e&&e.length&&t&&t.length?f(e,t):e},h=o(function(e,t){var n=200,o="__lodash_hash_undefined__",a=9007199254740991,i="[object Arguments]",s="[object Boolean]",c="[object Date]",u="[object Function]",l="[object GeneratorFunction]",f="[object Map]",p="[object Number]",h="[object Object]",y="[object RegExp]",g="[object Set]",d="[object String]",m="[object Symbol]",b="[object ArrayBuffer]",v="[object DataView]",_="[object Float32Array]",w="[object Float64Array]",j="[object Int8Array]",O="[object Int16Array]",S="[object Int32Array]",A="[object Uint8Array]",N="[object Uint8ClampedArray]",$="[object Uint16Array]",T="[object Uint32Array]",E=/\w*$/,P=/^\[object .+?Constructor\]$/,k=/^(?:0|[1-9]\d*)$/,x={};x[i]=x["[object Array]"]=x[b]=x[v]=x[s]=x[c]=x[_]=x[w]=x[j]=x[O]=x[S]=x[f]=x[p]=x[h]=x[y]=x[g]=x[d]=x[m]=x[A]=x[N]=x[$]=x[T]=!0,x["[object Error]"]=x[u]=x["[object WeakMap]"]=!1;var V="object"==typeof r&&r&&r.Object===Object&&r,I="object"==typeof self&&self&&self.Object===Object&&self,M=V||I||Function("return this")(),F=t&&!t.nodeType&&t,C=F&&e&&!e.nodeType&&e,L=C&&C.exports===F;function D(e,t){return e.set(t[0],t[1]),e}function W(e,t){return e.add(t),e}function H(e,t,n,r){var o=-1,a=e?e.length:0;for(r&&a&&(n=e[++o]);++o<a;)n=t(n,e[o],o,e);return n}function R(e){var t=!1;if(null!=e&&"function"!=typeof e.toString)try{t=!!(e+"")}catch(e){}return t}function B(e){var t=-1,n=Array(e.size);return e.forEach(function(e,r){n[++t]=[r,e]}),n}function K(e,t){return function(n){return e(t(n))}}function J(e){var t=-1,n=Array(e.size);return e.forEach(function(e){n[++t]=e}),n}var Z,q=Array.prototype,U=Function.prototype,z=Object.prototype,G=M["__core-js_shared__"],Q=(Z=/[^.]+$/.exec(G&&G.keys&&G.keys.IE_PROTO||""))?"Symbol(src)_1."+Z:"",X=U.toString,Y=z.hasOwnProperty,ee=z.toString,te=RegExp("^"+X.call(Y).replace(/[\\^$.*+?()[\]{}|]/g,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$"),ne=L?M.Buffer:void 0,re=M.Symbol,oe=M.Uint8Array,ae=K(Object.getPrototypeOf,Object),ie=Object.create,se=z.propertyIsEnumerable,ce=q.splice,ue=Object.getOwnPropertySymbols,le=ne?ne.isBuffer:void 0,fe=K(Object.keys,Object),pe=Ce(M,"DataView"),he=Ce(M,"Map"),ye=Ce(M,"Promise"),ge=Ce(M,"Set"),de=Ce(M,"WeakMap"),me=Ce(Object,"create"),be=Re(pe),ve=Re(he),_e=Re(ye),we=Re(ge),je=Re(de),Oe=re?re.prototype:void 0,Se=Oe?Oe.valueOf:void 0;function Ae(e){var t=-1,n=e?e.length:0;for(this.clear();++t<n;){var r=e[t];this.set(r[0],r[1])}}function Ne(e){var t=-1,n=e?e.length:0;for(this.clear();++t<n;){var r=e[t];this.set(r[0],r[1])}}function $e(e){var t=-1,n=e?e.length:0;for(this.clear();++t<n;){var r=e[t];this.set(r[0],r[1])}}function Te(e){this.__data__=new Ne(e)}function Ee(e,t){var n=Ke(e)||function(e){return function(e){return function(e){return!!e&&"object"==typeof e}(e)&&Je(e)}(e)&&Y.call(e,"callee")&&(!se.call(e,"callee")||ee.call(e)==i)}(e)?function(e,t){for(var n=-1,r=Array(e);++n<e;)r[n]=t(n);return r}(e.length,String):[],r=n.length,o=!!r;for(var a in e)!t&&!Y.call(e,a)||o&&("length"==a||We(a,r))||n.push(a);return n}function Pe(e,t,n){var r=e[t];Y.call(e,t)&&Be(r,n)&&(void 0!==n||t in e)||(e[t]=n)}function ke(e,t){for(var n=e.length;n--;)if(Be(e[n][0],t))return n;return-1}function xe(e,t,n,r,o,a,P){var k;if(r&&(k=a?r(e,o,a,P):r(e)),void 0!==k)return k;if(!Ue(e))return e;var V=Ke(e);if(V){if(k=function(e){var t=e.length,n=e.constructor(t);t&&"string"==typeof e[0]&&Y.call(e,"index")&&(n.index=e.index,n.input=e.input);return n}(e),!t)return function(e,t){var n=-1,r=e.length;t||(t=Array(r));for(;++n<r;)t[n]=e[n];return t}(e,k)}else{var I=De(e),M=I==u||I==l;if(Ze(e))return function(e,t){if(t)return e.slice();var n=new e.constructor(e.length);return e.copy(n),n}(e,t);if(I==h||I==i||M&&!a){if(R(e))return a?e:{};if(k=function(e){return"function"!=typeof e.constructor||He(e)?{}:(t=ae(e),Ue(t)?ie(t):{});var t}(M?{}:e),!t)return function(e,t){return Me(e,Le(e),t)}(e,function(e,t){return e&&Me(t,ze(t),e)}(k,e))}else{if(!x[I])return a?e:{};k=function(e,t,n,r){var o=e.constructor;switch(t){case b:return Ie(e);case s:case c:return new o(+e);case v:return function(e,t){var n=t?Ie(e.buffer):e.buffer;return new e.constructor(n,e.byteOffset,e.byteLength)}(e,r);case _:case w:case j:case O:case S:case A:case N:case $:case T:return function(e,t){var n=t?Ie(e.buffer):e.buffer;return new e.constructor(n,e.byteOffset,e.length)}(e,r);case f:return function(e,t,n){return H(t?n(B(e),!0):B(e),D,new e.constructor)}(e,r,n);case p:case d:return new o(e);case y:return(u=new(i=e).constructor(i.source,E.exec(i))).lastIndex=i.lastIndex,u;case g:return function(e,t,n){return H(t?n(J(e),!0):J(e),W,new e.constructor)}(e,r,n);case m:return a=e,Se?Object(Se.call(a)):{}}var a;var i,u}(e,I,xe,t)}}P||(P=new Te);var F=P.get(e);if(F)return F;if(P.set(e,k),!V)var C=n?function(e){return function(e,t,n){var r=t(e);return Ke(e)?r:function(e,t){for(var n=-1,r=t.length,o=e.length;++n<r;)e[o+n]=t[n];return e}(r,n(e))}(e,ze,Le)}(e):ze(e);return function(e,t){for(var n=-1,r=e?e.length:0;++n<r&&!1!==t(e[n],n,e););}(C||e,function(o,a){C&&(o=e[a=o]),Pe(k,a,xe(o,t,n,r,a,e,P))}),k}function Ve(e){return!(!Ue(e)||(t=e,Q&&Q in t))&&(qe(e)||R(e)?te:P).test(Re(e));var t}function Ie(e){var t=new e.constructor(e.byteLength);return new oe(t).set(new oe(e)),t}function Me(e,t,n,r){n||(n={});for(var o=-1,a=t.length;++o<a;){var i=t[o],s=r?r(n[i],e[i],i,n,e):void 0;Pe(n,i,void 0===s?e[i]:s)}return n}function Fe(e,t){var n,r,o=e.__data__;return("string"==(r=typeof(n=t))||"number"==r||"symbol"==r||"boolean"==r?"__proto__"!==n:null===n)?o["string"==typeof t?"string":"hash"]:o.map}function Ce(e,t){var n=function(e,t){return null==e?void 0:e[t]}(e,t);return Ve(n)?n:void 0}Ae.prototype.clear=function(){this.__data__=me?me(null):{}},Ae.prototype.delete=function(e){return this.has(e)&&delete this.__data__[e]},Ae.prototype.get=function(e){var t=this.__data__;if(me){var n=t[e];return n===o?void 0:n}return Y.call(t,e)?t[e]:void 0},Ae.prototype.has=function(e){var t=this.__data__;return me?void 0!==t[e]:Y.call(t,e)},Ae.prototype.set=function(e,t){return this.__data__[e]=me&&void 0===t?o:t,this},Ne.prototype.clear=function(){this.__data__=[]},Ne.prototype.delete=function(e){var t=this.__data__,n=ke(t,e);return!(n<0||(n==t.length-1?t.pop():ce.call(t,n,1),0))},Ne.prototype.get=function(e){var t=this.__data__,n=ke(t,e);return n<0?void 0:t[n][1]},Ne.prototype.has=function(e){return ke(this.__data__,e)>-1},Ne.prototype.set=function(e,t){var n=this.__data__,r=ke(n,e);return r<0?n.push([e,t]):n[r][1]=t,this},$e.prototype.clear=function(){this.__data__={hash:new Ae,map:new(he||Ne),string:new Ae}},$e.prototype.delete=function(e){return Fe(this,e).delete(e)},$e.prototype.get=function(e){return Fe(this,e).get(e)},$e.prototype.has=function(e){return Fe(this,e).has(e)},$e.prototype.set=function(e,t){return Fe(this,e).set(e,t),this},Te.prototype.clear=function(){this.__data__=new Ne},Te.prototype.delete=function(e){return this.__data__.delete(e)},Te.prototype.get=function(e){return this.__data__.get(e)},Te.prototype.has=function(e){return this.__data__.has(e)},Te.prototype.set=function(e,t){var r=this.__data__;if(r instanceof Ne){var o=r.__data__;if(!he||o.length<n-1)return o.push([e,t]),this;r=this.__data__=new $e(o)}return r.set(e,t),this};var Le=ue?K(ue,Object):function(){return[]},De=function(e){return ee.call(e)};function We(e,t){return!!(t=null==t?a:t)&&("number"==typeof e||k.test(e))&&e>-1&&e%1==0&&e<t}function He(e){var t=e&&e.constructor;return e===("function"==typeof t&&t.prototype||z)}function Re(e){if(null!=e){try{return X.call(e)}catch(e){}try{return e+""}catch(e){}}return""}function Be(e,t){return e===t||e!=e&&t!=t}(pe&&De(new pe(new ArrayBuffer(1)))!=v||he&&De(new he)!=f||ye&&"[object Promise]"!=De(ye.resolve())||ge&&De(new ge)!=g||de&&"[object WeakMap]"!=De(new de))&&(De=function(e){var t=ee.call(e),n=t==h?e.constructor:void 0,r=n?Re(n):void 0;if(r)switch(r){case be:return v;case ve:return f;case _e:return"[object Promise]";case we:return g;case je:return"[object WeakMap]"}return t});var Ke=Array.isArray;function Je(e){return null!=e&&function(e){return"number"==typeof e&&e>-1&&e%1==0&&e<=a}(e.length)&&!qe(e)}var Ze=le||function(){return!1};function qe(e){var t=Ue(e)?ee.call(e):"";return t==u||t==l}function Ue(e){var t=typeof e;return!!e&&("object"==t||"function"==t)}function ze(e){return Je(e)?Ee(e):function(e){if(!He(e))return fe(e);var t=[];for(var n in Object(e))Y.call(e,n)&&"constructor"!=n&&t.push(n);return t}(e)}e.exports=function(e){return xe(e,!0,!0)}}),y="[object Object]";var g,d,m=Function.prototype,b=Object.prototype,v=m.toString,_=b.hasOwnProperty,w=v.call(Object),j=b.toString,O=(g=Object.getPrototypeOf,d=Object,function(e){return g(d(e))});var S=function(e){if(!function(e){return!!e&&"object"==typeof e}(e)||j.call(e)!=y||function(e){var t=!1;if(null!=e&&"function"!=typeof e.toString)try{t=!!(e+"")}catch(e){}return t}(e))return!1;var t=O(e);if(null===t)return!0;var n=_.call(t,"constructor")&&t.constructor;return"function"==typeof n&&n instanceof n&&v.call(n)==w};const A=Array.isArray;function N(e){return"string"==typeof e&&e.length>0&&"."===e[0]?e.slice(1):e}function $(e,t){return function e(t,n,r){const o=h(t);let a,i,s,c,u;if((r=Object.assign({depth:-1,path:""},r)).depth+=1,A(o))for(a=0,i=o.length;a<i;a++){const t=`${r.path}.${a}`;void 0!==o[a]?(r.parent=h(o),r.parentType="array",s=e(n(o[a],void 0,Object.assign({},r,{path:N(t)})),n,Object.assign({},r,{path:N(t)})),Number.isNaN(s)&&a<o.length?(o.splice(a,1),a-=1):o[a]=s):o.splice(a,1)}else if(S(o))for(a=0,i=(c=Object.keys(o)).length;a<i;a++){u=c[a];const t=`${r.path}.${u}`;0===r.depth&&null!=u&&(r.topmostKey=u),r.parent=h(o),r.parentType="object",s=e(n(u,o[u],Object.assign({},r,{path:N(t)})),n,Object.assign({},r,{path:N(t)})),Number.isNaN(s)?delete o[u]:o[u]=s}return o}(e,t,{})}var T="__lodash_hash_undefined__",E=9007199254740991,P="[object Function]",k="[object GeneratorFunction]",x=/^\[object .+?Constructor\]$/,V="object"==typeof r&&r&&r.Object===Object&&r,I="object"==typeof self&&self&&self.Object===Object&&self,M=V||I||Function("return this")();function F(e,t){return!!(e?e.length:0)&&function(e,t,n){if(t!=t)return function(e,t,n,r){var o=e.length,a=n+(r?1:-1);for(;r?a--:++a<o;)if(t(e[a],a,e))return a;return-1}(e,D,n);var r=n-1,o=e.length;for(;++r<o;)if(e[r]===t)return r;return-1}(e,t,0)>-1}function C(e,t,n){for(var r=-1,o=e?e.length:0;++r<o;)if(n(t,e[r]))return!0;return!1}function L(e,t){for(var n=-1,r=e?e.length:0,o=Array(r);++n<r;)o[n]=t(e[n],n,e);return o}function D(e){return e!=e}function W(e){return function(t){return e(t)}}function H(e,t){return e.has(t)}var R,B=Array.prototype,K=Function.prototype,J=Object.prototype,Z=M["__core-js_shared__"],q=(R=/[^.]+$/.exec(Z&&Z.keys&&Z.keys.IE_PROTO||""))?"Symbol(src)_1."+R:"",U=K.toString,z=J.hasOwnProperty,G=J.toString,Q=RegExp("^"+U.call(z).replace(/[\\^$.*+?()[\]{}|]/g,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$"),X=B.splice,Y=Math.max,ee=Math.min,te=fe(M,"Map"),ne=fe(Object,"create");function re(e){var t=-1,n=e?e.length:0;for(this.clear();++t<n;){var r=e[t];this.set(r[0],r[1])}}function oe(e){var t=-1,n=e?e.length:0;for(this.clear();++t<n;){var r=e[t];this.set(r[0],r[1])}}function ae(e){var t=-1,n=e?e.length:0;for(this.clear();++t<n;){var r=e[t];this.set(r[0],r[1])}}function ie(e){var t=-1,n=e?e.length:0;for(this.__data__=new ae;++t<n;)this.add(e[t])}function se(e,t){for(var n,r,o=e.length;o--;)if((n=e[o][0])===(r=t)||n!=n&&r!=r)return o;return-1}function ce(e){return!(!he(e)||(t=e,q&&q in t))&&(pe(e)||function(e){var t=!1;if(null!=e&&"function"!=typeof e.toString)try{t=!!(e+"")}catch(e){}return t}(e)?Q:x).test(function(e){if(null!=e){try{return U.call(e)}catch(e){}try{return e+""}catch(e){}}return""}(e));var t}function ue(e){return function(e){return function(e){return!!e&&"object"==typeof e}(e)&&function(e){return null!=e&&function(e){return"number"==typeof e&&e>-1&&e%1==0&&e<=E}(e.length)&&!pe(e)}(e)}(e)?e:[]}function le(e,t){var n,r,o=e.__data__;return("string"==(r=typeof(n=t))||"number"==r||"symbol"==r||"boolean"==r?"__proto__"!==n:null===n)?o["string"==typeof t?"string":"hash"]:o.map}function fe(e,t){var n=function(e,t){return null==e?void 0:e[t]}(e,t);return ce(n)?n:void 0}function pe(e){var t=he(e)?G.call(e):"";return t==P||t==k}function he(e){var t=typeof e;return!!e&&("object"==t||"function"==t)}re.prototype.clear=function(){this.__data__=ne?ne(null):{}},re.prototype.delete=function(e){return this.has(e)&&delete this.__data__[e]},re.prototype.get=function(e){var t=this.__data__;if(ne){var n=t[e];return n===T?void 0:n}return z.call(t,e)?t[e]:void 0},re.prototype.has=function(e){var t=this.__data__;return ne?void 0!==t[e]:z.call(t,e)},re.prototype.set=function(e,t){return this.__data__[e]=ne&&void 0===t?T:t,this},oe.prototype.clear=function(){this.__data__=[]},oe.prototype.delete=function(e){var t=this.__data__,n=se(t,e);return!(n<0||(n==t.length-1?t.pop():X.call(t,n,1),0))},oe.prototype.get=function(e){var t=this.__data__,n=se(t,e);return n<0?void 0:t[n][1]},oe.prototype.has=function(e){return se(this.__data__,e)>-1},oe.prototype.set=function(e,t){var n=this.__data__,r=se(n,e);return r<0?n.push([e,t]):n[r][1]=t,this},ae.prototype.clear=function(){this.__data__={hash:new re,map:new(te||oe),string:new re}},ae.prototype.delete=function(e){return le(this,e).delete(e)},ae.prototype.get=function(e){return le(this,e).get(e)},ae.prototype.has=function(e){return le(this,e).has(e)},ae.prototype.set=function(e,t){return le(this,e).set(e,t),this},ie.prototype.add=ie.prototype.push=function(e){return this.__data__.set(e,T),this},ie.prototype.has=function(e){return this.__data__.has(e)};var ye=function(e,t){return t=Y(void 0===t?e.length-1:t,0),function(){for(var n=arguments,r=-1,o=Y(n.length-t,0),a=Array(o);++r<o;)a[r]=n[t+r];r=-1;for(var i=Array(t+1);++r<t;)i[r]=n[r];return i[t]=a,function(e,t,n){switch(n.length){case 0:return e.call(t);case 1:return e.call(t,n[0]);case 2:return e.call(t,n[0],n[1]);case 3:return e.call(t,n[0],n[1],n[2])}return e.apply(t,n)}(e,this,i)}}(function(e){var t=L(e,ue);return t.length&&t[0]===e[0]?function(e,t,n){for(var r=n?C:F,o=e[0].length,a=e.length,i=a,s=Array(a),c=1/0,u=[];i--;){var l=e[i];i&&t&&(l=L(l,W(t))),c=ee(l.length,c),s[i]=!n&&(t||o>=120&&l.length>=120)?new ie(i&&l):void 0}l=e[0];var f=-1,p=s[0];e:for(;++f<o&&u.length<c;){var h=l[f],y=t?t(h):h;if(h=n||0!==h?h:0,!(p?H(p,y):r(u,y,n))){for(i=a;--i;){var g=s[i];if(!(g?H(g,y):r(e[i],y,n)))continue e}p&&p.push(y),u.push(h)}}return u}(t):[]});function ge(e){return"string"==typeof e?e.length>0?[e]:[]:e}var de=o(function(e){e.exports=function(){var e=Object.prototype.toString;function t(e,t){return null!=e&&Object.prototype.hasOwnProperty.call(e,t)}function n(e){if(!e)return!0;if(o(e)&&0===e.length)return!0;if("string"!=typeof e){for(var n in e)if(t(e,n))return!1;return!0}return!1}function r(t){return e.call(t)}var o=Array.isArray||function(t){return"[object Array]"===e.call(t)};function a(e){var t=parseInt(e);return t.toString()===e?t:e}function i(e){e=e||{};var i=function(e){return Object.keys(i).reduce(function(t,n){return"create"===n?t:("function"==typeof i[n]&&(t[n]=i[n].bind(i,e)),t)},{})};function s(n,r){return e.includeInheritedProps||"number"==typeof r&&Array.isArray(n)||t(n,r)}function c(e,t){if(s(e,t))return e[t]}function u(e,t,n,r){if("number"==typeof t&&(t=[t]),!t||0===t.length)return e;if("string"==typeof t)return u(e,t.split(".").map(a),n,r);var o=t[0],i=c(e,o);return 1===t.length?(void 0!==i&&r||(e[o]=n),i):(void 0===i&&("number"==typeof t[1]?e[o]=[]:e[o]={}),u(e[o],t.slice(1),n,r))}return i.has=function(n,r){if("number"==typeof r?r=[r]:"string"==typeof r&&(r=r.split(".")),!r||0===r.length)return!!n;for(var i=0;i<r.length;i++){var s=a(r[i]);if(!("number"==typeof s&&o(n)&&s<n.length||(e.includeInheritedProps?s in Object(n):t(n,s))))return!1;n=n[s]}return!0},i.ensureExists=function(e,t,n){return u(e,t,n,!0)},i.set=function(e,t,n,r){return u(e,t,n,r)},i.insert=function(e,t,n,r){var a=i.get(e,t);r=~~r,o(a)||(a=[],i.set(e,t,a)),a.splice(r,0,n)},i.empty=function(e,t){var a,c;if(!n(t)&&null!=e&&(a=i.get(e,t))){if("string"==typeof a)return i.set(e,t,"");if(function(e){return"boolean"==typeof e||"[object Boolean]"===r(e)}(a))return i.set(e,t,!1);if("number"==typeof a)return i.set(e,t,0);if(o(a))a.length=0;else{if(!function(e){return"object"==typeof e&&"[object Object]"===r(e)}(a))return i.set(e,t,null);for(c in a)s(a,c)&&delete a[c]}}},i.push=function(e,t){var n=i.get(e,t);o(n)||(n=[],i.set(e,t,n)),n.push.apply(n,Array.prototype.slice.call(arguments,2))},i.coalesce=function(e,t,n){for(var r,o=0,a=t.length;o<a;o++)if(void 0!==(r=i.get(e,t[o])))return r;return n},i.get=function(e,t,n){if("number"==typeof t&&(t=[t]),!t||0===t.length)return e;if(null==e)return n;if("string"==typeof t)return i.get(e,t.split("."),n);var r=a(t[0]),o=c(e,r);return void 0===o?n:1===t.length?o:i.get(e[r],t.slice(1),n)},i.del=function(e,t){if("number"==typeof t&&(t=[t]),null==e)return e;if(n(t))return e;if("string"==typeof t)return i.del(e,t.split("."));var r=a(t[0]);return s(e,r)?1!==t.length?i.del(e[r],t.slice(1)):(o(e)?e.splice(r,1):delete e[r],e):e},i}var s=i();return s.create=i,s.withInheritedProps=i({includeInheritedProps:!0}),s}()}),me=function(e){var t=e%100;if(t>=10&&t<=20)return"th";var n=e%10;return 1===n?"st":2===n?"nd":3===n?"rd":"th"};function be(e){if("number"!=typeof e)throw new TypeError("Expected Number, got "+typeof e+" "+e);return e+me(e)}be.indicator=me;var ve=be,_e=/[|\\{}()[\]^$+*?.]/g,we=function(e){if("string"!=typeof e)throw new TypeError("Expected a string");return e.replace(_e,"\\$&")};const je=new Map;function Oe(e,t){const n=Object.assign({caseSensitive:!1},t),r=e+JSON.stringify(n);if(je.has(r))return je.get(r);const o="!"===e[0];o&&(e=e.slice(1)),e=we(e).replace(/\\\*/g,".*");const a=new RegExp(`^${e}$`,n.caseSensitive?"":"i");return a.negated=o,je.set(r,a),a}var Se=(e,t,n)=>{if(!Array.isArray(e)||!Array.isArray(t))throw new TypeError(`Expected two arrays, got ${typeof e} ${typeof t}`);if(0===t.length)return e;const r="!"===t[0][0];t=t.map(e=>Oe(e,n));const o=[];for(const n of e){let e=r;for(const r of t)r.test(n)&&(e=!r.negated);e&&o.push(n)}return o};function Ae(e,t,n){return function e(t,n,r,o=!0){const a=Object.prototype.hasOwnProperty;function s(e){return null!=e}function c(e){return"Object"===i(e)}function u(e,t){return t=ge(t),Array.from(e).filter(e=>!t.some(t=>Se.isMatch(e,t,{caseSensitive:!0})))}const l=["any","anything","every","everything","all","whatever","whatevs"],f=Array.isArray;if(!s(t))throw new Error("check-types-mini: [THROW_ID_01] First argument is missing!");const h={ignoreKeys:[],ignorePaths:[],acceptArrays:!1,acceptArraysIgnore:[],enforceStrictKeyset:!0,schema:{},msg:"check-types-mini",optsVarName:"opts"};let y;if(y=s(r)&&c(r)?Object.assign({},h,r):Object.assign({},h),s(y.ignoreKeys)&&y.ignoreKeys?y.ignoreKeys=ge(y.ignoreKeys):y.ignoreKeys=[],s(y.ignorePaths)&&y.ignorePaths?y.ignorePaths=ge(y.ignorePaths):y.ignorePaths=[],s(y.acceptArraysIgnore)&&y.acceptArraysIgnore?y.acceptArraysIgnore=ge(y.acceptArraysIgnore):y.acceptArraysIgnore=[],y.msg="string"==typeof y.msg?y.msg.trim():y.msg,":"===y.msg[y.msg.length-1]&&(y.msg=y.msg.slice(0,y.msg.length-1).trim()),y.schema&&(Object.keys(y.schema).forEach(e=>{if(c(y.schema[e])){const t={};$(y.schema[e],(n,r,o)=>{const a=void 0!==r?r:n;return f(a)||c(a)||(t[`${e}.${o.path}`]=a),a}),delete y.schema[e],y.schema=Object.assign(y.schema,t)}}),Object.keys(y.schema).forEach(e=>{f(y.schema[e])||(y.schema[e]=[y.schema[e]]),y.schema[e]=y.schema[e].map(String).map(e=>e.toLowerCase()).map(e=>e.trim())})),s(n)||(n={}),o&&e(y,h,{enforceStrictKeyset:!1},!1),y.enforceStrictKeyset)if(s(y.schema)&&Object.keys(y.schema).length>0){if(0!==u(p(Object.keys(t),Object.keys(n).concat(Object.keys(y.schema))),y.ignoreKeys).length){const e=p(Object.keys(t),Object.keys(n).concat(Object.keys(y.schema)));throw new TypeError(`${y.msg}: ${y.optsVarName}.enforceStrictKeyset is on and the following key${e.length>1?"s":""} ${e.length>1?"are":"is"} not covered by schema and/or reference objects: ${e.join(", ")}`)}}else{if(!(s(n)&&Object.keys(n).length>0))throw new TypeError(`${y.msg}: Both ${y.optsVarName}.schema and reference objects are missing! We don't have anything to match the keys as you requested via opts.enforceStrictKeyset!`);if(0!==u(p(Object.keys(t),Object.keys(n)),y.ignoreKeys).length){const e=p(Object.keys(t),Object.keys(n));throw new TypeError(`${y.msg}: The input object has key${e.length>1?"s":""} which ${e.length>1?"are":"is"} not covered by the reference object: ${e.join(", ")}`)}if(0!==u(p(Object.keys(n),Object.keys(t)),y.ignoreKeys).length){const e=p(Object.keys(n),Object.keys(t));throw new TypeError(`${y.msg}: The reference object has key${e.length>1?"s":""} which ${e.length>1?"are":"is"} not present in the input object: ${e.join(", ")}`)}}const g=[];$(t,(e,r,o)=>{let s=r,u=e;if("array"===o.parentType&&(u=void 0,s=e),f(g)&&g.length&&g.some(e=>o.path.startsWith(e)))return s;if(u&&y.ignoreKeys.some(e=>Se.isMatch(u,e)))return s;if(y.ignorePaths.some(e=>Se.isMatch(o.path,e)))return s;const p=!(!c(s)&&!f(s)&&f(o.parent));let h=!1;c(y.schema)&&a.call(y.schema,de.get(o.path))&&(h=!0);let d=!1;if(c(n)&&de.has(n,de.get(o.path))&&(d=!0),y.enforceStrictKeyset&&p&&!h&&!d)throw new TypeError(`${y.msg}: ${y.optsVarName}.${o.path} is neither covered by reference object (second input argument), nor ${y.optsVarName}.schema! To stop this error, turn off ${y.optsVarName}.enforceStrictKeyset or provide some type reference (2nd argument or ${y.optsVarName}.schema).\n\nDebug info:\n\nobj = ${JSON.stringify(t,null,4)}\n\nref = ${JSON.stringify(n,null,4)}\n\ninnerObj = ${JSON.stringify(o,null,4)}\n\nopts = ${JSON.stringify(y,null,4)}\n\ncurrent = ${JSON.stringify(s,null,4)}\n\n`);if(h){const e=ge(y.schema[o.path]).map(String).map(e=>e.toLowerCase());if(de.set(y.schema,o.path,e),ye(e,l).length)g.push(o.path);else if(!0!==s&&!1!==s&&!e.includes(i(s).toLowerCase())||(!0===s||!1===s)&&!e.includes(String(s))&&!e.includes("boolean")){if(!f(s)||!y.acceptArrays)throw new TypeError(`${y.msg}: ${y.optsVarName}.${o.path} was customised to ${"string"!==i(s)?'"':""}${JSON.stringify(s,null,0)}${"string"!==i(s)?'"':""} (type: ${i(s).toLowerCase()}) which is not among the allowed types in schema (which is equal to ${JSON.stringify(e,null,0)})`);for(let t=0,n=s.length;t<n;t++)if(!e.includes(i(s[t]).toLowerCase()))throw new TypeError(`${y.msg}: ${y.optsVarName}.${o.path}.${t}, the ${ve(t+1)} element (equal to ${JSON.stringify(s[t],null,0)}) is of a type ${i(s[t]).toLowerCase()}, but only the following are allowed by the ${y.optsVarName}.schema: ${e.join(", ")}`)}}else if(d){const t=de.get(n,o.path);if(y.acceptArrays&&f(s)&&!y.acceptArraysIgnore.includes(e)){if(!s.every(t=>i(t).toLowerCase()===i(n[e]).toLowerCase()))throw new TypeError(`${y.msg}: ${y.optsVarName}.${o.path} was customised to be array, but not all of its elements are ${i(n[e]).toLowerCase()}-type`)}else if(i(s)!==i(t))throw new TypeError(`${y.msg}: ${y.optsVarName}.${o.path} was customised to ${"string"===i(s).toLowerCase()?"":'"'}${JSON.stringify(s,null,0)}${"string"===i(s).toLowerCase()?"":'"'} which is not ${i(t).toLowerCase()} but ${i(s).toLowerCase()}`)}return s})}(e,t,n)}Se.isMatch=((e,t,n)=>{const r=Oe(t,n),o=r.test(e);return r.negated?!o:o});const Ne=Array.isArray;function $e(e,t){if(!Ne(e))throw new TypeError(`ranges-sort: [THROW_ID_01] Input must be an array, consisting of range arrays! Currently its type is: ${typeof e}, equal to: ${JSON.stringify(e,null,4)}`);if(0===e.length)return e;const r={strictlyTwoElementsInRangeArrays:!1,progressFn:null},o=Object.assign({},r,t);let i,s;if(Ae(o,r,{msg:"ranges-sort: [THROW_ID_02*]",schema:{progressFn:["function","false","null"]}}),o.strictlyTwoElementsInRangeArrays&&!e.every((e,t)=>2===e.length||(i=t,s=e.length,!1)))throw new TypeError(`ranges-sort: [THROW_ID_03] The first argument should be an array and must consist of arrays which are natural number indexes representing TWO string index ranges. However, ${a(i)} range (${JSON.stringify(e[i],null,4)}) has not two but ${s} elements!`);if(!e.every((e,t)=>!(!n(e[0],{includeZero:!0})||!n(e[1],{includeZero:!0}))||(i=t,!1)))throw new TypeError(`ranges-sort: [THROW_ID_04] The first argument should be an array and must consist of arrays which are natural number indexes representing string index ranges. However, ${a(i)} range (${JSON.stringify(e[i],null,4)}) does not consist of only natural numbers!`);const c=e.length*e.length;let u=0;return Array.from(e).sort((e,t)=>(o.progressFn&&(u++,o.progressFn(Math.floor(100*u/c))),e[0]===t[0]?e[1]<t[1]?-1:e[1]>t[1]?1:0:e[0]<t[0]?-1:1))}return function(n,r){function o(e){return!("string"==typeof e&&1===e.length&&e.toUpperCase()!==e.toLowerCase())}if("string"!=typeof n)throw new Error("string-fix-broken-named-entities: [THROW_ID_01] the first input argument must be string! It was given as:\n".concat(JSON.stringify(n,null,4)," (").concat(e(n),"-type)"));var a,i={decode:!1,cb:null,progressFn:null};if(null!=r){if(!S(r))throw new Error("string-fix-broken-named-entities: [THROW_ID_02] the second input argument must be a plain object! I was given as:\n".concat(JSON.stringify(r,null,4)," (").concat(e(r),"-type)"));a=Object.assign({},i,r)}else a=i;if(a.cb&&"function"!=typeof a.cb)throw new TypeError("string-fix-broken-named-entities: [THROW_ID_03] opts.cb must be a function (or falsey)! Currently it's: ".concat(e(a.cb),", equal to: ").concat(JSON.stringify(a.cb,null,4)));if(a.progressFn&&"function"!=typeof a.progressFn)throw new TypeError("string-fix-broken-named-entities: [THROW_ID_04] opts.progressFn must be a function (or falsey)! Currently it's: ".concat(e(a.progressFn),", equal to: ").concat(JSON.stringify(a.progressFn,null,4)));var s,c,u,l,f,p,y=!1,g={nameStartsAt:null,ampersandNecessary:null,patience:2,matchedN:null,matchedB:null,matchedS:null,matchedP:null,matchedSemicol:null},d=h(g),m=function(){d=h(g)},b=[],v=n.length+1,_=0;e:for(var w=0;w<v;w++)if(a.progressFn&&(f=Math.floor(_/v*100))!==p&&(p=f,a.progressFn(f)),u=(null!==d.matchedN?1:0)+(null!==d.matchedB?1:0)+(null!==d.matchedS?1:0)+(null!==d.matchedP?1:0),l=[d.matchedN,d.matchedB,d.matchedS,d.matchedP].filter(function(e){return null!==e}),s=Math.min.apply(Math,t(l)),c=Math.max.apply(Math,t(l)),null!==d.nameStartsAt&&u>2&&(null!==d.matchedSemicol||!d.ampersandNecessary||o(n[d.nameStartsAt-1])&&o(n[w])||(o(n[d.nameStartsAt-1])||o(n[w]))&&c-s<=4||null!==d.matchedN&&null!==d.matchedB&&null!==d.matchedS&&null!==d.matchedP&&d.matchedN+1===d.matchedB&&d.matchedB+1===d.matchedS&&d.matchedS+1===d.matchedP)&&(!n[w]||null!==d.matchedN&&null!==d.matchedB&&null!==d.matchedS&&null!==d.matchedP&&n[w]!==n[w-1]||"n"!==n[w].toLowerCase()&&"b"!==n[w].toLowerCase()&&"s"!==n[w].toLowerCase()&&"p"!==n[w].toLowerCase()||";"===n[w-1])&&";"!==n[w]&&(void 0===n[w+1]||";"!==n[w+1]))"&nbsp;"!==n.slice(d.nameStartsAt,w)&&(null==d.nameStartsAt||w-d.nameStartsAt!=5||"&nbsp"!==n.slice(d.nameStartsAt,w)||a.decode?a.cb?b.push(a.cb({ruleName:"bad-named-html-entity-malformed-nbsp",entityName:"nbsp",rangeFrom:d.nameStartsAt,rangeTo:w,rangeValEncoded:"&nbsp;",rangeValDecoded:" "})):b.push([d.nameStartsAt,w,a.decode?" ":"&nbsp;"]):a.cb?b.push(a.cb({ruleName:"bad-named-html-entity-missing-semicolon",entityName:"nbsp",rangeFrom:w,rangeTo:w,rangeValEncoded:";",rangeValDecoded:";"})):b.push([w,w,";"])),m();else if(n[w]&&";"===n[w-1]&&";"!==n[w]&&u>0)m();else{if("&"===n[w]){if("a"===n[w+1]&&"m"===n[w+2]&&"p"===n[w+3]&&";"===n[w+4]){null===d.nameStartsAt&&(d.nameStartsAt=w),y=!0;for(var j=w+5;"a"===n[j]&&"m"===n[j+1]&&"p"===n[j+2]&&";"===n[j+3];)j+=4;a.cb?b.push(a.cb({ruleName:"bad-named-html-entity-amp-repetitions",entityName:"amp",rangeFrom:w+1,rangeTo:j,rangeValEncoded:null,rangeValDecoded:null})):b.push([w+1,j]),w=j-1;continue e}if(null===d.nameStartsAt&&null===d.ampersandNecessary&&(d.nameStartsAt=w,d.ampersandNecessary=!1),"a"===n[w+1]&&"n"===n[w+2]&&"g"===n[w+3]){if("s"!==n[w+4]&&";"!==n[w+4]){a.cb?b.push(a.cb({ruleName:"bad-named-html-entity-missing-semicolon",entityName:"ang",rangeFrom:w+4,rangeTo:w+4,rangeValEncoded:"&ang;",rangeValDecoded:"∠"})):b.push([w,w+4,a.decode?"∠":"&ang;"]),w+=3;continue e}if("s"===n[w+4]&&"t"===n[w+5]&&";"!==n[w+6]){a.cb?b.push(a.cb({ruleName:"bad-named-html-entity-missing-semicolon",entityName:"angst",rangeFrom:w+6,rangeTo:w+6,rangeValEncoded:"&angst;",rangeValDecoded:"Å"})):b.push([w,w+6,a.decode?"Å":"&angst;"]),w+=5;continue e}}else if("p"===n[w+1]&&"i"===n[w+2]){if("v"!==n[w+3]&&";"!==n[w+3]){a.cb?b.push(a.cb({ruleName:"bad-named-html-entity-missing-semicolon",entityName:"pi",rangeFrom:w+3,rangeTo:w+3,rangeValEncoded:"&pi;",rangeValDecoded:"π"})):b.push([w,w+3,a.decode?"π":"&pi;"]),w+=3;continue e}if("v"===n[w+3]&&";"!==n[w+4]){a.cb?b.push(a.cb({ruleName:"bad-named-html-entity-missing-semicolon",entityName:"piv",rangeFrom:w+4,rangeTo:w+4,rangeValEncoded:"&piv;",rangeValDecoded:"ϖ"})):b.push([w,w+4,a.decode?"ϖ":"&piv;"]),w+=3;continue e}}else{if("P"===n[w+1]&&"i"===n[w+2]&&";"!==n[w+3]){a.cb?b.push(a.cb({ruleName:"bad-named-html-entity-missing-semicolon",entityName:"Pi",rangeFrom:w+3,rangeTo:w+3,rangeValEncoded:"&Pi;",rangeValDecoded:"Π"})):b.push([w,w+3,a.decode?"Π":"&Pi;"]),w+=2;continue e}if("s"===n[w+1]){if("i"===n[w+2]&&"g"===n[w+3]&&"m"===n[w+4]&&"a"===n[w+5]&&";"!==n[w+6]&&"f"!==n[w+6]){a.cb?b.push(a.cb({ruleName:"bad-named-html-entity-missing-semicolon",entityName:"sigma",rangeFrom:w+6,rangeTo:w+6,rangeValEncoded:"&sigma;",rangeValDecoded:"σ"})):b.push([w,w+6,a.decode?"σ":"&sigma;"]),w+=5;continue e}if("u"===n[w+2]&&"b"===n[w+3]&&";"!==n[w+4]&&"e"!==n[w+4]){a.cb?b.push(a.cb({ruleName:"bad-named-html-entity-missing-semicolon",entityName:"sub",rangeFrom:w+4,rangeTo:w+4,rangeValEncoded:"&sub;",rangeValDecoded:"⊂"})):b.push([w,w+4,a.decode?"⊂":"&sub;"]),w+=3;continue e}if("u"===n[w+2]&&"p"===n[w+3]&&"f"!==n[w+4]&&"e"!==n[w+4]&&"1"!==n[w+4]&&"2"!==n[w+4]&&"3"!==n[w+4]&&";"!==n[w+4]){a.cb?b.push(a.cb({ruleName:"bad-named-html-entity-missing-semicolon",entityName:"sup",rangeFrom:w+4,rangeTo:w+4,rangeValEncoded:"&sup;",rangeValDecoded:"⊃"})):b.push([w,w+4,a.decode?"⊃":"&sup;"]),w+=3;continue e}}else if("t"===n[w+1]){if("h"===n[w+2]&&"e"===n[w+3]&&"t"===n[w+4]&&"a"===n[w+5]&&"s"!==n[w+6]&&";"!==n[w+6]){a.cb?b.push(a.cb({ruleName:"bad-named-html-entity-missing-semicolon",entityName:"theta",rangeFrom:w+6,rangeTo:w+6,rangeValEncoded:"&theta;",rangeValDecoded:"θ"})):b.push([w,w+6,a.decode?"θ":"&theta;"]),w+=5;continue e}if("h"===n[w+2]&&"i"===n[w+3]&&"n"===n[w+4]&&"s"===n[w+5]&&"p"===n[w+6]&&";"!==n[w+7]){a.cb?b.push(a.cb({ruleName:"bad-named-html-entity-missing-semicolon",entityName:"thinsp",rangeFrom:w+7,rangeTo:w+7,rangeValEncoded:"&thinsp;",rangeValDecoded:" "})):b.push([w,w+7,a.decode?" ":"&thinsp;"]),w+=6;continue e}}}}if(n[w]&&"n"===n[w].toLowerCase()){if("i"===n[w-1]&&"s"===n[w+1]){m();continue e}d.matchedN=w,null===d.nameStartsAt&&(d.nameStartsAt=w,null!==d.ampersandNecessary||y?!0!==d.ampersandNecessary&&(d.ampersandNecessary=!1):d.ampersandNecessary=!0)}if(n[w]&&"b"===n[w].toLowerCase())if(null!==d.nameStartsAt)d.matchedB=w;else{if(!d.patience){m();continue e}d.patience--,d.nameStartsAt=w,d.matchedB=w,null!==d.ampersandNecessary||y?!0!==d.ampersandNecessary&&(d.ampersandNecessary=!1):d.ampersandNecessary=!0}if(n[w]&&"s"===n[w].toLowerCase())if(null!==d.nameStartsAt)d.matchedS=w;else{if(!d.patience){m();continue e}d.patience--,d.nameStartsAt=w,d.matchedS=w,null!==d.ampersandNecessary||y?!0!==d.ampersandNecessary&&(d.ampersandNecessary=!1):d.ampersandNecessary=!0}if(n[w]&&"p"===n[w].toLowerCase())if(null!==d.nameStartsAt)d.matchedP=w;else{if(!d.patience){m();continue e}d.patience--,d.nameStartsAt=w,d.matchedP=w,null!==d.ampersandNecessary||y?!0!==d.ampersandNecessary&&(d.ampersandNecessary=!1):d.ampersandNecessary=!0}if(";"===n[w]&&null!==d.nameStartsAt&&(d.matchedSemicol=w),n[w]&&0===n[w].trim().length&&null!==d.nameStartsAt&&m(),y&&(y=!1),null!==d.nameStartsAt&&w>d.nameStartsAt&&n[w]&&"n"!==n[w].toLowerCase()&&"b"!==n[w].toLowerCase()&&"s"!==n[w].toLowerCase()&&"p"!==n[w].toLowerCase()&&"&"!==n[w]&&";"!==n[w]){if(!d.patience){m();continue e}d.patience=d.patience-1}_++}return b.length?a.cb?b:function(e,t){if(!Array.isArray(e))return e;if(t&&"function"!=typeof t)throw new Error(`ranges-merge: [THROW_ID_01] the second input argument must be a function! It was given of a type: "${typeof t}", equal to ${JSON.stringify(t,null,4)}`);const n=h(e).filter(e=>void 0!==e[2]||e[0]!==e[1]);let r,o,a;const i=(r=t?$e(n,{progressFn:e=>{(a=Math.floor(e/5))!==o&&(o=a,t(a))}}):$e(n)).length-1;for(let e=i;e>0;e--)t&&(a=Math.floor(78*(1-e/i))+21)!==o&&a>o&&(o=a,t(a)),(r[e][0]<=r[e-1][0]||r[e][0]<=r[e-1][1])&&(r[e-1][0]=Math.min(r[e][0],r[e-1][0]),r[e-1][1]=Math.max(r[e][1],r[e-1][1]),void 0!==r[e][2]&&(r[e-1][0]>=r[e][0]||r[e-1][1]<=r[e][1])&&null!==r[e-1][2]&&(null===r[e][2]&&null!==r[e-1][2]?r[e-1][2]=null:void 0!==r[e-1][2]?r[e-1][2]+=r[e][2]:r[e-1][2]=r[e][2]),r.splice(e,1),e=r.length);return r}(b):null}});
