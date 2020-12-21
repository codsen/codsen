/**
 * ast-monkey-util
 * Utility library of AST helper functions
 * Version: 1.2.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ast-monkey-util/
 */

function e(e){return e?e.includes(".")&&/^\d*$/.test(e.slice(e.lastIndexOf(".")+1))?`${e.slice(0,e.lastIndexOf(".")+1)}${+e.slice(e.lastIndexOf(".")+1)+1}`:/^\d*$/.test(e)?""+(+e+1):e:null}function l(e){if(!e)return null;const l=e.slice(e.lastIndexOf(".")+1);return"0"===l?null:e.includes(".")&&/^\d*$/.test(l)?`${e.slice(0,e.lastIndexOf(".")+1)}${+e.slice(e.lastIndexOf(".")+1)-1}`:/^\d*$/.test(e)?""+(+e-1):null}function n(e){if(e.includes(".")&&e.slice(e.indexOf(".")+1).includes(".")){let l=0;for(let n=e.length;n--;)if("."===e[n]&&(l+=1),2===l)return e.slice(0,n)}return"0"}function t(e){if(e.includes(".")){const l=e.lastIndexOf(".");if(!e.slice(0,l).includes("."))return e.slice(0,l);for(let n=l-1;n--;)if("."===e[n])return e.slice(n+1,l)}return null}export{t as parent,e as pathNext,l as pathPrev,n as pathUp};
