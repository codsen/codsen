!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):t.rangesSort=e()}(this,function(){"use strict";function t(t,e){return e={exports:{}},t(e,e.exports),e.exports}function e(t){return t!=t}function r(t,e){return function(t,e){for(var r=-1,n=t?t.length:0,o=Array(n);++r<n;)o[r]=e(t[r],r,t);return o}(e,function(e){return t[e]})}function n(t,e){var r=et(t)||function(t){return function(t){return a(t)&&i(t)}(t)&&z.call(t,"callee")&&(!X.call(t,"callee")||U.call(t)==C)}(t)?function(t,e){for(var r=-1,n=Array(t);++r<t;)n[r]=e(r);return n}(t.length,String):[],n=r.length,o=!!n;for(var u in t)!e&&!z.call(t,u)||o&&("length"==u||function(t,e){return!!(e=null==e?P:e)&&("number"==typeof t||q.test(t))&&t>-1&&t%1==0&&t<e}(u,n))||r.push(u);return r}function o(t){if(!function(t){var e=t&&t.constructor,r="function"==typeof e&&e.prototype||Q;return t===r}(t))return Y(t);var e=[];for(var r in Object(t))z.call(t,r)&&"constructor"!=r&&e.push(r);return e}function i(t){return null!=t&&function(t){return"number"==typeof t&&t>-1&&t%1==0&&t<=P}(t.length)&&!function(t){var e=u(t)?U.call(t):"";return e==D||e==W}(t)}function u(t){var e=void 0===t?"undefined":H(t);return!!t&&("object"==e||"function"==e)}function a(t){return!!t&&"object"==(void 0===t?"undefined":H(t))}function c(t){return t!=t}function f(t,e,r,n){var o=n?function(t,e,r,n){for(var o=r-1,i=t.length;++o<i;)if(n(t[o],e))return o;return-1}:function(t,e,r){if(e!=e)return function(t,e,r,n){for(var o=t.length,i=r+(n?1:-1);n?i--:++i<o;)if(e(t[i],i,t))return i;return-1}(t,c,r);for(var n=r-1,o=t.length;++n<o;)if(t[n]===e)return n;return-1},i=-1,u=e.length,a=t;for(t===e&&(e=function(t,e){var r=-1,n=t.length;e||(e=Array(n));for(;++r<n;)e[r]=t[r];return e}(e)),r&&(a=function(t,e){for(var r=-1,n=t?t.length:0,o=Array(n);++r<n;)o[r]=e(t[r],r,t);return o}(t,function(t){return function(e){return t(e)}}(r)));++i<u;)for(var f=0,s=e[i],y=r?r(s):s;(f=o(a,y,f,n))>-1;)a!==t&&nt.call(a,f,1),nt.call(t,f,1);return t}function s(t,e){return!!(t?t.length:0)&&function(t,e,r){if(e!=e)return function(t,e,r,n){var o=t.length,i=r+(n?1:-1);for(;n?i--:++i<o;)if(e(t[i],i,t))return i;return-1}(t,l,r);var n=r-1,o=t.length;for(;++n<o;)if(t[n]===e)return n;return-1}(t,e,0)>-1}function y(t,e){for(var r=-1,n=t?t.length:0,o=Array(n);++r<n;)o[r]=e(t[r],r,t);return o}function l(t){return t!=t}function p(t){return function(e){return t(e)}}function h(t,e){return t.has(e)}function g(t){var e=-1,r=t?t.length:0;for(this.clear();++e<r;){var n=t[e];this.set(n[0],n[1])}}function m(t){var e=-1,r=t?t.length:0;for(this.clear();++e<r;){var n=t[e];this.set(n[0],n[1])}}function d(t){var e=-1,r=t?t.length:0;for(this.clear();++e<r;){var n=t[e];this.set(n[0],n[1])}}function b(t){var e=-1,r=t?t.length:0;for(this.__data__=new d;++e<r;)this.add(t[e])}function v(t,e){for(var r=t.length;r--;)if(function(t,e){return t===e||t!=t&&e!=e}(t[r][0],e))return r;return-1}function w(t){if(!T(t)||function(t){return!!bt&&bt in t}(t))return!1;return(j(t)||function(t){var e=!1;if(null!=t&&"function"!=typeof t.toString)try{e=!!(t+"")}catch(t){}return e}(t)?St:st).test(function(t){if(null!=t){try{return vt.call(t)}catch(t){}try{return t+""}catch(t){}}return""}(t))}function _(t){return function(t){return function(t){return!!t&&"object"==(void 0===t?"undefined":it(t))}(t)&&function(t){return null!=t&&function(t){return"number"==typeof t&&t>-1&&t%1==0&&t<=at}(t.length)&&!j(t)}(t)}(t)?t:[]}function S(t,e){var r=t.__data__;return function(t){var e=void 0===t?"undefined":it(t);return"string"==e||"number"==e||"symbol"==e||"boolean"==e?"__proto__"!==t:null===t}(e)?r["string"==typeof e?"string":"hash"]:r.map}function O(t,e){var r=function(t,e){return null==t?void 0:t[e]}(t,e);return w(r)?r:void 0}function j(t){var e=T(t)?_t.call(t):"";return e==ct||e==ft}function T(t){var e=void 0===t?"undefined":it(t);return!!t&&("object"==e||"function"==e)}function k(t){return"string"==typeof t?t.length>0?[t]:[]:t}var A="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},E=function(t,e){if(e){if("object"!==(void 0===e?"undefined":A(e)))throw new TypeError(String(e)+" is not an object. Expected an object that has boolean `includeZero` property.");if("includeZero"in e){if("boolean"!=typeof e.includeZero)throw new TypeError(String(e.includeZero)+" is neither true nor false. `includeZero` option must be a Boolean value.");if(e.includeZero&&0===t)return!0}}return Number.isSafeInteger(t)&&t>=1},N="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},M=t(function(t,e){(e=t.exports=function(t){return t+e.suffix(+t)}).suffix=function(t){return 1===Math.floor(t/10)?"th":t%10==1?"st":t%10==2?"nd":t%10==3?"rd":"th"}}),x=(M.suffix,"function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t}),I=t(function(t,e){t.exports=function(){var t="function"==typeof Promise,e="object"===("undefined"==typeof self?"undefined":x(self))?self:N,r="object"===("undefined"==typeof window?"undefined":x(window))&&"document"in window&&"navigator"in window&&"HTMLElement"in window,n="undefined"!=typeof Symbol,o="undefined"!=typeof Map,i="undefined"!=typeof Set,u="undefined"!=typeof WeakMap,a="undefined"!=typeof WeakSet,c="undefined"!=typeof DataView,f=n&&void 0!==Symbol.iterator,s=n&&void 0!==Symbol.toStringTag,y=i&&"function"==typeof Set.prototype.entries,l=o&&"function"==typeof Map.prototype.entries,p=y&&Object.getPrototypeOf((new Set).entries()),h=l&&Object.getPrototypeOf((new Map).entries()),g=f&&"function"==typeof Array.prototype[Symbol.iterator],m=g&&Object.getPrototypeOf([][Symbol.iterator]()),d=f&&"function"==typeof String.prototype[Symbol.iterator],b=d&&Object.getPrototypeOf(""[Symbol.iterator]()),v=8,w=-1;return function(n){var f=void 0===n?"undefined":x(n);if("object"!==f)return f;if(null===n)return"null";if(n===e)return"global";if(Array.isArray(n)&&(!1===s||!(Symbol.toStringTag in n)))return"Array";if(r){if(n===e.location)return"Location";if(n===e.document)return"Document";if(n===(e.navigator||{}).mimeTypes)return"MimeTypeArray";if(n===(e.navigator||{}).plugins)return"PluginArray";if(n instanceof e.HTMLElement&&"BLOCKQUOTE"===n.tagName)return"HTMLQuoteElement";if(n instanceof e.HTMLElement&&"TD"===n.tagName)return"HTMLTableDataCellElement";if(n instanceof e.HTMLElement&&"TH"===n.tagName)return"HTMLTableHeaderCellElement"}var y=s&&n[Symbol.toStringTag];if("string"==typeof y)return y;var l=Object.getPrototypeOf(n);if(l===RegExp.prototype)return"RegExp";if(l===Date.prototype)return"Date";if(t&&l===Promise.prototype)return"Promise";if(i&&l===Set.prototype)return"Set";if(o&&l===Map.prototype)return"Map";if(a&&l===WeakSet.prototype)return"WeakSet";if(u&&l===WeakMap.prototype)return"WeakMap";if(c&&l===DataView.prototype)return"DataView";if(o&&l===h)return"Map Iterator";if(i&&l===p)return"Set Iterator";if(g&&l===m)return"Array Iterator";if(d&&l===b)return"String Iterator";if(null===l)return"Object";return Object.prototype.toString.call(n).slice(v,w)}}()}),H="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},K=1/0,P=9007199254740991,V=1.7976931348623157e308,L=NaN,C="[object Arguments]",D="[object Function]",W="[object GeneratorFunction]",$="[object String]",J="[object Symbol]",R=/^\s+|\s+$/g,Z=/^[-+]0x[0-9a-f]+$/i,F=/^0b[01]+$/i,B=/^0o[0-7]+$/i,q=/^(?:0|[1-9]\d*)$/,G=parseInt,Q=Object.prototype,z=Q.hasOwnProperty,U=Q.toString,X=Q.propertyIsEnumerable,Y=function(t,e){return function(r){return t(e(r))}}(Object.keys,Object),tt=Math.max,et=Array.isArray,rt=function(t,c,f,s){t=i(t)?t:function(t){return t?r(t,function(t){return i(t)?n(t):o(t)}(t)):[]}(t),f=f&&!s?function(t){var e=function(t){if(!t)return 0===t?t:0;if((t=function(t){if("number"==typeof t)return t;if(function(t){return"symbol"==(void 0===t?"undefined":H(t))||a(t)&&U.call(t)==J}(t))return L;if(u(t)){var e="function"==typeof t.valueOf?t.valueOf():t;t=u(e)?e+"":e}if("string"!=typeof t)return 0===t?t:+t;t=t.replace(R,"");var r=F.test(t);return r||B.test(t)?G(t.slice(2),r?2:8):Z.test(t)?L:+t}(t))===K||t===-K){var e=t<0?-1:1;return e*V}return t==t?t:0}(t),r=e%1;return e==e?r?e-r:e:0}(f):0;var y=t.length;return f<0&&(f=tt(y+f,0)),function(t){return"string"==typeof t||!et(t)&&a(t)&&U.call(t)==$}(t)?f<=y&&t.indexOf(c,f)>-1:!!y&&function(t,r,n){if(r!=r)return function(t,e,r,n){for(var o=t.length,i=r+(n?1:-1);n?i--:++i<o;)if(e(t[i],i,t))return i;return-1}(t,e,n);for(var o=n-1,i=t.length;++o<i;)if(t[o]===r)return o;return-1}(t,c,f)>-1},nt=Array.prototype.splice,ot=function(t,e){return t&&t.length&&e&&e.length?f(t,e):t},it="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},ut="__lodash_hash_undefined__",at=9007199254740991,ct="[object Function]",ft="[object GeneratorFunction]",st=/^\[object .+?Constructor\]$/,yt="object"==it(N)&&N&&N.Object===Object&&N,lt="object"==("undefined"==typeof self?"undefined":it(self))&&self&&self.Object===Object&&self,pt=yt||lt||Function("return this")(),ht=Array.prototype,gt=Function.prototype,mt=Object.prototype,dt=pt["__core-js_shared__"],bt=function(){var t=/[^.]+$/.exec(dt&&dt.keys&&dt.keys.IE_PROTO||"");return t?"Symbol(src)_1."+t:""}(),vt=gt.toString,wt=mt.hasOwnProperty,_t=mt.toString,St=RegExp("^"+vt.call(wt).replace(/[\\^$.*+?()[\]{}|]/g,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$"),Ot=ht.splice,jt=Math.max,Tt=Math.min,kt=O(pt,"Map"),At=O(Object,"create");g.prototype.clear=function(){this.__data__=At?At(null):{}},g.prototype.delete=function(t){return this.has(t)&&delete this.__data__[t]},g.prototype.get=function(t){var e=this.__data__;if(At){var r=e[t];return r===ut?void 0:r}return wt.call(e,t)?e[t]:void 0},g.prototype.has=function(t){var e=this.__data__;return At?void 0!==e[t]:wt.call(e,t)},g.prototype.set=function(t,e){return this.__data__[t]=At&&void 0===e?ut:e,this},m.prototype.clear=function(){this.__data__=[]},m.prototype.delete=function(t){var e=this.__data__,r=v(e,t);return!(r<0||(r==e.length-1?e.pop():Ot.call(e,r,1),0))},m.prototype.get=function(t){var e=this.__data__,r=v(e,t);return r<0?void 0:e[r][1]},m.prototype.has=function(t){return v(this.__data__,t)>-1},m.prototype.set=function(t,e){var r=this.__data__,n=v(r,t);return n<0?r.push([t,e]):r[n][1]=e,this},d.prototype.clear=function(){this.__data__={hash:new g,map:new(kt||m),string:new g}},d.prototype.delete=function(t){return S(this,t).delete(t)},d.prototype.get=function(t){return S(this,t).get(t)},d.prototype.has=function(t){return S(this,t).has(t)},d.prototype.set=function(t,e){return S(this,t).set(t,e),this},b.prototype.add=b.prototype.push=function(t){return this.__data__.set(t,ut),this},b.prototype.has=function(t){return this.__data__.has(t)};var Et=function(t,e){return e=jt(void 0===e?t.length-1:e,0),function(){for(var r=arguments,n=-1,o=jt(r.length-e,0),i=Array(o);++n<o;)i[n]=r[e+n];n=-1;for(var u=Array(e+1);++n<e;)u[n]=r[n];return u[e]=i,function(t,e,r){switch(r.length){case 0:return t.call(e);case 1:return t.call(e,r[0]);case 2:return t.call(e,r[0],r[1]);case 3:return t.call(e,r[0],r[1],r[2])}return t.apply(e,r)}(t,this,u)}}(function(t){var e=y(t,_);return e.length&&e[0]===t[0]?function(t,e,r){for(var n=r?function(t,e,r){for(var n=-1,o=t?t.length:0;++n<o;)if(r(e,t[n]))return!0;return!1}:s,o=t[0].length,i=t.length,u=i,a=Array(i),c=1/0,f=[];u--;){var l=t[u];u&&e&&(l=y(l,p(e))),c=Tt(l.length,c),a[u]=!r&&(e||o>=120&&l.length>=120)?new b(u&&l):void 0}l=t[0];var g=-1,m=a[0];t:for(;++g<o&&f.length<c;){var d=l[g],v=e?e(d):d;if(d=r||0!==d?d:0,!(m?h(m,v):n(f,v,r))){for(u=i;--u;){var w=a[u];if(!(w?h(w,v):n(t[u],v,r)))continue t}m&&m.push(v),f.push(d)}}return f}(e):[]}),Nt=Object.freeze({default:k}),Mt=Nt&&k||Nt,xt=function(t,e,r){function n(t){return null!=t}function o(t){return"boolean"===I(t)}function i(t){return"string"===I(t)}function u(t){return"Object"===I(t)}var a=["any","anything","every","everything","all","whatever","whatevs"],c=Array.isArray;if(0===arguments.length)throw new Error("check-types-mini/checkTypes(): Missing all arguments!");if(1===arguments.length)throw new Error("check-types-mini/checkTypes(): Missing second argument!");var f=u(e)?e:{},s={ignoreKeys:[],acceptArrays:!1,acceptArraysIgnore:[],enforceStrictKeyset:!0,schema:{},msg:"check-types-mini/checkTypes()",optsVarName:"opts"},y=void 0;if(y=n(r)&&u(r)?Object.assign({},s,r):Object.assign({},s),!i(y.msg))throw new Error("check-types-mini/checkTypes(): opts.msg must be string! Currently it's: "+I(y.msg)+", equal to "+JSON.stringify(y.msg,null,4));if(y.msg=y.msg.trim(),":"===y.msg[y.msg.length-1]&&(y.msg=y.msg.slice(0,y.msg.length-1)),!i(y.optsVarName))throw new Error("check-types-mini/checkTypes(): opts.optsVarName must be string! Currently it's: "+I(y.optsVarName)+", equal to "+JSON.stringify(y.optsVarName,null,4));if(y.ignoreKeys=Mt(y.ignoreKeys),y.acceptArraysIgnore=Mt(y.acceptArraysIgnore),!c(y.ignoreKeys))throw new TypeError("check-types-mini/checkTypes(): opts.ignoreKeys should be an array, currently it's: "+I(y.ignoreKeys));if(!o(y.acceptArrays))throw new TypeError("check-types-mini/checkTypes(): opts.acceptArrays should be a Boolean, currently it's: "+I(y.acceptArrays));if(!c(y.acceptArraysIgnore))throw new TypeError("check-types-mini/checkTypes(): opts.acceptArraysIgnore should be an array, currently it's: "+I(y.acceptArraysIgnore));if(!o(y.enforceStrictKeyset))throw new TypeError("check-types-mini/checkTypes(): opts.enforceStrictKeyset should be a Boolean, currently it's: "+I(y.enforceStrictKeyset));if(Object.keys(y.schema).forEach(function(t){c(y.schema[t])||(y.schema[t]=[y.schema[t]]),y.schema[t]=y.schema[t].map(String).map(function(t){return t.toLowerCase()}).map(function(t){return t.trim()})}),y.enforceStrictKeyset)if(n(y.schema)&&Object.keys(y.schema).length>0){if(0!==ot(Object.keys(t),Object.keys(f).concat(Object.keys(y.schema))).length)throw new TypeError(y.msg+": "+y.optsVarName+".enforceStrictKeyset is on and the following keys are not covered by schema and/or reference objects: "+JSON.stringify(ot(Object.keys(t),Object.keys(f).concat(Object.keys(y.schema))),null,4))}else{if(!(n(f)&&Object.keys(f).length>0))throw new TypeError(y.msg+": Both "+y.optsVarName+".schema and reference objects are missing! We don't have anything to match the keys as you requested via opts.enforceStrictKeyset!");if(0!==ot(Object.keys(t),Object.keys(f)).length)throw new TypeError(y.msg+": The input object has keys that are not covered by reference object: "+JSON.stringify(ot(Object.keys(t),Object.keys(f)),null,4));if(0!==ot(Object.keys(f),Object.keys(t)).length)throw new TypeError(y.msg+": The reference object has keys that are not present in the input object: "+JSON.stringify(ot(Object.keys(f),Object.keys(t)),null,4))}Object.keys(t).forEach(function(e){if(n(y.schema)&&Object.prototype.hasOwnProperty.call(y.schema,e)){if(y.schema[e]=Mt(y.schema[e]).map(String).map(function(t){return t.toLowerCase()}),!Et(y.schema[e],a).length&&!rt(y.schema[e],I(t[e]).toLowerCase())){if(!c(t[e])||!y.acceptArrays)throw new TypeError(y.msg+": "+y.optsVarName+"."+e+" was customised to "+JSON.stringify(t[e],null,4)+" which is not among the allowed types in schema ("+y.schema[e]+") but "+I(t[e]));for(var r=0,o=t[e].length;r<o;r++)if(!rt(y.schema[e],I(t[e][r]).toLowerCase()))throw new TypeError(y.msg+": "+y.optsVarName+"."+e+" is of type "+I(t[e][r]).toLowerCase()+", but only the following are allowed in "+y.optsVarName+".schema: "+y.schema[e])}}else if(n(f)&&Object.prototype.hasOwnProperty.call(f,e)&&I(t[e])!==I(f[e])&&!rt(y.ignoreKeys,e)){if(!y.acceptArrays||!c(t[e])||rt(y.acceptArraysIgnore,e))throw new TypeError(y.msg+": "+y.optsVarName+"."+e+" was customised to "+JSON.stringify(t[e],null,4)+" which is not "+I(f[e])+" but "+I(t[e]));if(!t[e].every(function(t){return I(t)===I(f[e])}))throw new TypeError(y.msg+": "+y.optsVarName+"."+e+" was customised to be array, but not all of its elements are "+I(f[e])+"-type")}})},It="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},Ht=Array.isArray;return function(t,e){if(!Ht(t))throw new TypeError("ranges-sort: [THROW_ID_01] Input must be an array, consisting of range arrays! Currently its type is: "+(void 0===t?"undefined":It(t))+", equal to: "+JSON.stringify(t,null,4));if(0===t.length)return t;var r={strictlyTwoElementsInRangeArrays:!1},n=Object.assign({},r,e);xt(n,r,{msg:"ranges-sort: [THROW_ID_02*]"});var o=void 0,i=void 0;if(n.strictlyTwoElementsInRangeArrays&&!t.every(function(t,e){return 2===t.length||(o=e,i=t.length,!1)}))throw new TypeError("ranges-sort: [THROW_ID_03] The first argument should be an array and must consist of arrays which are natural number indexes representing TWO string index ranges. However, "+M(o)+" range ("+JSON.stringify(t[o],null,4)+") has not two but "+i+" elements!");if(!t.every(function(t,e){return!(!E(t[0],{includeZero:!0})||!E(t[1],{includeZero:!0}))||(o=e,!1)}))throw new TypeError("ranges-sort: [THROW_ID_03] The first argument should be an array and must consist of arrays which are natural number indexes representing string index ranges. However, "+M(o)+" range ("+JSON.stringify(t[o],null,4)+") does not consist of only natural numbers!");return Array.from(t).sort(function(t,e){return t[0]===e[0]?t[1]<e[1]?-1:t[1]>e[1]?1:0:t[0]<e[0]?-1:1})}});
