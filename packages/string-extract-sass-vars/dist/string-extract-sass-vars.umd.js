/**
 * string-extract-sass-vars
 * Parse SASS variables file into a plain object of CSS key-value pairs
 * Version: 1.1.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/string-extract-sass-vars
 */

!function(t,n){"object"==typeof exports&&"undefined"!=typeof module?module.exports=n():"function"==typeof define&&define.amd?define(n):(t=t||self).stringExtractSassVars=n()}(this,(function(){"use strict";function t(n){return(t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(n)}return function(n,e){if("string"!=typeof n)return{};if(e&&"object"!==t(e))throw new Error("string-extract-sass-vars: [THROW_ID_01] the second input argument should be a plain object but it was given as ".concat(JSON.stringify(e,null,4)," (type ").concat(t(e),")"));for(var l=Object.assign({},{throwIfEmpty:!1},e),o=n.length,r=null,u=null,s=null,i=null,c=null,f=null,y=!1,a=!1,p=!1,d={},b=0;b<o;b++)!y&&c&&n[b]===c&&"\\"!==n[b-1]?c=null:c||y||"\\"===n[b-1]||!"'\"".includes(n[b])||(c=n[b]),a&&"\r\n".includes(n[b])&&(a=!1),y||"/"!==n[b]||"/"!==n[b+1]||(a=!0),p&&"*"===n[b-2]&&"/"===n[b-1]&&(p=!1),y||"/"!==n[b]||"*"!==n[b+1]||(p=!0),(y=a||p)||"$"!==n[b]||null!==r||(r=b+1),y||null===u||c||";"!==n[b]||(i=n.slice("\"'".includes(n[u])?u+1:u,f+1),/^-?\d*\.?\d*$/.test(i)&&(i=+i),d[s]=i,r=null,u=null,s=null,i=null),!y&&null!==s&&n[b]&&n[b].trim().length&&null===u&&(u=b),y||s||null===r||":"!==n[b]||c||(s=n.slice(r,b)),"'\"".includes(n[b])||(f=b);if(!Object.keys(d).length&&l.throwIfEmpty)throw new Error("string-extract-sass-vars: [THROW_ID_02] no keys extracted! (setting opts.originalOpts)");return d}}));
