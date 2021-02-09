/**
 * detect-is-it-html-or-xhtml
 * Answers, is the string input string more an HTML or XHTML (or neither)
 * Version: 4.0.3
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/detect-is-it-html-or-xhtml/
 */

!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e((t="undefined"!=typeof globalThis?globalThis:t||self).detectIsItHtmlOrXhtml={})}(this,(function(t){"use strict";t.detectIsItHTMLOrXhtml=function(t){if(!t)return null;if("string"!=typeof t)throw new TypeError("detect-is-it-html-or-xhtml: [THROW_ID_01] Input must be string");var e=/\/\s*>/g,n=t.match(/<\s*!\s*doctype[^>]*>/im);if(n){return n[0].match(/xhtml/gi)||n[0].match(/svg/gi)?"xhtml":"html"}var i=t.match(/<\s*img[^>]*>/gi)||[],r=t.match(/<\s*br[^>]*>/gi)||[],l=t.match(/<\s*hr[^>]*>/gi)||[],o=i.concat(r).concat(l);if(0===o.length)return null;for(var h=0,s=0,c=o.length;s<c;s++)null!=o[s].match(e)&&(h+=1);return h>o.length/2?"xhtml":"html"},t.version="4.0.3",Object.defineProperty(t,"__esModule",{value:!0})}));
