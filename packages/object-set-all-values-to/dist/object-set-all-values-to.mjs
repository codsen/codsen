/**
 * object-set-all-values-to
 * Recursively walk the input and set all found values in plain objects to something
 * Version: 4.0.5
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/object-set-all-values-to/
 */

import r from"lodash.clonedeep";import o from"lodash.isplainobject";const a="4.0.5";function s(a,e){let t;const i=r(a);return t=!(arguments.length<2)&&(o(e)||Array.isArray(e)?r(e):e),Array.isArray(i)?i.forEach(((r,a)=>{(o(i[a])||Array.isArray(i[a]))&&(i[a]=s(i[a],t))})):o(i)&&Object.keys(i).forEach((r=>{i[r]=Array.isArray(i[r])||o(i[r])?s(i[r],t):t})),i}export{s as setAllValuesTo,a as version};
