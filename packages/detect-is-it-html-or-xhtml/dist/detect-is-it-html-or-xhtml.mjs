/**
 * detect-is-it-html-or-xhtml
 * Answers, is the string input string more an HTML or XHTML (or neither)
 * Version: 3.11.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/detect-is-it-html-or-xhtml/
 */

var t="3.11.0";function n(t){if(!t)return null;if("string"!=typeof t)throw new TypeError("detect-is-it-html-or-xhtml: [THROW_ID_01] Input must be string");const n=/\/\s*>/g,r=t.match(/<\s*!\s*doctype[^>]*>/im);if(r){const t=/svg/gi;return r[0].match(/xhtml/gi)||r[0].match(t)?"xhtml":"html"}const h=t.match(/<\s*img[^>]*>/gi)||[],l=t.match(/<\s*br[^>]*>/gi)||[],c=t.match(/<\s*hr[^>]*>/gi)||[],e=h.concat(l).concat(c);if(0===e.length)return null;let m=0;for(let t=0,r=e.length;r>t;t++)null!=e[t].match(n)&&(m+=1);return m>e.length/2?"xhtml":"html"}export{n as detectIsItHTMLOrXhtml,t as version};
