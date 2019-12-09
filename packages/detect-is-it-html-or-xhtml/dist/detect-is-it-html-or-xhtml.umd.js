/**
 * detect-is-it-html-or-xhtml
 * Answers, is the string input string more an HTML or XHTML (or neither)
 * Version: 3.9.50
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/detect-is-it-html-or-xhtml
 */

!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):(t=t||self).detectIsItHtmlOrXhtml=e()}(this,(function(){"use strict";return function(t){function e(t){return null!=t}if(!e(t))return null;if("string"!=typeof t)throw new TypeError("detect-is-it-html-or-xhtml: [THROW_ID_01] Input must be string");var n,i,l,r,c,m,o=0,u=/\/\s*>/g,h=null,f=null;if(e(h=/<\s*!\s*doctype[^>]*>/im.exec(t))){f=h[0].match(/xhtml/gi)||h[0].match(/svg/gi)?"xhtml":"html"}else{if(l=t.match(/<\s*img[^>]*>/gi)||[],r=t.match(/<\s*br[^>]*>/gi)||[],c=t.match(/<\s*hr[^>]*>/gi)||[],0===(m=l.concat(r).concat(c)).length)return null;for(n=0,i=m.length;n<i;n++)e(m[n].match(u))&&(o+=1);f=o>m.length/2?"xhtml":"html"}return f}}));
