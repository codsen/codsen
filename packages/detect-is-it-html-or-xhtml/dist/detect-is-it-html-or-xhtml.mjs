/**
 * detect-is-it-html-or-xhtml
 * Answers, is the string input string more an HTML or XHTML (or neither)
 * Version: 4.0.4
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/detect-is-it-html-or-xhtml/
 */

const t="4.0.4";function n(t){if(!t)return null;if("string"!=typeof t)throw new TypeError("detect-is-it-html-or-xhtml: [THROW_ID_01] Input must be string");const n=/\/\s*>/g,r=t.match(/<\s*!\s*doctype[^>]*>/im);if(r){const t=/svg/gi;return r[0].match(/xhtml/gi)||r[0].match(t)?"xhtml":"html"}const h=t.match(/<\s*img[^>]*>/gi)||[],c=t.match(/<\s*br[^>]*>/gi)||[],e=t.match(/<\s*hr[^>]*>/gi)||[],l=h.concat(c).concat(e);if(0===l.length)return null;let i=0;for(let t=0,r=l.length;t<r;t++)null!=l[t].match(n)&&(i+=1);return i>l.length/2?"xhtml":"html"}export{n as detectIsItHTMLOrXhtml,t as version};
