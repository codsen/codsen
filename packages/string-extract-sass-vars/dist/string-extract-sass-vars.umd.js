/**
 * string-extract-sass-vars
 * Parse SASS variables file into a plain object of CSS key-value pairs
 * Version: 1.0.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/string-extract-sass-vars
 */

!function(l,n){"object"==typeof exports&&"undefined"!=typeof module?module.exports=n():"function"==typeof define&&define.amd?define(n):(l=l||self).stringExtractSassVars=n()}(this,(function(){"use strict";return function(l,n){Object.assign({},{throwIfEmpty:!1},n);for(var e=l.length,u=null,t=null,i=null,s=null,r=null,c=null,d=!1,f=!1,o=!1,a={},p=0;p<e;p++)!d&&r&&l[p]===r&&"\\"!==l[p-1]?r=null:r||d||"\\"===l[p-1]||!"'\"".includes(l[p])||(r=l[p]),f&&"\r\n".includes(l[p])&&(f=!1),d||"/"!==l[p]||"/"!==l[p+1]||(f=!0),o&&"*"===l[p-2]&&"/"===l[p-1]&&(o=!1),d||"/"!==l[p]||"*"!==l[p+1]||(o=!0),(d=f||o)||"$"!==l[p]||null!==u||(u=p+1),d||null===t||r||";"!==l[p]||(s=l.slice("\"'".includes(l[t])?t+1:t,c+1),/^-?\d*\.?\d*$/.test(s)&&(s=+s),a[i]=s,u=null,t=null,i=null,s=null),!d&&null!==i&&l[p]&&l[p].trim().length&&null===t&&(t=p),d||i||null===u||":"!==l[p]||r||(i=l.slice(u,p)),"'\"".includes(l[p])||(c=p);return a}}));
