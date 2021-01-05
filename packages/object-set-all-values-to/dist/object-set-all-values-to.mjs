/**
 * object-set-all-values-to
 * Recursively walk the input and set all found values in plain objects to something
 * Version: 3.10.1
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/object-set-all-values-to/
 */

import r from"lodash.clonedeep";import a from"lodash.isplainobject";var o="3.10.1";function e(o,t){let i;const s=r(o);return i=!(arguments.length<2)&&(a(t)||Array.isArray(t)?r(t):t),Array.isArray(s)?s.forEach(((r,o)=>{(a(s[o])||Array.isArray(s[o]))&&(s[o]=e(s[o],i))})):a(s)&&Object.keys(s).forEach((r=>{s[r]=Array.isArray(s[r])||a(s[r])?e(s[r],i):i})),s}export{e as setAllValuesTo,o as version};
