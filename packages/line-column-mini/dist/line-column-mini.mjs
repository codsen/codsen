/**
 * line-column-mini
 * Convert string index to line-column position
 * Version: 1.1.6
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/line-column-mini/
 */

const r="1.1.6";function n(r,n){let t=0,e=n.length-2;for(;t<e;){const i=t+(e-t>>1);if(r<n[i])e=i-1;else{if(!(r>=n[i+1])){t=i;break}t=i+1}}return t}function t(r){return r.split(/\n|\r(?!\n)/g).reduce(((r,n)=>(r.push(r[r.length-1]+n.length+1),r)),[0])}function e(r,e,i=!1){if(!i&&(!Array.isArray(r)&&"string"!=typeof r||("string"==typeof r||Array.isArray(r))&&!r.length))return null;if(!i&&("number"!=typeof e||"string"==typeof r&&e>=r.length||Array.isArray(r)&&e+1>=r[r.length-1]))return null;if("string"==typeof r){const i=t(r),l=n(e,i);return{col:e-i[l]+1,line:l+1}}const l=n(e,r);return{col:e-r[l]+1,line:l+1}}export{t as getLineStartIndexes,e as lineCol,r as version};
