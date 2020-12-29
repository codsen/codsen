/**
 * string-trim-spaces-only
 * Like String.trim() but you can choose granularly what to trim
 * Version: 2.9.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/string-trim-spaces-only/
 */

var r="2.9.0";const e={classicTrim:!1,cr:!1,lf:!1,tab:!1,space:!0,nbsp:!1};function n(r,n){if("string"!=typeof r)throw Error(`string-trim-spaces-only: [THROW_ID_01] input must be string! It was given as ${typeof r}, equal to:\n${JSON.stringify(r,null,4)}`);const s={...e,...n};function t(r){return s.classicTrim&&!r.trim()||!s.classicTrim&&(s.space&&" "===r||s.cr&&"\r"===r||s.lf&&"\n"===r||s.tab&&"\t"===r||s.nbsp&&" "===r)}let i,l;if(r.length){if(t(r[0]))for(let e=0,n=r.length;n>e;e++){if(!t(r[e])){i=e;break}if(e===r.length-1)return{res:"",ranges:[[0,r.length]]}}if(t(r[r.length-1]))for(let e=r.length;e--;)if(!t(r[e])){l=e+1;break}return i?l?{res:r.slice(i,l),ranges:[[0,i],[l,r.length]]}:{res:r.slice(i),ranges:[[0,i]]}:l?{res:r.slice(0,l),ranges:[[l,r.length]]}:{res:r,ranges:[]}}return{res:"",ranges:[]}}export{e as defaults,n as trimSpaces,r as version};
