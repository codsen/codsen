/**
 * string-trim-spaces-only
 * Like String.trim() but you can choose granularly what to trim
 * Version: 3.0.8
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/string-trim-spaces-only/
 */

const e="3.0.8",r={classicTrim:!1,cr:!1,lf:!1,tab:!1,space:!0,nbsp:!1};function n(e,n){if("string"!=typeof e)throw new Error(`string-trim-spaces-only: [THROW_ID_01] input must be string! It was given as ${typeof e}, equal to:\n${JSON.stringify(e,null,4)}`);const s={...r,...n};function t(e){return s.classicTrim&&!e.trim()||!s.classicTrim&&(s.space&&" "===e||s.cr&&"\r"===e||s.lf&&"\n"===e||s.tab&&"\t"===e||s.nbsp&&" "===e)}let i,l;if(e.length){if(t(e[0]))for(let r=0,n=e.length;r<n;r++){if(!t(e[r])){i=r;break}if(r===e.length-1)return{res:"",ranges:[[0,e.length]]}}if(t(e[e.length-1]))for(let r=e.length;r--;)if(!t(e[r])){l=r+1;break}return i?l?{res:e.slice(i,l),ranges:[[0,i],[l,e.length]]}:{res:e.slice(i),ranges:[[0,i]]}:l?{res:e.slice(0,l),ranges:[[l,e.length]]}:{res:e,ranges:[]}}return{res:"",ranges:[]}}export{r as defaults,n as trimSpaces,e as version};
