/**
 * is-html-tag-opening
 * Does an HTML tag start at given position?
 * Version: 2.0.5
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/is-html-tag-opening/
 */

!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e((t="undefined"!=typeof globalThis?globalThis:t||self).isHtmlTagOpening={})}(this,(function(t){"use strict";function e(t,e,r){return e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}function r(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),r.push.apply(r,n)}return r}function n(t){for(var n=1;n<arguments.length;n++){var i=null!=arguments[n]?arguments[n]:{};n%2?r(Object(i),!0).forEach((function(r){e(t,r,i[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(i)):r(Object(i)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(i,e))}))}return t}function i(t){return t&&"object"==typeof t&&!Array.isArray(t)}function o(t){return"string"==typeof t}var a={cb:void 0,i:!1,trimBeforeMatching:!1,trimCharsBeforeMatching:[],maxMismatches:0,firstMustMatch:!1,lastMustMatch:!1},s=function(t){return t+1};function c(t,e,r,i,o,c){void 0===o&&(o=!1),void 0===c&&(c=s);var u="function"==typeof r?r():r;if(+e<0&&o&&"EOL"===u)return u;var f=n(n({},a),i);if(e>=t.length&&!o)return!1;for(var l=o?1:r.length,h=!1,p=!1,g=f.maxMismatches,b=e,y=!1,d=!1,m=!1;t[b];){var v=c(b);if(f.trimBeforeMatching&&""===t[b].trim()){if(!t[v]&&o&&"EOL"===r)return!0;b=c(b)}else if(f&&!f.i&&f.trimCharsBeforeMatching&&f.trimCharsBeforeMatching.includes(t[b])||f&&f.i&&f.trimCharsBeforeMatching&&f.trimCharsBeforeMatching.map((function(t){return t.toLowerCase()})).includes(t[b].toLowerCase())){if(o&&"EOL"===r&&!t[v])return!0;b=c(b)}else{var _=v>b?r[r.length-l]:r[l-1];if(!f.i&&t[b]===_||f.i&&t[b].toLowerCase()===_.toLowerCase()){if(y||(y=!0),p||(p=!0),l===r.length?d=!0:1===l&&(m=!0),(l-=1)<1)return b}else{if(!(f.maxMismatches&&g&&b))return!(0!==b||1!==l||f.lastMustMatch||!p)&&0;g-=1;for(var w=0;w<=g;w++){var O=v>b?r[r.length-l+1+w]:r[l-2-w],j=t[c(b)];if(O&&(!f.i&&t[b]===O||f.i&&t[b].toLowerCase()===O.toLowerCase())&&(!f.firstMustMatch||l!==r.length)){l-=2,y=!0;break}if(j&&O&&(!f.i&&j===O||f.i&&j.toLowerCase()===O.toLowerCase())&&(!f.firstMustMatch||l!==r.length)){l-=1,y=!0;break}if(void 0===O&&g>=0&&y&&(!f.firstMustMatch||d)&&(!f.lastMustMatch||m))return b}y||(h=b)}if(!1!==h&&h!==b&&(h=!1),l<1)return b;b=c(b)}}return l>0?!(!o||"EOL"!==u)||!!(f&&f.maxMismatches>=l&&p)&&(h||0):void 0}function u(t,e,r,s,u){if(i(u)&&Object.prototype.hasOwnProperty.call(u,"trimBeforeMatching")&&"boolean"!=typeof u.trimBeforeMatching)throw new Error("string-match-left-right/"+t+"(): [THROW_ID_09] opts.trimBeforeMatching should be boolean!"+(Array.isArray(u.trimBeforeMatching)?" Did you mean to use opts.trimCharsBeforeMatching?":""));var f,l,h,p=n(n({},a),u);if("string"==typeof p.trimCharsBeforeMatching&&(p.trimCharsBeforeMatching="string"==typeof(f=p.trimCharsBeforeMatching)?f.length?[f]:[]:f),p.trimCharsBeforeMatching=p.trimCharsBeforeMatching.map((function(t){return o(t)?t:String(t)})),!o(e))return!1;if(!e.length)return!1;if(!Number.isInteger(r)||r<0)throw new Error("string-match-left-right/"+t+"(): [THROW_ID_03] the second argument should be a natural number. Currently it's of a type: "+typeof r+", equal to:\n"+JSON.stringify(r,null,4));if(o(s))l=[s];else if(Array.isArray(s))l=s;else if(s){if("function"!=typeof s)throw new Error("string-match-left-right/"+t+"(): [THROW_ID_05] the third argument, whatToMatch, is neither string nor array of strings! It's "+typeof s+", equal to:\n"+JSON.stringify(s,null,4));(l=[]).push(s)}else l=s;if(u&&!i(u))throw new Error("string-match-left-right/"+t+"(): [THROW_ID_06] the fourth argument, options object, should be a plain object. Currently it's of a type \""+typeof u+'", and equal to:\n'+JSON.stringify(u,null,4));var g=0,b="";if(p&&p.trimCharsBeforeMatching&&p.trimCharsBeforeMatching.some((function(t,e){return t.length>1&&(g=e,b=t,!0)})))throw new Error("string-match-left-right/"+t+"(): [THROW_ID_07] the fourth argument, options object contains trimCharsBeforeMatching. It was meant to list the single characters but one of the entries at index "+g+" is longer than 1 character, "+b.length+" (equals to "+b+"). Please split it into separate characters and put into array as separate elements.");if(!l||!Array.isArray(l)||Array.isArray(l)&&!l.length||Array.isArray(l)&&1===l.length&&o(l[0])&&!l[0].trim()){if("function"==typeof p.cb){var y,d=r;if("matchLeftIncl"!==t&&"matchRight"!==t||(d+=1),"L"===t[5])for(var m=d;m--;){var v=e[m];if((!p.trimBeforeMatching||p.trimBeforeMatching&&void 0!==v&&v.trim())&&(!p.trimCharsBeforeMatching||!p.trimCharsBeforeMatching.length||void 0!==v&&!p.trimCharsBeforeMatching.includes(v))){y=m;break}}else if(t.startsWith("matchRight"))for(var _=d;_<e.length;_++){var w=e[_];if((!p.trimBeforeMatching||p.trimBeforeMatching&&w.trim())&&(!p.trimCharsBeforeMatching||!p.trimCharsBeforeMatching.length||!p.trimCharsBeforeMatching.includes(w))){y=_;break}}if(void 0===y)return!1;var O=e[y],j=y+1,M="";return j&&j>0&&(M=e.slice(0,j)),"L"===t[5]?p.cb(O,M,y):(y&&y>0&&(M=e.slice(y)),p.cb(O,M,y))}var B="";throw u||(B=" More so, the whole options object, the fourth input argument, is missing!"),new Error("string-match-left-right/"+t+'(): [THROW_ID_08] the third argument, "whatToMatch", was given as an empty string. This means, you intend to match purely by a callback. The callback was not set though, the opts key "cb" is not set!'+B)}for(var k=0,C=l.length;k<C;k++){var A=l[k],x=void 0,E=void 0,R="",L=r;"matchRight"===t?L+=1:"matchLeft"===t&&(L-=1);var I=c(e,L,A,p,h="function"==typeof l[k],(function(e){return"L"===t[5]?e-1:e+1}));if(I&&h&&"function"==typeof A&&"EOL"===A())return!(!A()||p.cb&&!p.cb(x,R,E))&&A();if(Number.isInteger(I)&&(E=t.startsWith("matchLeft")?I-1:I+1,R="L"===t[5]?e.slice(0,I):e.slice(E)),E<0&&(E=void 0),e[E]&&(x=e[E]),Number.isInteger(I)&&(!p.cb||p.cb(x,R,E)))return A}return!1}Function.prototype.toString.call(Object);var f="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{};!function(t){var e={exports:{}};t(e,e.exports)}((function(t,e){var r="__lodash_hash_undefined__",n=9007199254740991,i="[object Arguments]",o="[object Boolean]",a="[object Date]",s="[object Function]",c="[object GeneratorFunction]",u="[object Map]",l="[object Number]",h="[object Object]",p="[object Promise]",g="[object RegExp]",b="[object Set]",y="[object String]",d="[object Symbol]",m="[object WeakMap]",v="[object ArrayBuffer]",_="[object DataView]",w="[object Float32Array]",O="[object Float64Array]",j="[object Int8Array]",M="[object Int16Array]",B="[object Int32Array]",k="[object Uint8Array]",C="[object Uint8ClampedArray]",A="[object Uint16Array]",x="[object Uint32Array]",E=/\w*$/,R=/^\[object .+?Constructor\]$/,L=/^(?:0|[1-9]\d*)$/,I={};I[i]=I["[object Array]"]=I[v]=I[_]=I[o]=I[a]=I[w]=I[O]=I[j]=I[M]=I[B]=I[u]=I[l]=I[h]=I[g]=I[b]=I[y]=I[d]=I[k]=I[C]=I[A]=I[x]=!0,I["[object Error]"]=I[s]=I[m]=!1;var T="object"==typeof self&&self&&self.Object===Object&&self,S="object"==typeof f&&f&&f.Object===Object&&f||T||Function("return this")(),P=e&&!e.nodeType&&e,D=P&&t&&!t.nodeType&&t,N=D&&D.exports===P;function W(t,e){return t.set(e[0],e[1]),t}function H(t,e){return t.add(e),t}function $(t,e,r,n){var i=-1,o=t?t.length:0;for(n&&o&&(r=t[++i]);++i<o;)r=e(r,t[i],i,t);return r}function F(t){var e=!1;if(null!=t&&"function"!=typeof t.toString)try{e=!!(t+"")}catch(t){}return e}function U(t){var e=-1,r=Array(t.size);return t.forEach((function(t,n){r[++e]=[n,t]})),r}function q(t,e){return function(r){return t(e(r))}}function J(t){var e=-1,r=Array(t.size);return t.forEach((function(t){r[++e]=t})),r}var z,V=Array.prototype,G=Function.prototype,K=Object.prototype,Q=S["__core-js_shared__"],X=(z=/[^.]+$/.exec(Q&&Q.keys&&Q.keys.IE_PROTO||""))?"Symbol(src)_1."+z:"",Y=G.toString,Z=K.hasOwnProperty,tt=K.toString,et=RegExp("^"+Y.call(Z).replace(/[\\^$.*+?()[\]{}|]/g,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$"),rt=N?S.Buffer:void 0,nt=S.Symbol,it=S.Uint8Array,ot=q(Object.getPrototypeOf,Object),at=Object.create,st=K.propertyIsEnumerable,ct=V.splice,ut=Object.getOwnPropertySymbols,ft=rt?rt.isBuffer:void 0,lt=q(Object.keys,Object),ht=Dt(S,"DataView"),pt=Dt(S,"Map"),gt=Dt(S,"Promise"),bt=Dt(S,"Set"),yt=Dt(S,"WeakMap"),dt=Dt(Object,"create"),mt=Ft(ht),vt=Ft(pt),_t=Ft(gt),wt=Ft(bt),Ot=Ft(yt),jt=nt?nt.prototype:void 0,Mt=jt?jt.valueOf:void 0;function Bt(t){var e=-1,r=t?t.length:0;for(this.clear();++e<r;){var n=t[e];this.set(n[0],n[1])}}function kt(t){var e=-1,r=t?t.length:0;for(this.clear();++e<r;){var n=t[e];this.set(n[0],n[1])}}function Ct(t){var e=-1,r=t?t.length:0;for(this.clear();++e<r;){var n=t[e];this.set(n[0],n[1])}}function At(t){this.__data__=new kt(t)}function xt(t,e){var r=qt(t)||function(t){return function(t){return function(t){return!!t&&"object"==typeof t}(t)&&Jt(t)}(t)&&Z.call(t,"callee")&&(!st.call(t,"callee")||tt.call(t)==i)}(t)?function(t,e){for(var r=-1,n=Array(t);++r<t;)n[r]=e(r);return n}(t.length,String):[],n=r.length,o=!!n;for(var a in t)!e&&!Z.call(t,a)||o&&("length"==a||Ht(a,n))||r.push(a);return r}function Et(t,e,r){var n=t[e];Z.call(t,e)&&Ut(n,r)&&(void 0!==r||e in t)||(t[e]=r)}function Rt(t,e){for(var r=t.length;r--;)if(Ut(t[r][0],e))return r;return-1}function Lt(t,e,r,n,f,p,m){var R;if(n&&(R=p?n(t,f,p,m):n(t)),void 0!==R)return R;if(!Gt(t))return t;var L=qt(t);if(L){if(R=function(t){var e=t.length,r=t.constructor(e);e&&"string"==typeof t[0]&&Z.call(t,"index")&&(r.index=t.index,r.input=t.input);return r}(t),!e)return function(t,e){var r=-1,n=t.length;e||(e=Array(n));for(;++r<n;)e[r]=t[r];return e}(t,R)}else{var T=Wt(t),S=T==s||T==c;if(zt(t))return function(t,e){if(e)return t.slice();var r=new t.constructor(t.length);return t.copy(r),r}(t,e);if(T==h||T==i||S&&!p){if(F(t))return p?t:{};if(R=function(t){return"function"!=typeof t.constructor||$t(t)?{}:(e=ot(t),Gt(e)?at(e):{});var e}(S?{}:t),!e)return function(t,e){return St(t,Nt(t),e)}(t,function(t,e){return t&&St(e,Kt(e),t)}(R,t))}else{if(!I[T])return p?t:{};R=function(t,e,r,n){var i=t.constructor;switch(e){case v:return Tt(t);case o:case a:return new i(+t);case _:return function(t,e){var r=e?Tt(t.buffer):t.buffer;return new t.constructor(r,t.byteOffset,t.byteLength)}(t,n);case w:case O:case j:case M:case B:case k:case C:case A:case x:return function(t,e){var r=e?Tt(t.buffer):t.buffer;return new t.constructor(r,t.byteOffset,t.length)}(t,n);case u:return function(t,e,r){return $(e?r(U(t),!0):U(t),W,new t.constructor)}(t,n,r);case l:case y:return new i(t);case g:return function(t){var e=new t.constructor(t.source,E.exec(t));return e.lastIndex=t.lastIndex,e}(t);case b:return function(t,e,r){return $(e?r(J(t),!0):J(t),H,new t.constructor)}(t,n,r);case d:return s=t,Mt?Object(Mt.call(s)):{}}var s}(t,T,Lt,e)}}m||(m=new At);var P=m.get(t);if(P)return P;if(m.set(t,R),!L)var D=r?function(t){return function(t,e,r){var n=e(t);return qt(t)?n:function(t,e){for(var r=-1,n=e.length,i=t.length;++r<n;)t[i+r]=e[r];return t}(n,r(t))}(t,Kt,Nt)}(t):Kt(t);return function(t,e){for(var r=-1,n=t?t.length:0;++r<n&&!1!==e(t[r],r,t););}(D||t,(function(i,o){D&&(i=t[o=i]),Et(R,o,Lt(i,e,r,n,o,t,m))})),R}function It(t){return!(!Gt(t)||(e=t,X&&X in e))&&(Vt(t)||F(t)?et:R).test(Ft(t));var e}function Tt(t){var e=new t.constructor(t.byteLength);return new it(e).set(new it(t)),e}function St(t,e,r,n){r||(r={});for(var i=-1,o=e.length;++i<o;){var a=e[i],s=n?n(r[a],t[a],a,r,t):void 0;Et(r,a,void 0===s?t[a]:s)}return r}function Pt(t,e){var r,n,i=t.__data__;return("string"==(n=typeof(r=e))||"number"==n||"symbol"==n||"boolean"==n?"__proto__"!==r:null===r)?i["string"==typeof e?"string":"hash"]:i.map}function Dt(t,e){var r=function(t,e){return null==t?void 0:t[e]}(t,e);return It(r)?r:void 0}Bt.prototype.clear=function(){this.__data__=dt?dt(null):{}},Bt.prototype.delete=function(t){return this.has(t)&&delete this.__data__[t]},Bt.prototype.get=function(t){var e=this.__data__;if(dt){var n=e[t];return n===r?void 0:n}return Z.call(e,t)?e[t]:void 0},Bt.prototype.has=function(t){var e=this.__data__;return dt?void 0!==e[t]:Z.call(e,t)},Bt.prototype.set=function(t,e){return this.__data__[t]=dt&&void 0===e?r:e,this},kt.prototype.clear=function(){this.__data__=[]},kt.prototype.delete=function(t){var e=this.__data__,r=Rt(e,t);return!(r<0)&&(r==e.length-1?e.pop():ct.call(e,r,1),!0)},kt.prototype.get=function(t){var e=this.__data__,r=Rt(e,t);return r<0?void 0:e[r][1]},kt.prototype.has=function(t){return Rt(this.__data__,t)>-1},kt.prototype.set=function(t,e){var r=this.__data__,n=Rt(r,t);return n<0?r.push([t,e]):r[n][1]=e,this},Ct.prototype.clear=function(){this.__data__={hash:new Bt,map:new(pt||kt),string:new Bt}},Ct.prototype.delete=function(t){return Pt(this,t).delete(t)},Ct.prototype.get=function(t){return Pt(this,t).get(t)},Ct.prototype.has=function(t){return Pt(this,t).has(t)},Ct.prototype.set=function(t,e){return Pt(this,t).set(t,e),this},At.prototype.clear=function(){this.__data__=new kt},At.prototype.delete=function(t){return this.__data__.delete(t)},At.prototype.get=function(t){return this.__data__.get(t)},At.prototype.has=function(t){return this.__data__.has(t)},At.prototype.set=function(t,e){var r=this.__data__;if(r instanceof kt){var n=r.__data__;if(!pt||n.length<199)return n.push([t,e]),this;r=this.__data__=new Ct(n)}return r.set(t,e),this};var Nt=ut?q(ut,Object):function(){return[]},Wt=function(t){return tt.call(t)};function Ht(t,e){return!!(e=null==e?n:e)&&("number"==typeof t||L.test(t))&&t>-1&&t%1==0&&t<e}function $t(t){var e=t&&t.constructor;return t===("function"==typeof e&&e.prototype||K)}function Ft(t){if(null!=t){try{return Y.call(t)}catch(t){}try{return t+""}catch(t){}}return""}function Ut(t,e){return t===e||t!=t&&e!=e}(ht&&Wt(new ht(new ArrayBuffer(1)))!=_||pt&&Wt(new pt)!=u||gt&&Wt(gt.resolve())!=p||bt&&Wt(new bt)!=b||yt&&Wt(new yt)!=m)&&(Wt=function(t){var e=tt.call(t),r=e==h?t.constructor:void 0,n=r?Ft(r):void 0;if(n)switch(n){case mt:return _;case vt:return u;case _t:return p;case wt:return b;case Ot:return m}return e});var qt=Array.isArray;function Jt(t){return null!=t&&function(t){return"number"==typeof t&&t>-1&&t%1==0&&t<=n}(t.length)&&!Vt(t)}var zt=ft||function(){return!1};function Vt(t){var e=Gt(t)?tt.call(t):"";return e==s||e==c}function Gt(t){var e=typeof t;return!!t&&("object"==e||"function"==e)}function Kt(t){return Jt(t)?xt(t):function(t){if(!$t(t))return lt(t);var e=[];for(var r in Object(t))Z.call(t,r)&&"constructor"!=r&&e.push(r);return e}(t)}t.exports=function(t){return Lt(t,!0,!0)}}));function l(t,e){return void 0===e&&(e=0),function(t){var e=t.str,r=t.idx,n=t.stopAtNewlines,i=t.stopAtRawNbsp;if("string"!=typeof e||!e.length)return null;if(r&&"number"==typeof r||(r=0),r<1)return null;if(e[~-r]&&(e[~-r].trim()||n&&"\n\r".includes(e[~-r])||i&&" "===e[~-r]))return~-r;if(e[r-2]&&(e[r-2].trim()||n&&"\n\r".includes(e[r-2])||i&&" "===e[r-2]))return r-2;for(var o=r;o--;)if(e[o]&&(e[o].trim()||n&&"\n\r".includes(e[o])||i&&" "===e[o]))return o;return null}({str:t,idx:e,stopAtNewlines:!1,stopAtRawNbsp:!1})}var h={allowCustomTagNames:!1,skipOpeningBracket:!1},p=["a","abbr","acronym","address","applet","area","article","aside","audio","b","base","basefont","bdi","bdo","big","blockquote","body","br","button","canvas","caption","center","cite","code","col","colgroup","data","datalist","dd","del","details","dfn","dialog","dir","div","dl","doctype","dt","em","embed","fieldset","figcaption","figure","font","footer","form","frame","frameset","h1","h1 - h6","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","iframe","img","input","ins","kbd","keygen","label","legend","li","link","main","map","mark","math","menu","menuitem","meta","meter","nav","noframes","noscript","object","ol","optgroup","option","output","p","param","picture","pre","progress","q","rb","rp","rt","rtc","ruby","s","samp","script","section","select","slot","small","source","span","strike","strong","style","sub","summary","sup","svg","table","tbody","td","template","textarea","tfoot","th","thead","time","title","tr","track","tt","u","ul","var","video","wbr","xml"];function g(t){return void 0===t||t.toUpperCase()===t.toLowerCase()&&!/\d/.test(t)&&"="!==t}function b(t,e){return"<"===t[e]||"<"===t[l(t,e)]}t.defaults=h,t.isOpening=function(t,e,r){if(void 0===e&&(e=0),"string"!=typeof t)throw new Error('is-html-tag-opening: [THROW_ID_01] the first input argument should have been a string but it was given as "'+typeof t+'", value being '+JSON.stringify(t,null,4));if(!Number.isInteger(e)||e<0)throw new Error('is-html-tag-opening: [THROW_ID_02] the second input argument should have been a natural number string index but it was given as "'+typeof e+'", value being '+JSON.stringify(e,null,4));var i=n(n({},h),r),o="._a-z0-9·À-ÖØ-öø-ͽͿ-῿‌-‍‿-⁀⁰-￿",a=new RegExp("^<"+(i.skipOpeningBracket?"?":"")+"[\\\\ \\t\\r\\n/]*\\w+"+"[\\\\ \\t\\r\\n/]*\\/?"+"[\\\\ \\t\\r\\n/]*>","g"),s=new RegExp("^<"+(i.skipOpeningBracket?"?":"")+"[\\\\ \\t\\r\\n/]*["+o+"]+[-"+o+"]*"+"[\\\\ \\t\\r\\n/]*>","g"),c=new RegExp("^<"+(i.skipOpeningBracket?"?":"")+"\\s*\\w+\\s+\\w+(?:-\\w+)?\\s*=\\s*['\"\\w]","g"),f=new RegExp("^<"+(i.skipOpeningBracket?"?":"")+"\\s*\\w+\\s+["+o+"]+[-"+o+"]*(?:-\\w+)?\\s*=\\s*['\"\\w]"),y=new RegExp("^<"+(i.skipOpeningBracket?"?":"")+"\\s*\\/?\\s*\\w+\\s*\\/?\\s*>","g"),d=new RegExp("^<"+(i.skipOpeningBracket?"?":"")+"\\s*\\/?\\s*["+o+"]+[-"+o+"]*\\s*\\/?\\s*>","g"),m=new RegExp("^<"+(i.skipOpeningBracket?"?":"")+"[\\\\ \\t\\r\\n/]*\\w+(?:\\s*\\w+)?\\s*\\w+=['\"]","g"),v=new RegExp("^<"+(i.skipOpeningBracket?"?":"")+"[\\\\ \\t\\r\\n/]*["+o+"]+[-"+o+"]*\\s+(?:\\s*\\w+)?\\s*\\w+=['\"]","g"),_=new RegExp("^<"+(i.skipOpeningBracket?"?\\/?":"")+"("+"[\\\\ \\t\\r\\n/]*["+o+"]+)+"+"[\\\\ \\t\\r\\n/]*[\\\\/=>]",""),w=e?t.slice(e):t,O=!1,j=!1,M={cb:g,i:!0,trimCharsBeforeMatching:["/","\\","!"," ","\t","\n","\r"]};return i.allowCustomTagNames?((i.skipOpeningBracket&&("<"===t[e-1]||"/"===t[e-1]&&"<"===t[l(t,l(t,e))])||"<"===w[0]&&w[1]&&w[1].trim())&&(_.test(w)||/^<\w+$/.test(w))||s.test(w)&&b(t,e)||f.test(w)||d.test(w)&&b(t,e)||v.test(w))&&(j=!0):(((i.skipOpeningBracket&&("<"===t[e-1]||"/"===t[e-1]&&"<"===t[l(t,l(t,e))])||"<"===w[0]&&w[1]&&w[1].trim())&&_.test(w)||a.test(w)&&b(t,e)||c.test(w)||y.test(w)&&b(t,e)||m.test(w))&&(O=!0),O&&function(t,e,r,n){return u("matchRightIncl",t,e,r,n)}(t,e,p,{cb:function(r){return void 0===r?(("<"===t[e]&&t[e+1]&&t[e+1].trim()||"<"===t[e-1])&&(j=!0),!0):r.toUpperCase()===r.toLowerCase()&&!/\d/.test(r)&&"="!==r},i:!0,trimCharsBeforeMatching:["<","/","\\","!"," ","\t","\n","\r"]})&&(j=!0)),!j&&"<"===t[e]&&t[e+1]&&t[e+1].trim()&&function(t,e,r,n){return u("matchRight",t,e,r,n)}(t,e,p,M)&&(j=!0),"string"==typeof t&&e<t.length&&j},t.version="2.0.5",Object.defineProperty(t,"__esModule",{value:!0})}));
