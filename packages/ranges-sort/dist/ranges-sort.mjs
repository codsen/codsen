/**
 * ranges-sort
 * Sort string index ranges
 * Version: 4.0.8
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ranges-sort/
 */

const r="4.0.8",e={strictlyTwoElementsInRangeArrays:!1,progressFn:null};function n(r,n){if(!Array.isArray(r)||!r.length)return r;const t={...e,...n};let s,a;if(t.strictlyTwoElementsInRangeArrays&&!r.filter((r=>r)).every(((r,e)=>2===r.length||(s=e,a=r.length,!1))))throw new TypeError(`ranges-sort: [THROW_ID_03] The first argument should be an array and must consist of arrays which are natural number indexes representing TWO string index ranges. However, ${s}th range (${JSON.stringify(r[s],null,4)}) has not two but ${a} elements!`);if(!r.filter((r=>r)).every(((r,e)=>!(!Number.isInteger(r[0])||r[0]<0||!Number.isInteger(r[1])||r[1]<0)||(s=e,!1))))throw new TypeError(`ranges-sort: [THROW_ID_04] The first argument should be an array and must consist of arrays which are natural number indexes representing string index ranges. However, ${s}th range (${JSON.stringify(r[s],null,4)}) does not consist of only natural numbers!`);const o=r.filter((r=>r)).length**2;let i=0;return Array.from(r).filter((r=>r)).sort(((r,e)=>(t.progressFn&&(i+=1,t.progressFn(Math.floor(100*i/o))),r[0]===e[0]?r[1]<e[1]?-1:r[1]>e[1]?1:0:r[0]<e[0]?-1:1)))}export{e as defaults,n as rSort,r as version};
