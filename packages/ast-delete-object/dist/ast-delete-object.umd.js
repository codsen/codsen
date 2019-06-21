/**
 * ast-delete-object
 * Delete all plain objects that contain a certain key/value pair
 * Version: 1.8.26
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/ast-delete-object
 */

!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):(t=t||self).astDeleteObject=e()}(this,function(){"use strict";var t="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{};function e(t,e){return t(e={exports:{}},e.exports),e.exports}var r=e(function(e,r){var n=200,o="__lodash_hash_undefined__",i=9007199254740991,a="[object Arguments]",c="[object Boolean]",u="[object Date]",s="[object Function]",f="[object GeneratorFunction]",l="[object Map]",h="[object Number]",p="[object Object]",y="[object RegExp]",g="[object Set]",d="[object String]",b="[object Symbol]",v="[object ArrayBuffer]",m="[object DataView]",_="[object Float32Array]",j="[object Float64Array]",w="[object Int8Array]",O="[object Int16Array]",$="[object Int32Array]",S="[object Uint8Array]",A="[object Uint8ClampedArray]",T="[object Uint16Array]",k="[object Uint32Array]",N=/\w*$/,W=/^\[object .+?Constructor\]$/,E=/^(?:0|[1-9]\d*)$/,M={};M[a]=M["[object Array]"]=M[v]=M[m]=M[c]=M[u]=M[_]=M[j]=M[w]=M[O]=M[$]=M[l]=M[h]=M[p]=M[y]=M[g]=M[d]=M[b]=M[S]=M[A]=M[T]=M[k]=!0,M["[object Error]"]=M[s]=M["[object WeakMap]"]=!1;var P="object"==typeof t&&t&&t.Object===Object&&t,I="object"==typeof self&&self&&self.Object===Object&&self,x=P||I||Function("return this")(),F=r&&!r.nodeType&&r,J=F&&e&&!e.nodeType&&e,L=J&&J.exports===F;function D(t,e){return t.set(e[0],e[1]),t}function K(t,e){return t.add(e),t}function C(t,e,r,n){var o=-1,i=t?t.length:0;for(n&&i&&(r=t[++o]);++o<i;)r=e(r,t[o],o,t);return r}function R(t){var e=!1;if(null!=t&&"function"!=typeof t.toString)try{e=!!(t+"")}catch(t){}return e}function H(t){var e=-1,r=Array(t.size);return t.forEach(function(t,n){r[++e]=[n,t]}),r}function V(t,e){return function(r){return t(e(r))}}function q(t){var e=-1,r=Array(t.size);return t.forEach(function(t){r[++e]=t}),r}var B,U=Array.prototype,G=Function.prototype,z=Object.prototype,Q=x["__core-js_shared__"],X=(B=/[^.]+$/.exec(Q&&Q.keys&&Q.keys.IE_PROTO||""))?"Symbol(src)_1."+B:"",Y=G.toString,Z=z.hasOwnProperty,tt=z.toString,et=RegExp("^"+Y.call(Z).replace(/[\\^$.*+?()[\]{}|]/g,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$"),rt=L?x.Buffer:void 0,nt=x.Symbol,ot=x.Uint8Array,it=V(Object.getPrototypeOf,Object),at=Object.create,ct=z.propertyIsEnumerable,ut=U.splice,st=Object.getOwnPropertySymbols,ft=rt?rt.isBuffer:void 0,lt=V(Object.keys,Object),ht=Jt(x,"DataView"),pt=Jt(x,"Map"),yt=Jt(x,"Promise"),gt=Jt(x,"Set"),dt=Jt(x,"WeakMap"),bt=Jt(Object,"create"),vt=Rt(ht),mt=Rt(pt),_t=Rt(yt),jt=Rt(gt),wt=Rt(dt),Ot=nt?nt.prototype:void 0,$t=Ot?Ot.valueOf:void 0;function St(t){var e=-1,r=t?t.length:0;for(this.clear();++e<r;){var n=t[e];this.set(n[0],n[1])}}function At(t){var e=-1,r=t?t.length:0;for(this.clear();++e<r;){var n=t[e];this.set(n[0],n[1])}}function Tt(t){var e=-1,r=t?t.length:0;for(this.clear();++e<r;){var n=t[e];this.set(n[0],n[1])}}function kt(t){this.__data__=new At(t)}function Nt(t,e){var r=Vt(t)||function(t){return function(t){return function(t){return!!t&&"object"==typeof t}(t)&&qt(t)}(t)&&Z.call(t,"callee")&&(!ct.call(t,"callee")||tt.call(t)==a)}(t)?function(t,e){for(var r=-1,n=Array(t);++r<t;)n[r]=e(r);return n}(t.length,String):[],n=r.length,o=!!n;for(var i in t)!e&&!Z.call(t,i)||o&&("length"==i||Kt(i,n))||r.push(i);return r}function Wt(t,e,r){var n=t[e];Z.call(t,e)&&Ht(n,r)&&(void 0!==r||e in t)||(t[e]=r)}function Et(t,e){for(var r=t.length;r--;)if(Ht(t[r][0],e))return r;return-1}function Mt(t,e,r,n,o,i,W){var E;if(n&&(E=i?n(t,o,i,W):n(t)),void 0!==E)return E;if(!Gt(t))return t;var P=Vt(t);if(P){if(E=function(t){var e=t.length,r=t.constructor(e);e&&"string"==typeof t[0]&&Z.call(t,"index")&&(r.index=t.index,r.input=t.input);return r}(t),!e)return function(t,e){var r=-1,n=t.length;e||(e=Array(n));for(;++r<n;)e[r]=t[r];return e}(t,E)}else{var I=Dt(t),x=I==s||I==f;if(Bt(t))return function(t,e){if(e)return t.slice();var r=new t.constructor(t.length);return t.copy(r),r}(t,e);if(I==p||I==a||x&&!i){if(R(t))return i?t:{};if(E=function(t){return"function"!=typeof t.constructor||Ct(t)?{}:(e=it(t),Gt(e)?at(e):{});var e}(x?{}:t),!e)return function(t,e){return xt(t,Lt(t),e)}(t,function(t,e){return t&&xt(e,zt(e),t)}(E,t))}else{if(!M[I])return i?t:{};E=function(t,e,r,n){var o=t.constructor;switch(e){case v:return It(t);case c:case u:return new o(+t);case m:return function(t,e){var r=e?It(t.buffer):t.buffer;return new t.constructor(r,t.byteOffset,t.byteLength)}(t,n);case _:case j:case w:case O:case $:case S:case A:case T:case k:return function(t,e){var r=e?It(t.buffer):t.buffer;return new t.constructor(r,t.byteOffset,t.length)}(t,n);case l:return function(t,e,r){return C(e?r(H(t),!0):H(t),D,new t.constructor)}(t,n,r);case h:case d:return new o(t);case y:return(s=new(a=t).constructor(a.source,N.exec(a))).lastIndex=a.lastIndex,s;case g:return function(t,e,r){return C(e?r(q(t),!0):q(t),K,new t.constructor)}(t,n,r);case b:return i=t,$t?Object($t.call(i)):{}}var i;var a,s}(t,I,Mt,e)}}W||(W=new kt);var F=W.get(t);if(F)return F;if(W.set(t,E),!P)var J=r?function(t){return function(t,e,r){var n=e(t);return Vt(t)?n:function(t,e){for(var r=-1,n=e.length,o=t.length;++r<n;)t[o+r]=e[r];return t}(n,r(t))}(t,zt,Lt)}(t):zt(t);return function(t,e){for(var r=-1,n=t?t.length:0;++r<n&&!1!==e(t[r],r,t););}(J||t,function(o,i){J&&(o=t[i=o]),Wt(E,i,Mt(o,e,r,n,i,t,W))}),E}function Pt(t){return!(!Gt(t)||(e=t,X&&X in e))&&(Ut(t)||R(t)?et:W).test(Rt(t));var e}function It(t){var e=new t.constructor(t.byteLength);return new ot(e).set(new ot(t)),e}function xt(t,e,r,n){r||(r={});for(var o=-1,i=e.length;++o<i;){var a=e[o],c=n?n(r[a],t[a],a,r,t):void 0;Wt(r,a,void 0===c?t[a]:c)}return r}function Ft(t,e){var r,n,o=t.__data__;return("string"==(n=typeof(r=e))||"number"==n||"symbol"==n||"boolean"==n?"__proto__"!==r:null===r)?o["string"==typeof e?"string":"hash"]:o.map}function Jt(t,e){var r=function(t,e){return null==t?void 0:t[e]}(t,e);return Pt(r)?r:void 0}St.prototype.clear=function(){this.__data__=bt?bt(null):{}},St.prototype.delete=function(t){return this.has(t)&&delete this.__data__[t]},St.prototype.get=function(t){var e=this.__data__;if(bt){var r=e[t];return r===o?void 0:r}return Z.call(e,t)?e[t]:void 0},St.prototype.has=function(t){var e=this.__data__;return bt?void 0!==e[t]:Z.call(e,t)},St.prototype.set=function(t,e){return this.__data__[t]=bt&&void 0===e?o:e,this},At.prototype.clear=function(){this.__data__=[]},At.prototype.delete=function(t){var e=this.__data__,r=Et(e,t);return!(r<0||(r==e.length-1?e.pop():ut.call(e,r,1),0))},At.prototype.get=function(t){var e=this.__data__,r=Et(e,t);return r<0?void 0:e[r][1]},At.prototype.has=function(t){return Et(this.__data__,t)>-1},At.prototype.set=function(t,e){var r=this.__data__,n=Et(r,t);return n<0?r.push([t,e]):r[n][1]=e,this},Tt.prototype.clear=function(){this.__data__={hash:new St,map:new(pt||At),string:new St}},Tt.prototype.delete=function(t){return Ft(this,t).delete(t)},Tt.prototype.get=function(t){return Ft(this,t).get(t)},Tt.prototype.has=function(t){return Ft(this,t).has(t)},Tt.prototype.set=function(t,e){return Ft(this,t).set(t,e),this},kt.prototype.clear=function(){this.__data__=new At},kt.prototype.delete=function(t){return this.__data__.delete(t)},kt.prototype.get=function(t){return this.__data__.get(t)},kt.prototype.has=function(t){return this.__data__.has(t)},kt.prototype.set=function(t,e){var r=this.__data__;if(r instanceof At){var o=r.__data__;if(!pt||o.length<n-1)return o.push([t,e]),this;r=this.__data__=new Tt(o)}return r.set(t,e),this};var Lt=st?V(st,Object):function(){return[]},Dt=function(t){return tt.call(t)};function Kt(t,e){return!!(e=null==e?i:e)&&("number"==typeof t||E.test(t))&&t>-1&&t%1==0&&t<e}function Ct(t){var e=t&&t.constructor;return t===("function"==typeof e&&e.prototype||z)}function Rt(t){if(null!=t){try{return Y.call(t)}catch(t){}try{return t+""}catch(t){}}return""}function Ht(t,e){return t===e||t!=t&&e!=e}(ht&&Dt(new ht(new ArrayBuffer(1)))!=m||pt&&Dt(new pt)!=l||yt&&"[object Promise]"!=Dt(yt.resolve())||gt&&Dt(new gt)!=g||dt&&"[object WeakMap]"!=Dt(new dt))&&(Dt=function(t){var e=tt.call(t),r=e==p?t.constructor:void 0,n=r?Rt(r):void 0;if(n)switch(n){case vt:return m;case mt:return l;case _t:return"[object Promise]";case jt:return g;case wt:return"[object WeakMap]"}return e});var Vt=Array.isArray;function qt(t){return null!=t&&function(t){return"number"==typeof t&&t>-1&&t%1==0&&t<=i}(t.length)&&!Ut(t)}var Bt=ft||function(){return!1};function Ut(t){var e=Gt(t)?tt.call(t):"";return e==s||e==f}function Gt(t){var e=typeof t;return!!t&&("object"==e||"function"==e)}function zt(t){return qt(t)?Nt(t):function(t){if(!Ct(t))return lt(t);var e=[];for(var r in Object(t))Z.call(t,r)&&"constructor"!=r&&e.push(r);return e}(t)}e.exports=function(t){return Mt(t,!0,!0)}}),n="[object Object]";var o,i,a=Function.prototype,c=Object.prototype,u=a.toString,s=c.hasOwnProperty,f=u.call(Object),l=c.toString,h=(o=Object.getPrototypeOf,i=Object,function(t){return o(i(t))});var p=function(t){if(!function(t){return!!t&&"object"==typeof t}(t)||l.call(t)!=n||function(t){var e=!1;if(null!=t&&"function"!=typeof t.toString)try{e=!!(t+"")}catch(t){}return e}(t))return!1;var e=h(t);if(null===e)return!0;var r=s.call(e,"constructor")&&e.constructor;return"function"==typeof r&&r instanceof r&&u.call(r)==f};function y(t,e,r){if(e!=e)return function(t,e,r,n){for(var o=t.length,i=r+(n?1:-1);n?i--:++i<o;)if(e(t[i],i,t))return i;return-1}(t,d,r);for(var n=r-1,o=t.length;++n<o;)if(t[n]===e)return n;return-1}function g(t,e,r,n){for(var o=r-1,i=t.length;++o<i;)if(n(t[o],e))return o;return-1}function d(t){return t!=t}var b=Array.prototype.splice;function v(t,e,r,n){var o=n?g:y,i=-1,a=e.length,c=t;for(t===e&&(e=function(t,e){var r=-1,n=t.length;e||(e=Array(n));for(;++r<n;)e[r]=t[r];return e}(e)),r&&(c=function(t,e){for(var r=-1,n=t?t.length:0,o=Array(n);++r<n;)o[r]=e(t[r],r,t);return o}(t,function(t){return function(e){return t(e)}}(r)));++i<a;)for(var u=0,s=e[i],f=r?r(s):s;(u=o(c,f,u,n))>-1;)c!==t&&b.call(c,u,1),b.call(t,u,1);return t}var m=function(t,e){return t&&t.length&&e&&e.length?v(t,e):t},_=e(function(e,r){var n,o,i,a,c,u,s,f,l,h,p,y,g,d,b,v,m,_,j,w;e.exports=(n="function"==typeof Promise,o="object"==typeof self?self:t,i="undefined"!=typeof Symbol,a="undefined"!=typeof Map,c="undefined"!=typeof Set,u="undefined"!=typeof WeakMap,s="undefined"!=typeof WeakSet,f="undefined"!=typeof DataView,l=i&&void 0!==Symbol.iterator,h=i&&void 0!==Symbol.toStringTag,p=c&&"function"==typeof Set.prototype.entries,y=a&&"function"==typeof Map.prototype.entries,g=p&&Object.getPrototypeOf((new Set).entries()),d=y&&Object.getPrototypeOf((new Map).entries()),b=l&&"function"==typeof Array.prototype[Symbol.iterator],v=b&&Object.getPrototypeOf([][Symbol.iterator]()),m=l&&"function"==typeof String.prototype[Symbol.iterator],_=m&&Object.getPrototypeOf(""[Symbol.iterator]()),j=8,w=-1,function(t){var e=typeof t;if("object"!==e)return e;if(null===t)return"null";if(t===o)return"global";if(Array.isArray(t)&&(!1===h||!(Symbol.toStringTag in t)))return"Array";if("object"==typeof window&&null!==window){if("object"==typeof window.location&&t===window.location)return"Location";if("object"==typeof window.document&&t===window.document)return"Document";if("object"==typeof window.navigator){if("object"==typeof window.navigator.mimeTypes&&t===window.navigator.mimeTypes)return"MimeTypeArray";if("object"==typeof window.navigator.plugins&&t===window.navigator.plugins)return"PluginArray"}if(("function"==typeof window.HTMLElement||"object"==typeof window.HTMLElement)&&t instanceof window.HTMLElement){if("BLOCKQUOTE"===t.tagName)return"HTMLQuoteElement";if("TD"===t.tagName)return"HTMLTableDataCellElement";if("TH"===t.tagName)return"HTMLTableHeaderCellElement"}}var r=h&&t[Symbol.toStringTag];if("string"==typeof r)return r;var i=Object.getPrototypeOf(t);return i===RegExp.prototype?"RegExp":i===Date.prototype?"Date":n&&i===Promise.prototype?"Promise":c&&i===Set.prototype?"Set":a&&i===Map.prototype?"Map":s&&i===WeakSet.prototype?"WeakSet":u&&i===WeakMap.prototype?"WeakMap":f&&i===DataView.prototype?"DataView":a&&i===d?"Map Iterator":c&&i===g?"Set Iterator":b&&i===v?"Array Iterator":m&&i===_?"String Iterator":null===i?"Object":Object.prototype.toString.call(t).slice(j,w)})}),j=1/0,w="[object Symbol]",O=/^\s+|\s+$/g,$="[\\ud800-\\udfff]",S="[\\u0300-\\u036f\\ufe20-\\ufe23\\u20d0-\\u20f0]",A="\\ud83c[\\udffb-\\udfff]",T="[^\\ud800-\\udfff]",k="(?:\\ud83c[\\udde6-\\uddff]){2}",N="[\\ud800-\\udbff][\\udc00-\\udfff]",W="(?:"+S+"|"+A+")"+"?",E="[\\ufe0e\\ufe0f]?"+W+("(?:\\u200d(?:"+[T,k,N].join("|")+")[\\ufe0e\\ufe0f]?"+W+")*"),M="(?:"+[T+S+"?",S,k,N,$].join("|")+")",P=RegExp(A+"(?="+A+")|"+M+E,"g"),I=RegExp("[\\u200d\\ud800-\\udfff\\u0300-\\u036f\\ufe20-\\ufe23\\u20d0-\\u20f0\\ufe0e\\ufe0f]"),x="object"==typeof t&&t&&t.Object===Object&&t,F="object"==typeof self&&self&&self.Object===Object&&self,J=x||F||Function("return this")();function L(t,e,r){if(e!=e)return function(t,e,r,n){for(var o=t.length,i=r+(n?1:-1);n?i--:++i<o;)if(e(t[i],i,t))return i;return-1}(t,D,r);for(var n=r-1,o=t.length;++n<o;)if(t[n]===e)return n;return-1}function D(t){return t!=t}function K(t){return function(t){return I.test(t)}(t)?function(t){return t.match(P)||[]}(t):function(t){return t.split("")}(t)}var C=Object.prototype.toString,R=J.Symbol,H=R?R.prototype:void 0,V=H?H.toString:void 0;function q(t){if("string"==typeof t)return t;if(function(t){return"symbol"==typeof t||function(t){return!!t&&"object"==typeof t}(t)&&C.call(t)==w}(t))return V?V.call(t):"";var e=t+"";return"0"==e&&1/t==-j?"-0":e}function B(t,e,r){var n=t.length;return r=void 0===r?n:r,!e&&r>=n?t:function(t,e,r){var n=-1,o=t.length;e<0&&(e=-e>o?0:o+e),(r=r>o?o:r)<0&&(r+=o),o=e>r?0:r-e>>>0,e>>>=0;for(var i=Array(o);++n<o;)i[n]=t[n+e];return i}(t,e,r)}var U=function(t,e,r){var n;if((t=null==(n=t)?"":q(n))&&(r||void 0===e))return t.replace(O,"");if(!t||!(e=q(e)))return t;var o=K(t),i=K(e);return B(o,function(t,e){for(var r=-1,n=t.length;++r<n&&L(e,t[r],0)>-1;);return r}(o,i),function(t,e){for(var r=t.length;r--&&L(e,t[r],0)>-1;);return r}(o,i)+1).join("")};const G=Array.isArray;function z(t){return"string"==typeof t&&t.length>0&&"."===t[0]?t.slice(1):t}function Q(t,e){return function t(e,n,o){const i=r(e);let a,c,u,s,f;if((o=Object.assign({depth:-1,path:""},o)).depth+=1,G(i))for(a=0,c=i.length;a<c;a++){const e=`${o.path}.${a}`;void 0!==i[a]?(o.parent=r(i),o.parentType="array",u=t(n(i[a],void 0,Object.assign({},o,{path:z(e)})),n,Object.assign({},o,{path:z(e)})),Number.isNaN(u)&&a<i.length?(i.splice(a,1),a-=1):i[a]=u):i.splice(a,1)}else if(p(i))for(a=0,c=(s=Object.keys(i)).length;a<c;a++){f=s[a];const e=`${o.path}.${f}`;0===o.depth&&null!=f&&(o.topmostKey=f),o.parent=r(i),o.parentType="object",u=t(n(f,i[f],Object.assign({},o,{path:z(e)})),n,Object.assign({},o,{path:z(e)})),Number.isNaN(u)?delete i[f]:i[f]=u}return i}(t,e,{})}function X(t){function e(t){return"string"==typeof t}const r=Array.isArray;let n=!0;return!!(r(t)||p(t)||e(t))&&(e(t)?0===U(t).length:(t=Q(t,(t,r)=>{const o=void 0!==r?r:t;return e(o)&&""!==U(o)&&(n=!1),o}),n))}const Y=/[|\\{}()[\]^$+*?.-]/g;var Z=t=>{if("string"!=typeof t)throw new TypeError("Expected a string");return t.replace(Y,"\\$&")};const tt=new Map;function et(t,e){e={caseSensitive:!1,...e};const r=t+JSON.stringify(e);if(tt.has(r))return tt.get(r);const n="!"===t[0];n&&(t=t.slice(1)),t=Z(t).replace(/\\\*/g,".*");const o=new RegExp(`^${t}$`,e.caseSensitive?"":"i");return o.negated=n,tt.set(r,o),o}var rt=(t,e,r)=>{if(!Array.isArray(t)||!Array.isArray(e))throw new TypeError(`Expected two arrays, got ${typeof t} ${typeof e}`);if(0===e.length)return t;const n="!"===e[0][0];e=e.map(t=>et(t,r));const o=[];for(const r of t){let t=n;for(const n of e)n.test(r)&&(t=!n.negated);t&&o.push(r)}return o};rt.isMatch=(t,e,r)=>{const n=et(e,r),o=n.test(t);return n.negated?!o:o};var nt="__lodash_hash_undefined__",ot=9007199254740991,it="[object Function]",at="[object GeneratorFunction]",ct=/^\[object .+?Constructor\]$/,ut="object"==typeof t&&t&&t.Object===Object&&t,st="object"==typeof self&&self&&self.Object===Object&&self,ft=ut||st||Function("return this")();function lt(t,e){return!!(t?t.length:0)&&function(t,e,r){if(e!=e)return function(t,e,r,n){var o=t.length,i=r+(n?1:-1);for(;n?i--:++i<o;)if(e(t[i],i,t))return i;return-1}(t,yt,r);var n=r-1,o=t.length;for(;++n<o;)if(t[n]===e)return n;return-1}(t,e,0)>-1}function ht(t,e,r){for(var n=-1,o=t?t.length:0;++n<o;)if(r(e,t[n]))return!0;return!1}function pt(t,e){for(var r=-1,n=t?t.length:0,o=Array(n);++r<n;)o[r]=e(t[r],r,t);return o}function yt(t){return t!=t}function gt(t){return function(e){return t(e)}}function dt(t,e){return t.has(e)}var bt,vt=Array.prototype,mt=Function.prototype,_t=Object.prototype,jt=ft["__core-js_shared__"],wt=(bt=/[^.]+$/.exec(jt&&jt.keys&&jt.keys.IE_PROTO||""))?"Symbol(src)_1."+bt:"",Ot=mt.toString,$t=_t.hasOwnProperty,St=_t.toString,At=RegExp("^"+Ot.call($t).replace(/[\\^$.*+?()[\]{}|]/g,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$"),Tt=vt.splice,kt=Math.max,Nt=Math.min,Wt=Kt(ft,"Map"),Et=Kt(Object,"create");function Mt(t){var e=-1,r=t?t.length:0;for(this.clear();++e<r;){var n=t[e];this.set(n[0],n[1])}}function Pt(t){var e=-1,r=t?t.length:0;for(this.clear();++e<r;){var n=t[e];this.set(n[0],n[1])}}function It(t){var e=-1,r=t?t.length:0;for(this.clear();++e<r;){var n=t[e];this.set(n[0],n[1])}}function xt(t){var e=-1,r=t?t.length:0;for(this.__data__=new It;++e<r;)this.add(t[e])}function Ft(t,e){for(var r,n,o=t.length;o--;)if((r=t[o][0])===(n=e)||r!=r&&n!=n)return o;return-1}function Jt(t){return!(!Rt(t)||function(t){return!!wt&&wt in t}(t))&&(Ct(t)||function(t){var e=!1;if(null!=t&&"function"!=typeof t.toString)try{e=!!(t+"")}catch(t){}return e}(t)?At:ct).test(function(t){if(null!=t){try{return Ot.call(t)}catch(t){}try{return t+""}catch(t){}}return""}(t))}function Lt(t){return function(t){return function(t){return!!t&&"object"==typeof t}(t)&&function(t){return null!=t&&function(t){return"number"==typeof t&&t>-1&&t%1==0&&t<=ot}(t.length)&&!Ct(t)}(t)}(t)?t:[]}function Dt(t,e){var r,n,o=t.__data__;return("string"==(n=typeof(r=e))||"number"==n||"symbol"==n||"boolean"==n?"__proto__"!==r:null===r)?o["string"==typeof e?"string":"hash"]:o.map}function Kt(t,e){var r=function(t,e){return null==t?void 0:t[e]}(t,e);return Jt(r)?r:void 0}function Ct(t){var e=Rt(t)?St.call(t):"";return e==it||e==at}function Rt(t){var e=typeof t;return!!t&&("object"==e||"function"==e)}Mt.prototype.clear=function(){this.__data__=Et?Et(null):{}},Mt.prototype.delete=function(t){return this.has(t)&&delete this.__data__[t]},Mt.prototype.get=function(t){var e=this.__data__;if(Et){var r=e[t];return r===nt?void 0:r}return $t.call(e,t)?e[t]:void 0},Mt.prototype.has=function(t){var e=this.__data__;return Et?void 0!==e[t]:$t.call(e,t)},Mt.prototype.set=function(t,e){return this.__data__[t]=Et&&void 0===e?nt:e,this},Pt.prototype.clear=function(){this.__data__=[]},Pt.prototype.delete=function(t){var e=this.__data__,r=Ft(e,t);return!(r<0||(r==e.length-1?e.pop():Tt.call(e,r,1),0))},Pt.prototype.get=function(t){var e=this.__data__,r=Ft(e,t);return r<0?void 0:e[r][1]},Pt.prototype.has=function(t){return Ft(this.__data__,t)>-1},Pt.prototype.set=function(t,e){var r=this.__data__,n=Ft(r,t);return n<0?r.push([t,e]):r[n][1]=e,this},It.prototype.clear=function(){this.__data__={hash:new Mt,map:new(Wt||Pt),string:new Mt}},It.prototype.delete=function(t){return Dt(this,t).delete(t)},It.prototype.get=function(t){return Dt(this,t).get(t)},It.prototype.has=function(t){return Dt(this,t).has(t)},It.prototype.set=function(t,e){return Dt(this,t).set(t,e),this},xt.prototype.add=xt.prototype.push=function(t){return this.__data__.set(t,nt),this},xt.prototype.has=function(t){return this.__data__.has(t)};var Ht=function(t,e){return e=kt(void 0===e?t.length-1:e,0),function(){for(var r=arguments,n=-1,o=kt(r.length-e,0),i=Array(o);++n<o;)i[n]=r[e+n];n=-1;for(var a=Array(e+1);++n<e;)a[n]=r[n];return a[e]=i,function(t,e,r){switch(r.length){case 0:return t.call(e);case 1:return t.call(e,r[0]);case 2:return t.call(e,r[0],r[1]);case 3:return t.call(e,r[0],r[1],r[2])}return t.apply(e,r)}(t,this,a)}}(function(t){var e=pt(t,Lt);return e.length&&e[0]===t[0]?function(t,e,r){for(var n=r?ht:lt,o=t[0].length,i=t.length,a=i,c=Array(i),u=1/0,s=[];a--;){var f=t[a];a&&e&&(f=pt(f,gt(e))),u=Nt(f.length,u),c[a]=!r&&(e||o>=120&&f.length>=120)?new xt(a&&f):void 0}f=t[0];var l=-1,h=c[0];t:for(;++l<o&&s.length<u;){var p=f[l],y=e?e(p):p;if(p=r||0!==p?p:0,!(h?dt(h,y):n(s,y,r))){for(a=i;--a;){var g=c[a];if(!(g?dt(g,y):n(t[a],y,r)))continue t}h&&h.push(y),s.push(p)}}return s}(e):[]});function Vt(t){return"string"==typeof t?t.length>0?[t]:[]:t}var qt=e(function(t){t.exports=function(){var t=Object.prototype.toString;function e(t,e){return null!=t&&Object.prototype.hasOwnProperty.call(t,e)}function r(t){if(!t)return!0;if(o(t)&&0===t.length)return!0;if("string"!=typeof t){for(var r in t)if(e(t,r))return!1;return!0}return!1}function n(e){return t.call(e)}var o=Array.isArray||function(e){return"[object Array]"===t.call(e)};function i(t){var e=parseInt(t);return e.toString()===t?e:t}function a(t){t=t||{};var a=function(t){return Object.keys(a).reduce(function(e,r){return"create"===r?e:("function"==typeof a[r]&&(e[r]=a[r].bind(a,t)),e)},{})};function c(r,n){return t.includeInheritedProps||"number"==typeof n&&Array.isArray(r)||e(r,n)}function u(t,e){if(c(t,e))return t[e]}function s(t,e,r,n){if("number"==typeof e&&(e=[e]),!e||0===e.length)return t;if("string"==typeof e)return s(t,e.split(".").map(i),r,n);var o=e[0],a=u(t,o);return 1===e.length?(void 0!==a&&n||(t[o]=r),a):(void 0===a&&("number"==typeof e[1]?t[o]=[]:t[o]={}),s(t[o],e.slice(1),r,n))}return a.has=function(r,n){if("number"==typeof n?n=[n]:"string"==typeof n&&(n=n.split(".")),!n||0===n.length)return!!r;for(var a=0;a<n.length;a++){var c=i(n[a]);if(!("number"==typeof c&&o(r)&&c<r.length||(t.includeInheritedProps?c in Object(r):e(r,c))))return!1;r=r[c]}return!0},a.ensureExists=function(t,e,r){return s(t,e,r,!0)},a.set=function(t,e,r,n){return s(t,e,r,n)},a.insert=function(t,e,r,n){var i=a.get(t,e);n=~~n,o(i)||(i=[],a.set(t,e,i)),i.splice(n,0,r)},a.empty=function(t,e){var i,u;if(!r(e)&&null!=t&&(i=a.get(t,e))){if("string"==typeof i)return a.set(t,e,"");if(function(t){return"boolean"==typeof t||"[object Boolean]"===n(t)}(i))return a.set(t,e,!1);if("number"==typeof i)return a.set(t,e,0);if(o(i))i.length=0;else{if(!function(t){return"object"==typeof t&&"[object Object]"===n(t)}(i))return a.set(t,e,null);for(u in i)c(i,u)&&delete i[u]}}},a.push=function(t,e){var r=a.get(t,e);o(r)||(r=[],a.set(t,e,r)),r.push.apply(r,Array.prototype.slice.call(arguments,2))},a.coalesce=function(t,e,r){for(var n,o=0,i=e.length;o<i;o++)if(void 0!==(n=a.get(t,e[o])))return n;return r},a.get=function(t,e,r){if("number"==typeof e&&(e=[e]),!e||0===e.length)return t;if(null==t)return r;if("string"==typeof e)return a.get(t,e.split("."),r);var n=i(e[0]),o=u(t,n);return void 0===o?r:1===e.length?o:a.get(t[n],e.slice(1),r)},a.del=function(t,e){if("number"==typeof e&&(e=[e]),null==t)return t;if(r(e))return t;if("string"==typeof e)return a.del(t,e.split("."));var n=i(e[0]);return c(t,n)?1!==e.length?a.del(t[n],e.slice(1)):(o(t)?t.splice(n,1):delete t[n],t):t},a}var c=a();return c.create=a,c.withInheritedProps=a({includeInheritedProps:!0}),c}()}),Bt=function(t){var e=(t=Math.abs(t))%100;if(e>=10&&e<=20)return"th";var r=t%10;return 1===r?"st":2===r?"nd":3===r?"rd":"th"};function Ut(t){if("number"!=typeof t)throw new TypeError("Expected Number, got "+typeof t+" "+t);return Number.isFinite(t)?t+Bt(t):t}Ut.indicator=Bt;var Gt=Ut;function zt(t,e,r){return function t(e,r,n,o=!0){const i=Object.prototype.hasOwnProperty;function a(t){return null!=t}function c(t){return"Object"===_(t)}function u(t,e){return e=Vt(e),Array.from(t).filter(t=>!e.some(e=>rt.isMatch(t,e,{caseSensitive:!0})))}const s=["any","anything","every","everything","all","whatever","whatevs"],f=Array.isArray;if(!a(e))throw new Error("check-types-mini: [THROW_ID_01] First argument is missing!");const l={ignoreKeys:[],ignorePaths:[],acceptArrays:!1,acceptArraysIgnore:[],enforceStrictKeyset:!0,schema:{},msg:"check-types-mini",optsVarName:"opts"};let h;if(h=a(n)&&c(n)?Object.assign({},l,n):Object.assign({},l),a(h.ignoreKeys)&&h.ignoreKeys?h.ignoreKeys=Vt(h.ignoreKeys):h.ignoreKeys=[],a(h.ignorePaths)&&h.ignorePaths?h.ignorePaths=Vt(h.ignorePaths):h.ignorePaths=[],a(h.acceptArraysIgnore)&&h.acceptArraysIgnore?h.acceptArraysIgnore=Vt(h.acceptArraysIgnore):h.acceptArraysIgnore=[],h.msg="string"==typeof h.msg?h.msg.trim():h.msg,":"===h.msg[h.msg.length-1]&&(h.msg=h.msg.slice(0,h.msg.length-1).trim()),h.schema&&(Object.keys(h.schema).forEach(t=>{if(c(h.schema[t])){const e={};Q(h.schema[t],(r,n,o)=>{const i=void 0!==n?n:r;return f(i)||c(i)||(e[`${t}.${o.path}`]=i),i}),delete h.schema[t],h.schema=Object.assign(h.schema,e)}}),Object.keys(h.schema).forEach(t=>{f(h.schema[t])||(h.schema[t]=[h.schema[t]]),h.schema[t]=h.schema[t].map(String).map(t=>t.toLowerCase()).map(t=>t.trim())})),a(r)||(r={}),o&&t(h,l,{enforceStrictKeyset:!1},!1),h.enforceStrictKeyset)if(a(h.schema)&&Object.keys(h.schema).length>0){if(0!==u(m(Object.keys(e),Object.keys(r).concat(Object.keys(h.schema))),h.ignoreKeys).length){const t=m(Object.keys(e),Object.keys(r).concat(Object.keys(h.schema)));throw new TypeError(`${h.msg}: ${h.optsVarName}.enforceStrictKeyset is on and the following key${t.length>1?"s":""} ${t.length>1?"are":"is"} not covered by schema and/or reference objects: ${t.join(", ")}`)}}else{if(!(a(r)&&Object.keys(r).length>0))throw new TypeError(`${h.msg}: Both ${h.optsVarName}.schema and reference objects are missing! We don't have anything to match the keys as you requested via opts.enforceStrictKeyset!`);if(0!==u(m(Object.keys(e),Object.keys(r)),h.ignoreKeys).length){const t=m(Object.keys(e),Object.keys(r));throw new TypeError(`${h.msg}: The input object has key${t.length>1?"s":""} which ${t.length>1?"are":"is"} not covered by the reference object: ${t.join(", ")}`)}if(0!==u(m(Object.keys(r),Object.keys(e)),h.ignoreKeys).length){const t=m(Object.keys(r),Object.keys(e));throw new TypeError(`${h.msg}: The reference object has key${t.length>1?"s":""} which ${t.length>1?"are":"is"} not present in the input object: ${t.join(", ")}`)}}const p=[];Q(e,(t,n,o)=>{let a=n,u=t;if("array"===o.parentType&&(u=void 0,a=t),f(p)&&p.length&&p.some(t=>o.path.startsWith(t)))return a;if(u&&h.ignoreKeys.some(t=>rt.isMatch(u,t)))return a;if(h.ignorePaths.some(t=>rt.isMatch(o.path,t)))return a;const l=!(!c(a)&&!f(a)&&f(o.parent));let y=!1;c(h.schema)&&i.call(h.schema,qt.get(o.path))&&(y=!0);let g=!1;if(c(r)&&qt.has(r,qt.get(o.path))&&(g=!0),h.enforceStrictKeyset&&l&&!y&&!g)throw new TypeError(`${h.msg}: ${h.optsVarName}.${o.path} is neither covered by reference object (second input argument), nor ${h.optsVarName}.schema! To stop this error, turn off ${h.optsVarName}.enforceStrictKeyset or provide some type reference (2nd argument or ${h.optsVarName}.schema).\n\nDebug info:\n\nobj = ${JSON.stringify(e,null,4)}\n\nref = ${JSON.stringify(r,null,4)}\n\ninnerObj = ${JSON.stringify(o,null,4)}\n\nopts = ${JSON.stringify(h,null,4)}\n\ncurrent = ${JSON.stringify(a,null,4)}\n\n`);if(y){const t=Vt(h.schema[o.path]).map(String).map(t=>t.toLowerCase());if(qt.set(h.schema,o.path,t),Ht(t,s).length)p.push(o.path);else if(!0!==a&&!1!==a&&!t.includes(_(a).toLowerCase())||(!0===a||!1===a)&&!t.includes(String(a))&&!t.includes("boolean")){if(!f(a)||!h.acceptArrays)throw new TypeError(`${h.msg}: ${h.optsVarName}.${o.path} was customised to ${"string"!==_(a)?'"':""}${JSON.stringify(a,null,0)}${"string"!==_(a)?'"':""} (type: ${_(a).toLowerCase()}) which is not among the allowed types in schema (which is equal to ${JSON.stringify(t,null,0)})`);for(let e=0,r=a.length;e<r;e++)if(!t.includes(_(a[e]).toLowerCase()))throw new TypeError(`${h.msg}: ${h.optsVarName}.${o.path}.${e}, the ${Gt(e+1)} element (equal to ${JSON.stringify(a[e],null,0)}) is of a type ${_(a[e]).toLowerCase()}, but only the following are allowed by the ${h.optsVarName}.schema: ${t.join(", ")}`)}}else if(g){const e=qt.get(r,o.path);if(h.acceptArrays&&f(a)&&!h.acceptArraysIgnore.includes(t)){if(!a.every(e=>_(e).toLowerCase()===_(r[t]).toLowerCase()))throw new TypeError(`${h.msg}: ${h.optsVarName}.${o.path} was customised to be array, but not all of its elements are ${_(r[t]).toLowerCase()}-type`)}else if(_(a)!==_(e))throw new TypeError(`${h.msg}: ${h.optsVarName}.${o.path} was customised to ${"string"===_(a).toLowerCase()?"":'"'}${JSON.stringify(a,null,0)}${"string"===_(a).toLowerCase()?"":'"'} which is not ${_(e).toLowerCase()} but ${_(a).toLowerCase()}`)}return a})}(t,e,r)}const Qt=Array.isArray;function Xt(t){return null!=t}function Yt(t){return"Object"===_(t)}function Zt(t){return"string"===_(t)}function te(t){return Yt(t)||Zt(t)||function(t){return"number"===_(t)}(t)||function(t){return"boolean"===_(t)}(t)||Qt(t)||function(t){return null===t}(t)}const ee=Array.isArray;function re(t,e,n){if(void 0===t)throw new TypeError("ast-compare/compare(): [THROW_ID_01] first argument is missing!");if(void 0===e)throw new TypeError("ast-compare/compare(): [THROW_ID_02] second argument is missing!");if(Xt(t)&&!te(t))throw new TypeError(`ast-compare/compare(): [THROW_ID_03] first input argument is of a wrong type, ${_(t)}, equal to: ${JSON.stringify(t,null,4)}`);if(Xt(e)&&!te(e))throw new TypeError(`ast-compare/compare(): [THROW_ID_04] second input argument is of a wrong type, ${_(e)}, equal to: ${JSON.stringify(e,null,4)}`);if(Xt(n)&&!Yt(n))throw new TypeError(`ast-compare/compare(): [THROW_ID_05] third argument, options object, must, well, be an object! Currently it's: ${_(n)} and equal to: ${JSON.stringify(n,null,4)}`);const o=r(e),i=r(t);let a,c,u,s=0;const f={hungryForWhitespace:!1,matchStrictly:!1,verboseWhenMismatches:!1,useWildcards:!1},l=Object.assign({},f,n);if(zt(l,f,{msg:"ast-compare/compare(): [THROW_ID_06*]"}),l.hungryForWhitespace&&l.matchStrictly&&Yt(t)&&X(t)&&Yt(e)&&0===Object.keys(e).length)return!0;if((!l.hungryForWhitespace||l.hungryForWhitespace&&!X(t)&&X(e))&&Yt(t)&&0!==Object.keys(t).length&&Yt(e)&&0===Object.keys(e).length||_(t)!==_(e)&&(!l.hungryForWhitespace||l.hungryForWhitespace&&!X(t)))return!1;if(Zt(i)&&Zt(o))return!!(l.hungryForWhitespace&&X(i)&&X(o))||(l.verboseWhenMismatches?i===o||`Given string ${o} is not matched! We have ${i} on the other end.`:l.useWildcards?rt.isMatch(i,o,{caseSensitive:!0}):i===o);if(ee(i)&&ee(o)){if(l.hungryForWhitespace&&X(o)&&(!l.matchStrictly||l.matchStrictly&&i.length===o.length))return!0;if(!l.hungryForWhitespace&&o.length>i.length||l.matchStrictly&&o.length!==i.length)return!!l.verboseWhenMismatches&&`The length of a given array, ${JSON.stringify(o,null,4)} is ${o.length} but the length of an array on the other end, ${JSON.stringify(i,null,4)} is ${i.length}`;if(0===o.length)return 0===i.length||!!l.verboseWhenMismatches&&`The given array has no elements, but the array on the other end, ${JSON.stringify(i,null,4)} does have some`;for(let t=0,e=o.length;t<e;t++){u=!1;for(let e=s,r=i.length;e<r;e++)if(s+=1,!0===re(i[e],o[t],l)){u=!0;break}if(!u)return!!l.verboseWhenMismatches&&`The given array ${JSON.stringify(o,null,4)} is not a subset of an array on the other end, ${JSON.stringify(i,null,4)}`}}else{if(!Yt(i)||!Yt(o))return!!(l.hungryForWhitespace&&X(i)&&X(o)&&(!l.matchStrictly||l.matchStrictly&&(h=o,Yt(h)?0===Object.keys(h).length:(Qt(h)||Zt(h))&&0===h.length)))||i===o;if(a=Object.keys(o),c=Object.keys(i),l.matchStrictly&&a.length!==c.length){if(!l.verboseWhenMismatches)return!1;const t=m(r(a),r(c)),e=t.length>0?`First object has unique keys: ${JSON.stringify(t,null,4)}.`:"",n=m(r(c),r(a));return`When matching strictly, we found that both objects have different amount of keys. ${e} ${n.length>0?`Second object has unique keys:\n        ${JSON.stringify(n,null,4)}.`:""}`}for(let t=0,e=a.length;t<e;t++){if(!Xt(i[a[t]]))return!l.useWildcards||l.useWildcards&&!a[t].includes("*")?!!l.verboseWhenMismatches&&`The given object has key ${a[t]} which the other-one does not have.`:!!Object.keys(i).some(e=>rt.isMatch(e,a[t],{caseSensitive:!0}))||!!l.verboseWhenMismatches&&`The given object has key ${a[t]} which the other-one does not have.`;if(void 0!==i[a[t]]&&!te(i[a[t]]))throw new TypeError(`ast-compare/compare(): [THROW_ID_07] The input ${JSON.stringify(i,null,4)} contains a value of a wrong type, ${_(i[a[t]])} at index ${t}, equal to: ${JSON.stringify(i[a[t]],null,4)}`);if(!te(o[a[t]]))throw new TypeError(`ast-compare/compare(): [THROW_ID_08] The input ${JSON.stringify(o,null,4)} contains a value of a wrong type, ${_(o[a[t]])} at index ${t}, equal to: ${JSON.stringify(o[a[t]],null,4)}`);if(Xt(i[a[t]])&&_(i[a[t]])!==_(o[a[t]])){if(!(X(i[a[t]])&&X(o[a[t]])&&l.hungryForWhitespace))return!!l.verboseWhenMismatches&&`The given key ${a[t]} is of a different type on both objects. On the first-one, it's ${_(o[a[t]])}, on the second-one, it's ${_(i[a[t]])}`}else if(!0!==re(i[a[t]],o[a[t]],l))return!!l.verboseWhenMismatches&&`The given piece ${JSON.stringify(o[a[t]],null,4)} and ${JSON.stringify(i[a[t]],null,4)} don't match.`}}var h;return!0}return function(t,e,n){function o(t){return null!=t}if(!o(t))throw new Error("ast-delete-object/deleteObj(): Missing input!");if(!o(e))throw new Error("ast-delete-object/deleteObj(): Missing second argument, object to search for and delete!");if(o(n)&&!p(n))throw new Error("ast-delete-object/deleteObj(): Third argument, options object, must be an object!");var i={matchKeysStrictly:!1,hungryForWhitespace:!1},a=Object.assign({},i,n);zt(a,i,{msg:"ast-delete-object/deleteObj():"});var c,u=r(t),s=r(e);return re(u,s,{hungryForWhitespace:a.hungryForWhitespace,matchStrictly:a.matchKeysStrictly})?{}:u=Q(u,function(t,e){if(p(c=void 0!==e?e:t)){if(p(s)&&0===Object.keys(s).length&&p(c)&&0===Object.keys(c).length)return NaN;if(re(c,s,{hungryForWhitespace:a.hungryForWhitespace,matchStrictly:a.matchKeysStrictly}))return NaN}return c})}});
