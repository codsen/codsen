/**
 * string-collapse-leading-whitespace
 * Collapse the leading and trailing whitespace of a string
 * Version: 5.0.8
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/string-collapse-leading-whitespace/
 */

const r="5.0.8";function e(r,e=1){function t(r){return Array.from(r).reverse().join("")}function i(r,e,t){const i=t?"\n":"\r",n=t?"\r":"\n";if(!r)return r;let f=0,l="";for(let t=0,o=r.length;t<o;t++)(r[t]===i||r[t]===n&&r[t-1]!==i)&&f++,"\r\n".includes(r[t])||" "===r[t]?" "===r[t]?l+=r[t]:r[t]===i?f<=e&&(l+=r[t],r[t+1]===n&&(l+=r[t+1],t++)):r[t]===n&&(!r[t-1]||r[t-1]!==i)&&f<=e&&(l+=r[t]):r[t+1]||f||(l+=" ");return l}if("string"==typeof r&&r.length){let n=1;"number"==typeof+e&&Number.isInteger(+e)&&+e>=0&&(n=+e);let f="",l="";if(r.trim()){if(!r[0].trim())for(let e=0,t=r.length;e<t;e++)if(r[e].trim()){f=r.slice(0,e);break}}else f=r;if(r.trim()&&(""===r.slice(-1).trim()||" "===r.slice(-1)))for(let e=r.length;e--;)if(r[e].trim()){l=r.slice(e+1);break}return`${i(f,n,!1)}${r.trim()}${t(i(t(l),n,!0))}`}return r}export{e as collWhitespace,r as version};
