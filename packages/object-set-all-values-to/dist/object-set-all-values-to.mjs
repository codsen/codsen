/**
 * object-set-all-values-to
 * Recursively walk the input and set all found values in plain objects to something
 * Version: 4.0.9
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/object-set-all-values-to/
 */

import r from"lodash.clonedeep";import o from"lodash.isplainobject";const a="4.0.9";function t(a,e){let s;const i=r(a);return s=!(arguments.length<2)&&(o(e)||Array.isArray(e)?r(e):e),Array.isArray(i)?i.forEach(((r,a)=>{(o(i[a])||Array.isArray(i[a]))&&(i[a]=t(i[a],s))})):o(i)&&Object.keys(i).forEach((r=>{i[r]=Array.isArray(i[r])||o(i[r])?t(i[r],s):s})),i}export{t as setAllValuesTo,a as version};
