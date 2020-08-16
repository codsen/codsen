/**
 * detect-is-it-html-or-xhtml
 * Answers, is the string input string more an HTML or XHTML (or neither)
 * Version: 3.9.59
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/detect-is-it-html-or-xhtml
 */

!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):(t="undefined"!=typeof globalThis?globalThis:t||self).detectIsItHtmlOrXhtml=e()}(this,(function(){"use strict";return function(t){function e(t){return null!=t}if(!e(t))return null;if("string"!=typeof t)throw new TypeError("detect-is-it-html-or-xhtml: [THROW_ID_01] Input must be string");var n,l,i,r,o,h,u=0,c=/\/\s*>/g,f=null,m=null;if(e(f=/<\s*!\s*doctype[^>]*>/im.exec(t))){m=f[0].match(/xhtml/gi)||f[0].match(/svg/gi)?"xhtml":"html"}else{if(i=t.match(/<\s*img[^>]*>/gi)||[],r=t.match(/<\s*br[^>]*>/gi)||[],o=t.match(/<\s*hr[^>]*>/gi)||[],0===(h=i.concat(r).concat(o)).length)return null;for(n=0,l=h.length;n<l;n++)e(h[n].match(c))&&(u+=1);m=u>h.length/2?"xhtml":"html"}return m}}));
