/**
 * ast-monkey-util
 * Utility library of AST helper functions
 * Version: 1.3.11
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ast-monkey-util/
 */

function e(e){return e.includes(".")&&/^\d*$/.test(e.slice(e.lastIndexOf(".")+1))?`${e.slice(0,e.lastIndexOf(".")+1)}${+e.slice(e.lastIndexOf(".")+1)+1}`:/^\d*$/.test(e)?""+(+e+1):e}function n(e){if(!e)return null;const n=e.slice(e.lastIndexOf(".")+1);return"0"===n?null:e.includes(".")&&/^\d*$/.test(n)?`${e.slice(0,e.lastIndexOf(".")+1)}${+e.slice(e.lastIndexOf(".")+1)-1}`:/^\d*$/.test(e)?""+(+e-1):null}function l(e){if(e.includes(".")&&e.slice(e.indexOf(".")+1).includes(".")){let n=0;for(let l=e.length;l--;)if("."===e[l]&&(n+=1),2===n)return e.slice(0,l)}return"0"}function t(e){if(e.includes(".")){const n=e.lastIndexOf(".");if(!e.slice(0,n).includes("."))return e.slice(0,n);for(let l=n-1;l--;)if("."===e[l])return e.slice(l+1,n)}return null}const s="1.3.11";export{t as parent,e as pathNext,n as pathPrev,l as pathUp,s as version};
