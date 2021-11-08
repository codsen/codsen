/**
 * @name detect-is-it-html-or-xhtml
 * @fileoverview Answers, is the string input string more an HTML or XHTML (or neither)
 * @version 5.0.5
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/detect-is-it-html-or-xhtml/}
 */

!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e((t="undefined"!=typeof globalThis?globalThis:t||self).detectIsItHtmlOrXhtml={})}(this,(function(t){"use strict";t.detectIsItHTMLOrXhtml=function(t){if(!t)return null;if("string"!=typeof t)throw new TypeError("detect-is-it-html-or-xhtml: [THROW_ID_01] Input must be string");const e=/\/\s*>/g,n=t.match(/<\s*!\s*doctype[^>]*>/im);if(n){const t=/svg/gi;return n[0].match(/xhtml/gi)||n[0].match(t)?"xhtml":"html"}const i=t.match(/<\s*img[^>]*>/gi)||[],l=t.match(/<\s*br[^>]*>/gi)||[],o=t.match(/<\s*hr[^>]*>/gi)||[],r=i.concat(l).concat(o);if(0===r.length)return null;let s=0;for(let t=0,n=r.length;t<n;t++)null!=r[t].match(e)&&(s+=1);return s>r.length/2?"xhtml":"html"},t.version="5.0.5",Object.defineProperty(t,"__esModule",{value:!0})}));
