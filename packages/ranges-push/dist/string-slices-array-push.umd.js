!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):t.slices=e()}(this,function(){"use strict";var t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},e=function(e,r){if(r){if("object"!==(void 0===r?"undefined":t(r)))throw new TypeError(String(r)+" is not an object. Expected an object that has boolean `includeZero` property.");if("includeZero"in r){if("boolean"!=typeof r.includeZero)throw new TypeError(String(r.includeZero)+" is neither true nor false. `includeZero` option must be a Boolean value.");if(r.includeZero&&0===e)return!0}}return Number.isSafeInteger(e)&&e>=1},r=function(t,e){if("string"!=typeof t)return!1;if(e&&"includeZero"in e){if("boolean"!=typeof e.includeZero)throw new TypeError(String(e.includeZero)+" is neither true nor false. `includeZero` option must be a Boolean value.");if(e.includeZero)return/^(-?0|[1-9]\d*)(\.0+)?$/.test(t)}return/^[1-9]\d*(\.0+)?$/.test(t)},n="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{};function o(t,e){return t(e={exports:{}},e.exports),e.exports}var i=o(function(t,e){(e=t.exports=function(t){return t+e.suffix(+t)}).suffix=function(t){return 1===Math.floor(t/10)?"th":t%10==1?"st":t%10==2?"nd":t%10==3?"rd":"th"}}),a=(i.suffix,"function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t}),s=o(function(t,e){var r,o,i,s,u,c,f,l,y,p,h,d,g,m,b,v,w,_,S,O;t.exports=(r="function"==typeof Promise,o="object"===("undefined"==typeof self?"undefined":a(self))?self:n,i="undefined"!=typeof Symbol,s="undefined"!=typeof Map,u="undefined"!=typeof Set,c="undefined"!=typeof WeakMap,f="undefined"!=typeof WeakSet,l="undefined"!=typeof DataView,y=i&&void 0!==Symbol.iterator,p=i&&void 0!==Symbol.toStringTag,h=u&&"function"==typeof Set.prototype.entries,d=s&&"function"==typeof Map.prototype.entries,g=h&&Object.getPrototypeOf((new Set).entries()),m=d&&Object.getPrototypeOf((new Map).entries()),b=y&&"function"==typeof Array.prototype[Symbol.iterator],v=b&&Object.getPrototypeOf([][Symbol.iterator]()),w=y&&"function"==typeof String.prototype[Symbol.iterator],_=w&&Object.getPrototypeOf(""[Symbol.iterator]()),S=8,O=-1,function(t){var e=void 0===t?"undefined":a(t);if("object"!==e)return e;if(null===t)return"null";if(t===o)return"global";if(Array.isArray(t)&&(!1===p||!(Symbol.toStringTag in t)))return"Array";if("object"===("undefined"==typeof window?"undefined":a(window))){if("object"===a(window.location)&&t===window.location)return"Location";if("object"===a(window.document)&&t===window.document)return"Document";if("object"===a(window.navigator)){if("object"===a(window.navigator.mimeTypes)&&t===window.navigator.mimeTypes)return"MimeTypeArray";if("object"===a(window.navigator.plugins)&&t===window.navigator.plugins)return"PluginArray"}if(("function"==typeof window.HTMLElement||"object"===a(window.HTMLElement))&&t instanceof window.HTMLElement){if("BLOCKQUOTE"===t.tagName)return"HTMLQuoteElement";if("TD"===t.tagName)return"HTMLTableDataCellElement";if("TH"===t.tagName)return"HTMLTableHeaderCellElement"}}var n=p&&t[Symbol.toStringTag];if("string"==typeof n)return n;var i=Object.getPrototypeOf(t);return i===RegExp.prototype?"RegExp":i===Date.prototype?"Date":r&&i===Promise.prototype?"Promise":u&&i===Set.prototype?"Set":s&&i===Map.prototype?"Map":f&&i===WeakSet.prototype?"WeakSet":c&&i===WeakMap.prototype?"WeakMap":l&&i===DataView.prototype?"DataView":s&&i===m?"Map Iterator":u&&i===g?"Set Iterator":b&&i===v?"Array Iterator":w&&i===_?"String Iterator":null===i?"Object":Object.prototype.toString.call(t).slice(S,O)})}),u="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},c=1/0,f=9007199254740991,l=1.7976931348623157e308,y=NaN,p="[object Arguments]",h="[object Function]",d="[object GeneratorFunction]",g="[object String]",m="[object Symbol]",b=/^\s+|\s+$/g,v=/^[-+]0x[0-9a-f]+$/i,w=/^0b[01]+$/i,_=/^0o[0-7]+$/i,S=/^(?:0|[1-9]\d*)$/,O=parseInt;function j(t){return t!=t}function T(t,e){return function(t,e){for(var r=-1,n=t?t.length:0,o=Array(n);++r<n;)o[r]=e(t[r],r,t);return o}(e,function(e){return t[e]})}var k,A,E=Object.prototype,N=E.hasOwnProperty,I=E.toString,M=E.propertyIsEnumerable,x=(k=Object.keys,A=Object,function(t){return k(A(t))}),W=Math.max;function H(t,e){var r=C(t)||function(t){return function(t){return K(t)&&R(t)}(t)&&N.call(t,"callee")&&(!M.call(t,"callee")||I.call(t)==p)}(t)?function(t,e){for(var r=-1,n=Array(t);++r<t;)n[r]=e(r);return n}(t.length,String):[],n=r.length,o=!!n;for(var i in t)!e&&!N.call(t,i)||o&&("length"==i||P(i,n))||r.push(i);return r}function D(t){if(r=(e=t)&&e.constructor,n="function"==typeof r&&r.prototype||E,e!==n)return x(t);var e,r,n,o=[];for(var i in Object(t))N.call(t,i)&&"constructor"!=i&&o.push(i);return o}function P(t,e){return!!(e=null==e?f:e)&&("number"==typeof t||S.test(t))&&t>-1&&t%1==0&&t<e}var C=Array.isArray;function R(t){return null!=t&&function(t){return"number"==typeof t&&t>-1&&t%1==0&&t<=f}(t.length)&&!function(t){var e=V(t)?I.call(t):"";return e==h||e==d}(t)}function V(t){var e=void 0===t?"undefined":u(t);return!!t&&("object"==e||"function"==e)}function K(t){return!!t&&"object"==(void 0===t?"undefined":u(t))}var Z=function(t,e,r,n){var o;t=R(t)?t:(o=t)?T(o,function(t){return R(t)?H(t):D(t)}(o)):[],r=r&&!n?function(t){var e=function(t){if(!t)return 0===t?t:0;if((t=function(t){if("number"==typeof t)return t;if(function(t){return"symbol"==(void 0===t?"undefined":u(t))||K(t)&&I.call(t)==m}(t))return y;if(V(t)){var e="function"==typeof t.valueOf?t.valueOf():t;t=V(e)?e+"":e}if("string"!=typeof t)return 0===t?t:+t;t=t.replace(b,"");var r=w.test(t);return r||_.test(t)?O(t.slice(2),r?2:8):v.test(t)?y:+t}(t))===c||t===-c){var e=t<0?-1:1;return e*l}return t==t?t:0}(t),r=e%1;return e==e?r?e-r:e:0}(r):0;var i=t.length;return r<0&&(r=W(i+r,0)),function(t){return"string"==typeof t||!C(t)&&K(t)&&I.call(t)==g}(t)?r<=i&&t.indexOf(e,r)>-1:!!i&&function(t,e,r){if(e!=e)return function(t,e,r,n){for(var o=t.length,i=r+(n?1:-1);n?i--:++i<o;)if(e(t[i],i,t))return i;return-1}(t,j,r);for(var n=r-1,o=t.length;++n<o;)if(t[n]===e)return n;return-1}(t,e,r)>-1};function J(t,e,r){if(e!=e)return function(t,e,r,n){for(var o=t.length,i=r+(n?1:-1);n?i--:++i<o;)if(e(t[i],i,t))return i;return-1}(t,$,r);for(var n=r-1,o=t.length;++n<o;)if(t[n]===e)return n;return-1}function L(t,e,r,n){for(var o=r-1,i=t.length;++o<i;)if(n(t[o],e))return o;return-1}function $(t){return t!=t}var B=Array.prototype.splice;function q(t,e,r,n){var o,i=n?L:J,a=-1,s=e.length,u=t;for(t===e&&(e=function(t,e){var r=-1,n=t.length;e||(e=Array(n));for(;++r<n;)e[r]=t[r];return e}(e)),r&&(u=function(t,e){for(var r=-1,n=t?t.length:0,o=Array(n);++r<n;)o[r]=e(t[r],r,t);return o}(t,(o=r,function(t){return o(t)})));++a<s;)for(var c=0,f=e[a],l=r?r(f):f;(c=i(u,l,c,n))>-1;)u!==t&&B.call(u,c,1),B.call(t,c,1);return t}var F=function(t,e){return t&&t.length&&e&&e.length?q(t,e):t},G="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},Q="__lodash_hash_undefined__",z=9007199254740991,U="[object Function]",X="[object GeneratorFunction]",Y=/^\[object .+?Constructor\]$/,tt="object"==G(n)&&n&&n.Object===Object&&n,et="object"==("undefined"==typeof self?"undefined":G(self))&&self&&self.Object===Object&&self,rt=tt||et||Function("return this")();function nt(t,e){return!!(t?t.length:0)&&function(t,e,r){if(e!=e)return function(t,e,r,n){var o=t.length,i=r+(n?1:-1);for(;n?i--:++i<o;)if(e(t[i],i,t))return i;return-1}(t,at,r);var n=r-1,o=t.length;for(;++n<o;)if(t[n]===e)return n;return-1}(t,e,0)>-1}function ot(t,e,r){for(var n=-1,o=t?t.length:0;++n<o;)if(r(e,t[n]))return!0;return!1}function it(t,e){for(var r=-1,n=t?t.length:0,o=Array(n);++r<n;)o[r]=e(t[r],r,t);return o}function at(t){return t!=t}function st(t){return function(e){return t(e)}}function ut(t,e){return t.has(e)}var ct,ft=Array.prototype,lt=Function.prototype,yt=Object.prototype,pt=rt["__core-js_shared__"],ht=(ct=/[^.]+$/.exec(pt&&pt.keys&&pt.keys.IE_PROTO||""))?"Symbol(src)_1."+ct:"",dt=lt.toString,gt=yt.hasOwnProperty,mt=yt.toString,bt=RegExp("^"+dt.call(gt).replace(/[\\^$.*+?()[\]{}|]/g,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$"),vt=ft.splice,wt=Math.max,_t=Math.min,St=xt(rt,"Map"),Ot=xt(Object,"create");function jt(t){var e=-1,r=t?t.length:0;for(this.clear();++e<r;){var n=t[e];this.set(n[0],n[1])}}function Tt(t){var e=-1,r=t?t.length:0;for(this.clear();++e<r;){var n=t[e];this.set(n[0],n[1])}}function kt(t){var e=-1,r=t?t.length:0;for(this.clear();++e<r;){var n=t[e];this.set(n[0],n[1])}}function At(t){var e=-1,r=t?t.length:0;for(this.__data__=new kt;++e<r;)this.add(t[e])}function Et(t,e){for(var r,n,o=t.length;o--;)if((r=t[o][0])===(n=e)||r!=r&&n!=n)return o;return-1}function Nt(t){return!(!Ht(t)||ht&&ht in t)&&(Wt(t)||function(t){var e=!1;if(null!=t&&"function"!=typeof t.toString)try{e=!!(t+"")}catch(t){}return e}(t)?bt:Y).test(function(t){if(null!=t){try{return dt.call(t)}catch(t){}try{return t+""}catch(t){}}return""}(t))}function It(t){return function(t){return function(t){return!!t&&"object"==(void 0===t?"undefined":G(t))}(t)&&function(t){return null!=t&&function(t){return"number"==typeof t&&t>-1&&t%1==0&&t<=z}(t.length)&&!Wt(t)}(t)}(t)?t:[]}function Mt(t,e){var r,n,o=t.__data__;return("string"==(n=void 0===(r=e)?"undefined":G(r))||"number"==n||"symbol"==n||"boolean"==n?"__proto__"!==r:null===r)?o["string"==typeof e?"string":"hash"]:o.map}function xt(t,e){var r=function(t,e){return null==t?void 0:t[e]}(t,e);return Nt(r)?r:void 0}function Wt(t){var e=Ht(t)?mt.call(t):"";return e==U||e==X}function Ht(t){var e=void 0===t?"undefined":G(t);return!!t&&("object"==e||"function"==e)}jt.prototype.clear=function(){this.__data__=Ot?Ot(null):{}},jt.prototype.delete=function(t){return this.has(t)&&delete this.__data__[t]},jt.prototype.get=function(t){var e=this.__data__;if(Ot){var r=e[t];return r===Q?void 0:r}return gt.call(e,t)?e[t]:void 0},jt.prototype.has=function(t){var e=this.__data__;return Ot?void 0!==e[t]:gt.call(e,t)},jt.prototype.set=function(t,e){return this.__data__[t]=Ot&&void 0===e?Q:e,this},Tt.prototype.clear=function(){this.__data__=[]},Tt.prototype.delete=function(t){var e=this.__data__,r=Et(e,t);return!(r<0||(r==e.length-1?e.pop():vt.call(e,r,1),0))},Tt.prototype.get=function(t){var e=this.__data__,r=Et(e,t);return r<0?void 0:e[r][1]},Tt.prototype.has=function(t){return Et(this.__data__,t)>-1},Tt.prototype.set=function(t,e){var r=this.__data__,n=Et(r,t);return n<0?r.push([t,e]):r[n][1]=e,this},kt.prototype.clear=function(){this.__data__={hash:new jt,map:new(St||Tt),string:new jt}},kt.prototype.delete=function(t){return Mt(this,t).delete(t)},kt.prototype.get=function(t){return Mt(this,t).get(t)},kt.prototype.has=function(t){return Mt(this,t).has(t)},kt.prototype.set=function(t,e){return Mt(this,t).set(t,e),this},At.prototype.add=At.prototype.push=function(t){return this.__data__.set(t,Q),this},At.prototype.has=function(t){return this.__data__.has(t)};var Dt=function(t,e){return e=wt(void 0===e?t.length-1:e,0),function(){for(var r=arguments,n=-1,o=wt(r.length-e,0),i=Array(o);++n<o;)i[n]=r[e+n];n=-1;for(var a=Array(e+1);++n<e;)a[n]=r[n];return a[e]=i,function(t,e,r){switch(r.length){case 0:return t.call(e);case 1:return t.call(e,r[0]);case 2:return t.call(e,r[0],r[1]);case 3:return t.call(e,r[0],r[1],r[2])}return t.apply(e,r)}(t,this,a)}}(function(t){var e=it(t,It);return e.length&&e[0]===t[0]?function(t,e,r){for(var n=r?ot:nt,o=t[0].length,i=t.length,a=i,s=Array(i),u=1/0,c=[];a--;){var f=t[a];a&&e&&(f=it(f,st(e))),u=_t(f.length,u),s[a]=!r&&(e||o>=120&&f.length>=120)?new At(a&&f):void 0}f=t[0];var l=-1,y=s[0];t:for(;++l<o&&c.length<u;){var p=f[l],h=e?e(p):p;if(p=r||0!==p?p:0,!(y?ut(y,h):n(c,h,r))){for(a=i;--a;){var d=s[a];if(!(d?ut(d,h):n(t[a],h,r)))continue t}y&&y.push(h),c.push(p)}}return c}(e):[]});function Pt(t){return"string"==typeof t?t.length>0?[t]:[]:t}function Ct(t,e,r){function n(t){return null!=t}function o(t){return"boolean"===s(t)}function i(t){return"string"===s(t)}function a(t){return"Object"===s(t)}var u=["any","anything","every","everything","all","whatever","whatevs"],c=Array.isArray;if(0===arguments.length)throw new Error("check-types-mini/checkTypes(): Missing all arguments!");if(1===arguments.length)throw new Error("check-types-mini/checkTypes(): Missing second argument!");var f=a(e)?e:{},l={ignoreKeys:[],acceptArrays:!1,acceptArraysIgnore:[],enforceStrictKeyset:!0,schema:{},msg:"check-types-mini/checkTypes()",optsVarName:"opts"},y=void 0;if(!i((y=n(r)&&a(r)?Object.assign({},l,r):Object.assign({},l)).msg))throw new Error("check-types-mini/checkTypes(): opts.msg must be string! Currently it's: "+s(y.msg)+", equal to "+JSON.stringify(y.msg,null,4));if(y.msg=y.msg.trim(),":"===y.msg[y.msg.length-1]&&(y.msg=y.msg.slice(0,y.msg.length-1)),!i(y.optsVarName))throw new Error("check-types-mini/checkTypes(): opts.optsVarName must be string! Currently it's: "+s(y.optsVarName)+", equal to "+JSON.stringify(y.optsVarName,null,4));if(y.ignoreKeys=Pt(y.ignoreKeys),y.acceptArraysIgnore=Pt(y.acceptArraysIgnore),!c(y.ignoreKeys))throw new TypeError("check-types-mini/checkTypes(): opts.ignoreKeys should be an array, currently it's: "+s(y.ignoreKeys));if(!o(y.acceptArrays))throw new TypeError("check-types-mini/checkTypes(): opts.acceptArrays should be a Boolean, currently it's: "+s(y.acceptArrays));if(!c(y.acceptArraysIgnore))throw new TypeError("check-types-mini/checkTypes(): opts.acceptArraysIgnore should be an array, currently it's: "+s(y.acceptArraysIgnore));if(!o(y.enforceStrictKeyset))throw new TypeError("check-types-mini/checkTypes(): opts.enforceStrictKeyset should be a Boolean, currently it's: "+s(y.enforceStrictKeyset));if(Object.keys(y.schema).forEach(function(t){c(y.schema[t])||(y.schema[t]=[y.schema[t]]),y.schema[t]=y.schema[t].map(String).map(function(t){return t.toLowerCase()}).map(function(t){return t.trim()})}),y.enforceStrictKeyset)if(n(y.schema)&&Object.keys(y.schema).length>0){if(0!==F(Object.keys(t),Object.keys(f).concat(Object.keys(y.schema))).length)throw new TypeError(y.msg+": "+y.optsVarName+".enforceStrictKeyset is on and the following keys are not covered by schema and/or reference objects: "+JSON.stringify(F(Object.keys(t),Object.keys(f).concat(Object.keys(y.schema))),null,4))}else{if(!(n(f)&&Object.keys(f).length>0))throw new TypeError(y.msg+": Both "+y.optsVarName+".schema and reference objects are missing! We don't have anything to match the keys as you requested via opts.enforceStrictKeyset!");if(0!==F(Object.keys(t),Object.keys(f)).length)throw new TypeError(y.msg+": The input object has keys that are not covered by reference object: "+JSON.stringify(F(Object.keys(t),Object.keys(f)),null,4));if(0!==F(Object.keys(f),Object.keys(t)).length)throw new TypeError(y.msg+": The reference object has keys that are not present in the input object: "+JSON.stringify(F(Object.keys(f),Object.keys(t)),null,4))}Object.keys(t).forEach(function(e){if(n(y.schema)&&Object.prototype.hasOwnProperty.call(y.schema,e)){if(y.schema[e]=Pt(y.schema[e]).map(String).map(function(t){return t.toLowerCase()}),!Dt(y.schema[e],u).length&&!Z(y.schema[e],s(t[e]).toLowerCase())){if(!c(t[e])||!y.acceptArrays)throw new TypeError(y.msg+": "+y.optsVarName+"."+e+" was customised to "+JSON.stringify(t[e],null,4)+" which is not among the allowed types in schema ("+y.schema[e]+") but "+s(t[e]));for(var r=0,o=t[e].length;r<o;r++)if(!Z(y.schema[e],s(t[e][r]).toLowerCase()))throw new TypeError(y.msg+": "+y.optsVarName+"."+e+" is of type "+s(t[e][r]).toLowerCase()+", but only the following are allowed in "+y.optsVarName+".schema: "+y.schema[e])}}else if(n(f)&&Object.prototype.hasOwnProperty.call(f,e)&&s(t[e])!==s(f[e])&&!Z(y.ignoreKeys,e)){if(!y.acceptArrays||!c(t[e])||Z(y.acceptArraysIgnore,e))throw new TypeError(y.msg+": "+y.optsVarName+"."+e+" was customised to "+JSON.stringify(t[e],null,4)+" which is not "+s(f[e])+" but "+s(t[e]));if(!t[e].every(function(t){return s(t)===s(f[e])}))throw new TypeError(y.msg+": "+y.optsVarName+"."+e+" was customised to be array, but not all of its elements are "+s(f[e])+"-type")}})}var Rt="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},Vt="function"==typeof Symbol&&"symbol"===Rt(Symbol.iterator)?function(t){return void 0===t?"undefined":Rt(t)}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":void 0===t?"undefined":Rt(t)},Kt=Array.isArray;function Zt(t){if(!Array.isArray(t))return t;for(var r=function(t,r){if(!Kt(t))throw new TypeError("ranges-sort: [THROW_ID_01] Input must be an array, consisting of range arrays! Currently its type is: "+(void 0===t?"undefined":Vt(t))+", equal to: "+JSON.stringify(t,null,4));if(0===t.length)return t;var n={strictlyTwoElementsInRangeArrays:!1},o=Object.assign({},n,r);Ct(o,n,{msg:"ranges-sort: [THROW_ID_02*]"});var a=void 0,s=void 0;if(o.strictlyTwoElementsInRangeArrays&&!t.every(function(t,e){return 2===t.length||(a=e,s=t.length,!1)}))throw new TypeError("ranges-sort: [THROW_ID_03] The first argument should be an array and must consist of arrays which are natural number indexes representing TWO string index ranges. However, "+i(a)+" range ("+JSON.stringify(t[a],null,4)+") has not two but "+s+" elements!");if(!t.every(function(t,r){return!(!e(t[0],{includeZero:!0})||!e(t[1],{includeZero:!0}))||(a=r,!1)}))throw new TypeError("ranges-sort: [THROW_ID_03] The first argument should be an array and must consist of arrays which are natural number indexes representing string index ranges. However, "+i(a)+" range ("+JSON.stringify(t[a],null,4)+") does not consist of only natural numbers!");return Array.from(t).sort(function(t,e){return t[0]===e[0]?t[1]<e[1]?-1:t[1]>e[1]?1:0:t[0]<e[0]?-1:1})}(t),n=r.length-1;n>0;n--)(r[n][0]<=r[n-1][0]||r[n][0]<=r[n-1][1])&&(r[n-1][0]=Math.min(r[n][0],r[n-1][0]),r[n-1][1]=Math.max(r[n][1],r[n-1][1]),void 0!==r[n][2]&&(r[n-1][0]>=r[n][0]||r[n-1][1]<=r[n][1])&&null!==r[n-1][2]&&(null===r[n][2]&&null!==r[n-1][2]?r[n-1][2]=null:void 0!==r[n-1][2]?r[n-1][2]+=r[n][2]:r[n-1][2]=r[n][2]),r.splice(n,1),n=r.length);return r}function Jt(t){if("string"==typeof t){if(0===t.length)return"";if(""===t.trim())return t.includes("\n")?"\n":" ";var e="";if(""===t[0].trim()){e=" ";for(var r=!1,n=0,o=t.length;n<o&&("\n"===t[n]&&(r=!0),""===t[n].trim());n++);r&&(e="\n")}var i="";if(""===t.slice(-1).trim()){i=" ";for(var a=!1,s=t.length;s--&&("\n"===t[s]&&(a=!0),""===t[s].trim()););a&&(i="\n")}return e+t.trim()+i}return t}var Lt=function(){function t(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e}}();function $t(t){return null!=t}function Bt(t){throw new Error("string-slices-array-push/Slices/add(): [THROW_ID_01] Missing "+t+i(t)+" parameter!")}return function(){function t(e){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t);var r={limitToBeAddedWhitespace:!1},n=Object.assign({},r,e);Ct(n,r,{msg:"string-slices-array-push: [THROW_ID_00*]"}),this.opts=n}return Lt(t,[{key:"add",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:Bt(1),n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:Bt(2),o=arguments[2],i=r(t)?parseInt(t,10):t,a=r(n)?parseInt(n,10):n;if(!e(i,{includeZero:!0}))throw new TypeError('string-slices-array-push/Slices/add(): [THROW_ID_02] "from" value, first input argument, must be a natural number or zero! Currently it\'s equal to: '+JSON.stringify(i,null,4));if(!e(a,{includeZero:!0}))throw new TypeError('string-slices-array-push/Slices/add(): [THROW_ID_03] "to" value, second input argument, must be a natural number! Currently it\'s equal to: '+JSON.stringify(a,null,4));if($t(o)&&"string"!=typeof o&&null!==o)throw new TypeError('string-slices-array-push/Slices/add(): [THROW_ID_04] "addVal" value, third input argument, must be a string (or null)! Currently it\'s equal to: '+JSON.stringify(o,null,4));for(var s=arguments.length,u=Array(s>3?s-3:0),c=3;c<s;c++)u[c-3]=arguments[c];if(u.length>0)throw new TypeError("string-slices-array-push/Slices/add(): [THROW_ID_05] Please don't overload the add() method. From the 4th input argument onwards we see these redundant arguments: "+JSON.stringify(u,null,4));if(void 0!==this.slices&&i===this.last()[1]){if(this.last()[1]=a,null!==this.last()[2]&&$t(o)){var f=$t(this.last()[2])&&this.last()[2].length>0?this.last()[2]+o:o;this.opts.limitToBeAddedWhitespace&&(f=Jt(f)),this.last()[2]=f}}else this.slices||(this.slices=[]),this.slices.push(void 0!==o?[i,a,this.opts.limitToBeAddedWhitespace?Jt(o):o]:[i,a])}},{key:"push",value:function(t,e,r){for(var n=arguments.length,o=Array(n>3?n-3:0),i=3;i<n;i++)o[i-3]=arguments[i];this.add.apply(this,[t,e,r].concat(o))}},{key:"current",value:function(){return null!=this.slices?(this.slices=Zt(this.slices),this.opts.limitToBeAddedWhitespace?this.slices.map(function(t){return $t(t[2])?[t[0],t[1],Jt(t[2])]:t}):this.slices):null}},{key:"wipe",value:function(){this.slices=void 0}},{key:"last",value:function(){return void 0!==this.slices&&Array.isArray(this.slices)?this.slices[this.slices.length-1]:null}}]),t}()});
