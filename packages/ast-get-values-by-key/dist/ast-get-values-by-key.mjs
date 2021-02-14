/**
 * ast-get-values-by-key
 * Extract values and paths from AST by keys OR set them by keys
 * Version: 3.0.5
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ast-get-values-by-key/
 */

import{traverse as r}from"ast-monkey-traverse";import t from"matcher";import o from"lodash.clonedeep";const e="3.0.5";function i(e,i,s){let n;void 0!==s&&(n=Array.isArray(s)?o(s):[o(s)]);const a=[],v=r(e,((r,o,e)=>{const s=void 0!==o?o:r;if(void 0!==o&&t.isMatch(r,i,{caseSensitive:!0}))if(void 0===n)a.push({val:o,path:e.path});else if(n.length)return n.shift();return s}));return void 0===n?a:v}export{i as getByKey,e as version};
