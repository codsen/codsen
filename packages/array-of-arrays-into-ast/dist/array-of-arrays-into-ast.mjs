/**
 * array-of-arrays-into-ast
 * Turns an array of arrays of data into a nested tree of plain objects
 * Version: 1.10.1
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/array-of-arrays-into-ast/
 */

import{mergeAdvanced as r}from"object-merge-advanced";var t="1.10.1";const e={dedupe:!0};function n(t,n){if(!Array.isArray(t))throw Error(`array-of-arrays-into-ast: [THROW_ID_01] input must be array. Currently it's of a type ${typeof t} equal to:\n${JSON.stringify(t,null,4)}`);if(0===t.length)return{};const a={...e,...n};let o={};return t.forEach((t=>{let e=null;for(let r=t.length;r--;)e={[t[r]]:[e]};o=r(o,e,{concatInsteadOfMerging:!a.dedupe})})),Object.keys(u=o).sort().reduce(((r,t)=>(r[t]=u[t],r)),{});var u}export{e as defaults,n as generateAst,t as version};
