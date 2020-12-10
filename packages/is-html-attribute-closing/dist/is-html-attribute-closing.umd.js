/**
 * is-html-attribute-closing
 * Is a character on a given index a closing of an HTML attribute?
 * Version: 1.4.1
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/is-html-attribute-closing/
 */

!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):(t="undefined"!=typeof globalThis?globalThis:t||self).isHtmlAttributeClosing=e()}(this,(function(){"use strict";var t=new Set(["abbr","accept","accept-charset","accesskey","action","align","alink","allow","alt","archive","async","autocapitalize","autocomplete","autofocus","autoplay","axis","background","background-attachment","background-color","background-image","background-position","background-position-x","background-position-y","background-repeat","bgcolor","border","border-bottom","border-bottom-color","border-bottom-style","border-bottom-width","border-collapse","border-color","border-left","border-left-color","border-left-style","border-left-width","border-right","border-right-color","border-right-style","border-right-width","border-style","border-top","border-top-color","border-top-style","border-top-width","border-width","buffered","capture","cellpadding","cellspacing","challenge","char","charoff","charset","checked","cite","class","classid","clear","clip","code","codebase","codetype","color","cols","colspan","column-span","compact","content","contenteditable","contextmenu","controls","coords","crossorigin","csp","cursor","data","data-*","datetime","declare","decoding","default","defer","dir","direction","dirname","disabled","display","download","draggable","dropzone","enctype","enterkeyhint","face","filter","float","font","font-color","font-emphasize","font-emphasize-position","font-emphasize-style","font-family","font-size","font-style","font-variant","font-weight","for","form","formaction","formenctype","formmethod","formnovalidate","formtarget","frame","frameborder","frontuid","headers","height","hidden","high","horiz-align","href","hreflang","hspace","http-equiv","icon","id","importance","inputmode","integrity","intrinsicsize","ismap","itemprop","keytype","kind","label","lang","language","layout-flow","layout-grid","layout-grid-char","layout-grid-line","layout-grid-mode","layout-grid-type","left","letter-spacing","line-break","line-height","link","list","list-image-1","list-image-2","list-image-3","list-style","list-style-image","list-style-position","list-style-type","loading","longdesc","loop","low","manifest","margin","margin-bottom","margin-left","margin-right","margin-top","marginheight","marginwidth","max","maxlength","media","method","min","minlength","mso-ansi-font-size","mso-ansi-font-style","mso-ansi-font-weight","mso-ansi-language","mso-ascii-font-family","mso-background","mso-background-source","mso-baseline-position","mso-bidi-flag","mso-bidi-font-family","mso-bidi-font-size","mso-bidi-font-style","mso-bidi-font-weight","mso-bidi-language","mso-bookmark","mso-border-alt","mso-border-between","mso-border-between-color","mso-border-between-style","mso-border-between-width","mso-border-bottom-alt","mso-border-bottom-color-alt","mso-border-bottom-source","mso-border-bottom-style-alt","mso-border-bottom-width-alt","mso-border-color-alt","mso-border-effect","mso-border-left-alt","mso-border-left-color-alt","mso-border-left-source","mso-border-left-style-alt","mso-border-left-width-alt","mso-border-right-alt","mso-border-right-color-alt","mso-border-right-source","mso-border-right-style-alt","mso-border-right-width-alt","mso-border-shadow","mso-border-source","mso-border-style-alt","mso-border-top-alt","mso-border-top-color-alt","mso-border-top-source","mso-border-top-style-alt","mso-border-top-width-alt","mso-border-width-alt","mso-break-type","mso-build","mso-build-after-action","mso-build-after-color","mso-build-auto-secs","mso-build-avi","mso-build-dual-id","mso-build-order","mso-build-sound-name","mso-bullet-image","mso-cell-special","mso-cellspacing","mso-char-indent","mso-char-indent-count","mso-char-indent-size","mso-char-type","mso-char-wrap","mso-color-alt","mso-color-index","mso-color-source","mso-column-break-before","mso-column-separator","mso-columns","mso-comment-author","mso-comment-continuation","mso-comment-id","mso-comment-reference","mso-data-placement","mso-default-height","mso-default-width","mso-diagonal-down","mso-diagonal-down-color","mso-diagonal-down-source","mso-diagonal-down-style","mso-diagonal-down-width","mso-diagonal-up","mso-diagonal-up-color","mso-diagonal-up-source","mso-diagonal-up-style","mso-diagonal-up-width","mso-displayed-decimal-separator","mso-displayed-thousand-separator","mso-element","mso-element-anchor-horizontal","mso-element-anchor-lock","mso-element-anchor-vertical","mso-element-frame-height","mso-element-frame-hspace","mso-element-frame-vspace","mso-element-frame-width","mso-element-left","mso-element-linespan","mso-element-top","mso-element-wrap","mso-endnote-continuation-notice","mso-endnote-continuation-notice-id","mso-endnote-continuation-notice-src","mso-endnote-continuation-separator","mso-endnote-continuation-separator-id","mso-endnote-continuation-separator-src","mso-endnote-display","mso-endnote-id","mso-endnote-numbering","mso-endnote-numbering-restart","mso-endnote-numbering-start","mso-endnote-numbering-style","mso-endnote-position","mso-endnote-separator","mso-endnote-separator-id","mso-endnote-separator-src","mso-even-footer","mso-even-footer-id","mso-even-footer-src","mso-even-header","mso-even-header-id","mso-even-header-src","mso-facing-pages","mso-fareast-font-family","mso-fareast-hint","mso-fareast-language","mso-field-change","mso-field-change-author","mso-field-change-time","mso-field-change-value","mso-field-code","mso-field-lock","mso-fills-color","mso-first-footer","mso-first-footer-id","mso-first-footer-src","mso-first-header","mso-first-header-id","mso-first-header-src","mso-font-alt","mso-font-charset","mso-font-format","mso-font-info","mso-font-info-charset","mso-font-info-type","mso-font-kerning","mso-font-pitch","mso-font-signature","mso-font-signature-csb-one","mso-font-signature-csb-two","mso-font-signature-usb-four","mso-font-signature-usb-one","mso-font-signature-usb-three","mso-font-signature-usb-two","mso-font-src","mso-font-width","mso-footer","mso-footer-data","mso-footer-id","mso-footer-margin","mso-footer-src","mso-footnote-continuation-notice","mso-footnote-continuation-notice-id","mso-footnote-continuation-notice-src","mso-footnote-continuation-separator","mso-footnote-continuation-separator-id","mso-footnote-continuation-separator-src","mso-footnote-id","mso-footnote-numbering","mso-footnote-numbering-restart","mso-footnote-numbering-start","mso-footnote-numbering-style","mso-footnote-position","mso-footnote-separator","mso-footnote-separator-id","mso-footnote-separator-src","mso-foreground","mso-forms-protection","mso-generic-font-family","mso-grid-bottom","mso-grid-bottom-count","mso-grid-left","mso-grid-left-count","mso-grid-right","mso-grid-right-count","mso-grid-top","mso-grid-top-count","mso-gutter-direction","mso-gutter-margin","mso-gutter-position","mso-hansi-font-family","mso-header","mso-header-data","mso-header-id","mso-header-margin","mso-header-src","mso-height-alt","mso-height-rule","mso-height-source","mso-hide","mso-highlight","mso-horizontal-page-align","mso-hyphenate","mso-ignore","mso-kinsoku-overflow","mso-layout-grid-align","mso-layout-grid-char-alt","mso-layout-grid-origin","mso-level-inherit","mso-level-legacy","mso-level-legacy-indent","mso-level-legacy-space","mso-level-legal-format","mso-level-number-format","mso-level-number-position","mso-level-numbering","mso-level-reset-level","mso-level-start-at","mso-level-style-link","mso-level-suffix","mso-level-tab-stop","mso-level-text","mso-line-break-override","mso-line-grid","mso-line-height-alt","mso-line-height-rule","mso-line-numbers-count-by","mso-line-numbers-distance","mso-line-numbers-restart","mso-line-numbers-start","mso-line-spacing","mso-linked-frame","mso-list","mso-list-change","mso-list-change-author","mso-list-change-time","mso-list-change-values","mso-list-id","mso-list-ins","mso-list-ins-author","mso-list-ins-time","mso-list-name","mso-list-template-ids","mso-list-type","mso-margin-bottom-alt","mso-margin-left-alt","mso-margin-top-alt","mso-mirror-margins","mso-negative-indent-tab","mso-number-format","mso-outline-level","mso-outline-parent","mso-outline-parent-col","mso-outline-parent-row","mso-outline-parent-visibility","mso-outline-style","mso-padding-alt","mso-padding-between","mso-padding-bottom-alt","mso-padding-left-alt","mso-padding-right-alt","mso-padding-top-alt","mso-page-border-aligned","mso-page-border-art","mso-page-border-bottom-art","mso-page-border-display","mso-page-border-left-art","mso-page-border-offset-from","mso-page-border-right-art","mso-page-border-surround-footer","mso-page-border-surround-header","mso-page-border-top-art","mso-page-border-z-order","mso-page-numbers","mso-page-numbers-chapter-separator","mso-page-numbers-chapter-style","mso-page-numbers-start","mso-page-numbers-style","mso-page-orientation","mso-page-scale","mso-pagination","mso-panose-arm-style","mso-panose-contrast","mso-panose-family-type","mso-panose-letterform","mso-panose-midline","mso-panose-proportion","mso-panose-serif-style","mso-panose-stroke-variation","mso-panose-weight","mso-panose-x-height","mso-paper-source","mso-paper-source-first-page","mso-paper-source-other-pages","mso-pattern","mso-pattern-color","mso-pattern-style","mso-print-area","mso-print-color","mso-print-gridlines","mso-print-headings","mso-print-resolution","mso-print-sheet-order","mso-print-title-column","mso-print-title-row","mso-prop-change","mso-prop-change-author","mso-prop-change-time","mso-protection","mso-rotate","mso-row-margin-left","mso-row-margin-right","mso-ruby-merge","mso-ruby-visibility","mso-scheme-fill-color","mso-scheme-shadow-color","mso-shading","mso-shadow-color","mso-space-above","mso-space-below","mso-spacerun","mso-special-character","mso-special-format","mso-style-id","mso-style-name","mso-style-next","mso-style-parent","mso-style-type","mso-style-update","mso-subdocument","mso-symbol-font-family","mso-tab-count","mso-table-anchor-horizontal","mso-table-anchor-vertical","mso-table-bspace","mso-table-del-author","mso-table-del-time","mso-table-deleted","mso-table-dir","mso-table-ins-author","mso-table-ins-time","mso-table-inserted","mso-table-layout-alt","mso-table-left","mso-table-lspace","mso-table-overlap","mso-table-prop-author","mso-table-prop-change","mso-table-prop-time","mso-table-rspace","mso-table-top","mso-table-tspace","mso-table-wrap","mso-text-animation","mso-text-combine-brackets","mso-text-combine-id","mso-text-control","mso-text-fit-id","mso-text-indent-alt","mso-text-orientation","mso-text-raise","mso-title-page","mso-tny-compress","mso-unsynced","mso-vertical-align-alt","mso-vertical-align-special","mso-vertical-page-align","mso-width-alt","mso-width-source","mso-word-wrap","mso-xlrowspan","mso-zero-height","multiple","muted","name","nav-banner-image","navbutton_background_color","navbutton_home_hovered","navbutton_home_normal","navbutton_home_pushed","navbutton_horiz_hovered","navbutton_horiz_normal","navbutton_horiz_pushed","navbutton_next_hovered","navbutton_next_normal","navbutton_next_pushed","navbutton_prev_hovered","navbutton_prev_normal","navbutton_prev_pushed","navbutton_up_hovered","navbutton_up_normal","navbutton_up_pushed","navbutton_vert_hovered","navbutton_vert_normal","navbutton_vert_pushed","nohref","noresize","noshade","novalidate","nowrap","object","onblur","onchange","onclick","ondblclick","onfocus","onkeydown","onkeypress","onkeyup","onload","onmousedown","onmousemove","onmouseout","onmouseover","onmouseup","onreset","onselect","onsubmit","onunload","open","optimum","overflow","padding","padding-bottom","padding-left","padding-right","padding-top","page","page-break-after","page-break-before","panose-1","pattern","ping","placeholder","position","poster","preload","profile","prompt","punctuation-trim","punctuation-wrap","radiogroup","readonly","referrerpolicy","rel","required","rev","reversed","right","row-span","rows","rowspan","ruby-align","ruby-overhang","ruby-position","rules","sandbox","scheme","scope","scoped","scrolling","selected","separator-image","shape","size","sizes","slot","span","spellcheck","src","srcdoc","srclang","srcset","standby","start","step","style","summary","tab-interval","tab-stops","tabindex","table-border-color-dark","table-border-color-light","table-layout","target","text","text-align","text-autospace","text-combine","text-decoration","text-effect","text-fit","text-indent","text-justify","text-justify-trim","text-kashida","text-line-through","text-shadow","text-transform","text-underline","text-underline-color","text-underline-style","title","top","top-bar-button","translate","type","unicode-bidi","urlId","usemap","valign","value","valuetype","version","vert-align","vertical-align","visibility","vlink","vnd.ms-excel.numberformat","vspace","white-space","width","word-break","word-spacing","wrap","xmlns","z-index"]);function e(t){return"string"==typeof t&&(t.charCodeAt(0)>96&&t.charCodeAt(0)<123||t.charCodeAt(0)>64&&t.charCodeAt(0)<91||t.charCodeAt(0)>47&&t.charCodeAt(0)<58||":"===t||"-"===t)}function o(t){return(o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function r(t,e,o){return e in t?Object.defineProperty(t,e,{value:o,enumerable:!0,configurable:!0,writable:!0}):t[e]=o,t}function n(t,e){var o=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),o.push.apply(o,r)}return o}function i(t){for(var e=1;e<arguments.length;e++){var o=null!=arguments[e]?arguments[e]:{};e%2?n(Object(o),!0).forEach((function(e){r(t,e,o[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(o)):n(Object(o)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(o,e))}))}return t}Function.prototype.toString.call(Object);var s="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{};!function(t){var e={exports:{}};t(e,e.exports)}((function(t,e){var r="__lodash_hash_undefined__",n=9007199254740991,i="[object Arguments]",a="[object Boolean]",c="[object Date]",l="[object Function]",m="[object GeneratorFunction]",u="[object Map]",f="[object Number]",d="[object Object]",h="[object Promise]",p="[object RegExp]",g="[object Set]",b="[object String]",y="[object Symbol]",v="[object WeakMap]",w="[object ArrayBuffer]",_="[object DataView]",j="[object Float32Array]",x="[object Float64Array]",O="[object Int8Array]",k="[object Int16Array]",M="[object Int32Array]",A="[object Uint8Array]",C="[object Uint8ClampedArray]",B="[object Uint16Array]",z="[object Uint32Array]",P=/\w*$/,S=/^\[object .+?Constructor\]$/,I=/^(?:0|[1-9]\d*)$/,L={};L[i]=L["[object Array]"]=L[w]=L[_]=L[a]=L[c]=L[j]=L[x]=L[O]=L[k]=L[M]=L[u]=L[f]=L[d]=L[p]=L[g]=L[b]=L[y]=L[A]=L[C]=L[B]=L[z]=!0,L["[object Error]"]=L[l]=L[v]=!1;var E="object"==o(s)&&s&&s.Object===Object&&s,N="object"==("undefined"==typeof self?"undefined":o(self))&&self&&self.Object===Object&&self,R=E||N||Function("return this")(),T=e&&!e.nodeType&&e,W=T&&t&&!t.nodeType&&t,D=W&&W.exports===T;function $(t,e){return t.set(e[0],e[1]),t}function F(t,e){return t.add(e),t}function H(t,e,o,r){var n=-1,i=t?t.length:0;for(r&&i&&(o=t[++n]);++n<i;)o=e(o,t[n],n,t);return o}function q(t){var e=!1;if(null!=t&&"function"!=typeof t.toString)try{e=!!(t+"")}catch(t){}return e}function U(t){var e=-1,o=Array(t.size);return t.forEach((function(t,r){o[++e]=[r,t]})),o}function J(t,e){return function(o){return t(e(o))}}function V(t){var e=-1,o=Array(t.size);return t.forEach((function(t){o[++e]=t})),o}var Z,G=Array.prototype,K=Function.prototype,Q=Object.prototype,X=R["__core-js_shared__"],Y=(Z=/[^.]+$/.exec(X&&X.keys&&X.keys.IE_PROTO||""))?"Symbol(src)_1."+Z:"",tt=K.toString,et=Q.hasOwnProperty,ot=Q.toString,rt=RegExp("^"+tt.call(et).replace(/[\\^$.*+?()[\]{}|]/g,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$"),nt=D?R.Buffer:void 0,it=R.Symbol,st=R.Uint8Array,at=J(Object.getPrototypeOf,Object),ct=Object.create,lt=Q.propertyIsEnumerable,mt=G.splice,ut=Object.getOwnPropertySymbols,ft=nt?nt.isBuffer:void 0,dt=J(Object.keys,Object),ht=Wt(R,"DataView"),pt=Wt(R,"Map"),gt=Wt(R,"Promise"),bt=Wt(R,"Set"),yt=Wt(R,"WeakMap"),vt=Wt(Object,"create"),wt=qt(ht),_t=qt(pt),jt=qt(gt),xt=qt(bt),Ot=qt(yt),kt=it?it.prototype:void 0,Mt=kt?kt.valueOf:void 0;function At(t){var e=-1,o=t?t.length:0;for(this.clear();++e<o;){var r=t[e];this.set(r[0],r[1])}}function Ct(t){var e=-1,o=t?t.length:0;for(this.clear();++e<o;){var r=t[e];this.set(r[0],r[1])}}function Bt(t){var e=-1,o=t?t.length:0;for(this.clear();++e<o;){var r=t[e];this.set(r[0],r[1])}}function zt(t){this.__data__=new Ct(t)}function Pt(t,e){var r=Jt(t)||function(t){return function(t){return function(t){return!!t&&"object"==o(t)}(t)&&Vt(t)}(t)&&et.call(t,"callee")&&(!lt.call(t,"callee")||ot.call(t)==i)}(t)?function(t,e){for(var o=-1,r=Array(t);++o<t;)r[o]=e(o);return r}(t.length,String):[],n=r.length,s=!!n;for(var a in t)!e&&!et.call(t,a)||s&&("length"==a||Ft(a,n))||r.push(a);return r}function St(t,e,o){var r=t[e];et.call(t,e)&&Ut(r,o)&&(void 0!==o||e in t)||(t[e]=o)}function It(t,e){for(var o=t.length;o--;)if(Ut(t[o][0],e))return o;return-1}function Lt(t,e,o,r,n,s,h){var v;if(r&&(v=s?r(t,n,s,h):r(t)),void 0!==v)return v;if(!Kt(t))return t;var S=Jt(t);if(S){if(v=function(t){var e=t.length,o=t.constructor(e);e&&"string"==typeof t[0]&&et.call(t,"index")&&(o.index=t.index,o.input=t.input);return o}(t),!e)return function(t,e){var o=-1,r=t.length;e||(e=Array(r));for(;++o<r;)e[o]=t[o];return e}(t,v)}else{var I=$t(t),E=I==l||I==m;if(Zt(t))return function(t,e){if(e)return t.slice();var o=new t.constructor(t.length);return t.copy(o),o}(t,e);if(I==d||I==i||E&&!s){if(q(t))return s?t:{};if(v=function(t){return"function"!=typeof t.constructor||Ht(t)?{}:(e=at(t),Kt(e)?ct(e):{});var e}(E?{}:t),!e)return function(t,e){return Rt(t,Dt(t),e)}(t,function(t,e){return t&&Rt(e,Qt(e),t)}(v,t))}else{if(!L[I])return s?t:{};v=function(t,e,o,r){var n=t.constructor;switch(e){case w:return Nt(t);case a:case c:return new n(+t);case _:return function(t,e){var o=e?Nt(t.buffer):t.buffer;return new t.constructor(o,t.byteOffset,t.byteLength)}(t,r);case j:case x:case O:case k:case M:case A:case C:case B:case z:return function(t,e){var o=e?Nt(t.buffer):t.buffer;return new t.constructor(o,t.byteOffset,t.length)}(t,r);case u:return function(t,e,o){return H(e?o(U(t),!0):U(t),$,new t.constructor)}(t,r,o);case f:case b:return new n(t);case p:return function(t){var e=new t.constructor(t.source,P.exec(t));return e.lastIndex=t.lastIndex,e}(t);case g:return function(t,e,o){return H(e?o(V(t),!0):V(t),F,new t.constructor)}(t,r,o);case y:return i=t,Mt?Object(Mt.call(i)):{}}var i}(t,I,Lt,e)}}h||(h=new zt);var N=h.get(t);if(N)return N;if(h.set(t,v),!S)var R=o?function(t){return function(t,e,o){var r=e(t);return Jt(t)?r:function(t,e){for(var o=-1,r=e.length,n=t.length;++o<r;)t[n+o]=e[o];return t}(r,o(t))}(t,Qt,Dt)}(t):Qt(t);return function(t,e){for(var o=-1,r=t?t.length:0;++o<r&&!1!==e(t[o],o,t););}(R||t,(function(n,i){R&&(n=t[i=n]),St(v,i,Lt(n,e,o,r,i,t,h))})),v}function Et(t){return!(!Kt(t)||(e=t,Y&&Y in e))&&(Gt(t)||q(t)?rt:S).test(qt(t));var e}function Nt(t){var e=new t.constructor(t.byteLength);return new st(e).set(new st(t)),e}function Rt(t,e,o,r){o||(o={});for(var n=-1,i=e.length;++n<i;){var s=e[n],a=r?r(o[s],t[s],s,o,t):void 0;St(o,s,void 0===a?t[s]:a)}return o}function Tt(t,e){var r,n,i=t.__data__;return("string"==(n=o(r=e))||"number"==n||"symbol"==n||"boolean"==n?"__proto__"!==r:null===r)?i["string"==typeof e?"string":"hash"]:i.map}function Wt(t,e){var o=function(t,e){return null==t?void 0:t[e]}(t,e);return Et(o)?o:void 0}At.prototype.clear=function(){this.__data__=vt?vt(null):{}},At.prototype.delete=function(t){return this.has(t)&&delete this.__data__[t]},At.prototype.get=function(t){var e=this.__data__;if(vt){var o=e[t];return o===r?void 0:o}return et.call(e,t)?e[t]:void 0},At.prototype.has=function(t){var e=this.__data__;return vt?void 0!==e[t]:et.call(e,t)},At.prototype.set=function(t,e){return this.__data__[t]=vt&&void 0===e?r:e,this},Ct.prototype.clear=function(){this.__data__=[]},Ct.prototype.delete=function(t){var e=this.__data__,o=It(e,t);return!(o<0)&&(o==e.length-1?e.pop():mt.call(e,o,1),!0)},Ct.prototype.get=function(t){var e=this.__data__,o=It(e,t);return o<0?void 0:e[o][1]},Ct.prototype.has=function(t){return It(this.__data__,t)>-1},Ct.prototype.set=function(t,e){var o=this.__data__,r=It(o,t);return r<0?o.push([t,e]):o[r][1]=e,this},Bt.prototype.clear=function(){this.__data__={hash:new At,map:new(pt||Ct),string:new At}},Bt.prototype.delete=function(t){return Tt(this,t).delete(t)},Bt.prototype.get=function(t){return Tt(this,t).get(t)},Bt.prototype.has=function(t){return Tt(this,t).has(t)},Bt.prototype.set=function(t,e){return Tt(this,t).set(t,e),this},zt.prototype.clear=function(){this.__data__=new Ct},zt.prototype.delete=function(t){return this.__data__.delete(t)},zt.prototype.get=function(t){return this.__data__.get(t)},zt.prototype.has=function(t){return this.__data__.has(t)},zt.prototype.set=function(t,e){var o=this.__data__;if(o instanceof Ct){var r=o.__data__;if(!pt||r.length<199)return r.push([t,e]),this;o=this.__data__=new Bt(r)}return o.set(t,e),this};var Dt=ut?J(ut,Object):function(){return[]},$t=function(t){return ot.call(t)};function Ft(t,e){return!!(e=null==e?n:e)&&("number"==typeof t||I.test(t))&&t>-1&&t%1==0&&t<e}function Ht(t){var e=t&&t.constructor;return t===("function"==typeof e&&e.prototype||Q)}function qt(t){if(null!=t){try{return tt.call(t)}catch(t){}try{return t+""}catch(t){}}return""}function Ut(t,e){return t===e||t!=t&&e!=e}(ht&&$t(new ht(new ArrayBuffer(1)))!=_||pt&&$t(new pt)!=u||gt&&$t(gt.resolve())!=h||bt&&$t(new bt)!=g||yt&&$t(new yt)!=v)&&($t=function(t){var e=ot.call(t),o=e==d?t.constructor:void 0,r=o?qt(o):void 0;if(r)switch(r){case wt:return _;case _t:return u;case jt:return h;case xt:return g;case Ot:return v}return e});var Jt=Array.isArray;function Vt(t){return null!=t&&function(t){return"number"==typeof t&&t>-1&&t%1==0&&t<=n}(t.length)&&!Gt(t)}var Zt=ft||function(){return!1};function Gt(t){var e=Kt(t)?ot.call(t):"";return e==l||e==m}function Kt(t){var e=o(t);return!!t&&("object"==e||"function"==e)}function Qt(t){return Vt(t)?Pt(t):function(t){if(!Ht(t))return dt(t);var e=[];for(var o in Object(t))et.call(t,o)&&"constructor"!=o&&e.push(o);return e}(t)}t.exports=function(t){return Lt(t,!0,!0)}}));var a=" ";function c(t,e){return function(t){var e=t.str,o=t.idx,r=t.stopAtNewlines,n=t.stopAtRawNbsp;if("string"!=typeof e||!e.length)return null;if(o&&"number"==typeof o||(o=0),!e[o+1])return null;if(e[o+1]&&(e[o+1].trim()||r&&"\n\r".includes(e[o+1])||n&&e[o+1]===a))return o+1;if(e[o+2]&&(e[o+2].trim()||r&&"\n\r".includes(e[o+2])||n&&e[o+2]===a))return o+2;for(var i=o+1,s=e.length;i<s;i++)if(e[i].trim()||r&&"\n\r".includes(e[i])||n&&e[i]===a)return i;return null}({str:t,idx:e,stopAtNewlines:!1,stopAtRawNbsp:!1})}function l(t,e){return function(t){var e=t.str,o=t.idx,r=t.stopAtNewlines,n=t.stopAtRawNbsp;if("string"!=typeof e||!e.length)return null;if(o&&"number"==typeof o||(o=0),o<1)return null;if(e[~-o]&&(e[~-o].trim()||r&&"\n\r".includes(e[~-o])||n&&e[~-o]===a))return~-o;if(e[o-2]&&(e[o-2].trim()||r&&"\n\r".includes(e[o-2])||n&&e[o-2]===a))return o-2;for(var i=o;i--;)if(e[i]&&(e[i].trim()||r&&"\n\r".includes(e[i])||n&&e[i]===a))return i;return null}({str:t,idx:e,stopAtNewlines:!1,stopAtRawNbsp:!1})}function m(t){return t&&"object"===o(t)&&!Array.isArray(t)}function u(t){return"string"==typeof t}function f(t,e,o,r,n,i){var s="function"==typeof o?o():o;if(e<0&&n&&"EOL"===s)return s;if(e>=t.length&&!n)return!1;for(var a=n?1:o.length,c=!1,l=!1,m=r.maxMismatches,u=e,f=!1,d=!1,h=!1;t[u];){var p=i(u);if(r.trimBeforeMatching&&""===t[u].trim()){if(!t[p]&&n&&"EOL"===o)return!0;u=i(u)}else if(!r.i&&r.trimCharsBeforeMatching.includes(t[u])||r.i&&r.trimCharsBeforeMatching.map((function(t){return t.toLowerCase()})).includes(t[u].toLowerCase())){if(n&&"EOL"===o&&!t[p])return!0;u=i(u)}else{var g=p>u?o[o.length-a]:o[a-1];if(!r.i&&t[u]===g||r.i&&t[u].toLowerCase()===g.toLowerCase()){if(f||(f=!0),l||(l=!0),a===o.length?d=!0:1===a&&(h=!0),(a-=1)<1)return u}else{if(!(r.maxMismatches&&m&&u))return!(0!==u||1!==a||r.lastMustMatch||!l)&&0;m-=1;for(var b=0;b<=m;b++){var y=p>u?o[o.length-a+1+b]:o[a-2-b],v=t[i(u)];if(y&&(!r.i&&t[u]===y||r.i&&t[u].toLowerCase()===y.toLowerCase())&&(!r.firstMustMatch||a!==o.length)){a-=2,f=!0;break}if(v&&y&&(!r.i&&v===y||r.i&&v.toLowerCase()===y.toLowerCase())&&(!r.firstMustMatch||a!==o.length)){a-=1,f=!0;break}if(void 0===y&&m>=0&&f&&(!r.firstMustMatch||d)&&(!r.lastMustMatch||h))return u}f||(c=u)}if(!1!==c&&c!==u&&(c=!1),a<1)return u;u=i(u)}}return a>0?!(!n||"EOL"!==s)||!!(r.maxMismatches>=a&&l)&&(c||0):void 0}function d(t,e,r,n){return function(t,e,r,n,s){var a={cb:void 0,i:!1,trimBeforeMatching:!1,trimCharsBeforeMatching:[],maxMismatches:0,firstMustMatch:!1,lastMustMatch:!1};if(m(s)&&Object.prototype.hasOwnProperty.call(s,"trimBeforeMatching")&&"boolean"!=typeof s.trimBeforeMatching)throw new Error("string-match-left-right/".concat(t,"(): [THROW_ID_09] opts.trimBeforeMatching should be boolean!").concat(Array.isArray(s.trimBeforeMatching)?" Did you mean to use opts.trimCharsBeforeMatching?":""));var c,l,d,h,p,g=i(i({},a),s);if(g.trimCharsBeforeMatching="string"==typeof(c=g.trimCharsBeforeMatching)?c.length>0?[c]:[]:c,g.trimCharsBeforeMatching=g.trimCharsBeforeMatching.map((function(t){return u(t)?t:String(t)})),!u(e))return!1;if(!e.length)return!1;if(!Number.isInteger(r)||r<0)throw new Error("string-match-left-right/".concat(t,"(): [THROW_ID_03] the second argument should be a natural number. Currently it's of a type: ").concat(o(r),", equal to:\n").concat(JSON.stringify(r,null,4)));if(u(n))l=[n];else if(Array.isArray(n))l=n;else if(n){if("function"!=typeof n)throw new Error("string-match-left-right/".concat(t,"(): [THROW_ID_05] the third argument, whatToMatch, is neither string nor array of strings! It's ").concat(o(n),", equal to:\n").concat(JSON.stringify(n,null,4)));(l=[]).push(n)}else l=n;if(s&&!m(s))throw new Error("string-match-left-right/".concat(t,"(): [THROW_ID_06] the fourth argument, options object, should be a plain object. Currently it's of a type \"").concat(o(s),'", and equal to:\n').concat(JSON.stringify(s,null,4)));if(g.trimCharsBeforeMatching.some((function(t,e){return t.length>1&&(h=e,p=t,!0)})))throw new Error("string-match-left-right/".concat(t,"(): [THROW_ID_07] the fourth argument, options object contains trimCharsBeforeMatching. It was meant to list the single characters but one of the entries at index ").concat(h," is longer than 1 character, ").concat(p.length," (equals to ").concat(p,"). Please split it into separate characters and put into array as separate elements."));if(!l||!Array.isArray(l)||Array.isArray(l)&&!l.length||Array.isArray(l)&&1===l.length&&u(l[0])&&!l[0].trim()){if("function"==typeof g.cb){var b,y=r;if("matchLeftIncl"!==t&&"matchRight"!==t||(y+=1),"L"===t[5])for(var v=y;v--;){var w=e[v];if((!g.trimBeforeMatching||g.trimBeforeMatching&&void 0!==w&&w.trim())&&(!g.trimCharsBeforeMatching.length||void 0!==w&&!g.trimCharsBeforeMatching.includes(w))){b=v;break}}else if(t.startsWith("matchRight"))for(var _=y;_<e.length;_++){var j=e[_];if((!g.trimBeforeMatching||g.trimBeforeMatching&&j.trim())&&(!g.trimCharsBeforeMatching.length||!g.trimCharsBeforeMatching.includes(j))){b=_;break}}if(void 0===b)return!1;var x=e[b],O=b+1,k="";return O&&O>0&&(k=e.slice(0,O)),"L"===t[5]||b&&b>0&&(k=e.slice(b)),g.cb(x,k,b)}var M="";throw s||(M=" More so, the whole options object, the fourth input argument, is missing!"),new Error("string-match-left-right/".concat(t,'(): [THROW_ID_08] the third argument, "whatToMatch", was given as an empty string. This means, you intend to match purely by a callback. The callback was not set though, the opts key "cb" is not set!').concat(M))}for(var A=0,C=l.length;A<C;A++){d="function"==typeof l[A];var B=l[A],z=void 0,P=void 0,S="",I=r;"matchRight"===t?I+=1:"matchLeft"===t&&(I-=1);var L=f(e,I,B,g,d,(function(e){return"L"===t[5]?e-1:e+1}));if(L&&d&&"function"==typeof B&&"EOL"===B())return!(!B()||g.cb&&!g.cb(z,S,P))&&B();if(Number.isInteger(L)&&(P=t.startsWith("matchLeft")?L-1:L+1,S="L"===t[5]?e.slice(0,L):e.slice(P)),P<0&&(P=void 0),e[P]&&(z=e[P]),Number.isInteger(L)&&(!g.cb||g.cb(z,S,P)))return B}return!1}("matchRight",t,e,r,n)}function h(t,e,r){for(var n=arguments.length>3&&void 0!==arguments[3]?arguments[3]:[],i=function(e,o){return n.some((function(o){return t.startsWith(o,e)}))?{v:!0}:t[e]===r?{v:!1}:void 0},s=e,a=t.length;s<a;s++){var c=i(s);if("object"===o(c))return c.v}return!0}function p(t,e,o,r){for(var n=e,i=t.length;n<i;n++){if(t.startsWith(o,n))return!0;if(t.startsWith(r,n))return!1}return!1}function g(t,o){if(!e(t[o])||!o)return!1;return/^[a-zA-Z0-9:-]*(\s*[=]?\s*((?:'[^']*')|(?:"[^"]*")))|( [^/>'"=]*['"])/.test(t.slice(o))}function b(t,o){if(!e(t[o])||!o)return!1;return/^[a-zA-Z0-9:-]*=(((?:'[^']*')|(?:"[^"]*"))|((?:['"][^'"]*['"]\s*\/?>)))/.test(t.slice(o))}function y(t,o){if(e(t[l(t,o)]))for(var r=o;r--;)if(t[r].trim().length&&!e(t[r]))return t.slice(r+1,o)}function v(t){return"'"===t?'"':"'"}return function(o,r,n){if("string"!=typeof o||!o.trim()||!Number.isInteger(r)||!Number.isInteger(n)||!o[r]||!o[n]||r>=n)return!1;var i,s="'\"".includes(o[r])?o[r]:null,a=null;s&&(a=v(s));for(var m,u,f=(new Map).set("'",0).set('"',0).set("matchedPairs",0),w=null,_=0,j=!1,x=!1,O=!1,k=!1,M=!1,A=!1,C=r,B=o.length;C<B;C++){if("'\"".includes(o[C])&&j&&x===r&&O<C&&C>=n){var z=C!==n||b(o,c(o,n))||"/>".includes(o[c(o,C)]),P=!(C>n&&o[r]===o[n]&&o[r]===o[C]&&g(o,C+1)),S=C===n&&g(o,n+1),I=i&&i<C&&t.has(o.slice(i,C).trim()),L=(o.slice(i,C).trim(),i&&i<C&&o[i-1]&&!o[i-1].trim()&&Array.from(o.slice(i,C).trim()).every((function(t){return e(t)}))&&o[r]===o[n]&&!"/>".includes(o[c(o,C)])&&h(o,C+1,"=",["'",'"'])),E=void 0;C===n&&(E=y(o,C));var N=C===n&&(!e(o[l(o,C)])||E&&!t.has(E))&&"="!==o[l(o,C)],R="/>".includes(o[c(o,C)])&&C===n,T=e(o[c(o,C)]),W=j&&C!==n,D=!(C>=n&&":"===o[l(o,n)]);return z&&P&&(S||I||L||N)&&(R||T||W)&&D}if("'\"".includes(o[C])){if("'"===o[C]&&'"'===o[C-1]&&'"'===o[C+1]||'"'===o[C]&&"'"===o[C-1]&&"'"===o[C+1])continue;w&&o[C]===o[w]?(f.set("matchedPairs",f.get("matchedPairs")+1),x=w,O=C,w=null,j=!0):j=!1,f.set(o[C],f.get(o[C])+1),_=f.get('"')+f.get("'")}if(">"===o[C]&&!M&&(M=!0,_&&f.get("matchedPairs")&&_===2*f.get("matchedPairs")&&C<n))return!1;if("<"===o[C]&&M&&!A)return A=!0,!1;if(o[C].trim()&&!i)e(o[C])&&(i=C);else if(i&&!e(o[C])){if(u=m,m=o.slice(i,C),k=i>=n,"'\"".includes(o[C])&&0===f.get("matchedPairs")&&3===_&&o[r]===o[C]&&t.has(m)&&!"'\"".includes(o[c(o,C)])){var $=C>n,F=!w,H=w+1>=C,q=o.slice(w+1,C).trim().split(/\s+/).every((function(e){return t.has(e)})),U=!m||!u||!u.endsWith(":"),J=C===n,V=_<3,Z=!!j,G=!w,K=w+1>=C,Q=!o.slice(w+1,C).trim().split(/\s+/).every((function(e){return t.has(e)}));return $&&(F||H||q)&&U||J&&(V||Z||G||K||Q)}if(m&&t.has(m)&&x===r&&O===n)return!0}if("'\"".includes(o[C])&&(!(f.get('"')%2)||!(f.get("'")%2))&&(f.get('"')+f.get("'"))%2&&(m&&t.has(m)||C>n+1&&t.has(o.slice(n+1,C).trim()))&&(o[C+1]!==o[C]||o[C]!==o[r])&&!(C>n+1&&":"===o[l(o,n)])&&!(m&&u&&u.trim().endsWith(":"))){var X=C>n,Y=!!s,tt=o[r]!==o[n],et=t.has(o.slice(r+1,n).trim()),ot=!p(o,C+1,o[n],v(o[n]));return X&&!(Y&&tt&&et&&ot)}if(("="===o[C]||!o[C].length&&"="===o[c(o,C)])&&m&&t.has(m)){var rt=C>n,nt=!(!(j&&x===r&&O===n||b(o,i))&&j&&x&&x<=n);return rt&&nt}if(C>n){if(s&&o[C]===s){var it=!!w,st=w===n,at=w+1<C&&o.slice(w+1,C).trim(),ct=o.slice(w+1,C).trim().split(/\s+/).every((function(e){return t.has(e)})),lt=C>=n,mt=!o[c(o,C)]||!"'\"".includes(o[c(o,C)]);return it&&st&&at&&ct&&lt&&mt}if(s&&o[n]===a&&o[C]===a)return!1;if("/"===o[C]||">"===o[C]||"<"===o[C]){var ut=o[r]===o[n]&&w===n&&!o.slice(r+1,n).includes(o[r]),ft=f.get("matchedPairs")<2,dt=y(o,C),ht=(!dt||!t.has(dt))&&(!(C>n&&f.get("'")&&f.get('"')&&f.get("matchedPairs")>1)||"/>".includes(o[c(o,C)])),pt=_<3||f.get('"')+f.get("'")-2*f.get("matchedPairs")!=2,gt=!j||j&&!(x&&Array.from(o.slice(r+1,x).trim()).every((function(t){return e(t)}))&&t.has(o.slice(r+1,x).trim())),bt=!c(o,C)&&_%2==0,yt=o[r-2]&&"="===o[r-1]&&e(o[r-2]),vt=!h(o,C+1,"<",["='",'="']);return ut||(ft||ht)&&pt&&(gt||bt||yt||vt)}if("="===o[C]&&d(o,C,["'",'"'],{trimBeforeMatching:!0,trimCharsBeforeMatching:["="]}))return!0}else{var wt=void 0;if(o[C-1]&&o[C-1].trim()&&"="!==o[C-1])wt=C-1;else for(var _t=C;_t--;)if(o[_t].trim()&&"="!==o[_t]){wt=_t;break}if("="===o[C]&&d(o,C,["'",'"'],{cb:function(t){return!"/>".includes(t)},trimBeforeMatching:!0,trimCharsBeforeMatching:["="]})&&e(o[wt])&&!o.slice(r+1).startsWith("http"))return!1;if(C===n&&b(o,C+1))return!0;if(C<n&&"'\"".includes(o[C])&&m&&o[l(o,r)]&&"="!==o[l(o,r)]&&x===r&&t.has(m))return!1;if(C===n&&"'\"".includes(o[C])&&m&&u&&_%2==0&&u.endsWith(":"))return!0}if("'\"".includes(o[C])&&C>n)return!!(k&&m&&t.has(m));"'\"".includes(o[C])&&(w=C),i&&!e(o[C])&&(i=null)}return!1}}));
