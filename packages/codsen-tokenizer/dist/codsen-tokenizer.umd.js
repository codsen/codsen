/**
 * codsen-tokenizer
 * Tokenizer for mixed inputs aiming at broken code, especially HTML & CSS
 * Version: 1.2.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/codsen-tokenizer
 */

!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):(t=t||self).codsenTokenizer=e()}(this,(function(){"use strict";function t(e){return(t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(e)}var e=function(t,e){if(e){if("object"!=typeof e)throw new TypeError(String(e)+" is not an object. Expected an object that has boolean `includeZero` property.");if("includeZero"in e){if("boolean"!=typeof e.includeZero)throw new TypeError(String(e.includeZero)+" is neither true nor false. `includeZero` option must be a Boolean value.");if(e.includeZero&&0===t)return!0}}return Number.isSafeInteger(t)&&t>=1},r="[object Object]";var n,o,i=Function.prototype,a=Object.prototype,c=i.toString,u=a.hasOwnProperty,s=c.call(Object),l=a.toString,f=(n=Object.getPrototypeOf,o=Object,function(t){return n(o(t))});var h=function(t){if(!function(t){return!!t&&"object"==typeof t}(t)||l.call(t)!=r||function(t){var e=!1;if(null!=t&&"function"!=typeof t.toString)try{e=!!(t+"")}catch(t){}return e}(t))return!1;var e=f(t);if(null===e)return!0;var n=u.call(e,"constructor")&&e.constructor;return"function"==typeof n&&n instanceof n&&c.call(n)==s},p="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{};var g="[object AsyncFunction]",d="[object Function]",y="[object GeneratorFunction]",m="[object Null]",b="[object Proxy]",v="[object Undefined]",_="object"==typeof p&&p&&p.Object===Object&&p,w="object"==typeof self&&self&&self.Object===Object&&self,j=_||w||Function("return this")(),O=Object.prototype,C=O.hasOwnProperty,A=O.toString,S=j.Symbol,M=S?S.toStringTag:void 0;function x(t){return null==t?void 0===t?v:m:M&&M in Object(t)?function(t){var e=C.call(t,M),r=t[M];try{t[M]=void 0;var n=!0}catch(t){}var o=A.call(t);n&&(e?t[M]=r:delete t[M]);return o}(t):function(t){return A.call(t)}(t)}var E=function(t){if(!function(t){var e=typeof t;return null!=t&&("object"==e||"function"==e)}(t))return!1;var e=x(t);return e==d||e==y||e==g||e==b};function $(t){if("string"==typeof t)return 0!==t.length&&(t.charCodeAt(0)>=55296&&t.charCodeAt(0)<=56319);if(void 0===t)return!1;throw new TypeError(`string-character-is-astral-surrogate/isHighSurrogate(): the input is not string but ${typeof t}`)}function k(t){if("string"==typeof t)return 0!==t.length&&(t.charCodeAt(0)>=56320&&t.charCodeAt(0)<=57343);if(void 0===t)return!1;throw new TypeError(`string-character-is-astral-surrogate/isLowSurrogate(): the input is not string but ${typeof t}`)}const T=Array.isArray;function B(t){return null!=t}function F(t){return"string"==typeof t}function I(t){return"string"==typeof t&&(t.charCodeAt(0)>=55296&&t.charCodeAt(0)<=57343)}function P(t,e,r,n,o){const i="function"==typeof r?r():r;if(e>=t.length&&o&&"EOL"===i)return i;if(!(e<=t.length)){if(n.relaxedApi)return!1;throw new Error(`string-match-left-right/marchForward(): [THROW_ID_102] second argument, fromIndexInclusive is ${e} beyond the input string length, ${t.length}.`)}{let a=o?1:r.length;for(let o=e,i=t.length;o<i;o++){let e=t[o];if($(t[o])&&k(t[o+1])&&(e=t[o]+t[o+1]),k(t[o])&&$(t[o-1])&&(e=t[o-1]+t[o]),n.trimBeforeMatching&&""===t[o].trim())continue;if(!n.i&&n.trimCharsBeforeMatching.includes(e)||n.i&&n.trimCharsBeforeMatching.map(t=>t.toLowerCase()).includes(e.toLowerCase())){2===e.length&&(o+=1);continue}let i=r[r.length-a];if($(i)&&B(r[r.length-a+1])&&k(r[r.length-a+1])&&(i=r[r.length-a]+r[r.length-a+1]),!(!n.i&&e===i||n.i&&e.toLowerCase()===i.toLowerCase()))return!1;if((a-=e.length)<1){let n=o-r.length+e.length;return n>=0&&k(t[n])&&B(t[n-1])&&$(t[n-1])&&(n-=1),n>=0?n:0}2===e.length&&$(t[o])&&(o+=1)}if(a>0)return!(!o||"EOL"!==i)}}function L(t,e,r,n,o){const i="function"==typeof r?r():r;if(e<0&&o&&"EOL"===i)return i;if(e>=t.length){if(n.relaxedApi)return!1;throw new Error(`string-match-left-right/marchBackward(): [THROW_ID_203] second argument, starting index, should not be beyond the last character of the input string! Currently the first argument's last character's index is ${t.length} but the second argument is beyond it:\n${JSON.stringify(e,null,4)}`)}let a=o?1:r.length;for(let i=e+1;i--;){if(n.trimBeforeMatching&&""===t[i].trim()){if(0===i&&o&&"EOL"===r)return!0;continue}let e=t[i];if(k(t[i])&&$(t[i-1])?e=t[i-1]+t[i]:$(t[i])&&k(t[i+1])&&(e=t[i]+t[i+1]),!n.i&&n.trimCharsBeforeMatching.includes(e)||n.i&&n.trimCharsBeforeMatching.map(t=>t.toLowerCase()).includes(e.toLowerCase())){if(2===e.length&&(i-=1),o&&"EOL"===r&&0===i)return!0;continue}let c=r[a-1];if(k(c)&&(c=`${r[a-2]}${r[a-1]}`,a-=1,i-=1),!(!n.i&&e===c||n.i&&e.toLowerCase()===c.toLowerCase()))return!1;if((a-=1)<1)return i>=0?i:0}return a>0?!(!o||"EOL"!==i):void 0}function N(t,r,n,o){return function(t,r,n,o,i){const a=Object.assign({},{i:!1,trimBeforeMatching:!1,trimCharsBeforeMatching:[],relaxedApi:!1},i);var c;let u,s,l,f;if(a.trimCharsBeforeMatching="string"==typeof(c=a.trimCharsBeforeMatching)?c.length>0?[c]:[]:c,a.trimCharsBeforeMatching=a.trimCharsBeforeMatching.map(t=>F(t)?t:String(t)),a.trimCharsBeforeMatching.some((t,e)=>t.length>1&&!I(t)&&(u=e,s=t,!0)))throw new Error(`string-match-left-right/${t}(): [THROW_ID_07] the fourth argument, options object contains trimCharsBeforeMatching. It was meant to list the single characters but one of the entries at index ${u} is longer than 1 character, ${s.length} (equals to ${s}). Please split it into separate characters and put into array as separate elements.`);if(!F(r)){if(a.relaxedApi)return!1;throw new Error(`string-match-left-right/${t}(): [THROW_ID_01] the first argument should be a string. Currently it's of a type: ${typeof r}, equal to:\n${JSON.stringify(r,null,4)}`)}if(0===r.length){if(a.relaxedApi)return!1;throw new Error(`string-match-left-right/${t}(): [THROW_ID_02] the first argument should be a non-empty string. Currently it's empty!`)}if(!e(n,{includeZero:!0})){if(a.relaxedApi)return!1;throw new Error(`string-match-left-right/${t}(): [THROW_ID_03] the second argument should be a natural number. Currently it's of a type: ${typeof n}, equal to:\n${JSON.stringify(n,null,4)}`)}if(F(o))l=[o];else if(T(o))l=o;else if(B(o)){if(!E(o))throw new Error(`string-match-left-right/${t}(): [THROW_ID_05] the third argument, whatToMatch, is neither string nor array of strings! It's ${typeof o}, equal to:\n${JSON.stringify(o,null,4)}`);(l=[]).push(o)}else l=o;if(B(i)&&!h(i))throw new Error(`string-match-left-right/${t}(): [THROW_ID_06] the fourth argument, options object, should be a plain object. Currently it's of a type "${typeof i}", and equal to:\n${JSON.stringify(i,null,4)}`);if(!B(l)||!T(l)||T(l)&&!l.length||T(l)&&1===l.length&&F(l[0])&&0===l[0].trim().length){if("function"==typeof a.cb){let e,o=n;if("matchRight"===t&&$(r[n])&&k(r[n+1])&&(o+=1),"matchLeftIncl"!==t&&"matchRight"!==t||(o+=1),t.startsWith("matchLeft"))for(let t=o;t--;){if(k(r[t])&&$(r[t-1]))continue;let n=r[t];if($(r[t])&&k(r[t+1])&&(n=r[t]+r[t+1]),(!a.trimBeforeMatching||a.trimBeforeMatching&&void 0!==n&&""!==n.trim())&&(0===a.trimCharsBeforeMatching.length||void 0!==n&&!a.trimCharsBeforeMatching.includes(n))){e=t;break}k(r[t-1])&&$(r[t-2])&&(t-=1)}else if(t.startsWith("matchRight"))for(let t=o;t<r.length;t++){let n=r[t];if($(r[t])&&k(r[t+1])&&(n=r[t]+r[t+1]),(!a.trimBeforeMatching||a.trimBeforeMatching&&""!==n.trim())&&(0===a.trimCharsBeforeMatching.length||!a.trimCharsBeforeMatching.includes(n))){e=t;break}$(r[t])&&k(r[t+1])&&(t+=1)}if(void 0===e)return!1;let i=r[e];$(r[e])&&k(r[e+1])&&(i=r[e]+r[e+1]),k(r[e])&&$(r[e-1])&&(i=r[e-1]+r[e],e-=1);let c,u=e+1;return $(r[e])&&k(r[e+1])&&(u+=1),u&&u>0&&(c=r.slice(0,u)),t.startsWith("matchLeft")?a.cb(i,c,e):(e&&e>0&&(c=r.slice(e)),a.cb(i,c,e))}let e="";throw B(i)||(e=" More so, the whole options object, the fourth input argument, is missing!"),new Error(`string-match-left-right/${t}(): [THROW_ID_08] the third argument, "whatToMatch", was given as an empty string. This means, you intend to match purely by a callback. The callback was not set though, the opts key "cb" is not set!${e}`)}if(t.startsWith("matchLeft")){for(let e=0,o=l.length;e<o;e++){f="function"==typeof l[e];const o=l[e];let i=n;"matchLeft"===t&&(I(r[e-1])&&I(r[e-2])?i-=2:i-=1);const c=L(r,i,o,a,f);if(c&&f&&"function"==typeof o&&"EOL"===o())return!(!o()||a.cb&&!a.cb(s,h,u))&&o();let u,s,h="";if(B(c)&&c>0&&(s=r[u=c-1],h=r.slice(0,c)),k(r[u])&&B(r[u-1])&&$(r[u-1])&&(s=r[(u-=1)-1]+r[u]),$(r[u])&&B(r[u+1])&&k(r[u+1])&&(s=r[u]+r[u+1],h=r.slice(0,u+2)),!1!==c&&(!a.cb||a.cb(s,h,u)))return o}return!1}for(let e=0,o=l.length;e<o;e++){f="function"==typeof l[e];const o=l[e];let i=n+("matchRight"===t?1:0);"matchRight"===t&&$(r[i-1])&&k(r[i])&&(i+=1);const c=P(r,i,o,a,f);if(c&&f&&"function"==typeof o&&"EOL"===o()){let t,e,r;return!(!o()||a.cb&&!a.cb(t,e,r))&&o()}let u,s,h;if(B(c)&&B(r[c+o.length-1])&&(s=r[u=c+o.length],$(r[u])&&k(r[u+1])&&(s=r[u]+r[u+1])),B(u)&&u>=0&&(h=r.slice(u)),!1!==c&&(!a.cb||a.cb(s,h,u)))return o}return!1}("matchRight",t,r,n,o)}var R=function(t,e){return t(e={exports:{}},e.exports),e.exports}((function(t,e){var r=200,n="__lodash_hash_undefined__",o=9007199254740991,i="[object Arguments]",a="[object Boolean]",c="[object Date]",u="[object Function]",s="[object GeneratorFunction]",l="[object Map]",f="[object Number]",h="[object Object]",g="[object RegExp]",d="[object Set]",y="[object String]",m="[object Symbol]",b="[object ArrayBuffer]",v="[object DataView]",_="[object Float32Array]",w="[object Float64Array]",j="[object Int8Array]",O="[object Int16Array]",C="[object Int32Array]",A="[object Uint8Array]",S="[object Uint8ClampedArray]",M="[object Uint16Array]",x="[object Uint32Array]",E=/\w*$/,$=/^\[object .+?Constructor\]$/,k=/^(?:0|[1-9]\d*)$/,T={};T[i]=T["[object Array]"]=T[b]=T[v]=T[a]=T[c]=T[_]=T[w]=T[j]=T[O]=T[C]=T[l]=T[f]=T[h]=T[g]=T[d]=T[y]=T[m]=T[A]=T[S]=T[M]=T[x]=!0,T["[object Error]"]=T[u]=T["[object WeakMap]"]=!1;var B="object"==typeof p&&p&&p.Object===Object&&p,F="object"==typeof self&&self&&self.Object===Object&&self,I=B||F||Function("return this")(),P=e&&!e.nodeType&&e,L=P&&t&&!t.nodeType&&t,N=L&&L.exports===P;function R(t,e){return t.set(e[0],e[1]),t}function W(t,e){return t.add(e),t}function D(t,e,r,n){var o=-1,i=t?t.length:0;for(n&&i&&(r=t[++o]);++o<i;)r=e(r,t[o],o,t);return r}function H(t){var e=!1;if(null!=t&&"function"!=typeof t.toString)try{e=!!(t+"")}catch(t){}return e}function q(t){var e=-1,r=Array(t.size);return t.forEach((function(t,n){r[++e]=[n,t]})),r}function J(t,e){return function(r){return t(e(r))}}function z(t){var e=-1,r=Array(t.size);return t.forEach((function(t){r[++e]=t})),r}var U,Z=Array.prototype,G=Function.prototype,V=Object.prototype,K=I["__core-js_shared__"],Q=(U=/[^.]+$/.exec(K&&K.keys&&K.keys.IE_PROTO||""))?"Symbol(src)_1."+U:"",X=G.toString,Y=V.hasOwnProperty,tt=V.toString,et=RegExp("^"+X.call(Y).replace(/[\\^$.*+?()[\]{}|]/g,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$"),rt=N?I.Buffer:void 0,nt=I.Symbol,ot=I.Uint8Array,it=J(Object.getPrototypeOf,Object),at=Object.create,ct=V.propertyIsEnumerable,ut=Z.splice,st=Object.getOwnPropertySymbols,lt=rt?rt.isBuffer:void 0,ft=J(Object.keys,Object),ht=Lt(I,"DataView"),pt=Lt(I,"Map"),gt=Lt(I,"Promise"),dt=Lt(I,"Set"),yt=Lt(I,"WeakMap"),mt=Lt(Object,"create"),bt=Ht(ht),vt=Ht(pt),_t=Ht(gt),wt=Ht(dt),jt=Ht(yt),Ot=nt?nt.prototype:void 0,Ct=Ot?Ot.valueOf:void 0;function At(t){var e=-1,r=t?t.length:0;for(this.clear();++e<r;){var n=t[e];this.set(n[0],n[1])}}function St(t){var e=-1,r=t?t.length:0;for(this.clear();++e<r;){var n=t[e];this.set(n[0],n[1])}}function Mt(t){var e=-1,r=t?t.length:0;for(this.clear();++e<r;){var n=t[e];this.set(n[0],n[1])}}function xt(t){this.__data__=new St(t)}function Et(t,e){var r=Jt(t)||function(t){return function(t){return function(t){return!!t&&"object"==typeof t}(t)&&zt(t)}(t)&&Y.call(t,"callee")&&(!ct.call(t,"callee")||tt.call(t)==i)}(t)?function(t,e){for(var r=-1,n=Array(t);++r<t;)n[r]=e(r);return n}(t.length,String):[],n=r.length,o=!!n;for(var a in t)!e&&!Y.call(t,a)||o&&("length"==a||Wt(a,n))||r.push(a);return r}function $t(t,e,r){var n=t[e];Y.call(t,e)&&qt(n,r)&&(void 0!==r||e in t)||(t[e]=r)}function kt(t,e){for(var r=t.length;r--;)if(qt(t[r][0],e))return r;return-1}function Tt(t,e,r,n,o,p,$){var k;if(n&&(k=p?n(t,o,p,$):n(t)),void 0!==k)return k;if(!Gt(t))return t;var B=Jt(t);if(B){if(k=function(t){var e=t.length,r=t.constructor(e);e&&"string"==typeof t[0]&&Y.call(t,"index")&&(r.index=t.index,r.input=t.input);return r}(t),!e)return function(t,e){var r=-1,n=t.length;e||(e=Array(n));for(;++r<n;)e[r]=t[r];return e}(t,k)}else{var F=Rt(t),I=F==u||F==s;if(Ut(t))return function(t,e){if(e)return t.slice();var r=new t.constructor(t.length);return t.copy(r),r}(t,e);if(F==h||F==i||I&&!p){if(H(t))return p?t:{};if(k=function(t){return"function"!=typeof t.constructor||Dt(t)?{}:(e=it(t),Gt(e)?at(e):{});var e}(I?{}:t),!e)return function(t,e){return It(t,Nt(t),e)}(t,function(t,e){return t&&It(e,Vt(e),t)}(k,t))}else{if(!T[F])return p?t:{};k=function(t,e,r,n){var o=t.constructor;switch(e){case b:return Ft(t);case a:case c:return new o(+t);case v:return function(t,e){var r=e?Ft(t.buffer):t.buffer;return new t.constructor(r,t.byteOffset,t.byteLength)}(t,n);case _:case w:case j:case O:case C:case A:case S:case M:case x:return function(t,e){var r=e?Ft(t.buffer):t.buffer;return new t.constructor(r,t.byteOffset,t.length)}(t,n);case l:return function(t,e,r){return D(e?r(q(t),!0):q(t),R,new t.constructor)}(t,n,r);case f:case y:return new o(t);case g:return(s=new(u=t).constructor(u.source,E.exec(u))).lastIndex=u.lastIndex,s;case d:return function(t,e,r){return D(e?r(z(t),!0):z(t),W,new t.constructor)}(t,n,r);case m:return i=t,Ct?Object(Ct.call(i)):{}}var i;var u,s}(t,F,Tt,e)}}$||($=new xt);var P=$.get(t);if(P)return P;if($.set(t,k),!B)var L=r?function(t){return function(t,e,r){var n=e(t);return Jt(t)?n:function(t,e){for(var r=-1,n=e.length,o=t.length;++r<n;)t[o+r]=e[r];return t}(n,r(t))}(t,Vt,Nt)}(t):Vt(t);return function(t,e){for(var r=-1,n=t?t.length:0;++r<n&&!1!==e(t[r],r,t););}(L||t,(function(o,i){L&&(o=t[i=o]),$t(k,i,Tt(o,e,r,n,i,t,$))})),k}function Bt(t){return!(!Gt(t)||function(t){return!!Q&&Q in t}(t))&&(Zt(t)||H(t)?et:$).test(Ht(t))}function Ft(t){var e=new t.constructor(t.byteLength);return new ot(e).set(new ot(t)),e}function It(t,e,r,n){r||(r={});for(var o=-1,i=e.length;++o<i;){var a=e[o],c=n?n(r[a],t[a],a,r,t):void 0;$t(r,a,void 0===c?t[a]:c)}return r}function Pt(t,e){var r,n,o=t.__data__;return("string"==(n=typeof(r=e))||"number"==n||"symbol"==n||"boolean"==n?"__proto__"!==r:null===r)?o["string"==typeof e?"string":"hash"]:o.map}function Lt(t,e){var r=function(t,e){return null==t?void 0:t[e]}(t,e);return Bt(r)?r:void 0}At.prototype.clear=function(){this.__data__=mt?mt(null):{}},At.prototype.delete=function(t){return this.has(t)&&delete this.__data__[t]},At.prototype.get=function(t){var e=this.__data__;if(mt){var r=e[t];return r===n?void 0:r}return Y.call(e,t)?e[t]:void 0},At.prototype.has=function(t){var e=this.__data__;return mt?void 0!==e[t]:Y.call(e,t)},At.prototype.set=function(t,e){return this.__data__[t]=mt&&void 0===e?n:e,this},St.prototype.clear=function(){this.__data__=[]},St.prototype.delete=function(t){var e=this.__data__,r=kt(e,t);return!(r<0)&&(r==e.length-1?e.pop():ut.call(e,r,1),!0)},St.prototype.get=function(t){var e=this.__data__,r=kt(e,t);return r<0?void 0:e[r][1]},St.prototype.has=function(t){return kt(this.__data__,t)>-1},St.prototype.set=function(t,e){var r=this.__data__,n=kt(r,t);return n<0?r.push([t,e]):r[n][1]=e,this},Mt.prototype.clear=function(){this.__data__={hash:new At,map:new(pt||St),string:new At}},Mt.prototype.delete=function(t){return Pt(this,t).delete(t)},Mt.prototype.get=function(t){return Pt(this,t).get(t)},Mt.prototype.has=function(t){return Pt(this,t).has(t)},Mt.prototype.set=function(t,e){return Pt(this,t).set(t,e),this},xt.prototype.clear=function(){this.__data__=new St},xt.prototype.delete=function(t){return this.__data__.delete(t)},xt.prototype.get=function(t){return this.__data__.get(t)},xt.prototype.has=function(t){return this.__data__.has(t)},xt.prototype.set=function(t,e){var n=this.__data__;if(n instanceof St){var o=n.__data__;if(!pt||o.length<r-1)return o.push([t,e]),this;n=this.__data__=new Mt(o)}return n.set(t,e),this};var Nt=st?J(st,Object):function(){return[]},Rt=function(t){return tt.call(t)};function Wt(t,e){return!!(e=null==e?o:e)&&("number"==typeof t||k.test(t))&&t>-1&&t%1==0&&t<e}function Dt(t){var e=t&&t.constructor;return t===("function"==typeof e&&e.prototype||V)}function Ht(t){if(null!=t){try{return X.call(t)}catch(t){}try{return t+""}catch(t){}}return""}function qt(t,e){return t===e||t!=t&&e!=e}(ht&&Rt(new ht(new ArrayBuffer(1)))!=v||pt&&Rt(new pt)!=l||gt&&"[object Promise]"!=Rt(gt.resolve())||dt&&Rt(new dt)!=d||yt&&"[object WeakMap]"!=Rt(new yt))&&(Rt=function(t){var e=tt.call(t),r=e==h?t.constructor:void 0,n=r?Ht(r):void 0;if(n)switch(n){case bt:return v;case vt:return l;case _t:return"[object Promise]";case wt:return d;case jt:return"[object WeakMap]"}return e});var Jt=Array.isArray;function zt(t){return null!=t&&function(t){return"number"==typeof t&&t>-1&&t%1==0&&t<=o}(t.length)&&!Zt(t)}var Ut=lt||function(){return!1};function Zt(t){var e=Gt(t)?tt.call(t):"";return e==u||e==s}function Gt(t){var e=typeof t;return!!t&&("object"==e||"function"==e)}function Vt(t){return zt(t)?Et(t):function(t){if(!Dt(t))return ft(t);var e=[];for(var r in Object(t))Y.call(t,r)&&"constructor"!=r&&e.push(r);return e}(t)}t.exports=function(t){return Tt(t,!0,!0)}}));function W(t,e){return function(t,e,r){if("string"!=typeof t||!t.length)return null;if(e&&"number"==typeof e||(e=0),!t[e+1])return null;if(t[e+1]&&(!r&&t[e+1].trim().length||r&&(t[e+1].trim().length||"\n\r".includes(t[e+1]))))return e+1;if(t[e+2]&&(!r&&t[e+2].trim().length||r&&(t[e+2].trim().length||"\n\r".includes(t[e+2]))))return e+2;for(let n=e+1,o=t.length;n<o;n++)if(t[n]&&(!r&&t[n].trim().length||r&&(t[n].trim().length||"\n\r".includes(t[n]))))return n;return null}(t,e,!1)}function D(t,e){return function(t,e,r){if("string"!=typeof t||!t.length)return null;if(e&&"number"==typeof e||(e=0),e<1)return null;if(t[e-1]&&(!r&&t[e-1].trim().length||r&&(t[e-1].trim().length||"\n\r".includes(t[e-1]))))return e-1;if(t[e-2]&&(!r&&t[e-2].trim().length||r&&(t[e-2].trim().length||"\n\r".includes(t[e-2]))))return e-2;for(let n=e;n--;)if(t[n]&&(!r&&t[n].trim().length||r&&(t[n].trim().length||"\n\r".includes(t[n]))))return n;return null}(t,e,!1)}const H="\\",q=["a","abbr","acronym","address","applet","area","article","aside","audio","b","base","basefont","bdi","bdo","big","blockquote","body","br","button","canvas","caption","center","cite","code","col","colgroup","data","datalist","dd","del","details","dfn","dialog","dir","div","dl","doctype","dt","em","embed","fieldset","figcaption","figure","font","footer","form","frame","frameset","h1","h1 - h6","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","iframe","img","input","ins","kbd","keygen","label","legend","li","link","main","map","mark","math","menu","menuitem","meta","meter","nav","noframes","noscript","object","ol","optgroup","option","output","p","param","picture","pre","progress","q","rb","rp","rt","rtc","ruby","s","samp","script","section","select","slot","small","source","span","strike","strong","style","sub","summary","sup","svg","table","tbody","td","template","textarea","tfoot","th","thead","time","title","tr","track","tt","u","ul","var","video","wbr","xml"];function J(t){return void 0===t||t.toUpperCase()===t.toLowerCase()&&!"0123456789".includes(t)}function z(t,e=0){const r=e?t.slice(e):t;let n=!1;return/^<[\\ \t\r\n/]*\w+[\\ \t\r\n/]*>/g.test(r)?n=!0:/^<\s*\w+\s+\w+\s*=\s*['"]/g.test(r)?n=!0:/^<\s*\/?\s*\w+\s*\/?\s*>/g.test(r)?n=!0:/^<[\\ \t\r\n/]*\w+(?:\s*\w+)*\s*\w+=['"]/g.test(r)?n=!0:"<"===t[e]&&t[e+1]&&(!J(t[e+1])&&N(t,e,q,{cb:J,i:!0,trimCharsBeforeMatching:["/",H,"!"," ","\t","\n","\r"]})||J(t[e+1])&&N(t,e,q,{cb:(e,r,n)=>(void 0===e||e.toUpperCase()===e.toLowerCase()&&!"0123456789".includes(e))&&("/"===t[W(t,n-1)]||">"===t[W(t,n-1)]),i:!0,trimCharsBeforeMatching:["/",H,"!"," ","\t","\n","\r"]}))&&(n=!0),"string"==typeof t&&e<t.length&&n}function U(t){return"string"==typeof t}function Z(t){return"number"==typeof t}function G(t){return U(t)&&1===t.length&&(t.charCodeAt(0)>64&&t.charCodeAt(0)<91||t.charCodeAt(0)>96&&t.charCodeAt(0)<123)}function V(t){for(var e="",r=0,n=t.length;r<n;r++)e="{"===t[r]?"}".concat(e):"("===t[r]?")".concat(e):"".concat(t[r]).concat(e);return e}var K={reportProgressFunc:null,reportProgressFuncFrom:0,reportProgressFuncTo:100},Q="{}%-$_()*|";return function(e,r,n){if(!U(e))throw void 0===e?new Error("codsen-tokenizer: [THROW_ID_01] the first input argument is completely missing! It should be given as string."):new Error('codsen-tokenizer: [THROW_ID_02] the first input argument must be string! It was given as "'.concat(t(e),'", equal to:\n').concat(JSON.stringify(e,null,4)));if("function"!=typeof r)throw new Error("codsen-tokenizer: [THROW_ID_03] the second input argument, callback function, should be a function but it was given as type ".concat(t(r),", equal to ").concat(JSON.stringify(r,null,4)));if(n&&!h(n))throw new Error("codsen-tokenizer: [THROW_ID_04] the third input argument, options object, should be a plain object but it was given as type ".concat(t(n),", equal to ").concat(JSON.stringify(n,null,4)));var o,i=Object.assign({},K,n);if(i.reportProgressFunc&&"function"!=typeof i.reportProgressFunc)throw new TypeError("codsen-tokenizer: [THROW_ID_05] opts.reportProgressFunc should be a function but it was given as :\n".concat(JSON.stringify(i.reportProgressFunc,null,4)," (").concat(t(i.reportProgressFunc),")"));var a,c=0,u=e.length,s=Math.floor(u/2),l=!1,f={},p={type:null,start:null,end:null,tail:null,kind:null};function g(){f=Object.assign({},p)}g();var d=[];function y(t,e){if(!d.length)return!1;if("simple"===d[d.length-1].type)return t[e]===d[d.length-1].value;if("esp"===d[d.length-1].type){if(!Q.includes(t[e]))return!1;for(var r="",n=t.length,o=e;o<n&&Q.includes(t[o]);o++)r+=t[o];return d[d.length-1].value.split("").every((function(t){return r.includes(t)}))}}function m(t){r(R(t)),g()}function b(t,r){"text"!==t.type&&null!==t.start&&e[r-1]&&!e[r-1].trim().length&&(t.end=D(e,r)+1,m(t),t.start=D(e,r)+1,t.type="text"),null!==t.start&&(t.end=r,m(t))}for(var v=0;v<u;v++){if(i.reportProgressFunc&&(u>1e3&&u<2e3?v===s&&i.reportProgressFunc(Math.floor((i.reportProgressFuncTo-i.reportProgressFuncFrom)/2)):u>=2e3&&(o=i.reportProgressFuncFrom+Math.floor(v/u*(i.reportProgressFuncTo-i.reportProgressFuncFrom)))!==c&&(c=o,i.reportProgressFunc(o))),Number.isInteger(a)&&v>=a&&(a=!1),f.end&&f.end===v&&("style"===f.kind&&(l=!0),b(f,v)),!a&&["html"].includes(f.type)&&['"',"'"].includes(e[v])&&(y(e,v)?d.pop():d.length&&"esp"===d[d.length-1].type||d.push({type:"simple",value:e[v]})),!a)if(d.length||"<"!==e[v]||!z(e,v)&&!N(e,v,["!--","!doctype","?xml"],{i:!0})||"esp"===f.type&&!f.tail.includes(e[v]))if("html"===f.type&&"comment"===f.kind||!Q.includes(e[v])||!e[v+1]||!Q.includes(e[v+1])||"-"===e[v]&&"-"===e[v+1])null!==f.start&&f.end!==v||(l?e[v].trim().length?(f.start=v,f.type="css"):(f.start=v,f.type="text",f.end=W(e,v)||e.length,m(f),W(e,v)&&(f.start=W(e,v),f.type="css",a=W(e,v))):(f.start=v,f.type="text"));else{for(var _="",w=v;w<u&&Q.includes(e[w]);w++)_+=e[w];["html","esp"].includes(f.type)?"html"===f.type&&(y(e,v)?d.pop():d.push({type:"esp",value:V(_)})):(b(f,v),f.start=v,f.type="esp",a=v+_.length,f.tail=V(_))}else f.type&&b(f,v),f.start=v,f.type="html",f=Object.assign({tagNameStartAt:null,tagNameEndAt:null,tagName:null,recognised:null,closing:!1,selfClosing:!1,pureHTML:!0,esp:[]},f),N(e,v,"!--")?f.kind="comment":N(e,v,"!doctype",{i:!0})?f.kind="doctype":N(e,v,"?xml",{i:!0})?f.kind="xml":N(e,v,"style",{i:!0,trimCharsBeforeMatching:"/"})&&(f.kind="style");if(!a)if("html"!==f.type||d.length||">"!==e[v]){if("esp"===f.type&&null===f.end&&U(f.tail)&&f.tail.includes(e[v])){for(var j="",O=v;O<u&&Q.includes(e[O]);O++)j+=e[O];f.end=v+j.length,a=v+j.length}}else f.end=v+1,"html"===f.type&&"/"===e[D(e,v)]&&(f.selfClosing=!0);"html"===f.type&&Z(f.tagNameStartAt)&&!Z(f.tagNameEndAt)&&(G(e[v])||(f.tagNameEndAt=v,f.tagName=e.slice(f.tagNameStartAt,v))),"html"===f.type&&!Z(f.tagNameStartAt)&&Z(f.start)&&f.start<v&&("/"===e[v]?f.closing=!0:G(e[v])&&(f.tagNameStartAt=v,f.closing||(f.closing=!1))),e[v+1]||null===f.start||(f.end=v+1,m(f))}}}));
