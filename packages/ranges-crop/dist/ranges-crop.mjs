/**
 * ranges-crop
 * Crop array of ranges when they go beyond the reference string's length
 * Version: 4.0.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ranges-crop/
 */

import{rMerge as r}from"ranges-merge";const e="4.0.0";function n(e,n){if(null===e)return null;if(!Array.isArray(e))throw new TypeError(`ranges-crop: [THROW_ID_01] The first input's argument must be an array, consisting of range arrays! Currently its type is: ${typeof e}, equal to: ${JSON.stringify(e,null,4)}`);if(!Number.isInteger(n))throw new TypeError(`ranges-crop: [THROW_ID_02] The second input's argument must be a natural number or zero (coming from String.length)! Currently its type is: ${typeof n}, equal to: ${JSON.stringify(n,null,4)}`);if(!e.filter((r=>r)).length)return e.filter((r=>r));let t=0;if(!e.filter((r=>r)).every(((r,e)=>!(!Number.isInteger(r[0])||!Number.isInteger(r[1]))||(t=e,!1)))){if(Array.isArray(e)&&"number"==typeof e[0]&&"number"==typeof e[1])throw new TypeError(`ranges-crop: [THROW_ID_03] The first argument should be AN ARRAY OF RANGES, not a single range! Currently arrOfRanges = ${JSON.stringify(e,null,0)}!`);throw new TypeError(`ranges-crop: [THROW_ID_04] The first argument should be AN ARRAY OF ARRAYS! Each sub-array means string slice indexes. In our case, here ${t}th range (${JSON.stringify(e[t],null,0)}) does not consist of only natural numbers!`)}if(!e.filter((r=>r)).every(((r,e)=>null==r[2]||"string"==typeof r[2]||(t=e,!1))))throw new TypeError(`ranges-crop: [THROW_ID_05] The third argument, if present at all, should be of a string-type or null. Currently the ${t}th range ${JSON.stringify(e[t],null,0)} has a argument in the range of a type ${typeof e[t][2]}`);const s=(r(e)||[]).filter((r=>r[0]<=n&&(null!=r[2]||r[0]<n))).map((r=>r[1]>n?null!=r[2]?[r[0],n,r[2]]:[r[0],n]:r));return s===[]?null:s}export{n as rCrop,e as version};
