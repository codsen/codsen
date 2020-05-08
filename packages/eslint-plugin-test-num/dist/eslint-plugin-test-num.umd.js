/**
 * eslint-plugin-test-num
 * ESLint plugin to update unit test numbers automatically
 * Version: 1.1.1
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/eslint-plugin-test-num
 */

!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):(t=t||self).eslintPluginTestNum=e()}(this,(function(){"use strict";var t="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{};function e(t,e){return t(e={exports:{}},e.exports),e.exports}var r=e((function(t){t.exports=function(){var t=Object.prototype.toString;function e(t,e){return null!=t&&Object.prototype.hasOwnProperty.call(t,e)}function r(t){if(!t)return!0;if(o(t)&&0===t.length)return!0;if("string"!=typeof t){for(var r in t)if(e(t,r))return!1;return!0}return!1}function n(e){return t.call(e)}var o=Array.isArray||function(e){return"[object Array]"===t.call(e)};function i(t){var e=parseInt(t);return e.toString()===t?e:t}function a(t){t=t||{};var a=function(t){return Object.keys(a).reduce((function(e,r){return"create"===r||"function"==typeof a[r]&&(e[r]=a[r].bind(a,t)),e}),{})};function u(r,n){return t.includeInheritedProps||"number"==typeof n&&Array.isArray(r)||e(r,n)}function s(t,e){if(u(t,e))return t[e]}function c(t,e,r,n){if("number"==typeof e&&(e=[e]),!e||0===e.length)return t;if("string"==typeof e)return c(t,e.split(".").map(i),r,n);var o=e[0],a=s(t,o);return 1===e.length?(void 0!==a&&n||(t[o]=r),a):(void 0===a&&("number"==typeof e[1]?t[o]=[]:t[o]={}),c(t[o],e.slice(1),r,n))}return a.has=function(r,n){if("number"==typeof n?n=[n]:"string"==typeof n&&(n=n.split(".")),!n||0===n.length)return!!r;for(var a=0;a<n.length;a++){var u=i(n[a]);if(!("number"==typeof u&&o(r)&&u<r.length||(t.includeInheritedProps?u in Object(r):e(r,u))))return!1;r=r[u]}return!0},a.ensureExists=function(t,e,r){return c(t,e,r,!0)},a.set=function(t,e,r,n){return c(t,e,r,n)},a.insert=function(t,e,r,n){var i=a.get(t,e);n=~~n,o(i)||(i=[],a.set(t,e,i)),i.splice(n,0,r)},a.empty=function(t,e){var i,s;if(!r(e)&&null!=t&&(i=a.get(t,e))){if("string"==typeof i)return a.set(t,e,"");if(function(t){return"boolean"==typeof t||"[object Boolean]"===n(t)}(i))return a.set(t,e,!1);if("number"==typeof i)return a.set(t,e,0);if(o(i))i.length=0;else{if(!function(t){return"object"==typeof t&&"[object Object]"===n(t)}(i))return a.set(t,e,null);for(s in i)u(i,s)&&delete i[s]}}},a.push=function(t,e){var r=a.get(t,e);o(r)||(r=[],a.set(t,e,r)),r.push.apply(r,Array.prototype.slice.call(arguments,2))},a.coalesce=function(t,e,r){for(var n,o=0,i=e.length;o<i;o++)if(void 0!==(n=a.get(t,e[o])))return n;return r},a.get=function(t,e,r){if("number"==typeof e&&(e=[e]),!e||0===e.length)return t;if(null==t)return r;if("string"==typeof e)return a.get(t,e.split("."),r);var n=i(e[0]),o=s(t,n);return void 0===o?r:1===e.length?o:a.get(t[n],e.slice(1),r)},a.del=function(t,e){if("number"==typeof e&&(e=[e]),null==t)return t;if(r(e))return t;if("string"==typeof e)return a.del(t,e.split("."));var n=i(e[0]);return u(t,n)?1!==e.length?a.del(t[n],e.slice(1)):(o(t)?t.splice(n,1):delete t[n],t):t},a}var u=a();return u.create=a,u.withInheritedProps=a({includeInheritedProps:!0}),u}()}));Function.prototype.toString.call(Object),e((function(e,r){var n="[object Arguments]",o="[object Function]",i="[object GeneratorFunction]",a="[object Map]",u="[object Set]",s=/\w*$/,c=/^\[object .+?Constructor\]$/,l=/^(?:0|[1-9]\d*)$/,f={};f[n]=f["[object Array]"]=f["[object ArrayBuffer]"]=f["[object DataView]"]=f["[object Boolean]"]=f["[object Date]"]=f["[object Float32Array]"]=f["[object Float64Array]"]=f["[object Int8Array]"]=f["[object Int16Array]"]=f["[object Int32Array]"]=f[a]=f["[object Number]"]=f["[object Object]"]=f["[object RegExp]"]=f[u]=f["[object String]"]=f["[object Symbol]"]=f["[object Uint8Array]"]=f["[object Uint8ClampedArray]"]=f["[object Uint16Array]"]=f["[object Uint32Array]"]=!0,f["[object Error]"]=f[o]=f["[object WeakMap]"]=!1;var p="object"==typeof t&&t&&t.Object===Object&&t,y="object"==typeof self&&self&&self.Object===Object&&self,g=p||y||Function("return this")(),d=r&&!r.nodeType&&r,h=d&&e&&!e.nodeType&&e,b=h&&h.exports===d;function v(t,e){return t.set(e[0],e[1]),t}function m(t,e){return t.add(e),t}function _(t,e,r,n){var o=-1,i=t?t.length:0;for(n&&i&&(r=t[++o]);++o<i;)r=e(r,t[o],o,t);return r}function j(t){var e=!1;if(null!=t&&"function"!=typeof t.toString)try{e=!!(t+"")}catch(t){}return e}function x(t){var e=-1,r=Array(t.size);return t.forEach((function(t,n){r[++e]=[n,t]})),r}function w(t,e){return function(r){return t(e(r))}}function O(t){var e=-1,r=Array(t.size);return t.forEach((function(t){r[++e]=t})),r}var A,S=Array.prototype,E=Function.prototype,q=Object.prototype,I=g["__core-js_shared__"],P=(A=/[^.]+$/.exec(I&&I.keys&&I.keys.IE_PROTO||""))?"Symbol(src)_1."+A:"",D=E.toString,k=q.hasOwnProperty,T=q.toString,N=RegExp("^"+D.call(k).replace(/[\\^$.*+?()[\]{}|]/g,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$"),L=b?g.Buffer:void 0,U=g.Symbol,F=g.Uint8Array,R=w(Object.getPrototypeOf,Object),B=Object.create,M=q.propertyIsEnumerable,$=S.splice,C=Object.getOwnPropertySymbols,V=L?L.isBuffer:void 0,W=w(Object.keys,Object),z=ht(g,"DataView"),G=ht(g,"Map"),H=ht(g,"Promise"),J=ht(g,"Set"),K=ht(g,"WeakMap"),Q=ht(Object,"create"),X=jt(z),Y=jt(G),Z=jt(H),tt=jt(J),et=jt(K),rt=U?U.prototype:void 0,nt=rt?rt.valueOf:void 0;function ot(t){var e=-1,r=t?t.length:0;for(this.clear();++e<r;){var n=t[e];this.set(n[0],n[1])}}function it(t){var e=-1,r=t?t.length:0;for(this.clear();++e<r;){var n=t[e];this.set(n[0],n[1])}}function at(t){var e=-1,r=t?t.length:0;for(this.clear();++e<r;){var n=t[e];this.set(n[0],n[1])}}function ut(t){this.__data__=new it(t)}function st(t,e){var r=wt(t)||function(t){return function(t){return function(t){return!!t&&"object"==typeof t}(t)&&Ot(t)}(t)&&k.call(t,"callee")&&(!M.call(t,"callee")||T.call(t)==n)}(t)?function(t,e){for(var r=-1,n=Array(t);++r<t;)n[r]=e(r);return n}(t.length,String):[],o=r.length,i=!!o;for(var a in t)!e&&!k.call(t,a)||i&&("length"==a||mt(a,o))||r.push(a);return r}function ct(t,e,r){var n=t[e];k.call(t,e)&&xt(n,r)&&(void 0!==r||e in t)||(t[e]=r)}function lt(t,e){for(var r=t.length;r--;)if(xt(t[r][0],e))return r;return-1}function ft(t,e,r,c,l,p,y){var g;if(c&&(g=p?c(t,l,p,y):c(t)),void 0!==g)return g;if(!Et(t))return t;var d=wt(t);if(d){if(g=function(t){var e=t.length,r=t.constructor(e);e&&"string"==typeof t[0]&&k.call(t,"index")&&(r.index=t.index,r.input=t.input);return r}(t),!e)return function(t,e){var r=-1,n=t.length;e||(e=Array(n));for(;++r<n;)e[r]=t[r];return e}(t,g)}else{var h=vt(t),b=h==o||h==i;if(At(t))return function(t,e){if(e)return t.slice();var r=new t.constructor(t.length);return t.copy(r),r}(t,e);if("[object Object]"==h||h==n||b&&!p){if(j(t))return p?t:{};if(g=function(t){return"function"!=typeof t.constructor||_t(t)?{}:(e=R(t),Et(e)?B(e):{});var e}(b?{}:t),!e)return function(t,e){return gt(t,bt(t),e)}(t,function(t,e){return t&&gt(e,qt(e),t)}(g,t))}else{if(!f[h])return p?t:{};g=function(t,e,r,n){var o=t.constructor;switch(e){case"[object ArrayBuffer]":return yt(t);case"[object Boolean]":case"[object Date]":return new o(+t);case"[object DataView]":return function(t,e){var r=e?yt(t.buffer):t.buffer;return new t.constructor(r,t.byteOffset,t.byteLength)}(t,n);case"[object Float32Array]":case"[object Float64Array]":case"[object Int8Array]":case"[object Int16Array]":case"[object Int32Array]":case"[object Uint8Array]":case"[object Uint8ClampedArray]":case"[object Uint16Array]":case"[object Uint32Array]":return function(t,e){var r=e?yt(t.buffer):t.buffer;return new t.constructor(r,t.byteOffset,t.length)}(t,n);case a:return function(t,e,r){return _(e?r(x(t),!0):x(t),v,new t.constructor)}(t,n,r);case"[object Number]":case"[object String]":return new o(t);case"[object RegExp]":return function(t){var e=new t.constructor(t.source,s.exec(t));return e.lastIndex=t.lastIndex,e}(t);case u:return function(t,e,r){return _(e?r(O(t),!0):O(t),m,new t.constructor)}(t,n,r);case"[object Symbol]":return i=t,nt?Object(nt.call(i)):{}}var i}(t,h,ft,e)}}y||(y=new ut);var w=y.get(t);if(w)return w;if(y.set(t,g),!d)var A=r?function(t){return function(t,e,r){var n=e(t);return wt(t)?n:function(t,e){for(var r=-1,n=e.length,o=t.length;++r<n;)t[o+r]=e[r];return t}(n,r(t))}(t,qt,bt)}(t):qt(t);return function(t,e){for(var r=-1,n=t?t.length:0;++r<n&&!1!==e(t[r],r,t););}(A||t,(function(n,o){A&&(n=t[o=n]),ct(g,o,ft(n,e,r,c,o,t,y))})),g}function pt(t){return!(!Et(t)||(e=t,P&&P in e))&&(St(t)||j(t)?N:c).test(jt(t));var e}function yt(t){var e=new t.constructor(t.byteLength);return new F(e).set(new F(t)),e}function gt(t,e,r,n){r||(r={});for(var o=-1,i=e.length;++o<i;){var a=e[o],u=n?n(r[a],t[a],a,r,t):void 0;ct(r,a,void 0===u?t[a]:u)}return r}function dt(t,e){var r,n,o=t.__data__;return("string"==(n=typeof(r=e))||"number"==n||"symbol"==n||"boolean"==n?"__proto__"!==r:null===r)?o["string"==typeof e?"string":"hash"]:o.map}function ht(t,e){var r=function(t,e){return null==t?void 0:t[e]}(t,e);return pt(r)?r:void 0}ot.prototype.clear=function(){this.__data__=Q?Q(null):{}},ot.prototype.delete=function(t){return this.has(t)&&delete this.__data__[t]},ot.prototype.get=function(t){var e=this.__data__;if(Q){var r=e[t];return"__lodash_hash_undefined__"===r?void 0:r}return k.call(e,t)?e[t]:void 0},ot.prototype.has=function(t){var e=this.__data__;return Q?void 0!==e[t]:k.call(e,t)},ot.prototype.set=function(t,e){return this.__data__[t]=Q&&void 0===e?"__lodash_hash_undefined__":e,this},it.prototype.clear=function(){this.__data__=[]},it.prototype.delete=function(t){var e=this.__data__,r=lt(e,t);return!(r<0)&&(r==e.length-1?e.pop():$.call(e,r,1),!0)},it.prototype.get=function(t){var e=this.__data__,r=lt(e,t);return r<0?void 0:e[r][1]},it.prototype.has=function(t){return lt(this.__data__,t)>-1},it.prototype.set=function(t,e){var r=this.__data__,n=lt(r,t);return n<0?r.push([t,e]):r[n][1]=e,this},at.prototype.clear=function(){this.__data__={hash:new ot,map:new(G||it),string:new ot}},at.prototype.delete=function(t){return dt(this,t).delete(t)},at.prototype.get=function(t){return dt(this,t).get(t)},at.prototype.has=function(t){return dt(this,t).has(t)},at.prototype.set=function(t,e){return dt(this,t).set(t,e),this},ut.prototype.clear=function(){this.__data__=new it},ut.prototype.delete=function(t){return this.__data__.delete(t)},ut.prototype.get=function(t){return this.__data__.get(t)},ut.prototype.has=function(t){return this.__data__.has(t)},ut.prototype.set=function(t,e){var r=this.__data__;if(r instanceof it){var n=r.__data__;if(!G||n.length<199)return n.push([t,e]),this;r=this.__data__=new at(n)}return r.set(t,e),this};var bt=C?w(C,Object):function(){return[]},vt=function(t){return T.call(t)};function mt(t,e){return!!(e=null==e?9007199254740991:e)&&("number"==typeof t||l.test(t))&&t>-1&&t%1==0&&t<e}function _t(t){var e=t&&t.constructor;return t===("function"==typeof e&&e.prototype||q)}function jt(t){if(null!=t){try{return D.call(t)}catch(t){}try{return t+""}catch(t){}}return""}function xt(t,e){return t===e||t!=t&&e!=e}(z&&"[object DataView]"!=vt(new z(new ArrayBuffer(1)))||G&&vt(new G)!=a||H&&"[object Promise]"!=vt(H.resolve())||J&&vt(new J)!=u||K&&"[object WeakMap]"!=vt(new K))&&(vt=function(t){var e=T.call(t),r="[object Object]"==e?t.constructor:void 0,n=r?jt(r):void 0;if(n)switch(n){case X:return"[object DataView]";case Y:return a;case Z:return"[object Promise]";case tt:return u;case et:return"[object WeakMap]"}return e});var wt=Array.isArray;function Ot(t){return null!=t&&function(t){return"number"==typeof t&&t>-1&&t%1==0&&t<=9007199254740991}(t.length)&&!St(t)}var At=V||function(){return!1};function St(t){var e=Et(t)?T.call(t):"";return e==o||e==i}function Et(t){var e=typeof t;return!!t&&("object"==e||"function"==e)}function qt(t){return Ot(t)?st(t):function(t){if(!_t(t))return W(t);var e=[];for(var r in Object(t))k.call(t,r)&&"constructor"!=r&&e.push(r);return e}(t)}e.exports=function(t){return ft(t,!0,!0)}}));function n(t,e,r){return e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}function o(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),r.push.apply(r,n)}return r}function i(t){for(var e=1;e<arguments.length;e++){var r=null!=arguments[e]?arguments[e]:{};e%2?o(Object(r),!0).forEach((function(e){n(t,e,r[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(r,e))}))}return t}function a(t,e){if("string"==typeof t&&t.length)for(var r,n=i(i({},{offset:0}),e),o=null,a=0,u=t.length;a<=u;a++){if(null!==o&&(t[a]&&t[a].trim().length&&!/\d/.test(t[a])&&!["."].includes(t[a])||!t[a]))return{start:n.offset+o,end:n.offset+r+1,value:t.slice(o,r+1)};if(/^\d*$/.test(t[a])&&(r=a,null===o&&(o=a)),null===o&&t[a]&&t[a].trim().length&&!/[\d.'"`]/.test(t[a]))return}}var u=function(t,e,r){return"single"===t?e:"".concat(e,".").concat("".concat(r).padStart(2,"0"))},s=new Set(["ok","notOk","true","false","assert","assertNot","error","ifErr","ifError","rejects","resolves","resolveMatchSnapshot","throws","throw","doesNotThrow","notThrow","expectUncaughtException"]),c=new Set(["emits","rejects","resolveMatch","throws","throw","expectUncaughtException","equal","equals","isEqual","is","strictEqual","strictEquals","strictIs","isStrict","isStrictly","notEqual","inequal","notEqual","notEquals","notStrictEqual","notStrictEquals","isNotEqual","isNot","doesNotEqual","isInequal","same","equivalent","looseEqual","looseEquals","deepEqual","deepEquals","isLoose","looseIs","notSame","inequivalent","looseInequal","notDeep","deepInequal","notLoose","looseNot","strictSame","strictEquivalent","strictDeepEqual","sameStrict","deepIs","isDeeply","isDeep","strictDeepEquals","strictNotSame","strictInequivalent","strictDeepInequal","notSameStrict","deepNot","notDeeply","strictDeepInequals","notStrictSame","hasStrict","match","has","hasFields","matches","similar","like","isLike","includes","include","contains","notMatch","dissimilar","unsimilar","notSimilar","unlike","isUnlike","notLike","isNotLike","doesNotHave","isNotSimilar","isDissimilar","type","isa","isA"]);return{configs:{recommended:{plugins:["test-num"],rules:{"no-console":"off","test-num/correct-test-num":"error"}}},rules:{"correct-test-num":{create:function(t){var e=0;return{ExpressionStatement:function(n){if("CallExpression"===r.get(n,"expression.type")&&["test","only","skip"].includes(r.get(n,"expression.callee.property.name"))&&["TemplateLiteral","Literal"].includes(r.get(n,"expression.arguments.0.type"))){var o,i="".concat(e+=1).padStart(2,"0");if(!o&&"TemplateLiteral"===r.get(n,"expression.arguments.0.type")&&r.has(n,"expression.arguments.0.quasis.0.value.raw")){var l=a(r.get(n,"expression.arguments.0.quasis.0.value.raw"),{offset:r.get(n,"expression.arguments.0.quasis.0.start"),returnRangesOnly:!0})||{},f=l.start,p=l.end,y=l.value;f&&p&&y&&y!==i&&(o={start:f,end:p,value:i,node:r.get(n,"expression.arguments.0.quasis.0")})}if(!o&&"Literal"===n.expression.arguments[0].type&&n.expression.arguments[0].raw){var g=a(n.expression.arguments[0].raw,{offset:n.expression.arguments[0].start,returnRangesOnly:!0})||{},d=g.start,h=g.end,b=g.value;d&&h&&b&&b!==i&&(o={start:d,end:h,value:i,node:n.expression.arguments[0]})}if(!o&&"ArrowFunctionExpression"===r.get(n,"expression.arguments.1.type")&&"BlockStatement"===r.get(n,"expression.arguments.1.body.type")&&r.get(n,"expression.arguments.1.body.body").length){var v,m="multiple";2===(v=r.get(n,"expression.arguments.1.body.body").filter((function(t){return"ExpressionStatement"===t.type}))).length&&"end"===r.get(v[v.length-1],"expression.callee.property.name")&&(m="single");var _=r.get(n,"expression.arguments.1.body.body");if(Array.isArray(_))for(var j=0,x=0,w=_.length;x<w;x++){var O=r.get(_[x],"expression.callee.property.name");if(O){var A=void 0;if(c.has(O)&&r.has(_[x],"expression.arguments.2")?A=2:s.has(O)&&r.has(_[x],"expression.arguments.1")&&(A=1),A){if("continue"===function(){var e=void 0,n=void 0,o=void 0;"TemplateLiteral"===r.get(_[x],"expression.arguments.".concat(A,".type"))?(n="expression.arguments.".concat(A,".quasis.0"),e=r.get(_[x],"".concat(n,".value.raw")),o=r.get(_[x],"".concat(n,".start")),j+=1):"Literal"===r.get(_[x],"expression.arguments.".concat(A,".type"))&&(n="expression.arguments.".concat(A),e=r.get(_[x],"".concat(n,".raw")),o=r.get(_[x],"".concat(n,".start")),j+=1);var s=a(e,{offset:o,returnRangesOnly:!0})||{},c=s.start,l=s.end;if(!c||!l)return"continue";var f=u(m,i,j);a(e).value!==f&&t.report({node:r.get(_[x],n),messageId:"correctTestNum",fix:function(t){return t.replaceTextRange([c,l],f)}})}())continue}else{var S=void 0;c.has(O)&&Array.isArray(r.get(_[x],"expression.arguments"))&&2===r.get(_[x],"expression.arguments").length?S=2:s.has(O)&&Array.isArray(r.get(_[x],"expression.arguments"))&&1===r.get(_[x],"expression.arguments").length&&(S=1),S&&function(){var e=r.get(_[x],"expression.end")-1,n=u(m,i,j),o=t.getSourceCode().getText(),a=e,s=function(t,e,r){if("string"!=typeof t||!t.length)return null;if(e&&"number"==typeof e||(e=0),e<1)return null;if(t[e-1]&&(!r&&t[e-1].trim()||r&&(t[e-1].trim()||"\n\r".includes(t[e-1]))))return e-1;if(t[e-2]&&(!r&&t[e-2].trim()||r&&(t[e-2].trim()||"\n\r".includes(t[e-2]))))return e-2;for(let n=e;n--;)if(t[n]&&(!r&&t[n].trim()||r&&(t[n].trim()||"\n\r".includes(t[n]))))return n;return null}(o,a,!1)+1,c=', "'.concat(n,'"');if(o.slice(s,a).includes("\n")){var l=Array.from(o.slice(s,a)).filter((function(t){return!"\r\n".includes(t)})).join("");c=",\n".concat(l,'  "').concat(n,'"\n').concat(l)}t.report({node:_[x],messageId:"correctTestNum",fix:function(t){return t.replaceTextRange([s,a],c)}})}()}}}}o&&t.report({messageId:"correctTestNum",node:o.node||n,fix:function(t){return t.replaceTextRange([o.start,o.end],o.value)}})}}}},meta:{type:"suggestion",messages:{correctTestNum:"Update the test number."},fixable:"code"}}}}}));
