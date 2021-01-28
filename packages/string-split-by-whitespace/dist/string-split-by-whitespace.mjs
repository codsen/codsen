/**
 * string-split-by-whitespace
 * Split string into array by chunks of whitespace
 * Version: 2.0.1
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/string-split-by-whitespace/
 */

import{isIndexWithin as n}from"ranges-is-index-within";const e="2.0.1";function i(e,i){if(void 0===e)throw new Error("string-split-by-whitespace: [THROW_ID_01] The input is missing!");if("string"!=typeof e)return e;if(""===e.trim())return[];const r={ignoreRanges:[],...i};if(r.ignoreRanges.length>0&&!r.ignoreRanges.every((n=>Array.isArray(n))))throw new Error("string-split-by-whitespace: [THROW_ID_03] The opts.ignoreRanges contains elements which are not arrays!");let s=null;const t=[];for(let i=0,g=e.length;i<g;i++)null!==s||!e[i].trim()||r&&r.ignoreRanges&&r.ignoreRanges.length&&(!r.ignoreRanges.length||n(i,r.ignoreRanges.map((n=>[n[0],n[1]-1])),{inclusiveRangeEnds:!0}))||(s=i),null!==s&&(e[i].trim()?r.ignoreRanges.length&&n(i,r.ignoreRanges)?(t.push(e.slice(s,i-1)),s=null):void 0===e[i+1]&&t.push(e.slice(s,i+1)):(t.push(e.slice(s,i)),s=null));return t}export{i as splitByW,e as version};
