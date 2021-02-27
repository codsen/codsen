/**
 * helga
 * Your next best friend when editing complex nested code
 * Version: 1.3.6
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/helga/
 */

!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t((e="undefined"!=typeof globalThis?globalThis:e||self).helga={})}(this,(function(e){"use strict";function t(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function r(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function n(e){for(var n=1;n<arguments.length;n++){var i=null!=arguments[n]?arguments[n]:{};n%2?r(Object(i),!0).forEach((function(r){t(e,r,i[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(i)):r(Object(i)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(i,t))}))}return e}var i={targetJSON:!1},o={b:"\b",f:"\f",n:"\n",r:"\r",t:"\t",v:"\v","'":"'",'"':'"',"\\":"\\",0:"\0"};function f(e){return e.replace(/\\([bfnrtv'"\\0])/g,(function(e){return o[e]||e&&(e.startsWith("\\")?o[e.slice(1)]:"")}))}e.defaults=i,e.helga=function(e,t){var r=n(n({},i),t),o=f(e),c=f(e);return r.targetJSON&&(c=(c=JSON.stringify(c.replace(/\t/g,"  "),null,0)).slice(1,c.length-1)),{minified:c,beautified:o}},e.version="1.3.6",Object.defineProperty(e,"__esModule",{value:!0})}));
