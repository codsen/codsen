/**
 * string-uglify
 * Uglify - generate unique short names for sets of strings
 * Version: 1.1.1
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/string-uglify
 */

!function(e,n){"object"==typeof exports&&"undefined"!=typeof module?n(exports):"function"==typeof define&&define.amd?define(["exports"],n):n((e=e||self).stringUglify={})}(this,function(e){"use strict";var n=Array.isArray;function r(e,n){return e.codePointAt(n)}function t(e){var t="abcdefghijklmnopqrstuvwxyz",u="abcdefghijklmnopqrstuvwxyz0123456789",i=[];if(!n(e)||!e.length)return e;for(var f=0,o=e.length;f<o;f++)if(e.indexOf(e[f])<f)i.push(i[e.indexOf(e[f])]);else{var c=".#".includes(e[f][0])?e[f][0]:"",l=Array.from(e[f]).reduce(function(e,n){return e+r(n)},0);if(!(".#".includes(e[f][0])&&e[f].length<4||!".#".includes(e[f][0])&&e[f].length<3)||i.includes(e[f])){var s="".concat(c).concat(t[l%t.length]).concat(u[l%u.length]);if(i.includes(s)){for(var d=s,a=0,h=Array.from(e[f]).reduce(function(e,n){return e<200?e+r(n):(e+r(n))%u.length},0),p=Array.from(e[f]).map(function(e){return r(e)}).reduce(function(e,n){var r=e+n;do{r=String(r).split("").reduce(function(e,n){return e+Number.parseInt(n)},0)}while(r>=10);return r},0);i.includes(d);)d+=u[h*p*++a%u.length];i.push(d)}else i.push(s)}else i.push(e[f])}return i}e.uglifyArr=t,e.uglifyById=function(e,n){return t(e)[n]},e.version="1.1.1",Object.defineProperty(e,"__esModule",{value:!0})});
