/**
 * @name helga
 * @fileoverview Your next best friend when editing complex nested code
 * @version 1.3.14
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/helga/}
 */

!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t((e="undefined"!=typeof globalThis?globalThis:e||self).helga={})}(this,(function(e){"use strict";const t={targetJSON:!1},n={b:"\b",f:"\f",n:"\n",r:"\r",t:"\t",v:"\v","'":"'",'"':'"',"\\":"\\",0:"\0"};function i(e){return e.replace(/\\([bfnrtv'"\\0])/g,(e=>n[e]||e&&(e.startsWith("\\")?n[e.slice(1)]:"")))}e.defaults=t,e.helga=function(e,n){const f={...t,...n},o=i(e);let r=i(e);return f.targetJSON&&(r=JSON.stringify(r.replace(/\t/g,"  "),null,0),r=r.slice(1,r.length-1)),{minified:r,beautified:o}},e.version="1.3.14",Object.defineProperty(e,"__esModule",{value:!0})}));
