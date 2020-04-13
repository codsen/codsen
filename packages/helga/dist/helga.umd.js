/**
 * helga
 * Your next best friend when editing complex nested code
 * Version: 1.1.29
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/helga
 */

!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t((e=e||self).helga={})}(this,(function(e){"use strict";var t,r,n,o;
/*! http://mths.be/fromcodepoint v0.2.1 by @mathias */
String.fromCodePoint||(t=function(){try{var e={},t=Object.defineProperty,r=t(e,e,e)&&t}catch(e){}return r}(),r=String.fromCharCode,n=Math.floor,o=function(e){var t,o,i=16384,f=[],a=-1,u=arguments.length;if(!u)return"";for(var d="";++a<u;){var l=Number(arguments[a]);if(!isFinite(l)||l<0||l>1114111||n(l)!=l)throw RangeError("Invalid code point: "+l);l<=65535?f.push(l):(t=55296+((l-=65536)>>10),o=l%1024+56320,f.push(t,o)),(a+1==u||f.length>i)&&(d+=r.apply(null,f),f.length=0)}return d},t?t(String,"fromCodePoint",{value:o,configurable:!0,writable:!0}):String.fromCodePoint=o);var i,f=function(e,t){return e(t={exports:{}},t.exports),t.exports}((function(e,t){Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r=/\\(u\{([0-9A-Fa-f]+)\}|u([0-9A-Fa-f]{4})|x([0-9A-Fa-f]{2})|([1-7][0-7]{0,2}|[0-7]{2,3})|(['"tbrnfv0\\]))|\\U([0-9A-Fa-f]{8})/g,n={0:"\0",b:"\b",f:"\f",n:"\n",r:"\r",t:"\t",v:"\v","'":"'",'"':'"',"\\":"\\"},o=function(e){return String.fromCodePoint(parseInt(e,16))};t.default=function(e){return e.replace(r,(function(e,t,r,i,f,a,u,d){return void 0!==r?o(r):void 0!==i?o(i):void 0!==f?o(f):void 0!==a?(l=a,String.fromCodePoint(parseInt(l,8))):void 0!==d?o(d):n[u];var l}))},e.exports=t.default})),a=(i=f)&&i.__esModule&&Object.prototype.hasOwnProperty.call(i,"default")?i.default:i,u={targetJSON:!1};e.defaults=u,e.helga=function(e,t){var r=Object.assign({},u,t),n=a(e),o=a(e);return r.targetJSON&&(o=(o=JSON.stringify(o.replace(/\t/g,"  "),null,0)).slice(1,o.length-1)),{minified:o,beautified:n}},e.version="1.1.29",Object.defineProperty(e,"__esModule",{value:!0})}));
