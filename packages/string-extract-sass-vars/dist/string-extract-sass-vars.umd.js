/**
 * @name string-extract-sass-vars
 * @fileoverview Parse SASS variables file into a plain object of CSS key-value pairs
 * @version 2.0.13
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/string-extract-sass-vars/}
 */

!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e((t="undefined"!=typeof globalThis?globalThis:t||self).stringExtractSassVars={})}(this,(function(t){"use strict";const e={throwIfEmpty:!1,cb:null};t.defaults=e,t.extractVars=function(t,n){if("string"!=typeof t)return{};if(n&&"object"!=typeof n)throw new Error(`string-extract-sass-vars: [THROW_ID_01] the second input argument should be a plain object but it was given as ${JSON.stringify(n,null,4)} (type ${typeof n})`);const l={...e,...n};if(l.cb&&"function"!=typeof l.cb)throw new Error(`string-extract-sass-vars: [THROW_ID_02] opts.cb should be function! But it was given as ${JSON.stringify(n,null,4)} (type ${typeof n})`);const s=t.length;let r=null,o=null,i=null,u=null,c=null,f=null,a=!1,d=!1,p=!1;const y={};for(let e=0;e<s;e++)!a&&c&&t[e]===c&&"\\"!==t[e-1]?c=null:c||a||"\\"===t[e-1]||!"'\"".includes(t[e])||(c=t[e]),d&&"\r\n".includes(t[e])&&(d=!1),a||"/"!==t[e]||"/"!==t[e+1]||(d=!0),p&&"*"===t[e-2]&&"/"===t[e-1]&&(p=!1),a||"/"!==t[e]||"*"!==t[e+1]||(p=!0),a=d||p,a||"$"!==t[e]||null!==r||(r=e+1),a||null===o||c||";"!==t[e]||(u=t.slice("\"'".includes(t[o])?o+1:o,(f||0)+1),/^-?\d*\.?\d*$/.test(u)&&(u=+u),y[i]=l.cb?l.cb(u):u,r=null,o=null,i=null,u=null),!a&&null!==i&&t[e]&&t[e].trim().length&&null===o&&(o=e),a||i||null===r||":"!==t[e]||c||(i=t.slice(r,e)),"'\"".includes(t[e])||(f=e);if(!Object.keys(y).length&&l.throwIfEmpty)throw new Error("string-extract-sass-vars: [THROW_ID_03] no keys extracted! (setting opts.originalOpts)");return y},t.version="2.0.13",Object.defineProperty(t,"__esModule",{value:!0})}));
