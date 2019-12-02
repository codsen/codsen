/**
 * js-row-num
 * Update all row numbers in all console.logs in JS code
 * Version: 2.5.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/js-row-num
 */

!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e=e||self).jsRowNum=t()}(this,(function(){"use strict";const e=" ";function t(t,r=!0,n){if(!(n.trim().length||t.length&&"\n"!==n&&n!==e&&" "===(r?t[t.length-1]:t[0])||t.length&&"\n"===(r?t[t.length-1]:t[0])&&"\n"!==n&&n!==e))if(r){if(("\n"===n||n===e)&&t.length&&" "===t[t.length-1])for(;t.length&&" "===t[t.length-1];)t.pop();t.push(n===e||"\n"===n?n:" ")}else{if(("\n"===n||n===e)&&t.length&&" "===t[0])for(;t.length&&" "===t[0];)t.shift();t.unshift(n===e||"\n"===n?n:" ")}}function r(e,r){if("string"==typeof e&&e.length){let n,o,i=!1;if(e.includes("\r\n")&&(i=!0),n=r&&"number"==typeof r?r:1,""===e.trim()){const r=[];for(o=n,Array.from(e).forEach(e=>{("\n"!==e||o)&&("\n"===e&&o--,t(r,!0,e))});r.length>1&&" "===r[r.length-1];)r.pop();return r.join("")}const s=[];if(o=n,""===e[0].trim())for(let r=0,n=e.length;r<n&&0===e[r].trim().length;r++)("\n"!==e[r]||o)&&("\n"===e[r]&&o--,t(s,!0,e[r]));const a=[];if(o=n,""===e.slice(-1).trim())for(let r=e.length;r--&&0===e[r].trim().length;)("\n"!==e[r]||o)&&("\n"===e[r]&&o--,t(a,!1,e[r]));return i?`${s.join("")}${e.trim()}${a.join("")}`.replace(/\n/g,"\r\n"):s.join("")+e.trim()+a.join("")}return e}var n=function(e,t){if("string"!=typeof e)return!1;if(t&&"includeZero"in t){if("boolean"!=typeof t.includeZero)throw new TypeError(String(t.includeZero)+" is neither true nor false. `includeZero` option must be a Boolean value.");if(t.includeZero)return/^(-?0|[1-9]\d*)(\.0+)?$/.test(e)}return/^[1-9]\d*(\.0+)?$/.test(e)},o=function(e,t){if(t){if("object"!=typeof t)throw new TypeError(String(t)+" is not an object. Expected an object that has boolean `includeZero` property.");if("includeZero"in t){if("boolean"!=typeof t.includeZero)throw new TypeError(String(t.includeZero)+" is neither true nor false. `includeZero` option must be a Boolean value.");if(t.includeZero&&0===e)return!0}}return Number.isSafeInteger(e)&&e>=1};const i=Array.isArray;function s(e,t){if(!i(e))throw new TypeError(`ranges-sort: [THROW_ID_01] Input must be an array, consisting of range arrays! Currently its type is: ${typeof e}, equal to: ${JSON.stringify(e,null,4)}`);if(0===e.length)return e;const r=Object.assign({},{strictlyTwoElementsInRangeArrays:!1,progressFn:null},t);let n,s;if(r.strictlyTwoElementsInRangeArrays&&!e.every((e,t)=>2===e.length||(n=t,s=e.length,!1)))throw new TypeError(`ranges-sort: [THROW_ID_03] The first argument should be an array and must consist of arrays which are natural number indexes representing TWO string index ranges. However, ${n}th range (${JSON.stringify(e[n],null,4)}) has not two but ${s} elements!`);if(!e.every((e,t)=>!(!o(e[0],{includeZero:!0})||!o(e[1],{includeZero:!0}))||(n=t,!1)))throw new TypeError(`ranges-sort: [THROW_ID_04] The first argument should be an array and must consist of arrays which are natural number indexes representing string index ranges. However, ${n}th range (${JSON.stringify(e[n],null,4)}) does not consist of only natural numbers!`);const a=e.length*e.length;let u=0;return Array.from(e).sort((e,t)=>(r.progressFn&&(u++,r.progressFn(Math.floor(100*u/a))),e[0]===t[0]?e[1]<t[1]?-1:e[1]>t[1]?1:0:e[0]<t[0]?-1:1))}var a="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{};var u=function(e,t){return e(t={exports:{}},t.exports),t.exports}((function(e,t){var r=200,n="__lodash_hash_undefined__",o=9007199254740991,i="[object Arguments]",s="[object Boolean]",u="[object Date]",l="[object Function]",c="[object GeneratorFunction]",f="[object Map]",p="[object Number]",g="[object Object]",h="[object RegExp]",y="[object Set]",d="[object String]",m="[object Symbol]",_="[object ArrayBuffer]",b="[object DataView]",v="[object Float32Array]",w="[object Float64Array]",T="[object Int8Array]",O="[object Int16Array]",j="[object Int32Array]",$="[object Uint8Array]",S="[object Uint8ClampedArray]",R="[object Uint16Array]",I="[object Uint32Array]",E=/\w*$/,A=/^\[object .+?Constructor\]$/,N=/^(?:0|[1-9]\d*)$/,W={};W[i]=W["[object Array]"]=W[_]=W[b]=W[s]=W[u]=W[v]=W[w]=W[T]=W[O]=W[j]=W[f]=W[p]=W[g]=W[h]=W[y]=W[d]=W[m]=W[$]=W[S]=W[R]=W[I]=!0,W["[object Error]"]=W[l]=W["[object WeakMap]"]=!1;var x="object"==typeof a&&a&&a.Object===Object&&a,Z="object"==typeof self&&self&&self.Object===Object&&self,F=x||Z||Function("return this")(),D=t&&!t.nodeType&&t,H=D&&e&&!e.nodeType&&e,J=H&&H.exports===D;function C(e,t){return e.set(t[0],t[1]),e}function k(e,t){return e.add(t),e}function M(e,t,r,n){var o=-1,i=e?e.length:0;for(n&&i&&(r=e[++o]);++o<i;)r=t(r,e[o],o,e);return r}function q(e){var t=!1;if(null!=e&&"function"!=typeof e.toString)try{t=!!(e+"")}catch(e){}return t}function B(e){var t=-1,r=Array(e.size);return e.forEach((function(e,n){r[++t]=[n,e]})),r}function P(e,t){return function(r){return e(t(r))}}function L(e){var t=-1,r=Array(e.size);return e.forEach((function(e){r[++t]=e})),r}var z,G=Array.prototype,U=Function.prototype,K=Object.prototype,V=F["__core-js_shared__"],Q=(z=/[^.]+$/.exec(V&&V.keys&&V.keys.IE_PROTO||""))?"Symbol(src)_1."+z:"",X=U.toString,Y=K.hasOwnProperty,ee=K.toString,te=RegExp("^"+X.call(Y).replace(/[\\^$.*+?()[\]{}|]/g,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$"),re=J?F.Buffer:void 0,ne=F.Symbol,oe=F.Uint8Array,ie=P(Object.getPrototypeOf,Object),se=Object.create,ae=K.propertyIsEnumerable,ue=G.splice,le=Object.getOwnPropertySymbols,ce=re?re.isBuffer:void 0,fe=P(Object.keys,Object),pe=He(F,"DataView"),ge=He(F,"Map"),he=He(F,"Promise"),ye=He(F,"Set"),de=He(F,"WeakMap"),me=He(Object,"create"),_e=qe(pe),be=qe(ge),ve=qe(he),we=qe(ye),Te=qe(de),Oe=ne?ne.prototype:void 0,je=Oe?Oe.valueOf:void 0;function $e(e){var t=-1,r=e?e.length:0;for(this.clear();++t<r;){var n=e[t];this.set(n[0],n[1])}}function Se(e){var t=-1,r=e?e.length:0;for(this.clear();++t<r;){var n=e[t];this.set(n[0],n[1])}}function Re(e){var t=-1,r=e?e.length:0;for(this.clear();++t<r;){var n=e[t];this.set(n[0],n[1])}}function Ie(e){this.__data__=new Se(e)}function Ee(e,t){var r=Pe(e)||function(e){return function(e){return function(e){return!!e&&"object"==typeof e}(e)&&Le(e)}(e)&&Y.call(e,"callee")&&(!ae.call(e,"callee")||ee.call(e)==i)}(e)?function(e,t){for(var r=-1,n=Array(e);++r<e;)n[r]=t(r);return n}(e.length,String):[],n=r.length,o=!!n;for(var s in e)!t&&!Y.call(e,s)||o&&("length"==s||ke(s,n))||r.push(s);return r}function Ae(e,t,r){var n=e[t];Y.call(e,t)&&Be(n,r)&&(void 0!==r||t in e)||(e[t]=r)}function Ne(e,t){for(var r=e.length;r--;)if(Be(e[r][0],t))return r;return-1}function We(e,t,r,n,o,a,A){var N;if(n&&(N=a?n(e,o,a,A):n(e)),void 0!==N)return N;if(!Ue(e))return e;var x=Pe(e);if(x){if(N=function(e){var t=e.length,r=e.constructor(t);t&&"string"==typeof e[0]&&Y.call(e,"index")&&(r.index=e.index,r.input=e.input);return r}(e),!t)return function(e,t){var r=-1,n=e.length;t||(t=Array(n));for(;++r<n;)t[r]=e[r];return t}(e,N)}else{var Z=Ce(e),F=Z==l||Z==c;if(ze(e))return function(e,t){if(t)return e.slice();var r=new e.constructor(e.length);return e.copy(r),r}(e,t);if(Z==g||Z==i||F&&!a){if(q(e))return a?e:{};if(N=function(e){return"function"!=typeof e.constructor||Me(e)?{}:(t=ie(e),Ue(t)?se(t):{});var t}(F?{}:e),!t)return function(e,t){return Fe(e,Je(e),t)}(e,function(e,t){return e&&Fe(t,Ke(t),e)}(N,e))}else{if(!W[Z])return a?e:{};N=function(e,t,r,n){var o=e.constructor;switch(t){case _:return Ze(e);case s:case u:return new o(+e);case b:return function(e,t){var r=t?Ze(e.buffer):e.buffer;return new e.constructor(r,e.byteOffset,e.byteLength)}(e,n);case v:case w:case T:case O:case j:case $:case S:case R:case I:return function(e,t){var r=t?Ze(e.buffer):e.buffer;return new e.constructor(r,e.byteOffset,e.length)}(e,n);case f:return function(e,t,r){return M(t?r(B(e),!0):B(e),C,new e.constructor)}(e,n,r);case p:case d:return new o(e);case h:return(l=new(a=e).constructor(a.source,E.exec(a))).lastIndex=a.lastIndex,l;case y:return function(e,t,r){return M(t?r(L(e),!0):L(e),k,new e.constructor)}(e,n,r);case m:return i=e,je?Object(je.call(i)):{}}var i;var a,l}(e,Z,We,t)}}A||(A=new Ie);var D=A.get(e);if(D)return D;if(A.set(e,N),!x)var H=r?function(e){return function(e,t,r){var n=t(e);return Pe(e)?n:function(e,t){for(var r=-1,n=t.length,o=e.length;++r<n;)e[o+r]=t[r];return e}(n,r(e))}(e,Ke,Je)}(e):Ke(e);return function(e,t){for(var r=-1,n=e?e.length:0;++r<n&&!1!==t(e[r],r,e););}(H||e,(function(o,i){H&&(o=e[i=o]),Ae(N,i,We(o,t,r,n,i,e,A))})),N}function xe(e){return!(!Ue(e)||(t=e,Q&&Q in t))&&(Ge(e)||q(e)?te:A).test(qe(e));var t}function Ze(e){var t=new e.constructor(e.byteLength);return new oe(t).set(new oe(e)),t}function Fe(e,t,r,n){r||(r={});for(var o=-1,i=t.length;++o<i;){var s=t[o],a=n?n(r[s],e[s],s,r,e):void 0;Ae(r,s,void 0===a?e[s]:a)}return r}function De(e,t){var r,n,o=e.__data__;return("string"==(n=typeof(r=t))||"number"==n||"symbol"==n||"boolean"==n?"__proto__"!==r:null===r)?o["string"==typeof t?"string":"hash"]:o.map}function He(e,t){var r=function(e,t){return null==e?void 0:e[t]}(e,t);return xe(r)?r:void 0}$e.prototype.clear=function(){this.__data__=me?me(null):{}},$e.prototype.delete=function(e){return this.has(e)&&delete this.__data__[e]},$e.prototype.get=function(e){var t=this.__data__;if(me){var r=t[e];return r===n?void 0:r}return Y.call(t,e)?t[e]:void 0},$e.prototype.has=function(e){var t=this.__data__;return me?void 0!==t[e]:Y.call(t,e)},$e.prototype.set=function(e,t){return this.__data__[e]=me&&void 0===t?n:t,this},Se.prototype.clear=function(){this.__data__=[]},Se.prototype.delete=function(e){var t=this.__data__,r=Ne(t,e);return!(r<0)&&(r==t.length-1?t.pop():ue.call(t,r,1),!0)},Se.prototype.get=function(e){var t=this.__data__,r=Ne(t,e);return r<0?void 0:t[r][1]},Se.prototype.has=function(e){return Ne(this.__data__,e)>-1},Se.prototype.set=function(e,t){var r=this.__data__,n=Ne(r,e);return n<0?r.push([e,t]):r[n][1]=t,this},Re.prototype.clear=function(){this.__data__={hash:new $e,map:new(ge||Se),string:new $e}},Re.prototype.delete=function(e){return De(this,e).delete(e)},Re.prototype.get=function(e){return De(this,e).get(e)},Re.prototype.has=function(e){return De(this,e).has(e)},Re.prototype.set=function(e,t){return De(this,e).set(e,t),this},Ie.prototype.clear=function(){this.__data__=new Se},Ie.prototype.delete=function(e){return this.__data__.delete(e)},Ie.prototype.get=function(e){return this.__data__.get(e)},Ie.prototype.has=function(e){return this.__data__.has(e)},Ie.prototype.set=function(e,t){var n=this.__data__;if(n instanceof Se){var o=n.__data__;if(!ge||o.length<r-1)return o.push([e,t]),this;n=this.__data__=new Re(o)}return n.set(e,t),this};var Je=le?P(le,Object):function(){return[]},Ce=function(e){return ee.call(e)};function ke(e,t){return!!(t=null==t?o:t)&&("number"==typeof e||N.test(e))&&e>-1&&e%1==0&&e<t}function Me(e){var t=e&&e.constructor;return e===("function"==typeof t&&t.prototype||K)}function qe(e){if(null!=e){try{return X.call(e)}catch(e){}try{return e+""}catch(e){}}return""}function Be(e,t){return e===t||e!=e&&t!=t}(pe&&Ce(new pe(new ArrayBuffer(1)))!=b||ge&&Ce(new ge)!=f||he&&"[object Promise]"!=Ce(he.resolve())||ye&&Ce(new ye)!=y||de&&"[object WeakMap]"!=Ce(new de))&&(Ce=function(e){var t=ee.call(e),r=t==g?e.constructor:void 0,n=r?qe(r):void 0;if(n)switch(n){case _e:return b;case be:return f;case ve:return"[object Promise]";case we:return y;case Te:return"[object WeakMap]"}return t});var Pe=Array.isArray;function Le(e){return null!=e&&function(e){return"number"==typeof e&&e>-1&&e%1==0&&e<=o}(e.length)&&!Ge(e)}var ze=ce||function(){return!1};function Ge(e){var t=Ue(e)?ee.call(e):"";return t==l||t==c}function Ue(e){var t=typeof e;return!!e&&("object"==t||"function"==t)}function Ke(e){return Le(e)?Ee(e):function(e){if(!Me(e))return fe(e);var t=[];for(var r in Object(e))Y.call(e,r)&&"constructor"!=r&&t.push(r);return t}(e)}e.exports=function(e){return We(e,!0,!0)}})),l="[object Object]";var c,f,p=Function.prototype,g=Object.prototype,h=p.toString,y=g.hasOwnProperty,d=h.call(Object),m=g.toString,_=(c=Object.getPrototypeOf,f=Object,function(e){return c(f(e))});var b=function(e){if(!function(e){return!!e&&"object"==typeof e}(e)||m.call(e)!=l||function(e){var t=!1;if(null!=e&&"function"!=typeof e.toString)try{t=!!(e+"")}catch(e){}return t}(e))return!1;var t=_(e);if(null===t)return!0;var r=y.call(t,"constructor")&&t.constructor;return"function"==typeof r&&r instanceof r&&h.call(r)==d};function v(e,t){function r(e){return"string"==typeof e}if(!Array.isArray(e))return e;const n={mergeType:1,progressFn:null,joinRangesThatTouchEdges:!0};let o;if(t){if(!b(t))throw new Error(`emlint: [THROW_ID_03] the second input argument must be a plain object. It was given as:\n${JSON.stringify(t,null,4)} (type ${typeof t})`);if((o=Object.assign({},n,t)).progressFn&&b(o.progressFn)&&!Object.keys(o.progressFn).length)o.progressFn=null;else if(o.progressFn&&"function"!=typeof o.progressFn)throw new Error(`ranges-merge: [THROW_ID_01] opts.progressFn must be a function! It was given of a type: "${typeof o.progressFn}", equal to ${JSON.stringify(o.progressFn,null,4)}`);if(o.mergeType&&1!==o.mergeType&&2!==o.mergeType)if(r(o.mergeType)&&"1"===o.mergeType.trim())o.mergeType=1;else{if(!r(o.mergeType)||"2"!==o.mergeType.trim())throw new Error(`ranges-merge: [THROW_ID_02] opts.mergeType was customised to a wrong thing! It was given of a type: "${typeof o.mergeType}", equal to ${JSON.stringify(o.mergeType,null,4)}`);o.mergeType=2}if("boolean"!=typeof o.joinRangesThatTouchEdges)throw new Error(`ranges-merge: [THROW_ID_04] opts.joinRangesThatTouchEdges was customised to a wrong thing! It was given of a type: "${typeof o.joinRangesThatTouchEdges}", equal to ${JSON.stringify(o.joinRangesThatTouchEdges,null,4)}`)}else o=u(n);const i=u(e).filter(e=>void 0!==e[2]||e[0]!==e[1]);let a,l,c;const f=(a=o.progressFn?s(i,{progressFn:e=>{(c=Math.floor(e/5))!==l&&(l=c,o.progressFn(c))}}):s(i)).length-1;for(let e=f;e>0;e--)o.progressFn&&(c=Math.floor(78*(1-e/f))+21)!==l&&c>l&&(l=c,o.progressFn(c)),(a[e][0]<=a[e-1][0]||!o.joinRangesThatTouchEdges&&a[e][0]<a[e-1][1]||o.joinRangesThatTouchEdges&&a[e][0]<=a[e-1][1])&&(a[e-1][0]=Math.min(a[e][0],a[e-1][0]),a[e-1][1]=Math.max(a[e][1],a[e-1][1]),void 0!==a[e][2]&&(a[e-1][0]>=a[e][0]||a[e-1][1]<=a[e][1])&&null!==a[e-1][2]&&(null===a[e][2]&&null!==a[e-1][2]?a[e-1][2]=null:void 0!==a[e-1][2]?2===o.mergeType&&a[e-1][0]===a[e][0]?a[e-1][2]=a[e][2]:a[e-1][2]+=a[e][2]:a[e-1][2]=a[e][2]),a.splice(e,1),e=a.length);return a}function w(e){return null!=e}const T=Array.isArray,O=Number.isInteger;function j(e){return"string"==typeof e}function $(e){return n(e,{includeZero:!0})?parseInt(e,10):e}class S{constructor(e){const t=Object.assign({},{limitToBeAddedWhitespace:!1,limitLinebreaksCount:1,mergeType:1},e);if(t.mergeType&&1!==t.mergeType&&2!==t.mergeType)if(j(t.mergeType)&&"1"===t.mergeType.trim())t.mergeType=1;else{if(!j(t.mergeType)||"2"!==t.mergeType.trim())throw new Error(`ranges-push: [THROW_ID_02] opts.mergeType was customised to a wrong thing! It was given of a type: "${typeof t.mergeType}", equal to ${JSON.stringify(t.mergeType,null,4)}`);t.mergeType=2}this.opts=t}add(e,t,i,...s){if(s.length>0)throw new TypeError(`ranges-push/Ranges/add(): [THROW_ID_03] Please don't overload the add() method. From the 4th input argument onwards we see these redundant arguments: ${JSON.stringify(s,null,4)}`);if(!w(e)&&!w(t))return;if(w(e)&&!w(t)){if(T(e)){if(e.length){if(e.some(e=>T(e)))return void e.forEach(e=>{T(e)&&this.add(...e)});e.length>1&&O($(e[0]))&&O($(e[1]))&&this.add(...e)}return}throw new TypeError(`ranges-push/Ranges/add(): [THROW_ID_12] the first input argument, "from" is set (${JSON.stringify(e,null,0)}) but second-one, "to" is not (${JSON.stringify(t,null,0)})`)}if(!w(e)&&w(t))throw new TypeError(`ranges-push/Ranges/add(): [THROW_ID_13] the second input argument, "to" is set (${JSON.stringify(t,null,0)}) but first-one, "from" is not (${JSON.stringify(e,null,0)})`);const a=n(e,{includeZero:!0})?parseInt(e,10):e,u=n(t,{includeZero:!0})?parseInt(t,10):t;if(O(i)&&(i=String(i)),!o(a,{includeZero:!0})||!o(u,{includeZero:!0}))throw o(a,{includeZero:!0})?new TypeError(`ranges-push/Ranges/add(): [THROW_ID_10] "to" value, the second input argument, must be a natural number or zero! Currently it's of a type "${typeof u}" equal to: ${JSON.stringify(u,null,4)}`):new TypeError(`ranges-push/Ranges/add(): [THROW_ID_09] "from" value, the first input argument, must be a natural number or zero! Currently it's of a type "${typeof a}" equal to: ${JSON.stringify(a,null,4)}`);if(w(i)&&!j(i)&&!O(i))throw new TypeError(`ranges-push/Ranges/add(): [THROW_ID_08] The third argument, the value to add, was given not as string but ${typeof i}, equal to:\n${JSON.stringify(i,null,4)}`);if(w(this.slices)&&T(this.last())&&a===this.last()[1]){if(this.last()[1]=u,this.last()[2],null!==this.last()[2]&&w(i)){let e=!(w(this.last()[2])&&this.last()[2].length>0)||this.opts&&this.opts.mergeType&&1!==this.opts.mergeType?i:this.last()[2]+i;this.opts.limitToBeAddedWhitespace&&(e=r(e,this.opts.limitLinebreaksCount)),j(e)&&!e.length||(this.last()[2]=e)}}else{this.slices||(this.slices=[]);const e=void 0===i||j(i)&&!i.length?[a,u]:[a,u,this.opts.limitToBeAddedWhitespace?r(i,this.opts.limitLinebreaksCount):i];this.slices.push(e)}}push(e,t,r,...n){this.add(e,t,r,...n)}current(){return null!=this.slices?(this.slices=v(this.slices,{mergeType:this.opts.mergeType}),this.opts.limitToBeAddedWhitespace?this.slices.map(e=>w(e[2])?[e[0],e[1],r(e[2],this.opts.limitLinebreaksCount)]:e):this.slices):null}wipe(){this.slices=void 0}replace(e){if(T(e)&&e.length){if(!T(e[0])||!O(e[0][0]))throw new Error(`ranges-push/Ranges/replace(): [THROW_ID_11] Single range was given but we expected array of arrays! The first element, ${JSON.stringify(e[0],null,4)} should be an array and its first element should be an integer, a string index.`);this.slices=u(e)}else this.slices=void 0}last(){return void 0!==this.slices&&Array.isArray(this.slices)?this.slices[this.slices.length-1]:null}}const R=Array.isArray;var I="\\";return function(e,t){if("string"!=typeof e||0===e.length)return e;function r(e){return/[0-9]/.test(e)}var i=Object.assign({},{padStart:3,overrideRowNum:null,returnRangesOnly:!1,triggerKeywords:["console.log"],extractedLogContentsWereGiven:!1},t);(!i.padStart||"number"!=typeof i.padStart||"number"==typeof i.padStart&&i.padStart<0)&&(i.padStart=0);var s,a,u=new S,l=e.length,c=null,f=null,p=null,g=1,h=!1,y=null;for(i.padStart&&l>45e3&&(i.padStart=4),s=0;s<l;s++){if(null===i.overrideRowNum&&("\n"===e[s]||"\r"===e[s]&&"\n"!==e[s+1])&&g++,Number.isInteger(y)&&!r(e[s])&&s>y&&(u.push(y,s,i.padStart?String(null!==i.overrideRowNum?i.overrideRowNum:g).padStart(i.padStart,"0"):"".concat(null!==i.overrideRowNum?i.overrideRowNum:g)),y=null,h=!0),c&&Number.isInteger(c.start)&&c.start<s&&!h&&null===y&&r(e[s])&&(y=s),c&&Number.isInteger(c.start)&&c.start<s&&!h&&(a=e[s],/[A-Za-z]/.test(a))&&("n"!==e[s]||e[s-1]!==I)){if("\\"===e[s-1]&&"u"===e[s]&&"0"===e[s+1]&&"0"===e[s+2]&&"1"===e[s+3]&&("b"===e[s+4]||"B"===e[s+5])&&"["===e[s+5]){var d=void 0;r(e[s+6])?d=s+6:"$"===e[s+6]&&"{"===e[s+7]&&r(e[s+8])&&(d=s+8);var m=void 0;if(d)for(var _=d;_<l;_++)if(!r(e[_])){m=_;break}var b=void 0;if("m"===e[m]?b=m:"}"===e[m]&&"m"===e[m+1]&&(b=m+1),!b){h=!0;continue}if("$"===e[b+1]&&"{"===e[b+2]&&"`"===e[b+3]){s=b+3;continue}}h=!0}null!==c&&c.start<s&&c.type===e[s]&&(c=null,f=null,p=null,y=null,h=!1),null===c&&(i.extractedLogContentsWereGiven||f&&f<s&&p&&p<s)&&e[s].trim().length&&('"'===e[s]||"'"===e[s]||"`"===e[s]?((c={}).start=s,c.type=e[s],h=!1):i.extractedLogContentsWereGiven&&r(e[s])&&null===y?y=s:e[s].trim().length&&"/"!==e[s]&&!i.extractedLogContentsWereGiven&&(f=null,p=null,y=null)),!p&&e[s].trim().length&&f&&f<=s&&("("===e[s]?p=s:(f=null,y=null));var w=void 0;i&&i.triggerKeywords&&Array.isArray(i.triggerKeywords)&&i.triggerKeywords.some((function(t){if(e.startsWith(t,s))return w=t,!0}))&&(f=s+w.length,s=s+w.length-1)}return c=null,f=null,p=null,g=1,h=void 0,y=null,g=1,i.returnRangesOnly?u.current():u.current()?function(e,t,r){let i=0,s=0;if(0===arguments.length)throw new Error("ranges-apply: [THROW_ID_01] inputs missing!");if("string"!=typeof e)throw new TypeError(`ranges-apply: [THROW_ID_02] first input argument must be a string! Currently it's: ${typeof e}, equal to: ${JSON.stringify(e,null,4)}`);if(null===t)return e;if(!R(t))throw new TypeError(`ranges-apply: [THROW_ID_03] second input argument must be an array (or null)! Currently it's: ${typeof t}, equal to: ${JSON.stringify(t,null,4)}`);if(r&&"function"!=typeof r)throw new TypeError(`ranges-apply: [THROW_ID_04] the third input argument must be a function (or falsey)! Currently it's: ${typeof r}, equal to: ${JSON.stringify(r,null,4)}`);R(t)&&(o(t[0],{includeZero:!0})||n(t[0],{includeZero:!0}))&&(o(t[1],{includeZero:!0})||n(t[1],{includeZero:!0}))&&(t=[t]);const a=t.length;let u=0;t.forEach((e,l)=>{if(r&&(i=Math.floor(u/a*10))!==s&&(s=i,r(i)),!R(e))throw new TypeError(`ranges-apply: [THROW_ID_05] ranges array, second input arg., has ${l}th element not an array: ${JSON.stringify(e,null,4)}, which is ${typeof e}`);if(!o(e[0],{includeZero:!0})){if(!n(e[0],{includeZero:!0}))throw new TypeError(`ranges-apply: [THROW_ID_06] ranges array, second input arg. has ${l}th element, array [${e[0]},${e[1]}]. That array has first element not an integer, but ${typeof e[0]}, equal to: ${JSON.stringify(e[0],null,4)}. Computer doesn't like this.`);t[l][0]=Number.parseInt(t[l][0],10)}if(!o(e[1],{includeZero:!0})){if(!n(e[1],{includeZero:!0}))throw new TypeError(`ranges-apply: [THROW_ID_07] ranges array, second input arg. has ${l}th element, array [${e[0]},${e[1]}]. That array has second element not an integer, but ${typeof e[1]}, equal to: ${JSON.stringify(e[1],null,4)}. Computer doesn't like this.`);t[l][1]=Number.parseInt(t[l][1],10)}u++});const l=v(t,{progressFn:e=>{r&&(i=10+Math.floor(e/10))!==s&&(s=i,r(i))}}),c=l.length;if(c>0){const t=e.slice(l[c-1][1]);e=l.reduce((t,n,o,a)=>{r&&(i=20+Math.floor(o/c*80))!==s&&(s=i,r(i));const u=0===o?0:a[o-1][1],l=a[o][0];return t+e.slice(u,l)+(function(e){return null!=e}(a[o][2])?a[o][2]:"")},""),e+=t}return e}(e,u.current()):e}}));
