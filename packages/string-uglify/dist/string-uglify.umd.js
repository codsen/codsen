/**
 * string-uglify
 * Uglify - generate short unique names for sets of strings
 * Version: 1.0.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/string-uglify
 */

!function(r,n){"object"==typeof exports&&"undefined"!=typeof module?n(exports):"function"==typeof define&&define.amd?define(["exports"],n):n((r=r||self).stringUglify={})}(this,function(r){"use strict";var n=Array.isArray;function e(r){if(r<26)return r;for(;r>9;)if((r=Array.from(String(r)).reduce(function(r,n){return r+Number.parseInt(n)},0))<26)return r}function t(r,n){return r.codePointAt(n)}function u(r){var u="abcdefghijklmnopqrstuvwxyz",i=[];if(!n(r)||!r.length)return r;for(var o,f=[],c=function(n,c){o=i.length;var s=".#".includes(r[n][0])?r[n][0]:"",h=[e(Array.from(r[n]).reduce(function(r,n){return r+t(n)},0)),e(Array.from(r[n]).reduce(function(r,n){return r<1e3?r*t(n):e(r*t(n)-1)},1)),e(Array.from(r[n]).reduce(function(r,n){return e(r*t(n)+1)},1))];h.push(e(h[0]+11)),h.push(e(h[1]+12)),h.push(e(h[2]+13)),h.push(e(h[0]*h[1])),h.push(e(h[1]*h[2])),h.push(e(h[2]*h[0])),h.push(e(h[0]*h[1]+11)),h.push(e(h[1]*h[0]+12)),h.push(e(h[2]*h[1]+13)),h.push(e((h[0]+1)*(h[1]+2))),h.push(e((h[1]+2)*(h[1]+3))),h.push(e((h[2]+3)*(h[0]+4)));var p=void 0;do{if(f.length)for(var a=0;a<f.length;){if(f[a]<h.length-1){f[a]+=1;break}if(f[a]=0,void 0===f[a+1]){f.push(0);break}a++}else f.push(0);p="".concat(s).concat(f.map(function(r){return u[h[r]]}).join(""))}while(i.includes(p));if(i.push("".concat(s).concat(f.map(function(r){return u[h[r]]}).join(""))),i.length===o)throw new Error("string-uglify: [THROW_ID_01] internal error!");o=i.length},s=0,h=r.length;s<h;s++)c(s);return i}r.uglifyArr=u,r.uglifyById=function(r,n){return u(r)[n]},r.version="1.0.0",Object.defineProperty(r,"__esModule",{value:!0})});
