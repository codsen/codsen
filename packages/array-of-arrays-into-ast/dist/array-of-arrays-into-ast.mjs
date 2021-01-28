/**
 * array-of-arrays-into-ast
 * Turns an array of arrays of data into a nested tree of plain objects
 * Version: 2.0.1
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/array-of-arrays-into-ast/
 */

import{mergeAdvanced as r}from"object-merge-advanced";const e="2.0.1",t={dedupe:!0};function n(e,n){if(!Array.isArray(e))throw new Error(`array-of-arrays-into-ast: [THROW_ID_01] input must be array. Currently it's of a type ${typeof e} equal to:\n${JSON.stringify(e,null,4)}`);if(0===e.length)return{};const o={...t,...n};let a={};return e.forEach((e=>{let t=null;for(let r=e.length;r--;)t={[e[r]]:[t]};a=r(a,t,{concatInsteadOfMerging:!o.dedupe})})),s=a,Object.keys(s).sort().reduce(((r,e)=>(r[e]=s[e],r)),{});var s}export{t as defaults,n as generateAst,e as version};
