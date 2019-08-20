/**
 * str-indexes-of-plus
 * Search for a string in another string. Get array of indexes. Full Unicode support.
 * Version: 2.9.38
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/str-indexes-of-plus
 */

!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e=e||self).strIndexesOfPlus=t()}(this,function(){"use strict";function e(t){return(e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(t)}var t="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=9007199254740991,r="[object Arguments]",u="[object Function]",o="[object GeneratorFunction]",f="[object Map]",i="[object Set]",c="[object String]",l=/^\[object .+?Constructor\]$/,a=/^(?:0|[1-9]\d*)$/,s="[\\ud800-\\udfff]",d="[\\u0300-\\u036f\\ufe20-\\ufe23\\u20d0-\\u20f0]",p="\\ud83c[\\udffb-\\udfff]",y="[^\\ud800-\\udfff]",b="(?:\\ud83c[\\udde6-\\uddff]){2}",h="[\\ud800-\\udbff][\\udc00-\\udfff]",g="(?:"+d+"|"+p+")"+"?",j="[\\ufe0e\\ufe0f]?"+g+("(?:\\u200d(?:"+[y,b,h].join("|")+")[\\ufe0e\\ufe0f]?"+g+")*"),m="(?:"+[y+d+"?",d,b,h,s].join("|")+")",v=RegExp(p+"(?="+p+")|"+m+j,"g"),w=RegExp("[\\u200d\\ud800-\\udfff\\u0300-\\u036f\\ufe20-\\ufe23\\u20d0-\\u20f0\\ufe0e\\ufe0f]"),O="object"==typeof t&&t&&t.Object===Object&&t,S="object"==typeof self&&self&&self.Object===Object&&self,x=O||S||Function("return this")();function E(e,t){return function(e,t){for(var n=-1,r=e?e.length:0,u=Array(r);++n<r;)u[n]=t(e[n],n,e);return u}(t,function(t){return e[t]})}function Z(e){var t=-1,n=Array(e.size);return e.forEach(function(e,r){n[++t]=[r,e]}),n}function P(e){var t=-1,n=Array(e.size);return e.forEach(function(e){n[++t]=e}),n}function A(e){return function(e){return w.test(e)}(e)?function(e){return e.match(v)||[]}(e):function(e){return e.split("")}(e)}var T,$,I,_=Function.prototype,k=Object.prototype,M=x["__core-js_shared__"],C=(T=/[^.]+$/.exec(M&&M.keys&&M.keys.IE_PROTO||""))?"Symbol(src)_1."+T:"",F=_.toString,R=k.hasOwnProperty,B=k.toString,D=RegExp("^"+F.call(R).replace(/[\\^$.*+?()[\]{}|]/g,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$"),V=x.Symbol,W=V?V.iterator:void 0,z=k.propertyIsEnumerable,N=($=Object.keys,I=Object,function(e){return $(I(e))}),G=re(x,"DataView"),q=re(x,"Map"),H=re(x,"Promise"),J=re(x,"Set"),K=re(x,"WeakMap"),L=fe(G),Q=fe(q),U=fe(H),X=fe(J),Y=fe(K);function ee(e,t){var n=ie(e)||function(e){return function(e){return se(e)&&ce(e)}(e)&&R.call(e,"callee")&&(!z.call(e,"callee")||B.call(e)==r)}(e)?function(e,t){for(var n=-1,r=Array(e);++n<e;)r[n]=t(n);return r}(e.length,String):[],u=n.length,o=!!u;for(var f in e)!t&&!R.call(e,f)||o&&("length"==f||oe(f,u))||n.push(f);return n}function te(e){return!(!ae(e)||function(e){return!!C&&C in e}(e))&&(le(e)||function(e){var t=!1;if(null!=e&&"function"!=typeof e.toString)try{t=!!(e+"")}catch(e){}return t}(e)?D:l).test(fe(e))}function ne(e){if(n=(t=e)&&t.constructor,r="function"==typeof n&&n.prototype||k,t!==r)return N(e);var t,n,r,u=[];for(var o in Object(e))R.call(e,o)&&"constructor"!=o&&u.push(o);return u}function re(e,t){var n=function(e,t){return null==e?void 0:e[t]}(e,t);return te(n)?n:void 0}var ue=function(e){return B.call(e)};function oe(e,t){return!!(t=null==t?n:t)&&("number"==typeof e||a.test(e))&&e>-1&&e%1==0&&e<t}function fe(e){if(null!=e){try{return F.call(e)}catch(e){}try{return e+""}catch(e){}}return""}(G&&"[object DataView]"!=ue(new G(new ArrayBuffer(1)))||q&&ue(new q)!=f||H&&"[object Promise]"!=ue(H.resolve())||J&&ue(new J)!=i||K&&"[object WeakMap]"!=ue(new K))&&(ue=function(e){var t=B.call(e),n="[object Object]"==t?e.constructor:void 0,r=n?fe(n):void 0;if(r)switch(r){case L:return"[object DataView]";case Q:return f;case U:return"[object Promise]";case X:return i;case Y:return"[object WeakMap]"}return t});var ie=Array.isArray;function ce(e){return null!=e&&function(e){return"number"==typeof e&&e>-1&&e%1==0&&e<=n}(e.length)&&!le(e)}function le(e){var t=ae(e)?B.call(e):"";return t==u||t==o}function ae(e){var t=typeof e;return!!e&&("object"==t||"function"==t)}function se(e){return!!e&&"object"==typeof e}function de(e){return e?E(e,function(e){return ce(e)?ee(e):ne(e)}(e)):[]}var pe=function(e){if(!e)return[];if(ce(e))return function(e){return"string"==typeof e||!ie(e)&&se(e)&&B.call(e)==c}(e)?A(e):function(e,t){var n=-1,r=e.length;for(t||(t=Array(r));++n<r;)t[n]=e[n];return t}(e);if(W&&e[W])return function(e){for(var t,n=[];!(t=e.next()).done;)n.push(t.value);return n}(e[W]());var t=ue(e);return(t==f?Z:t==i?P:de)(e)},ye=function(e,t){if(t){if("object"!=typeof t)throw new TypeError(String(t)+" is not an object. Expected an object that has boolean `includeZero` property.");if("includeZero"in t){if("boolean"!=typeof t.includeZero)throw new TypeError(String(t.includeZero)+" is neither true nor false. `includeZero` option must be a Boolean value.");if(t.includeZero&&0===e)return!0}}return Number.isSafeInteger(e)&&e>=1},be=function(e,t){if("string"!=typeof e)return!1;if(t&&"includeZero"in t){if("boolean"!=typeof t.includeZero)throw new TypeError(String(t.includeZero)+" is neither true nor false. `includeZero` option must be a Boolean value.");if(t.includeZero)return/^(-?0|[1-9]\d*)(\.0+)?$/.test(e)}return/^[1-9]\d*(\.0+)?$/.test(e)};function he(e){return null!=e}function ge(e){return"string"==typeof e}return function(t,n,r){if(0===arguments.length)throw new Error("str-indexes-of-plus/strIndexesOfPlus(): inputs missing!");if(!ge(t))throw new TypeError("str-indexes-of-plus/strIndexesOfPlus(): first input argument must be a string! Currently it's: ".concat(e(t)));if(!ge(n))throw new TypeError("str-indexes-of-plus/strIndexesOfPlus(): second input argument must be a string! Currently it's: ".concat(e(n)));if(arguments.length>=3&&!ye(r,{includeZero:!0})&&!be(r,{includeZero:!0}))throw new TypeError("str-indexes-of-plus/strIndexesOfPlus(): third input argument must be a natural number! Currently it's: ".concat(r));be(r,{includeZero:!0})&&(r=Number(r));var u=pe(t),o=pe(n);if(0===u.length||0===o.length||he(r)&&r>=u.length)return[];he(r)||(r=0);for(var f,i=[],c=!1,l=r,a=u.length;l<a;l++)c&&(u[l]===o[l-f]?l-f+1===o.length&&i.push(f):(f=null,c=!1)),c||u[l]===o[0]&&(1===o.length?i.push(l):(c=!0,f=l));return i}});
