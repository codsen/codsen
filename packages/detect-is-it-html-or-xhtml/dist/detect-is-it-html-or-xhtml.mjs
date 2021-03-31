/**
 * detect-is-it-html-or-xhtml
 * Answers, is the string input string more an HTML or XHTML (or neither)
 * Version: 4.0.12
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/detect-is-it-html-or-xhtml/
 */

const t="4.0.12";function n(t){if(!t)return null;if("string"!=typeof t)throw new TypeError("detect-is-it-html-or-xhtml: [THROW_ID_01] Input must be string");const n=/\/\s*>/g,h=t.match(/<\s*!\s*doctype[^>]*>/im);if(h){const t=/svg/gi;return h[0].match(/xhtml/gi)||h[0].match(t)?"xhtml":"html"}const r=t.match(/<\s*img[^>]*>/gi)||[],c=t.match(/<\s*br[^>]*>/gi)||[],l=t.match(/<\s*hr[^>]*>/gi)||[],e=r.concat(c).concat(l);if(0===e.length)return null;let m=0;for(let t=0,h=e.length;t<h;t++)null!=e[t].match(n)&&(m+=1);return m>e.length/2?"xhtml":"html"}export{n as detectIsItHTMLOrXhtml,t as version};
