!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):t.objectFlattenReferencing=e()}(this,function(){"use strict";var zt="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{};function t(t,e){return t(e={exports:{}},e.exports),e.exports}var w="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},p=t(function(t,e){var o,i,r,a,u,c,f,s,n,l,p,y,h,d,g,b,v,m;t.exports=(o="function"==typeof Promise,i="object"===("undefined"==typeof self?"undefined":w(self))?self:zt,r="undefined"!=typeof Symbol,a="undefined"!=typeof Map,u="undefined"!=typeof Set,c="undefined"!=typeof WeakMap,f="undefined"!=typeof WeakSet,s="undefined"!=typeof DataView,n=r&&void 0!==Symbol.iterator,l=r&&void 0!==Symbol.toStringTag,p=u&&"function"==typeof Set.prototype.entries,y=a&&"function"==typeof Map.prototype.entries,h=p&&Object.getPrototypeOf((new Set).entries()),d=y&&Object.getPrototypeOf((new Map).entries()),g=n&&"function"==typeof Array.prototype[Symbol.iterator],b=g&&Object.getPrototypeOf([][Symbol.iterator]()),v=n&&"function"==typeof String.prototype[Symbol.iterator],m=v&&Object.getPrototypeOf(""[Symbol.iterator]()),function(t){var e=void 0===t?"undefined":w(t);if("object"!==e)return e;if(null===t)return"null";if(t===i)return"global";if(Array.isArray(t)&&(!1===l||!(Symbol.toStringTag in t)))return"Array";if("object"===("undefined"==typeof window?"undefined":w(window))&&null!==window){if("object"===w(window.location)&&t===window.location)return"Location";if("object"===w(window.document)&&t===window.document)return"Document";if("object"===w(window.navigator)){if("object"===w(window.navigator.mimeTypes)&&t===window.navigator.mimeTypes)return"MimeTypeArray";if("object"===w(window.navigator.plugins)&&t===window.navigator.plugins)return"PluginArray"}if(("function"==typeof window.HTMLElement||"object"===w(window.HTMLElement))&&t instanceof window.HTMLElement){if("BLOCKQUOTE"===t.tagName)return"HTMLQuoteElement";if("TD"===t.tagName)return"HTMLTableDataCellElement";if("TH"===t.tagName)return"HTMLTableHeaderCellElement"}}var r=l&&t[Symbol.toStringTag];if("string"==typeof r)return r;var n=Object.getPrototypeOf(t);return n===RegExp.prototype?"RegExp":n===Date.prototype?"Date":o&&n===Promise.prototype?"Promise":u&&n===Set.prototype?"Set":a&&n===Map.prototype?"Map":f&&n===WeakSet.prototype?"WeakSet":c&&n===WeakMap.prototype?"WeakMap":s&&n===DataView.prototype?"DataView":a&&n===d?"Map Iterator":u&&n===h?"Set Iterator":g&&n===b?"Array Iterator":v&&n===m?"String Iterator":null===n?"Object":Object.prototype.toString.call(t).slice(8,-1)})}),Qt="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},l=t(function(t,e){var n="__lodash_hash_undefined__",r=9007199254740991,j="[object Arguments]",S="[object Boolean]",O="[object Date]",A="[object Function]",T="[object GeneratorFunction]",W="[object Map]",E="[object Number]",k="[object Object]",o="[object Promise]",I="[object RegExp]",x="[object Set]",M="[object String]",P="[object Symbol]",i="[object WeakMap]",D="[object ArrayBuffer]",R="[object DataView]",N="[object Float32Array]",$="[object Float64Array]",C="[object Int8Array]",H="[object Int16Array]",K="[object Int32Array]",L="[object Uint8Array]",V="[object Uint8ClampedArray]",B="[object Uint16Array]",F="[object Uint32Array]",Z=/\w*$/,a=/^\[object .+?Constructor\]$/,u=/^(?:0|[1-9]\d*)$/,J={};J[j]=J["[object Array]"]=J[D]=J[R]=J[S]=J[O]=J[N]=J[$]=J[C]=J[H]=J[K]=J[W]=J[E]=J[k]=J[I]=J[x]=J[M]=J[P]=J[L]=J[V]=J[B]=J[F]=!0,J["[object Error]"]=J[A]=J[i]=!1;var c="object"==Qt(zt)&&zt&&zt.Object===Object&&zt,f="object"==("undefined"==typeof self?"undefined":Qt(self))&&self&&self.Object===Object&&self,s=c||f||Function("return this")(),l=e&&!e.nodeType&&e,p=l&&t&&!t.nodeType&&t,y=p&&p.exports===l;function G(t,e){return t.set(e[0],e[1]),t}function U(t,e){return t.add(e),t}function q(t,e,r,n){var o=-1,i=t?t.length:0;for(n&&i&&(r=t[++o]);++o<i;)r=e(r,t[o],o,t);return r}function z(t){var e=!1;if(null!=t&&"function"!=typeof t.toString)try{e=!!(t+"")}catch(t){}return e}function Q(t){var r=-1,n=Array(t.size);return t.forEach(function(t,e){n[++r]=[e,t]}),n}function h(e,r){return function(t){return e(r(t))}}function X(t){var e=-1,r=Array(t.size);return t.forEach(function(t){r[++e]=t}),r}var d,g=Array.prototype,b=Function.prototype,v=Object.prototype,m=s["__core-js_shared__"],w=(d=/[^.]+$/.exec(m&&m.keys&&m.keys.IE_PROTO||""))?"Symbol(src)_1."+d:"",_=b.toString,Y=v.hasOwnProperty,tt=v.toString,et=RegExp("^"+_.call(Y).replace(/[\\^$.*+?()[\]{}|]/g,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$"),rt=y?s.Buffer:void 0,nt=s.Symbol,ot=s.Uint8Array,it=h(Object.getPrototypeOf,Object),at=Object.create,ut=v.propertyIsEnumerable,ct=g.splice,ft=Object.getOwnPropertySymbols,st=rt?rt.isBuffer:void 0,lt=h(Object.keys,Object),pt=$t(s,"DataView"),yt=$t(s,"Map"),ht=$t(s,"Promise"),dt=$t(s,"Set"),gt=$t(s,"WeakMap"),bt=$t(Object,"create"),vt=Vt(pt),mt=Vt(yt),wt=Vt(ht),_t=Vt(dt),jt=Vt(gt),St=nt?nt.prototype:void 0,Ot=St?St.valueOf:void 0;function At(t){var e=-1,r=t?t.length:0;for(this.clear();++e<r;){var n=t[e];this.set(n[0],n[1])}}function Tt(t){var e=-1,r=t?t.length:0;for(this.clear();++e<r;){var n=t[e];this.set(n[0],n[1])}}function Wt(t){var e=-1,r=t?t.length:0;for(this.clear();++e<r;){var n=t[e];this.set(n[0],n[1])}}function Et(t){this.__data__=new Tt(t)}function kt(t,e){var r,n,o,i=Ft(t)||(o=n=r=t)&&"object"==(void 0===o?"undefined":Qt(o))&&Zt(n)&&Y.call(r,"callee")&&(!ut.call(r,"callee")||tt.call(r)==j)?function(t,e){for(var r=-1,n=Array(t);++r<t;)n[r]=e(r);return n}(t.length,String):[],a=i.length,u=!!a;for(var c in t)!e&&!Y.call(t,c)||u&&("length"==c||Kt(c,a))||i.push(c);return i}function It(t,e,r){var n=t[e];Y.call(t,e)&&Bt(n,r)&&(void 0!==r||e in t)||(t[e]=r)}function xt(t,e){for(var r=t.length;r--;)if(Bt(t[r][0],e))return r;return-1}function Mt(r,n,o,i,t,e,a){var u;if(i&&(u=e?i(r,t,e,a):i(r)),void 0!==u)return u;if(!Ut(r))return r;var c,f,s,l,p,y,h=Ft(r);if(h){if(u=function(t){var e=t.length,r=t.constructor(e);e&&"string"==typeof t[0]&&Y.call(t,"index")&&(r.index=t.index,r.input=t.input);return r}(r),!n)return function(t,e){var r=-1,n=t.length;e||(e=Array(n));for(;++r<n;)e[r]=t[r];return e}(r,u)}else{var d=Ht(r),g=d==A||d==T;if(Jt(r))return function(t,e){if(e)return t.slice();var r=new t.constructor(t.length);return t.copy(r),r}(r,n);if(d==k||d==j||g&&!e){if(z(r))return e?r:{};if(u="function"!=typeof(p=g?{}:r).constructor||Lt(p)?{}:Ut(y=it(p))?at(y):{},!n)return l=c=r,f=(s=u)&&Rt(l,qt(l),s),Rt(c,Ct(c),f)}else{if(!J[d])return e?r:{};u=function(t,e,r,n){var o=t.constructor;switch(e){case D:return Dt(t);case S:case O:return new o(+t);case R:return h=t,d=n?Dt(h.buffer):h.buffer,new h.constructor(d,h.byteOffset,h.byteLength);case N:case $:case C:case H:case K:case L:case V:case B:case F:return p=t,y=n?Dt(p.buffer):p.buffer,new p.constructor(y,p.byteOffset,p.length);case W:return s=t,l=r,q(n?l(Q(s),!0):Q(s),G,new s.constructor);case E:case M:return new o(t);case I:return(f=new(c=t).constructor(c.source,Z.exec(c))).lastIndex=c.lastIndex,f;case x:return a=t,u=r,q(n?u(X(a),!0):X(a),U,new a.constructor);case P:return i=t,Ot?Object(Ot.call(i)):{}}var i;var a,u;var c,f;var s,l;var p,y;var h,d}(r,d,Mt,n)}}a||(a=new Et);var b,v,m,w=a.get(r);if(w)return w;if(a.set(r,u),!h)var _=o?(v=Ct,m=qt(b=r),Ft(b)?m:function(t,e){for(var r=-1,n=e.length,o=t.length;++r<n;)t[o+r]=e[r];return t}(m,v(b))):qt(r);return function(t,e){for(var r=-1,n=t?t.length:0;++r<n&&!1!==e(t[r],r,t););}(_||r,function(t,e){_&&(t=r[e=t]),It(u,e,Mt(t,n,o,i,e,r,a))}),u}function Pt(t){return!(!Ut(t)||(e=t,w&&w in e))&&(Gt(t)||z(t)?et:a).test(Vt(t));var e}function Dt(t){var e=new t.constructor(t.byteLength);return new ot(e).set(new ot(t)),e}function Rt(t,e,r,n){r||(r={});for(var o=-1,i=e.length;++o<i;){var a=e[o],u=n?n(r[a],t[a],a,r,t):void 0;It(r,a,void 0===u?t[a]:u)}return r}function Nt(t,e){var r,n,o=t.__data__;return("string"==(n=void 0===(r=e)?"undefined":Qt(r))||"number"==n||"symbol"==n||"boolean"==n?"__proto__"!==r:null===r)?o["string"==typeof e?"string":"hash"]:o.map}function $t(t,e){var r,n,o=(n=e,null==(r=t)?void 0:r[n]);return Pt(o)?o:void 0}At.prototype.clear=function(){this.__data__=bt?bt(null):{}},At.prototype.delete=function(t){return this.has(t)&&delete this.__data__[t]},At.prototype.get=function(t){var e=this.__data__;if(bt){var r=e[t];return r===n?void 0:r}return Y.call(e,t)?e[t]:void 0},At.prototype.has=function(t){var e=this.__data__;return bt?void 0!==e[t]:Y.call(e,t)},At.prototype.set=function(t,e){return this.__data__[t]=bt&&void 0===e?n:e,this},Tt.prototype.clear=function(){this.__data__=[]},Tt.prototype.delete=function(t){var e=this.__data__,r=xt(e,t);return!(r<0||(r==e.length-1?e.pop():ct.call(e,r,1),0))},Tt.prototype.get=function(t){var e=this.__data__,r=xt(e,t);return r<0?void 0:e[r][1]},Tt.prototype.has=function(t){return-1<xt(this.__data__,t)},Tt.prototype.set=function(t,e){var r=this.__data__,n=xt(r,t);return n<0?r.push([t,e]):r[n][1]=e,this},Wt.prototype.clear=function(){this.__data__={hash:new At,map:new(yt||Tt),string:new At}},Wt.prototype.delete=function(t){return Nt(this,t).delete(t)},Wt.prototype.get=function(t){return Nt(this,t).get(t)},Wt.prototype.has=function(t){return Nt(this,t).has(t)},Wt.prototype.set=function(t,e){return Nt(this,t).set(t,e),this},Et.prototype.clear=function(){this.__data__=new Tt},Et.prototype.delete=function(t){return this.__data__.delete(t)},Et.prototype.get=function(t){return this.__data__.get(t)},Et.prototype.has=function(t){return this.__data__.has(t)},Et.prototype.set=function(t,e){var r=this.__data__;if(r instanceof Tt){var n=r.__data__;if(!yt||n.length<199)return n.push([t,e]),this;r=this.__data__=new Wt(n)}return r.set(t,e),this};var Ct=ft?h(ft,Object):function(){return[]},Ht=function(t){return tt.call(t)};function Kt(t,e){return!!(e=null==e?r:e)&&("number"==typeof t||u.test(t))&&-1<t&&t%1==0&&t<e}function Lt(t){var e=t&&t.constructor;return t===("function"==typeof e&&e.prototype||v)}function Vt(t){if(null!=t){try{return _.call(t)}catch(t){}try{return t+""}catch(t){}}return""}function Bt(t,e){return t===e||t!=t&&e!=e}(pt&&Ht(new pt(new ArrayBuffer(1)))!=R||yt&&Ht(new yt)!=W||ht&&Ht(ht.resolve())!=o||dt&&Ht(new dt)!=x||gt&&Ht(new gt)!=i)&&(Ht=function(t){var e=tt.call(t),r=e==k?t.constructor:void 0,n=r?Vt(r):void 0;if(n)switch(n){case vt:return R;case mt:return W;case wt:return o;case _t:return x;case jt:return i}return e});var Ft=Array.isArray;function Zt(t){return null!=t&&("number"==typeof(e=t.length)&&-1<e&&e%1==0&&e<=r)&&!Gt(t);var e}var Jt=st||function(){return!1};function Gt(t){var e=Ut(t)?tt.call(t):"";return e==A||e==T}function Ut(t){var e=void 0===t?"undefined":Qt(t);return!!t&&("object"==e||"function"==e)}function qt(t){return Zt(t)?kt(t):function(t){if(!Lt(t))return lt(t);var e=[];for(var r in Object(t))Y.call(t,r)&&"constructor"!=r&&e.push(r);return e}(t)}t.exports=function(t){return Mt(t,!0,!0)}}),r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},n=9007199254740991,c="[object Arguments]",o="[object Function]",i="[object GeneratorFunction]",a="[object Map]",u="[object Promise]",f="[object Set]",s="[object String]",y="[object WeakMap]",h="[object DataView]",d=/^\[object .+?Constructor\]$/,g=/^(?:0|[1-9]\d*)$/,e="\\ud800-\\udfff",b="\\u0300-\\u036f\\ufe20-\\ufe23",v="\\u20d0-\\u20f0",m="\\ufe0e\\ufe0f",_="["+e+"]",j="["+b+v+"]",S="\\ud83c[\\udffb-\\udfff]",O="[^"+e+"]",A="(?:\\ud83c[\\udde6-\\uddff]){2}",T="[\\ud800-\\udbff][\\udc00-\\udfff]",W="\\u200d",E="(?:"+j+"|"+S+")"+"?",k="["+m+"]?",I=k+E+("(?:"+W+"(?:"+[O,A,T].join("|")+")"+k+E+")*"),x="(?:"+[O+j+"?",j,A,T,_].join("|")+")",M=RegExp(S+"(?="+S+")|"+x+I,"g"),P=RegExp("["+W+e+b+v+m+"]"),D="object"==r(zt)&&zt&&zt.Object===Object&&zt,R="object"==("undefined"==typeof self?"undefined":r(self))&&self&&self.Object===Object&&self,N=D||R||Function("return this")();function $(e,t){return function(t,e){for(var r=-1,n=t?t.length:0,o=Array(n);++r<n;)o[r]=e(t[r],r,t);return o}(t,function(t){return e[t]})}function C(t){var r=-1,n=Array(t.size);return t.forEach(function(t,e){n[++r]=[e,t]}),n}function H(t){var e=-1,r=Array(t.size);return t.forEach(function(t){r[++e]=t}),r}function K(t){return e=t,P.test(e)?t.match(M)||[]:t.split("");var e}var L,V,B,F=Function.prototype,Z=Object.prototype,J=N["__core-js_shared__"],G=(L=/[^.]+$/.exec(J&&J.keys&&J.keys.IE_PROTO||""))?"Symbol(src)_1."+L:"",U=F.toString,q=Z.hasOwnProperty,z=Z.toString,Q=RegExp("^"+U.call(q).replace(/[\\^$.*+?()[\]{}|]/g,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$"),X=N.Symbol,Y=X?X.iterator:void 0,tt=Z.propertyIsEnumerable,et=(V=Object.keys,B=Object,function(t){return V(B(t))}),rt=dt(N,"DataView"),nt=dt(N,"Map"),ot=dt(N,"Promise"),it=dt(N,"Set"),at=dt(N,"WeakMap"),ut=vt(rt),ct=vt(nt),ft=vt(ot),st=vt(it),lt=vt(at);function pt(t,e){var r,n,o=mt(t)||St(n=r=t)&&wt(n)&&q.call(r,"callee")&&(!tt.call(r,"callee")||z.call(r)==c)?function(t,e){for(var r=-1,n=Array(t);++r<t;)n[r]=e(r);return n}(t.length,String):[],i=o.length,a=!!i;for(var u in t)!e&&!q.call(t,u)||a&&("length"==u||bt(u,i))||o.push(u);return o}function yt(t){return!(!jt(t)||(e=t,G&&G in e))&&(_t(t)||function(t){var e=!1;if(null!=t&&"function"!=typeof t.toString)try{e=!!(t+"")}catch(t){}return e}(t)?Q:d).test(vt(t));var e}function ht(t){if(r=(e=t)&&e.constructor,n="function"==typeof r&&r.prototype||Z,e!==n)return et(t);var e,r,n,o=[];for(var i in Object(t))q.call(t,i)&&"constructor"!=i&&o.push(i);return o}function dt(t,e){var r,n,o=(n=e,null==(r=t)?void 0:r[n]);return yt(o)?o:void 0}var gt=function(t){return z.call(t)};function bt(t,e){return!!(e=null==e?n:e)&&("number"==typeof t||g.test(t))&&-1<t&&t%1==0&&t<e}function vt(t){if(null!=t){try{return U.call(t)}catch(t){}try{return t+""}catch(t){}}return""}(rt&&gt(new rt(new ArrayBuffer(1)))!=h||nt&&gt(new nt)!=a||ot&&gt(ot.resolve())!=u||it&&gt(new it)!=f||at&&gt(new at)!=y)&&(gt=function(t){var e=z.call(t),r="[object Object]"==e?t.constructor:void 0,n=r?vt(r):void 0;if(n)switch(n){case ut:return h;case ct:return a;case ft:return u;case st:return f;case lt:return y}return e});var mt=Array.isArray;function wt(t){return null!=t&&("number"==typeof(e=t.length)&&-1<e&&e%1==0&&e<=n)&&!_t(t);var e}function _t(t){var e=jt(t)?z.call(t):"";return e==o||e==i}function jt(t){var e=void 0===t?"undefined":r(t);return!!t&&("object"==e||"function"==e)}function St(t){return!!t&&"object"==(void 0===t?"undefined":r(t))}function Ot(t){return t?$(t,wt(e=t)?pt(e):ht(e)):[];var e}var At=function(t){if(!t)return[];if(wt(t))return"string"==typeof(e=t)||!mt(e)&&St(e)&&z.call(e)==s?K(t):function(t,e){var r=-1,n=t.length;for(e||(e=Array(n));++r<n;)e[r]=t[r];return e}(t);var e;if(Y&&t[Y])return function(t){for(var e,r=[];!(e=t.next()).done;)r.push(e.value);return r}(t[Y]());var r=gt(t);return(r==a?C:r==f?H:Ot)(t)},Tt="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},Wt=function(t,e){if(e){if("object"!==(void 0===e?"undefined":Tt(e)))throw new TypeError(String(e)+" is not an object. Expected an object that has boolean `includeZero` property.");if("includeZero"in e){if("boolean"!=typeof e.includeZero)throw new TypeError(String(e.includeZero)+" is neither true nor false. `includeZero` option must be a Boolean value.");if(e.includeZero&&0===t)return!0}}return Number.isSafeInteger(t)&&1<=t},Et=function(t,e){if("string"!=typeof t)return!1;if(e&&"includeZero"in e){if("boolean"!=typeof e.includeZero)throw new TypeError(String(e.includeZero)+" is neither true nor false. `includeZero` option must be a Boolean value.");if(e.includeZero)return/^(-?0|[1-9]\d*)(\.0+)?$/.test(t)}return/^[1-9]\d*(\.0+)?$/.test(t)},kt="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t};function It(t){return null!=t}function xt(t){return"string"==typeof t}function Mt(t,e,r){if(0===arguments.length)throw new Error("str-indexes-of-plus/strIndexesOfPlus(): inputs missing!");if(!xt(t))throw new TypeError("str-indexes-of-plus/strIndexesOfPlus(): first input argument must be a string! Currently it's: "+(void 0===t?"undefined":kt(t)));if(!xt(e))throw new TypeError("str-indexes-of-plus/strIndexesOfPlus(): second input argument must be a string! Currently it's: "+(void 0===e?"undefined":kt(e)));if(3<=arguments.length&&!Wt(r,{includeZero:!0})&&!Et(r,{includeZero:!0}))throw new TypeError("str-indexes-of-plus/strIndexesOfPlus(): third input argument must be a natural number! Currently it's: "+r);Et(r,{includeZero:!0})&&(r=Number(r));var n=At(t),o=At(e);if(0===n.length||0===o.length||It(r)&&r>=n.length)return[];It(r)||(r=0);for(var i=[],a=!1,u=void 0,c=r,f=n.length;c<f;c++)a&&(n[c]===o[c-u]?c-u+1===o.length&&i.push(u):(u=null,a=!1)),a||n[c]===o[0]&&(1===o.length?i.push(c):(a=!0,u=c));return i}var Pt="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},Dt=1/0,Rt=9007199254740991,Nt=17976931348623157e292,$t=NaN,Ct="[object Arguments]",Ht="[object Function]",Kt="[object GeneratorFunction]",Lt="[object String]",Vt="[object Symbol]",Bt=/^\s+|\s+$/g,Ft=/^[-+]0x[0-9a-f]+$/i,Zt=/^0b[01]+$/i,Jt=/^0o[0-7]+$/i,Gt=/^(?:0|[1-9]\d*)$/,Ut=parseInt;function qt(t){return t!=t}function Xt(e,t){return function(t,e){for(var r=-1,n=t?t.length:0,o=Array(n);++r<n;)o[r]=e(t[r],r,t);return o}(t,function(t){return e[t]})}var Yt,te,ee=Object.prototype,re=ee.hasOwnProperty,ne=ee.toString,oe=ee.propertyIsEnumerable,ie=(Yt=Object.keys,te=Object,function(t){return Yt(te(t))}),ae=Math.max;function ue(t,e){var r,n,o=se(t)||ye(n=r=t)&&le(n)&&re.call(r,"callee")&&(!oe.call(r,"callee")||ne.call(r)==Ct)?function(t,e){for(var r=-1,n=Array(t);++r<t;)n[r]=e(r);return n}(t.length,String):[],i=o.length,a=!!i;for(var u in t)!e&&!re.call(t,u)||a&&("length"==u||fe(u,i))||o.push(u);return o}function ce(t){if(r=(e=t)&&e.constructor,n="function"==typeof r&&r.prototype||ee,e!==n)return ie(t);var e,r,n,o=[];for(var i in Object(t))re.call(t,i)&&"constructor"!=i&&o.push(i);return o}function fe(t,e){return!!(e=null==e?Rt:e)&&("number"==typeof t||Gt.test(t))&&-1<t&&t%1==0&&t<e}var se=Array.isArray;function le(t){return null!=t&&("number"==typeof(n=t.length)&&-1<n&&n%1==0&&n<=Rt)&&!((r=pe(e=t)?ne.call(e):"")==Ht||r==Kt);var e,r,n}function pe(t){var e=void 0===t?"undefined":Pt(t);return!!t&&("object"==e||"function"==e)}function ye(t){return!!t&&"object"==(void 0===t?"undefined":Pt(t))}var he=function(t,e,r,n){var o,i,a,u;t=le(t)?t:(o=t)?Xt(o,le(i=o)?ue(i):ce(i)):[],r=r&&!n?(a=function(t){if(!t)return 0===t?t:0;if((t=function(t){if("number"==typeof t)return t;if("symbol"==(void 0===(e=t)?"undefined":Pt(e))||ye(e)&&ne.call(e)==Vt)return $t;var e;if(pe(t)){var r="function"==typeof t.valueOf?t.valueOf():t;t=pe(r)?r+"":r}if("string"!=typeof t)return 0===t?t:+t;t=t.replace(Bt,"");var n=Zt.test(t);return n||Jt.test(t)?Ut(t.slice(2),n?2:8):Ft.test(t)?$t:+t}(t))===Dt||t===-Dt){var e=t<0?-1:1;return e*Nt}return t==t?t:0}(r),u=a%1,a==a?u?a-u:a:0):0;var c,f=t.length;return r<0&&(r=ae(f+r,0)),"string"==typeof(c=t)||!se(c)&&ye(c)&&ne.call(c)==Lt?r<=f&&-1<t.indexOf(e,r):!!f&&-1<function(t,e,r){if(e!=e)return function(t,e,r,n){for(var o=t.length,i=r+(n?1:-1);n?i--:++i<o;)if(e(t[i],i,t))return i;return-1}(t,qt,r);for(var n=r-1,o=t.length;++n<o;)if(t[n]===e)return n;return-1}(t,e,r)},de=/[|\\{}()[\]^$+*?.]/g,ge="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},be=new Map;function ve(t,e){var r=Object.assign({caseSensitive:!1},e),n=t+JSON.stringify(r);if(be.has(n))return be.get(n);var o="!"===t[0];o&&(t=t.slice(1)),t=function(t){if("string"!=typeof t)throw new TypeError("Expected a string");return t.replace(de,"\\$&")}(t).replace(/\\\*/g,".*");var i=new RegExp("^"+t+"$",r.caseSensitive?"":"i");return i.negated=o,be.set(n,i),i}var me=function(t,e,r){if(!Array.isArray(t)||!Array.isArray(e))throw new TypeError("Expected two arrays, got "+(void 0===t?"undefined":ge(t))+" "+(void 0===e?"undefined":ge(e)));if(0===e.length)return t;var n="!"===e[0][0];e=e.map(function(t){return ve(t,r)});var o=[],i=!0,a=!1,u=void 0;try{for(var c,f=t[Symbol.iterator]();!(i=(c=f.next()).done);i=!0){var s=c.value,l=n,p=!0,y=!1,h=void 0;try{for(var d,g=e[Symbol.iterator]();!(p=(d=g.next()).done);p=!0){var b=d.value;b.test(s)&&(l=!b.negated)}}catch(t){y=!0,h=t}finally{try{!p&&g.return&&g.return()}finally{if(y)throw h}}l&&o.push(s)}}catch(t){a=!0,u=t}finally{try{!i&&f.return&&f.return()}finally{if(a)throw u}}return o};function we(t,e,r){if(e!=e)return function(t,e,r,n){for(var o=t.length,i=r+(n?1:-1);n?i--:++i<o;)if(e(t[i],i,t))return i;return-1}(t,je,r);for(var n=r-1,o=t.length;++n<o;)if(t[n]===e)return n;return-1}function _e(t,e,r,n){for(var o=r-1,i=t.length;++o<i;)if(n(t[o],e))return o;return-1}function je(t){return t!=t}me.isMatch=function(t,e,r){var n=ve(e,r),o=n.test(t);return n.negated?!o:o};var Se=Array.prototype.splice;function Oe(t,e,r,n){var o,i=n?_e:we,a=-1,u=e.length,c=t;for(t===e&&(e=function(t,e){var r=-1,n=t.length;e||(e=Array(n));for(;++r<n;)e[r]=t[r];return e}(e)),r&&(c=function(t,e){for(var r=-1,n=t?t.length:0,o=Array(n);++r<n;)o[r]=e(t[r],r,t);return o}(t,(o=r,function(t){return o(t)})));++a<u;)for(var f=0,s=e[a],l=r?r(s):s;-1<(f=i(c,l,f,n));)c!==t&&Se.call(c,f,1),Se.call(t,f,1);return t}var Ae=function(t,e){return t&&t.length&&e&&e.length?Oe(t,e):t},Te="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},We="__lodash_hash_undefined__",Ee=9007199254740991,ke="[object Function]",Ie="[object GeneratorFunction]",xe=/^\[object .+?Constructor\]$/,Me="object"==Te(zt)&&zt&&zt.Object===Object&&zt,Pe="object"==("undefined"==typeof self?"undefined":Te(self))&&self&&self.Object===Object&&self,De=Me||Pe||Function("return this")();function Re(t,e){return!!(t?t.length:0)&&-1<function(t,e,r){if(e!=e)return function(t,e,r,n){var o=t.length,i=r+(n?1:-1);for(;n?i--:++i<o;)if(e(t[i],i,t))return i;return-1}(t,Ce,r);var n=r-1,o=t.length;for(;++n<o;)if(t[n]===e)return n;return-1}(t,e,0)}function Ne(t,e,r){for(var n=-1,o=t?t.length:0;++n<o;)if(r(e,t[n]))return!0;return!1}function $e(t,e){for(var r=-1,n=t?t.length:0,o=Array(n);++r<n;)o[r]=e(t[r],r,t);return o}function Ce(t){return t!=t}function He(e){return function(t){return e(t)}}function Ke(t,e){return t.has(e)}var Le,Ve,Be,Fe=Array.prototype,Ze=Function.prototype,Je=Object.prototype,Ge=De["__core-js_shared__"],Ue=(Le=/[^.]+$/.exec(Ge&&Ge.keys&&Ge.keys.IE_PROTO||""))?"Symbol(src)_1."+Le:"",qe=Ze.toString,ze=Je.hasOwnProperty,Qe=Je.toString,Xe=RegExp("^"+qe.call(ze).replace(/[\\^$.*+?()[\]{}|]/g,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$"),Ye=Fe.splice,tr=Math.max,er=Math.min,rr=pr(De,"Map"),nr=pr(Object,"create");function or(t){var e=-1,r=t?t.length:0;for(this.clear();++e<r;){var n=t[e];this.set(n[0],n[1])}}function ir(t){var e=-1,r=t?t.length:0;for(this.clear();++e<r;){var n=t[e];this.set(n[0],n[1])}}function ar(t){var e=-1,r=t?t.length:0;for(this.clear();++e<r;){var n=t[e];this.set(n[0],n[1])}}function ur(t){var e=-1,r=t?t.length:0;for(this.__data__=new ar;++e<r;)this.add(t[e])}function cr(t,e){for(var r,n,o=t.length;o--;)if((r=t[o][0])===(n=e)||r!=r&&n!=n)return o;return-1}function fr(t){return!(!hr(t)||(e=t,Ue&&Ue in e))&&(yr(t)||function(t){var e=!1;if(null!=t&&"function"!=typeof t.toString)try{e=!!(t+"")}catch(t){}return e}(t)?Xe:xe).test(function(t){if(null!=t){try{return qe.call(t)}catch(t){}try{return t+""}catch(t){}}return""}(t));var e}function sr(t){return(o=e=t)&&"object"==(void 0===o?"undefined":Te(o))&&(null!=(r=e)&&("number"==typeof(n=r.length)&&-1<n&&n%1==0&&n<=Ee)&&!yr(r))?t:[];var e,r,n,o}function lr(t,e){var r,n,o=t.__data__;return("string"==(n=void 0===(r=e)?"undefined":Te(r))||"number"==n||"symbol"==n||"boolean"==n?"__proto__"!==r:null===r)?o["string"==typeof e?"string":"hash"]:o.map}function pr(t,e){var r,n,o=(n=e,null==(r=t)?void 0:r[n]);return fr(o)?o:void 0}function yr(t){var e=hr(t)?Qe.call(t):"";return e==ke||e==Ie}function hr(t){var e=void 0===t?"undefined":Te(t);return!!t&&("object"==e||"function"==e)}or.prototype.clear=function(){this.__data__=nr?nr(null):{}},or.prototype.delete=function(t){return this.has(t)&&delete this.__data__[t]},or.prototype.get=function(t){var e=this.__data__;if(nr){var r=e[t];return r===We?void 0:r}return ze.call(e,t)?e[t]:void 0},or.prototype.has=function(t){var e=this.__data__;return nr?void 0!==e[t]:ze.call(e,t)},or.prototype.set=function(t,e){return this.__data__[t]=nr&&void 0===e?We:e,this},ir.prototype.clear=function(){this.__data__=[]},ir.prototype.delete=function(t){var e=this.__data__,r=cr(e,t);return!(r<0||(r==e.length-1?e.pop():Ye.call(e,r,1),0))},ir.prototype.get=function(t){var e=this.__data__,r=cr(e,t);return r<0?void 0:e[r][1]},ir.prototype.has=function(t){return-1<cr(this.__data__,t)},ir.prototype.set=function(t,e){var r=this.__data__,n=cr(r,t);return n<0?r.push([t,e]):r[n][1]=e,this},ar.prototype.clear=function(){this.__data__={hash:new or,map:new(rr||ir),string:new or}},ar.prototype.delete=function(t){return lr(this,t).delete(t)},ar.prototype.get=function(t){return lr(this,t).get(t)},ar.prototype.has=function(t){return lr(this,t).has(t)},ar.prototype.set=function(t,e){return lr(this,t).set(t,e),this},ur.prototype.add=ur.prototype.push=function(t){return this.__data__.set(t,We),this},ur.prototype.has=function(t){return this.__data__.has(t)};var dr=(Ve=function(t){var e=$e(t,sr);return e.length&&e[0]===t[0]?function(t,e,r){for(var n=r?Ne:Re,o=t[0].length,i=t.length,a=i,u=Array(i),c=1/0,f=[];a--;){var s=t[a];a&&e&&(s=$e(s,He(e))),c=er(s.length,c),u[a]=!r&&(e||120<=o&&120<=s.length)?new ur(a&&s):void 0}s=t[0];var l=-1,p=u[0];t:for(;++l<o&&f.length<c;){var y=s[l],h=e?e(y):y;if(y=r||0!==y?y:0,!(p?Ke(p,h):n(f,h,r))){for(a=i;--a;){var d=u[a];if(!(d?Ke(d,h):n(t[a],h,r)))continue t}p&&p.push(h),f.push(y)}}return f}(e):[]},Be=tr(void 0===Be?Ve.length-1:Be,0),function(){for(var t=arguments,e=-1,r=tr(t.length-Be,0),n=Array(r);++e<r;)n[e]=t[Be+e];e=-1;for(var o=Array(Be+1);++e<Be;)o[e]=t[e];return o[Be]=n,function(t,e,r){switch(r.length){case 0:return t.call(e);case 1:return t.call(e,r[0]);case 2:return t.call(e,r[0],r[1]);case 3:return t.call(e,r[0],r[1],r[2])}return t.apply(e,r)}(Ve,this,o)});function gr(t){return"string"==typeof t?0<t.length?[t]:[]:t}var br=function(t,e){if(e=e||{},0===arguments.length)throw new TypeError("No arguments. (One argument required)");if("string"!=typeof t)throw new TypeError(t+" is not a string. Argument must be a string to be checked if it represents an integer.");var r,n=Number(t);if(e.parseLiteral){if(t.trim()!==t)return!1;r=n.toString()}else r=t;return"NaN"!==r&&Math.round(n).toString()===r},vr=Array.isArray;function mr(t){return"string"===p(t)}function wr(t){return"Object"===p(t)}function _r(t,a,u,e){if(0===arguments.length||0===t.length)return"";var r=l(t),n="";if(0<r.length)if(e)for(var o=0,i=r.length;o<i;o++)if(mr(r[o])){var c=void 0;c="",a.mergeArraysWithLineBreaks&&0<o&&(!a.mergeWithoutTrailingBrIfLineContainsBr||"string"!=typeof r[o-1]||a.mergeWithoutTrailingBrIfLineContainsBr&&void 0!==r[o-1]&&!r[o-1].toLowerCase().includes("<br"))&&(c="<br"+(a.xhtml?" /":"")+">"),n+=c+(u?a.wrapHeadsWith:"")+r[o]+(u?a.wrapTailsWith:"")}else vr(r[o])&&0<r[o].length&&r[o].every(mr)&&function(){var i="";a.mergeArraysWithLineBreaks&&0<n.length&&(i="<br"+(a.xhtml?" /":"")+">"),n=r[o].reduce(function(t,e,r,n){var o="";return r!==n.length-1&&(o=" "),t+(0===r?i:"")+(u?a.wrapHeadsWith:"")+e+(u?a.wrapTailsWith:"")+o},n)}();else n=r.reduce(function(t,e,r,n){var o="";a.mergeArraysWithLineBreaks&&0<r&&(o="<br"+(a.xhtml?" /":"")+">");var i="";return r!==n.length-1&&(i=" "),t+(0===r?o:"")+(u?a.wrapHeadsWith:"")+e+(u?a.wrapTailsWith:"")+i},n);return n}function jr(t){return mr(t)?0<t.length?[t]:[]:t}var Sr="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},Or=Array.isArray;function Ar(t){return null!=t}function Tr(t){return"string"===p(t)}function Wr(t){return"Object"===p(t)}return function(t,e,r){if(0===arguments.length)throw new Error("object-flatten-referencing/ofr(): [THROW_ID_01] all inputs missing!");if(1===arguments.length)throw new Error("object-flatten-referencing/ofr(): [THROW_ID_02] reference object missing!");if(Ar(r)&&!Wr(r))throw new Error("object-flatten-referencing/ofr(): [THROW_ID_03] third input, options object must be a plain object. Currently it's: "+(void 0===r?"undefined":Sr(r)));return function o(t,e,i,a,u,c){var f=l(t),s=l(e);void 0===a&&(a=!0),void 0===u&&(u=!0),void 0===c&&(c="");var r,n={wrapHeadsWith:"%%_",wrapTailsWith:"_%%",dontWrapKeys:[],dontWrapPaths:[],xhtml:!0,preventDoubleWrapping:!0,preventWrappingIfContains:[],objectKeyAndValueJoinChar:".",wrapGlobalFlipSwitch:!0,ignore:[],whatToDoWhenReferenceIsMissing:0,mergeArraysWithLineBreaks:!0,mergeWithoutTrailingBrIfLineContainsBr:!0,enforceStrictKeyset:!0};return(i=Object.assign({},n,i)).dontWrapKeys=jr(i.dontWrapKeys),i.preventWrappingIfContains=jr(i.preventWrappingIfContains),i.dontWrapPaths=jr(i.dontWrapPaths),i.ignore=jr(i.ignore),i.whatToDoWhenReferenceIsMissing=mr(r=i.whatToDoWhenReferenceIsMissing)&&br(r.trim())?parseInt(r.trim(),10):r,function(n,t,e){function o(t){return null!=t}function r(t){return"boolean"===p(t)}function i(t){return"string"===p(t)}function a(t){return"Object"===p(t)}var u=["any","anything","every","everything","all","whatever","whatevs"],c=Array.isArray;if(0===arguments.length)throw new Error("check-types-mini: [THROW_ID_01] Missing all arguments!");if(1===arguments.length)throw new Error("check-types-mini: [THROW_ID_02] Missing second argument!");var f=a(t)?t:{},s={ignoreKeys:[],acceptArrays:!1,acceptArraysIgnore:[],enforceStrictKeyset:!0,schema:{},msg:"check-types-mini",optsVarName:"opts"},l=void 0;if(!i((l=o(e)&&a(e)?Object.assign({},s,e):Object.assign({},s)).msg))throw new Error("check-types-mini: [THROW_ID_03] opts.msg must be string! Currently it's: "+p(l.msg)+", equal to "+JSON.stringify(l.msg,null,4));if(l.msg=l.msg.trim(),":"===l.msg[l.msg.length-1]&&(l.msg=l.msg.slice(0,l.msg.length-1)),!i(l.optsVarName))throw new Error("check-types-mini: [THROW_ID_04] opts.optsVarName must be string! Currently it's: "+p(l.optsVarName)+", equal to "+JSON.stringify(l.optsVarName,null,4));if(l.ignoreKeys=gr(l.ignoreKeys),l.acceptArraysIgnore=gr(l.acceptArraysIgnore),!c(l.ignoreKeys))throw new TypeError("check-types-mini: [THROW_ID_05] opts.ignoreKeys should be an array, currently it's: "+p(l.ignoreKeys));if(!r(l.acceptArrays))throw new TypeError("check-types-mini: [THROW_ID_06] opts.acceptArrays should be a Boolean, currently it's: "+p(l.acceptArrays));if(!c(l.acceptArraysIgnore))throw new TypeError("check-types-mini: [THROW_ID_07] opts.acceptArraysIgnore should be an array, currently it's: "+p(l.acceptArraysIgnore));if(!r(l.enforceStrictKeyset))throw new TypeError("check-types-mini: [THROW_ID_08] opts.enforceStrictKeyset should be a Boolean, currently it's: "+p(l.enforceStrictKeyset));if(Object.keys(l.schema).forEach(function(t){c(l.schema[t])||(l.schema[t]=[l.schema[t]]),l.schema[t]=l.schema[t].map(String).map(function(t){return t.toLowerCase()}).map(function(t){return t.trim()})}),l.enforceStrictKeyset)if(o(l.schema)&&0<Object.keys(l.schema).length){if(0!==Ae(Object.keys(n),Object.keys(f).concat(Object.keys(l.schema))).length)throw new TypeError(l.msg+": "+l.optsVarName+".enforceStrictKeyset is on and the following keys are not covered by schema and/or reference objects: "+JSON.stringify(Ae(Object.keys(n),Object.keys(f).concat(Object.keys(l.schema))),null,4))}else{if(!(o(f)&&0<Object.keys(f).length))throw new TypeError(l.msg+": Both "+l.optsVarName+".schema and reference objects are missing! We don't have anything to match the keys as you requested via opts.enforceStrictKeyset!");if(0!==Ae(Object.keys(n),Object.keys(f)).length)throw new TypeError(l.msg+": The input object has keys that are not covered by reference object: "+JSON.stringify(Ae(Object.keys(n),Object.keys(f)),null,4));if(0!==Ae(Object.keys(f),Object.keys(n)).length)throw new TypeError(l.msg+": The reference object has keys that are not present in the input object: "+JSON.stringify(Ae(Object.keys(f),Object.keys(n)),null,4))}Object.keys(n).forEach(function(e){if(o(l.schema)&&Object.prototype.hasOwnProperty.call(l.schema,e)){if(l.schema[e]=gr(l.schema[e]).map(String).map(function(t){return t.toLowerCase()}),!(dr(l.schema[e],u).length||(!0===n[e]||!1===n[e]||l.schema[e].includes(p(n[e]).toLowerCase()))&&(!0!==n[e]&&!1!==n[e]||l.schema[e].includes(String(n[e]))||l.schema[e].includes("boolean")))){if(!c(n[e])||!l.acceptArrays)throw new TypeError(l.msg+": "+l.optsVarName+"."+e+" was customised to "+JSON.stringify(n[e],null,4)+" which is not among the allowed types in schema ("+l.schema[e]+") but "+p(n[e]));for(var t=0,r=n[e].length;t<r;t++)if(!l.schema[e].includes(p(n[e][t]).toLowerCase()))throw new TypeError(l.msg+": "+l.optsVarName+"."+e+" is of type "+p(n[e][t]).toLowerCase()+", but only the following are allowed in "+l.optsVarName+".schema: "+l.schema[e])}}else if(o(f)&&Object.prototype.hasOwnProperty.call(f,e)&&p(n[e])!==p(f[e])&&!l.ignoreKeys.includes(e)){if(!l.acceptArrays||!c(n[e])||l.acceptArraysIgnore.includes(e))throw new TypeError(l.msg+": "+l.optsVarName+"."+e+" was customised to "+JSON.stringify(n[e],null,4)+" which is not "+p(f[e])+" but "+p(n[e]));if(!n[e].every(function(t){return p(t)===p(f[e])}))throw new TypeError(l.msg+": "+l.optsVarName+"."+e+" was customised to be array, but not all of its elements are "+p(f[e])+"-type")}})}(i,n,{msg:"object-flatten-referencing/ofr(): [THROW_ID_05*]",optsVarName:"opts",enforceStrictKeyset:i.enforceStrictKeyset}),i.wrapGlobalFlipSwitch||(a=!1),Wr(f)?Object.keys(f).forEach(function(e){var r=c+(0===c.length?e:"."+e);if(0===i.ignore.length||!he(i.ignore,e))if(i.wrapGlobalFlipSwitch&&(a=!0,0<i.dontWrapKeys.length&&(a=a&&!i.dontWrapKeys.some(function(t){return me.isMatch(e,t,{caseSensitive:!0})})),0<i.dontWrapPaths.length&&(a=a&&!i.dontWrapPaths.some(function(t){return t===r})),0<i.preventWrappingIfContains.length&&"string"==typeof f[e]&&(a=a&&!i.preventWrappingIfContains.some(function(t){return f[e].includes(t)}))),Ar(s[e])||!Ar(s[e])&&2===i.whatToDoWhenReferenceIsMissing)if(Or(f[e]))if(2===i.whatToDoWhenReferenceIsMissing||Tr(s[e]))f[e]=_r(f[e],i,a,u);else{if(f[e].every(function(t){return"string"==typeof t||Array.isArray(t)})){var n=!0;f[e].forEach(function(t){Array.isArray(t)&&!t.every(Tr)&&(n=!1)}),n&&(u=!1)}f[e]=o(f[e],s[e],i,a,u,r)}else Wr(f[e])?2===i.whatToDoWhenReferenceIsMissing||Tr(s[e])?f[e]=_r(function t(e,r){if(0===arguments.length||0===Object.keys(e).length)return[];var n=l(e),o=[];return wr(n)&&Object.keys(n).forEach(function(e){wr(n[e])&&(n[e]=t(n[e],r)),vr(n[e])&&(o=o.concat(n[e].map(function(t){return e+r.objectKeyAndValueJoinChar+t}))),mr(n[e])&&o.push(e+r.objectKeyAndValueJoinChar+n[e])}),o}(f[e],i),i,a,u):f[e]=o(f[e],s[e],a?i:Object.assign({},i,{wrapGlobalFlipSwitch:!1}),a,u,r):Tr(f[e])&&(f[e]=o(f[e],s[e],i,a,u,r));else if(p(f[e])!==p(s[e])&&1===i.whatToDoWhenReferenceIsMissing)throw new Error("object-flatten-referencing/ofr(): [THROW_ID_06] reference object does not have the key "+e+" and we need it. TIP: Turn off throwing via opts.whatToDoWhenReferenceIsMissing.")}):Or(f)?Or(s)?f.forEach(function(t,e){Ar(f[e])&&Ar(s[e])?f[e]=o(f[e],s[e],i,a,u,c+"["+e+"]"):f[e]=o(f[e],s[0],i,a,u,c+"["+e+"]")}):Tr(s)&&(f=_r(f,i,a,u)):Tr(f)&&0<f.length&&(i.wrapHeadsWith||i.wrapTailsWith)&&(i.preventDoubleWrapping&&(""!==i.wrapHeadsWith&&Mt(f,i.wrapHeadsWith.trim()).length||""!==i.wrapTailsWith&&Mt(f,i.wrapTailsWith.trim()).length)||(f=(a?i.wrapHeadsWith:"")+f+(a?i.wrapTailsWith:""))),f}(t,e,r)}});
