/**
 * ast-get-values-by-key
 * Read or edit parsed HTML (or AST in general)
 * Version: 2.8.1
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ast-get-values-by-key/
 */

import{traverse as r}from"ast-monkey-traverse";import t from"matcher";import e from"lodash.clonedeep";var o="2.8.1";function i(o,i,a){let s;void 0!==a&&(s=Array.isArray(a)?e(a):[e(a)]);const n=[],v=r(o,((r,e,o)=>{const a=void 0!==e?e:r;if(void 0!==e&&t.isMatch(r,i,{caseSensitive:!0}))if(void 0===s)n.push({val:e,path:o.path});else if(s.length>0)return s.shift();return a}));return void 0===s?n:v}export{i as getByKey,o as version};
