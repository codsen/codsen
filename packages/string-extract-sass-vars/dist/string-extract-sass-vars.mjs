/**
 * string-extract-sass-vars
 * Parse SASS variables file into a plain object of CSS key-value pairs
 * Version: 2.0.2
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/string-extract-sass-vars/
 */

const t="2.0.2",n={throwIfEmpty:!1,cb:null};function l(t,l){if("string"!=typeof t)return{};if(l&&"object"!=typeof l)throw new Error(`string-extract-sass-vars: [THROW_ID_01] the second input argument should be a plain object but it was given as ${JSON.stringify(l,null,4)} (type ${typeof l})`);const e={...n,...l};if(e.cb&&"function"!=typeof e.cb)throw new Error(`string-extract-sass-vars: [THROW_ID_02] opts.cb should be function! But it was given as ${JSON.stringify(l,null,4)} (type ${typeof l})`);const s=t.length;let r=null,u=null,i=null,o=null,c=null,a=null,f=!1,p=!1,g=!1;const y={};for(let n=0;n<s;n++)!f&&c&&t[n]===c&&"\\"!==t[n-1]?c=null:c||f||"\\"===t[n-1]||!"'\"".includes(t[n])||(c=t[n]),p&&"\r\n".includes(t[n])&&(p=!1),f||"/"!==t[n]||"/"!==t[n+1]||(p=!0),g&&"*"===t[n-2]&&"/"===t[n-1]&&(g=!1),f||"/"!==t[n]||"*"!==t[n+1]||(g=!0),f=p||g,f||"$"!==t[n]||null!==r||(r=n+1),f||null===u||c||";"!==t[n]||(o=t.slice("\"'".includes(t[u])?u+1:u,(a||0)+1),/^-?\d*\.?\d*$/.test(o)&&(o=+o),y[i]=e.cb?e.cb(o):o,r=null,u=null,i=null,o=null),!f&&null!==i&&t[n]&&t[n].trim().length&&null===u&&(u=n),f||i||null===r||":"!==t[n]||c||(i=t.slice(r,n)),"'\"".includes(t[n])||(a=n);if(!Object.keys(y).length&&e.throwIfEmpty)throw new Error("string-extract-sass-vars: [THROW_ID_03] no keys extracted! (setting opts.originalOpts)");return y}export{n as defaults,l as extractVars,t as version};
