/**
 * ranges-process-outside
 * Iterate string considering ranges, as if they were already applied
 * Version: 4.0.9
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ranges-process-outside/
 */

import r from"runes";import{rInvert as t}from"ranges-invert";import{rCrop as e}from"ranges-crop";const n="4.0.9";function s(n,s,i,o=!1){if("string"!=typeof n)throw void 0===n?new Error("ranges-process-outside: [THROW_ID_01] the first input argument must be string! It's missing currently (undefined)!"):new Error(`ranges-process-outside: [THROW_ID_02] the first input argument must be string! It was given as:\n${JSON.stringify(n,null,4)} (type ${typeof n})`);if(s&&(!Array.isArray(s)||s.length&&!Array.isArray(s[0])))throw new Error(`ranges-process-outside: [THROW_ID_03] the second input argument must be array of ranges or null! It was given as:\n${JSON.stringify(s,null,4)} (type ${typeof s})`);if("function"!=typeof i)throw new Error(`ranges-process-outside: [THROW_ID_04] the third input argument must be a function! It was given as:\n${JSON.stringify(i,null,4)} (type ${typeof i})`);function u(t,e){(e||[]).forEach((([e,n])=>{for(let s=e;s<n;s++){const e=r(t.slice(s))[0].length;i(s,s+e,(r=>{null!=r&&(s+=r)})),e&&e>1&&(s+=e-1)}}))}if(s&&s.length){u(n,e(t(s,n.length,{skipChecks:!!o}),n.length))}else u(n,[[0,n.length]])}export{s as rProcessOutside,n as version};
